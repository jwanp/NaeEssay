// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let email = null;
    if (session) {
        email = session?.user?.email;
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { limit = '1000' } = request.query;

        const essays = await db
            .collection('essay_like')
            .aggregate([
                // Filter for essays with the matching topicId
                {
                    $match: {
                        email: email as string,
                    },
                },
                {
                    $lookup: {
                        from: 'essay',
                        localField: 'essayId',
                        foreignField: '_id',
                        as: 'essay',
                    },
                },
                {
                    $unwind: '$essay', // Flatten the joined data
                },
                {
                    $replaceRoot: { newRoot: '$essay' }, // Replace the root with essayDetails
                },

                {
                    $lookup: {
                        from: 'essay_like',
                        localField: '_id',
                        foreignField: 'essayId',
                        as: 'like',
                    },
                },
                {
                    $addFields: {
                        likeCount: { $size: '$like' },
                        myLikeIds: {
                            $cond: {
                                if: { $ne: [email, null] }, // Check if email exists
                                then: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: '$like',
                                                as: 'like',
                                                cond: { $eq: ['$$like.email', email] }, // Filter likes by the user
                                            },
                                        },
                                        as: 'like',
                                        in: '$$like._id', // Extract `_id` field
                                    },
                                },
                                else: null, // Return null if no email
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: 'essay_comment',
                        localField: '_id',
                        foreignField: 'essayId',
                        as: 'comment',
                    },
                },
                {
                    $addFields: {
                        commentCount: { $size: '$comment' },
                        myCommentCount: {
                            $cond: {
                                if: { $ne: [email, null] }, // Check if email exists
                                then: {
                                    $size: {
                                        $filter: {
                                            input: '$comment',
                                            as: 'comment',
                                            cond: { $eq: ['$$comment.email', email] }, // comments by the user
                                        },
                                    },
                                },
                                else: null, // Return null if no email
                            },
                        },
                    },
                },
                {
                    $sort: {
                        ...{ date: -1 },
                    },
                },
                {
                    $project: {
                        like: 0,
                    },
                },
            ])
            .toArray();

        const limitedEssays = essays.slice(0, parseInt(limit as string, 10));
        return response.status(200).json(limitedEssays);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

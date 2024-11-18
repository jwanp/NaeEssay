// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let email = null;
    if (session) {
        email = session?.user?.email;
    }
    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { topicId = null, sortBy = 'date', limit = '1000' } = request.query;
        if (topicId == null) {
            return response.status(500).json('잘못된 요청 입니다.');
        }
        const essays = await db
            .collection('essay')
            .aggregate([
                // Filter for essays with the matching topicId
                {
                    $match: {
                        topicId: new ObjectId(topicId as string),
                    },
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
                        ...(sortBy === 'comments' ? { commentCount: -1 } : {}),
                        ...(sortBy === 'likes' ? { likeCount: -1 } : {}),
                        ...(sortBy === 'date' ? { date: -1 } : {}),
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

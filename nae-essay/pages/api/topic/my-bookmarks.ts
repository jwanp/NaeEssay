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

        const pipeline = [
            // Lookup all bookmarks to get the total count
            {
                $match: {
                    email: email as string,
                },
            },
            {
                $lookup: {
                    from: 'topic',
                    localField: 'topicId',
                    foreignField: '_id',
                    as: 'topic',
                },
            },
            {
                $unwind: '$topic', // Flatten the joined data
            },
            {
                $replaceRoot: { newRoot: '$topic' }, // Replace the root with essayDetails
            },
            {
                $lookup: {
                    from: 'bookmark',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'bookmark',
                },
            },
            {
                $addFields: {
                    bookmarkCount: { $size: '$bookmark' },
                    myBookmarkIds: {
                        $cond: {
                            if: { $ne: [email, null] }, // Check if email exists
                            then: {
                                $map: {
                                    input: {
                                        $filter: {
                                            input: '$bookmark',
                                            as: 'bookmark',
                                            cond: { $eq: ['$$bookmark.email', email] }, // Filter bookmark by the user
                                        },
                                    },
                                    as: 'bookmark',
                                    in: '$$bookmark._id', // Extract `_id` field
                                },
                            },
                            else: null, // Return null if no email
                        },
                    },
                },
            },
            // Lookup all essays to get the total count
            {
                $lookup: {
                    from: 'essay',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'essay',
                },
            },
            {
                $addFields: {
                    essayCount: { $size: '$essay' },
                    myEssayCount: {
                        $cond: {
                            if: { $ne: [email, null] }, // Check if email exists
                            then: {
                                $size: {
                                    $filter: {
                                        input: '$essay',
                                        as: 'essay',
                                        cond: { $eq: ['$$essay.email', email] }, // comments by the user
                                    },
                                },
                            },
                            else: null, // Return null if no email
                        },
                    },
                },
            },
            // Sorting based on criteria
            {
                $sort: {
                    ...{ date: -1 },
                },
            },
            // Remove intermediate arrays used for counting
            {
                $project: {
                    bookmark: 0,
                },
            },
        ];

        const topics = await db.collection('bookmark').aggregate(pipeline).toArray();

        const limitedTopics = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedTopics);
    } catch (e) {
        return response.status(500).json('db 연결중 에러가 발생했습니다.' + e);
    }
}

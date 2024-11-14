// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { sortBy = 'date', limit = '1000' } = request.query;

        const pipeline = [
            // Lookup all bookmarks to get the total count
            {
                $lookup: {
                    from: 'bookmark',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'allBookmarks',
                },
            },
            {
                $addFields: {
                    bookmarkCount: { $size: '$allBookmarks' },
                },
            },
            // Lookup all essays to get the total count
            {
                $lookup: {
                    from: 'essay',
                    localField: '_id',
                    foreignField: 'topicId',
                    as: 'allEssays',
                },
            },
            {
                $addFields: {
                    essayCount: { $size: '$allEssays' },
                },
            },
            // Sorting based on criteria
            {
                $sort: {
                    ...(sortBy === 'bookmarks' ? { bookmarkCount: -1 } : {}),
                    ...(sortBy === 'essays' ? { essayCount: -1 } : {}),
                    ...(sortBy === 'date' ? { date: -1 } : {}),
                },
            },
            // Remove intermediate arrays used for counting
            {
                $project: {
                    allBookmarks: 0,
                    allEssays: 0,
                },
            },
        ];

        if (session?.user) {
            pipeline.splice(
                2,
                0,
                // Filter bookmarks by user email
                {
                    $lookup: {
                        from: 'bookmark',
                        let: { topicId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$topicId', '$$topicId'] },
                                            { $eq: ['$email', session.user.email] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'bookmark',
                    } as any,
                },
                // Filter essays by user email
                {
                    $lookup: {
                        from: 'essay',
                        let: { topicId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$topicId', '$$topicId'] },
                                            { $eq: ['$email', session.user.email] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'essay',
                    } as any,
                }
            );
        }

        const topics = await db.collection('topic').aggregate(pipeline).toArray();

        const limitedTopics = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedTopics);
    } catch (e) {
        return response.status(500).json('db 연결중 에러가 발생했습니다.' + e);
    }
}

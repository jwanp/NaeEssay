// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { topicId = null, sortBy = 'date', limit = '1000' } = request.query;
        if (topicId == null) {
            return response.status(500).json('잘못된 요청 입니다.');
        }
        const topics = await db
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
                    },
                },
                {
                    $sort: {
                        ...(sortBy === 'comments' ? { commentCount: -1 } : {}),
                        ...(sortBy === 'likes' ? { likeCount: -1 } : {}),
                        ...(sortBy === 'date' ? { date: -1 } : {}),
                    },
                },
            ])
            .toArray();
        const limitedEssays = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedEssays);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

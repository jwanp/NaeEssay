// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { sortBy = 'date', limit = '1000' } = request.query;

        const topics = await db
            .collection('qna')
            .aggregate([
                {
                    $lookup: {
                        from: 'qna_like',
                        localField: '_id',
                        foreignField: 'qnaId',
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
                        from: 'qna_comment',
                        localField: '_id',
                        foreignField: 'qnaId',
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
        const limitedQnas = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedQnas);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

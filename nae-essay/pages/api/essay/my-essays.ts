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

        const topics = await db.collection('essay').find({ email: email }).toArray();
        const essays = await db
            .collection('essay')
            .aggregate([
                // Filter for essays with the matching topicId
                {
                    $match: {
                        email: email,
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
            ])
            .toArray();

        const limitedEssays = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedEssays);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

interface EssayLike {
    email: string;
    essayId: string;
    date: Date;
}

interface requestBody {
    essayId?: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: EssayLike;

    if (request.method == 'POST' && request.body) {
        request.body.essayId = new ObjectId(request.body.essayId);
    } else {
        return response.status(500).json({ message: '에세이 아이디가 비었습니다.' });
    }

    if (session && session.user && session.user.email) {
        requestBody = {
            essayId: request.body.essayId,
            email: session.user.email,
            date: new Date(),
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        request.body.essayId = new ObjectId(request.body.essayId);
        let db = (await connectDB).db('nae-essay');
        let result;
        let insertedId: string | undefined = undefined;

        //이미 좋아요 한경우
        const isLikeed = await db
            .collection('essay_like')
            .findOne({ email: session.user.email, essayId: request.body.essayId });
        if (isLikeed) {
            return response.status(500).json({ message: '이미 좋아요를 눌렀습니다.' });
        }
        result = await db.collection('essay_like').insertOne({ ...requestBody });
        insertedId = result.insertedId.toString();

        if (insertedId) {
            return response.status(200).json({ message: '좋아요 완료', likeId: insertedId });
        } else {
            return response.status(500).json({ message: '좋아요 실패' });
        }
    } catch (error) {
        return response.status(500).json({ message: 'DB 에러 발생' });
    }
}

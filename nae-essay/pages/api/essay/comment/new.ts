// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

interface EssayComment {
    email: string;
    username: string;
    essayId: string;
    date: Date;
    content: string;
    edited: boolean;
}

interface requestBody {
    essayId?: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: EssayComment;

    if (request.method == 'POST' && request.body) {
        request.body.essayId = new ObjectId(request.body.essayId);
    } else {
        return response.status(500).json({ message: '에세이 아이디가 비었습니다.' });
    }

    if (session && session.user && session.user.email && session.user.name) {
        requestBody = {
            email: session.user.email,
            username: session.user.name,
            essayId: request.body.essayId,
            date: new Date(),
            content: request.body.content,
            edited: false,
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        let db = (await connectDB).db('nae-essay');
        let result;
        let insertedId: string | undefined = undefined;

        result = await db.collection('essay_comment').insertOne({ ...requestBody });
        insertedId = result.insertedId.toString();

        if (insertedId) {
            return response.status(200).json({ _id: insertedId, ...requestBody });
        } else {
            return response.status(500).json({ message: '댓글 작성 실패' });
        }
    } catch (error) {
        return response.status(500).json({ message: 'DB 에러 발생' });
    }
}

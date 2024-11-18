// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

interface Bookmark {
    email: string;
    topicId: string;
    date: Date;
}

interface requestBody {
    topicId?: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: Bookmark;

    if (request.method == 'POST' && request.body) {
        request.body.topicId = new ObjectId(request.body.topicId);
    } else {
        return response.status(500).json({ message: '북마크 아이디가 비었습니다.' });
    }

    if (session && session.user && session.user.email) {
        requestBody = {
            topicId: request.body.topicId,
            email: session.user.email,
            date: new Date(),
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        request.body.topicId = new ObjectId(request.body.topicId);
        let db = (await connectDB).db('nae-essay');
        let result;
        let insertedId: string | undefined = undefined;

        //이미 북마크 있는 경우
        const isBookmarked = await db
            .collection('bookmark')
            .findOne({ email: session.user.email, topicId: request.body.topicId });
        if (isBookmarked) {
            return response.status(500).json({ message: '이미 북마크를 했습니다.', bookmarkId: isBookmarked._id });
        }
        result = await db.collection('bookmark').insertOne({ ...requestBody });
        insertedId = result.insertedId.toString();

        if (insertedId) {
            return response.status(200).json({ message: '북마크 추가 완료', bookmarkId: insertedId });
        } else {
            return response.status(500).json({ message: '북마크 생성 실패' });
        }
    } catch (error) {
        return response.status(500).json({ message: 'DB 에러 발생' });
    }
}

// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { ObjectId } from 'mongodb';
import { count } from 'console';

interface requestBody {
    _id?: string | ObjectId;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: requestBody;

    if (request.method == 'DELETE' && request.body) {
        request.body.bookmarkId = new ObjectId(request.body.bookmarkId);
    } else {
        return response.status(500).json({ message: '북마크 아이디가 비었습니다.' });
    }

    if (session && session.user && session.user.email) {
        requestBody = {
            _id: request.body.bookmarkId,
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        let db = (await connectDB).db('nae-essay');

        //이미 북마크 있는 경우
        const bookmark = await db.collection('bookmark').findOne({ ...requestBody });
        if (!bookmark) {
            return response.status(500).json({ message: '해당 북마크를 찾을 수 없습니다.' });
        }

        if (bookmark.email != session.user.email) {
            return response.status(500).json({ mesaage: '옮바른 유저가 아닙니다.' });
        }

        const result = await db.collection('bookmark').deleteOne({ ...requestBody });
        if (result.deletedCount == 0) {
            return response.status(500).json({ message: '북마크 삭제 실패' });
        } else {
            return response.status(200).json({ message: '북마크 삭제 성공', count: result.deletedCount });
        }
    } catch (error) {
        return response.status(500).json({ message: 'DB 에러 발생' });
    }
}

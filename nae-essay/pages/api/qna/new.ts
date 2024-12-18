import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

/*
/api/topic/new 으로 요청을 할때의 data type 은 다음과 같다.
Topic
    title: str
    date: date
    author: str(User.nickname)
    authorName: str(User.name)
    public: Boolean

이므로 
request.body:
    title: str
    is_public: boolean
*/
interface Topic {
    title: string;
    date: Date;
    author: string | null | undefined;
    email: string | null | undefined;
    is_public: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: Topic | null = null;
    if (session) {
        if (request.body.is_public == 'on') {
            request.body.is_public = true;
        } else {
            request.body.is_public = false;
        }
        requestBody = {
            title: request.body.title,
            is_public: request.body.is_public,
            email: session.user?.email,
            author: session.user?.name,
            date: new Date(),
        };
    } else {
        return response.status(500).json('로그인 하지 않았습니다.');
    }
    if (request.method == 'POST') {
        if (request.body.title == '' || request.body.title == null) {
            return response.status(500).json('제목을 입력 하지 않았습니다.');
        }
        if (requestBody) {
            try {
                let db = (await connectDB).db('nae-essay');
                let result = db.collection('qna').insertOne({ requestBody });
                response.redirect(302, '/qna');
            } catch (error) {
                response.json('DB 에러 발생');
            }
        }
    } else {
        response.status(500).json('post 요청만 가능합니다.');
    }
}

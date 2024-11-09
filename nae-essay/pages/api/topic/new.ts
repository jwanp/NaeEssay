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
    authorName: string | null | undefined;
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
            author: session.user?.email,
            authorName: session.user?.name,
            date: new Date(),
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }
    if (request.method == 'POST') {
        if (request.body.title == '' || request.body.title == null) {
            return response.status(500).json({ message: '제목을 입력 하지 않았습니다.' });
        }
        if (requestBody) {
            try {
                let db = (await connectDB).db('nae-essay');
                let sameTopic = await db.collection('topic').findOne({ title: requestBody.title });
                if (sameTopic) {
                    return response.status(500).json({ message: '이미 있는 주제 입니다.' });
                }
                let result = db.collection('topic').insertOne({ ...requestBody });
                return response.status(200).json({ message: '주제 생성 성공' });
            } catch (error) {
                return response.status(500).json({ message: 'DB 에러 발생' });
            }
        }
    } else {
        response.status(500).json({ message: 'post 요청만 가능합니다.' });
    }
}

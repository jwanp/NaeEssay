import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    if (session) {
        request.body.author = session.user?.email;
        console.log(session.user);
    }

    if (request.method == 'POST') {
        if (request.body.title == '') {
            return response.status(500).json('제목을 입력 하지 않았습니다.');
        }
        try {
            let db = (await connectDB).db('nae-essay');
            let result = db.collection('topic').insertOne(request.body);
            response.redirect(302, '/list');
        } catch (error) {
            response.json('DB 에러 발생');
        }
    }
}

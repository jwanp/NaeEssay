// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

import { ObjectId } from 'mongodb';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody = null;

    // essayId 가 null 이면 새로 생성이고 만약 이미 있다면 수정이다.
    let essayId = request.body._id;
    delete request.body._id;
    request.body.topicId = new ObjectId(request.body.topicId);
    if (session) {
        requestBody = {
            ...request.body,
            author: session?.user?.name,
            email: session?.user?.email,
            date: new Date(),
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }
    if (request.method == 'POST' && request.body) {
        try {
            let db = (await connectDB).db('nae-essay');
            let result = undefined;
            let insertedId: string = '';
            // 수정 POST 요청인 경우
            if (essayId != null) {
                result = await db
                    .collection('essay')
                    .updateOne({ _id: new ObjectId(essayId) }, { $set: { ...requestBody } });
                insertedId = essayId;
            }
            // essayId 를 찾지 못하거나 수정이 아닐때
            if (essayId == null || result?.matchedCount == 0) {
                result = await db.collection('essay').insertOne({ ...requestBody });
                insertedId = result.insertedId.toString();
            }
            return response.status(200).json({ message: '저장 완료', essayId: insertedId });
        } catch (error) {
            return response.status(500).json({ message: 'DB 에러 발생' });
        }
    } else {
        return response.status(500).json({ message: '내용을 입력하세요.' });
    }
}

// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

import { ObjectId } from 'mongodb';

interface requestBody {
    essayId: string;
    cohesion: number;
    syntax: number;
    vocabulary: number;
    phraseology: number;
    grammar: number;
    conventions: number;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody = null;

    // essayId 가 null 이면 새로 생성이고 만약 이미 있다면 수정이다.
    let essayId = request.body.essayId;
    delete request.body._id;
    request.body.essayId = new ObjectId(request.body.essayId);
    if (session) {
        requestBody = {
            ...request.body,
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }
    if (request.method == 'POST' && request.body) {
        try {
            let db = (await connectDB).db('nae-essay');
            let previous = undefined;
            let essay = undefined;
            let insertedId: string = '';
            // 수정 POST 요청인 경우
            if (essayId) {
                previous = await db.collection('essay_score').findOne({ essayId: new ObjectId(essayId) });
                essay = await db.collection('essay').findOne({ _id: new ObjectId(essayId) });
                if (previous) {
                    await db.collection('essay_score').deleteOne({ essayId: new ObjectId(essayId) });
                }
            } else {
                return response.status(500).json({ message: 'essayId가 비었습니다.' });
            }
            // essayId 를 찾지 못하거나 수정이 아닐때
            if (essay?.matchedCount == 0) {
                return response.status(500).json({ message: '존재하지 않는 에세이 입니다.' });
            }
            db.collection('essay_score').insertOne(requestBody);
            return response.status(200).json({ message: '저장 완료', essayId: insertedId });
        } catch (error) {
            return response.status(500).json({ message: 'DB 에러 발생' });
        }
    } else {
        return response.status(500).json({ message: '내용을 입력하세요.' });
    }
}

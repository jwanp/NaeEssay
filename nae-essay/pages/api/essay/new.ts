// 여기 할 차례
// redux 로부터 가져온 essay 데이터를 Essay collection 형식에 맞추어서 db에 저장한다.

// 보내준 데이터 형식
// interface Outline {
//     outline: string;
//     content: string;
// }

// export interface Essay {
//     topic: string;
//     topicId: string;
//     content: Outline[];
//     public: boolean;
// }

// 추가해야하는 데이터 형식

// Essay
// - topic: str (Topic.title)
// - topicId: str (Topic.id)
// - content: `[{outline: string, content: string}]`
// - public: Boolean

// - author: str (User.nickname)
// - date: date

// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { Essay } from '@/lib/features/essay/essaySlice';
import { ObjectId } from 'mongodb';

interface EssayDB extends Essay {
    author: string | null | undefined;
    date: Date;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: EssayDB | null = null;

    // essayId 가 null 이면 새로 생성이고 만약 이미 있다면 수정이다.
    let essayId = request.body.essayId;
    delete request.body.essayId;
    request.body.topicId = new ObjectId(request.body.topicId);
    if (session) {
        requestBody = {
            ...request.body,
            author: session?.user?.email,
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

    // if (request.method == 'POST') {
    //     if (request.body.title == '' || request.body.title == null) {
    //         return response.status(500).json({ message: '제목을 입력 하지 않았습니다.' });
    //     }
    //     if (requestBody) {
    //         try {
    //             let db = (await connectDB).db('nae-essay');
    //             let sameTopic = await db.collection('topic').findOne({ title: requestBody.title });
    //             if (sameTopic) {
    //                 return response.status(500).json({ message: '이미 있는 주제 입니다.' });
    //             }
    //             let result = db.collection('topic').insertOne({ ...requestBody });
    //             return response.status(200).json({ message: '주제 생성 성공' });
    //         } catch (error) {
    //             return response.status(500).json({ message: 'DB 에러 발생' });
    //         }
    //     }
    // } else {
    //     response.status(500).json({ message: 'post 요청만 가능합니다.' });
    // }
}

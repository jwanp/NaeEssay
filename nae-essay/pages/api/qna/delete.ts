import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let db = (await connectDB).db('nae-essay');
    try {
        // user 가 다르다면 return
        let item = await db.collection('qna').findOne({ _id: new ObjectId(request.query._id as string) });
        if (item?.author) {
            if (!session || item.author != session.user?.email) {
                return response.status(400).json('권한이 없습니다.');
            }
        }
        // DELETE 으로 요청이 왔을때 상품 삭제
        if (request.method == 'DELETE') {
            if (request.body._id == '') {
                return response.status(400).json('상품의 id가 비어있습니다.');
            }
            await db.collection('qna').deleteOne({ _id: new ObjectId(request.body) });
            return response.status(200).json('서버 요청에 성공했습니다.');
            //  GET 으로 요청이 왔을때 상품 삭제
        } else if (request.method == 'GET') {
            if (request.query._id == '') {
                return response.status(400).json('상품의 id가 비어있습니다.');
            }
            await db.collection('qna').deleteOne({ _id: new ObjectId(request.query._id as string) });
            return response.status(200).json('서버 요청에 성공했습니다.');
        }
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

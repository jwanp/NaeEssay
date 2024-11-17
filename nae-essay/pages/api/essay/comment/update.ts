// author 과 date 추가 해서 DB에 저장한다.
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

interface EssayComment {
    content: string;
    edited: boolean;
}

interface requestBody {
    essayId?: string;
    content: string;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    let session = await getServerSession(request, response, authOptions);
    let requestBody: { _id: ObjectId };
    let updateBody: EssayComment;

    let { commentId, content } = request.body;

    if (!commentId || !content) {
        return response.status(400).json({ message: 'Invalid input. "commentId" and "content" are required.' });
    }

    if (request.method == 'PUT') {
        commentId = new ObjectId(commentId);
    } else {
        return response.status(500).json({ message: '잘못된 method 입니다.' });
    }

    if (session && session.user && session.user.email) {
        requestBody = {
            _id: commentId,
        };
    } else {
        return response.status(500).json({ message: '로그인 하지 않았습니다.' });
    }

    try {
        let db = (await connectDB).db('nae-essay');

        //이미 좋아요 있는 경우
        const comment = await db.collection('essay_comment').findOne({ ...requestBody });
        if (!comment) {
            return response.status(500).json({ message: '해당 댓글을 찾을 수 없습니다.' });
        }

        if (comment.email != session.user.email) {
            return response.status(500).json({ mesaage: '옮바른 유저가 아닙니다.' });
        }
        updateBody = {
            content: content,
            edited: true,
        };
        const result = await db.collection('essay_comment').updateOne(
            { ...requestBody },
            { $set: { ...updateBody } } // Update the `content` field and add an `updatedAt` timestamp
        );
        if (result.modifiedCount == 0) {
            return response.status(500).json({ message: '댓글 수정 실패' });
        } else {
            return response.status(200).json({ ...updateBody });
        }
    } catch (error) {
        return response.status(500).json({ message: 'DB 에러 발생' });
    }
}

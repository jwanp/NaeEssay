import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const session = await getServerSession(request, response, authOptions);
    const db = (await connectDB).db('nae-essay');

    try {
        if (request.method === 'DELETE') {
            const { essayId } = request.body;

            if (!essayId) {
                return response.status(400).json({ message: 'Essay ID is required' });
            }

            if (!ObjectId.isValid(essayId)) {
                return response.status(400).json({ message: 'Invalid Essay ID' });
            }

            const essay = await db.collection('essay').findOne({ _id: new ObjectId(essayId) });
            console.log(essayId);
            if (!essay) {
                return response.status(404).json({ message: 'Essay not found' });
            }

            if (!session || essay.email !== session.user?.email) {
                return response.status(403).json({ message: 'You do not have permission to delete this essay' });
            }

            const result = await db.collection('essay').deleteOne({ _id: new ObjectId(essayId) });
            const like_result = await db.collection('essay_like').deleteMany({ essayId: new ObjectId(essayId) });

            if (result.deletedCount > 0) {
                return response
                    .status(200)
                    .json({ message: 'Essay deleted successfully', like_deleted: like_result.deletedCount });
            } else {
                return response.status(500).json({ message: 'Failed to delete essay' });
            }
        } else {
            return response.status(405).json({ message: 'Method not allowed' });
        }
    } catch (error) {
        console.error(error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}

// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

const getSessionEmail = async (request: NextApiRequest, response: NextApiResponse) => {
    const session = await getServerSession(request, response, authOptions);
    return session?.user?.email || null;
};

const getEssayById = async (db: any, essayId: string) => {
    try {
        return await db.collection('essay_score').findOne({ essayId: new ObjectId(essayId) });
    } catch (error) {
        console.error('Error fetching essay:', error);
        throw new Error('Error fetching essay');
    }
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const email = await getSessionEmail(request, response);

    if (!email) {
        return response.status(401).json({ message: 'Unauthorized' });
    }

    const { essayId } = request.query;

    if (!essayId) {
        return response.status(400).json({ message: 'Missing essayId' });
    }

    try {
        const db = (await connectDB).db('nae-essay');
        const essay = await getEssayById(db, essayId as string);

        if (!essay) {
            return response.status(404).json({ message: 'Essay not found' });
        }

        return response.status(200).json(essay);
    } catch (error) {
        console.error('Database connection error:', error);
        return response.status(500).json({ message: 'Internal server error' });
    }
}

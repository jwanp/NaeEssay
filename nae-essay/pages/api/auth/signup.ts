import { connectDB } from '@/utils/database';
import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'POST') {
        try {
            const { password, ...rest } = request.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const db = (await connectDB).db('nae-essay');
            const email = await db.collection('user_cred').findOne({
                email: rest.email,
            });

            if (email) {
                return response.status(500).json({ email: '이미 가입된 이메일입니다.' });
            }

            const name = await db.collection('user_cred').findOne({
                name: rest.name,
            });
            if (name) {
                return response.status(500).json({ name: '이미 가입된 이름입니다.' });
            }

            await db.collection('user_cred').insertOne({
                ...rest,
                password: hashedPassword, // Save the hashed password
            });

            response.status(200).json({ message: 'Success' });
        } catch (error) {
            response.status(500).json({ error: 'Server error' });
        }
    } else {
        response.status(405).json({ error: 'Method Not Allowed' });
    }
}

import { connectDB } from '@/utils/database';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';

// AuthOptions wrapped in a function to ensure the MongoDB connection is awaited

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!, // Ensure env variables are defined
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' },
            },
            // Authorize function that validates user credentials
            async authorize(credentials, req): Promise<any | null> {
                const db = (await connectDB).db('nae-essay'); // Use resolved client here
                const user = await db.collection('user_cred').findOne({ email: credentials?.email });

                if (!user) {
                    console.log('No user found with this email');
                    return null;
                }

                const pwCheck = await bcrypt.compare(credentials!.password, user.password);

                if (!pwCheck) {
                    console.log('Incorrect password');
                    return null;
                }

                return user; // Return the user object if credentials are valid
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        // Callback for handling JWT creation
        jwt: async ({ token, user }: { token: JWT; user?: any }) => {
            if (user) {
                token.user = {
                    name: user.name,
                    email: user.email,
                };
            }
            return token;
        },
        // Callback for attaching JWT to session
        session: async ({ session, token }: { session: Session; token: JWT }) => {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET!, // Ensure NEXTAUTH_SECRET is provided
    adapter: MongoDBAdapter(connectDB), // Pass resolved MongoDB client
};

export { handler as GET, handler as POST };

export default NextAuth(authOptions);
const handler = NextAuth(authOptions);

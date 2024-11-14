import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';
import { redirect } from 'next/navigation';

import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/failure.css';
import 'react-simple-toasts/dist/theme/success.css';

import { EssayType } from '@/lib/definitions';

import { EssayLike, EssayComment } from '@/lib/definitions';
import { EssayContentType } from '@/lib/definitions';
import { getDatePrintFormat } from '@/utils/string';

import { LikeIcon, CommentIcon } from '@/components/Icons/Icons';
import Content from './Content';

toastConfig({
    theme: 'failure',
    duration: 5000,
    position: 'top-right',
    clickClosable: true,
    maxVisibleToasts: 3,
});

async function getEssayDetails(essayId: string) {
    try {
        // Convert essayId to ObjectId
        const essayObjectId = new ObjectId(essayId);
        let db = (await connectDB).db('nae-essay');
        const essay = await db.collection('essay').findOne({ _id: essayObjectId });
        // Query to fetch likes for the essay
        const likes = await db.collection('essay_like').find({ essayId: essayObjectId }).toArray();

        // Query to fetch comments for the essay
        const comments = await db.collection('essay_comment').find({ essayId: essayObjectId }).toArray();

        // Return both likes and comments
        return { essay, likes, comments };
    } catch (error) {
        console.error('Error fetching essay details:', error);
        throw new Error('Failed to fetch essay likes and comments.');
    }
}

export default async function Essay({ params }: { params: { id: string } }) {
    const { essay, likes, comments } = await getEssayDetails(params.id);
    console.log(essay);
    console.log(likes);
    console.log(comments);

    if (essay == null) {
        toast('잘못된 요청입니다.');
        redirect('/topics');
    } else {
        return (
            <div className="mx-auto p-5 max-w-6xl">
                <div className="px-8 py-3 my-3">
                    <h2 className=" text-3xl   ">{essay.topic}</h2>
                    <div className="md:max-w-3xl truncate flex border-b-2 p-2 text-[#00000080] gap-2">
                        <p>{essay.author && essay.author}</p>
                        <p>{getDatePrintFormat(essay.date)}</p>
                        <p className="flex">
                            <LikeIcon />
                            {Array.isArray(likes) && likes.length}
                        </p>
                        <p className="flex">
                            <CommentIcon />
                            {Array.isArray(comments) && comments.length}
                        </p>
                    </div>
                </div>

                <Content essayContent={essay.content}></Content>
            </div>
        );
    }
}

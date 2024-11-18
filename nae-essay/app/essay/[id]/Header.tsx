'use client';

import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/failure.css';
import 'react-simple-toasts/dist/theme/success.css';
import { useAppSelector } from '@/lib/hooks';

import { getDatePrintFormat } from '@/utils/string';
import { useQueryClient } from 'react-query';
import { LikeIcon, CommentIcon } from '@/components/Icons/Icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useAppDispatch } from '@/lib/hooks';
import { clearEssay } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

toastConfig({
    theme: 'failure',
    duration: 5000,
    position: 'top-right',
    clickClosable: true,
    maxVisibleToasts: 3,
});

export default function Header() {
    const router = useRouter();
    const { data: session } = useSession();
    const email = session?.user?.email;
    const essay = useAppSelector((state) => state.essay);
    const [isDeleting, setIsDeleting] = useState(false);
    if (isDeleting == false && (essay == null || essay == undefined || essay.topic == '')) {
        toast('잘못된 요청입니다.');
        router.back();
    }

    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const deleteHandler = async () => {
        setIsDeleting(true);
        const response = await fetch('/api/essay/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ essayId: essay._id }),
        });

        if (response.ok) {
            // Refetch queries related to bookmarks
            queryClient.refetchQueries('topics');
            queryClient.refetchQueries('essays');
            queryClient.refetchQueries('BookmarkedTopics');
            queryClient.refetchQueries('myEssays');
            queryClient.refetchQueries('myLikes');
            toast('삭제완료', { theme: 'success' });
            dispatch(clearEssay());
            router.back();
        } else {
            const error = await response.json();
            console.log(error.message);
            toast('에러 발생');
            router.back();
        }
    };

    return (
        <div className="px-8 py-3 my-3">
            <h2 className=" text-3xl   ">{essay.topic}</h2>
            <div className="md:max-w-3xl  flex justify-between border-b-2 p-2 text-[#00000080] ">
                <div className="flex truncate gap-2">
                    <p>{essay.author && essay.author}</p>
                    <p>{getDatePrintFormat(essay.date)}</p>
                    <p className="flex gap-1">
                        <LikeIcon />
                        {essay.likeCount ? essay.likeCount : 0}
                    </p>
                    <p className="flex gap-1">
                        <CommentIcon />
                        {essay.commentCount ? essay.commentCount : 0}
                    </p>
                </div>
                {email && email == essay.email && (
                    <div>
                        <button
                            onClick={deleteHandler}
                            className=" text-[18px] font-[300] mr-2 hover:underline hover:text-red-500 ">
                            삭제
                        </button>
                        <Link
                            href="/write"
                            className=" text-[18px] font-[300] mr-2 hover:underline hover:text-teal-500 text-teal-700">
                            수정
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

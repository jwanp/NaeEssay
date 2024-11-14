'use client';
import { redirect } from 'next/navigation';

import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/failure.css';
import 'react-simple-toasts/dist/theme/success.css';
import { useAppSelector } from '@/lib/hooks';

import { getDatePrintFormat } from '@/utils/string';

import { LikeIcon, CommentIcon } from '@/components/Icons/Icons';

toastConfig({
    theme: 'failure',
    duration: 5000,
    position: 'top-right',
    clickClosable: true,
    maxVisibleToasts: 3,
});

export default function Header() {
    const essay = useAppSelector((state) => state.essay);
    console.log(essay);
    if (essay == null || essay == undefined || essay.topic == '') {
        toast('잘못된 요청입니다.');
        redirect('/topics');
    }
    return (
        <div className="px-8 py-3 my-3">
            <h2 className=" text-3xl   ">{essay.topic}</h2>
            <div className="md:max-w-3xl truncate flex border-b-2 p-2 text-[#00000080] gap-2">
                <p>{essay.author && essay.author}</p>
                <p>{getDatePrintFormat(essay.date)}</p>
                <p className="flex gap-1">
                    <LikeIcon />
                    {essay.likeCount ? essay.likeCount : 0}
                </p>
                <p className="flex gap-1">
                    <CommentIcon />
                    {essay.commnetCount ? essay.commnetCount : 0}
                </p>
            </div>
        </div>
    );
}

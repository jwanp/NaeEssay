'use client';

import { EssayType } from '@/lib/definitions';
import EssayDropDown from '@/components/dropdown/EssayDropDown';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { chageTopic, clearEssay } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
import TopicBookmark from '../Buttons/TopicBookmark';
import { useSearchParams } from 'next/navigation';

import toast from 'react-simple-toasts';
import { useSession } from 'next-auth/react';

export default function EssayTableHeader({ topic, topicId }: { topic: string; topicId: string }) {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const essayCount = useAppSelector((state) => state.essaySort.totalCount);
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookmarkId = searchParams?.get('bookmarkId');

    const clickHandler = () => {
        if (!session) {
            toast('글작성은 로그인 상태에서만 할 수 있습니다.');
            return;
        }
        dispatch(clearEssay());
        dispatch(chageTopic({ value: topic, id: topicId }));
        router.push('/write');
    };
    return (
        <>
            <div className="flex justify-between px-[40px] py-[20px] ">
                <div className="flex items-center mr-5">
                    <h1 className=" font-medium text-xl ">{topic}</h1>
                    <h4 className="hidden md:block shrink-0 font-medium text-base ml-6 text-teal-600">
                        {essayCount}개 에세이
                    </h4>
                </div>

                <div className="hidden md:flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <TopicBookmark topicId={topicId} bookmarkId={bookmarkId} />
                    <EssayDropDown />
                    <button
                        className="w-[96px] shrink-0 px-3 bg-teal-600 hover:bg-teal-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]"
                        onClick={clickHandler}>
                        글 쓰기
                    </button>
                </div>
            </div>
            <div className="md:hidden flex justify-between items-center px-[40px] ">
                <h4 className="shrink-0 font-medium text-base text-teal-600">{essayCount}개 에세이</h4>
                <EssayDropDown />
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button
                    className="w-full shrink-0 px-3 bg-teal-600 hover:bg-teal-500 duration-300 rounded-3xl text-white h-[48px]"
                    onClick={clickHandler}>
                    글 쓰기
                </button>
            </div>
        </>
    );
}

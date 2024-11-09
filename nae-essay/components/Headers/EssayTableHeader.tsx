'use client';

import { EssayType } from '@/lib/definitions';
import EssayDropDown from '@/components/dropdown/EssayDropDown';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { chageTopic } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
export default function EssayTableHeader({ topic, topicId }: { topic: string; topicId: string }) {
    const dispatch = useAppDispatch();
    const essayCount = useAppSelector((state) => state.essaySort.totalCount);
    let router = useRouter();
    const clickHandler = () => {
        dispatch(chageTopic({ value: topic, id: topicId }));
        router.push('/write');
    };
    return (
        <>
            <div className="flex justify-between px-[40px] py-[20px] ">
                <div className="flex items-center mr-5">
                    <h1 className=" font-medium text-xl ">{topic}</h1>
                    <h4 className="hidden md:block shrink-0 font-medium text-base ml-6 text-green-600">
                        {essayCount}개 에세이
                    </h4>
                </div>

                <div className="hidden md:flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <EssayDropDown />
                    <button
                        className="w-[96px] shrink-0 px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]"
                        onClick={clickHandler}>
                        글 쓰기
                    </button>
                </div>
            </div>
            <div className="md:hidden flex justify-between items-center px-[40px] ">
                <h4 className="shrink-0 font-medium text-base text-green-600">{essayCount}개 에세이</h4>
                <EssayDropDown />
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button
                    className="w-full shrink-0 px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-3xl text-white h-[48px]"
                    onClick={clickHandler}>
                    글 쓰기
                </button>
            </div>
        </>
    );
}
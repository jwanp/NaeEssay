'use client';

import { useState } from 'react';
import NewQnAModal from '@/components/Modals/NewQnAModal';
import QnADropDown from '@/components/dropdown/QnADropDown';
import { useAppSelector } from '@/lib/hooks';
export default function QnATableHeader() {
    const qnaCount = useAppSelector((state) => state.qnaSort.totalCount);

    return (
        <>
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl ">QnA</h1>
                    <h4 className="font-medium text-base ml-6 text-teal-600">{qnaCount}개 게시물</h4>
                </div>

                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <QnADropDown />
                    <button className="hidden md:block w-[96px] px-3 bg-teal-600 hover:bg-teal-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]">
                        글쓰기
                    </button>
                </div>
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button className="w-full px-3 bg-teal-600 hover:bg-teal-500 duration-300 rounded-3xl text-white h-[48px]">
                    글쓰기
                </button>
            </div>
        </>
    );
}

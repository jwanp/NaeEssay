'use client';

import { useState, useEffect } from 'react';

import { getDatePrintFormat } from '@/utils/string';
import { EssayType } from '@/lib/definitions';
import EssayDropDown from '@/components/dropdown/EssayDropDown';
import EssayTable from '@/components/Tables/EssayTable';

type Params = {
    id: string;
};

export default function Essays({ params }: { params: Params }) {
    const [datePrintFormat, setDatePrintFormat] = useState('');
    useEffect(() => {
        const dummyDate = new Date();
        setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    }, []);

    let essays: EssayType[] = [];

    for (let i = 0; i < 30; i += 1) {
        essays.push({
            id: i.toString(),
            topic: `why do we have to help people in difficult situations 0`,
            author: 'jwanp',
            date: datePrintFormat,
            public: true,
            content: [
                {
                    outline: `outline${i + 1}`,
                    content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, cupiditate quas. Corrupti alias temporibus soluta laudantium sapiente voluptate voluptatibus a facilis laboriosam aliquid necessitatibus nobis, optio illum sit repellat saepe.`,
                },
                { outline: 'outline2', content: 'content2' },
            ],
            comments: 10,
            likes: 10,
        });
    }
    let essaysCount: number = essays.length;
    let topic: string = essays[0].topic;
    return (
        <div className=" max-w-[1240px] min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <div className="flex justify-between px-[40px] py-[20px] ">
                <div className="flex items-center mr-5">
                    <h1 className=" font-medium text-xl ">{topic}</h1>
                    <h4 className="hidden md:block shrink-0 font-medium text-base ml-6 text-green-600">
                        {essaysCount}개 에세이
                    </h4>
                </div>

                <div className="hidden md:flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <EssayDropDown />
                    <button className="w-[96px] shrink-0 px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]">
                        글 쓰기
                    </button>
                </div>
            </div>
            <div className="md:hidden flex justify-between items-center px-[40px] ">
                <h4 className="shrink-0 font-medium text-base text-green-600">{essaysCount}개 에세이</h4>
                <EssayDropDown />
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button className="w-full shrink-0 px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-3xl text-white h-[48px]">
                    글 쓰기
                </button>
            </div>
            <EssayTable essays={essays} />
        </div>
    );
}

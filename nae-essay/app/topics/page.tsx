'use client';

import TopicDropDown from '@/components/dropdown/TopicDropDown';
import TopicTable from '@/components/Tables/TopicTable';
import NewTopicModal from '@/components/Modals/NewTopicModal';

import { useState, useEffect } from 'react';
import { getDatePrintFormat } from '@/utils/string';

import { TopicType } from '@/lib/definitions';

export default function Topics() {
    const [datePrintFormat, setDatePrintFormat] = useState('');
    useEffect(() => {
        const dummyDate = new Date();
        setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    }, []);

    let topics: TopicType[] = [];

    for (let i = 0; i < 30; i += 1) {
        topics.push({
            id: i.toString(),
            title: `why do we have to help people in difficult situations ${i}`,
            author: 'jwanp',
            date: datePrintFormat,
            essays: 16,
            bookmarks: 20,
            public: true,
        });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    let topic_count = topics.length;

    return (
        <div className="max-w-[1240px]  min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl ">주제</h1>
                    <h4 className="font-medium text-base ml-6 text-green-600">{topic_count}개 주제</h4>
                </div>

                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <TopicDropDown />
                    <button
                        onClick={openModal}
                        className="hidden md:block px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]">
                        주제 만들기
                    </button>
                    <NewTopicModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button
                    onClick={openModal}
                    className="w-full px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-3xl text-white h-[48px]">
                    주제 만들기
                </button>
            </div>

            <TopicTable topics={topics} />
        </div>
    );
}

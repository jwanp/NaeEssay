'use client';
import TopicDropDown from '@/components/dropdown/TopicDropDown';
import AdvTable from '@/components/Tables/TopicTable';
import NewTopicModal from '@/components/Modals/NewTopicModal';
import { useState } from 'react';

export default function Topics() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    let topic_count = 11;

    let topics = [
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
    ];

    return (
        <div className="max-w-[1240px] min-w-[1240px] min-h-screen md:min-w-[unset] pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl">주제</h1>
                    <h4 className="font-medium text-base ml-6">{topic_count}개 주제</h4>
                </div>
                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <TopicDropDown />
                    <button onClick={openModal} className="px-3 bg-green-600 rounded-2xl text-white ml-[40px] h-[48px]">
                        주제 만들기
                    </button>
                    <NewTopicModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
            <AdvTable />
        </div>
    );
}

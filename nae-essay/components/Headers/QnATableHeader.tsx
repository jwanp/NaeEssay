'use client';

import { useState } from 'react';
import NewQnAModal from '@/components/Modals/NewQnAModal';
import QnADropDown from '@/components/dropdown/QnADropDown';

export default function QnATableHeader() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <>
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl ">QnA</h1>
                    {/* <h4 className="font-medium text-base ml-6 text-green-600">{qna_count}개 게시물</h4> */}
                </div>

                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <QnADropDown />
                    <button
                        onClick={openModal}
                        className="hidden md:block w-[96px] px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]">
                        글쓰기
                    </button>
                    <NewQnAModal isOpen={isModalOpen} onClose={closeModal} />
                </div>
            </div>
            <div className="px-4 md:hidden py-[20px]">
                <button
                    onClick={openModal}
                    className="w-full px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-3xl text-white h-[48px]">
                    글쓰기
                </button>
            </div>
        </>
    );
}

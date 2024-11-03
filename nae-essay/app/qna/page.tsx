'use client';

import QnADropDown from '@/components/dropdown/QnADropDown';
import TopicTable from '@/components/Tables/TopicTable';
import NewQnAModal from '@/components/Modals/NewQnAModal';

import { useState, useEffect } from 'react';

import { getDatePrintFormat } from '@/utils/string';

import { QnAType } from '@/lib/definitions';
import QnATable from '@/components/Tables/QnATable';

export default function QnA() {
    const [datePrintFormat, setDatePrintFormat] = useState('');
    useEffect(() => {
        const dummyDate = new Date();
        setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    }, []);

    let qnas: QnAType[] = [];

    for (let i = 0; i < 30; i += 1) {
        qnas.push({
            id: i.toString(),
            title: `why do we have to help people in difficult situations ${i}`,
            author: 'jwanp',
            date: datePrintFormat,
            comments: 16,
            likes: 20,
        });
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    let qna_count = qnas.length;

    return (
        <div className="max-w-[1240px] min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl ">QnA</h1>
                    <h4 className="font-medium text-base ml-6 text-green-600">{qna_count}개 게시물</h4>
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
            <QnATable qnas={qnas} />
        </div>
    );
}

'use client';
import { useState } from 'react';

import NewTopicModal from '../Modals/NewTopicModal';

export default function NewTopicButton({ full }: { full: boolean }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    return (
        <div>
            {full ? (
                <div className="px-4 py-[20px]">
                    <button
                        onClick={openModal}
                        className="w-full px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-3xl text-white h-[48px]">
                        주제 만들기
                    </button>
                </div>
            ) : (
                <button
                    onClick={openModal}
                    className="px-3 bg-green-600 hover:bg-green-500 duration-300 rounded-2xl text-white ml-[40px] h-[48px]">
                    주제 만들기
                </button>
            )}
            <NewTopicModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
}

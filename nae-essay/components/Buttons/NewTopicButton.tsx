'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import NewTopicModal from '../Modals/NewTopicModal';
import toast from 'react-simple-toasts';

export default function NewTopicButton({ full }: { full: boolean }) {
    const { data: session } = useSession();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        if (!session) {
            toast('로그인 후에 주제를 만들 수 있습니다.');
        } else {
            setIsModalOpen(true);
        }
    };
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

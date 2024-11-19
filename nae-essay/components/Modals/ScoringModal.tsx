// components/NewTopicModal.tsx
'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

import { useState, useEffect } from 'react';
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/failure.css';
import 'react-simple-toasts/dist/theme/success.css';

toastConfig({
    theme: 'failure',
    duration: 1000,
    position: 'top-right',
    clickClosable: true,
    maxVisibleToasts: 3,
});

import { useQueryClient, useMutation } from 'react-query';
import RadarChart from '../Chart/RadarChart';

interface NewTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    essayId: string | null;
    content: string | null;
}

export default function ScoringModal({ isOpen, onClose, essayId, content }: NewTopicModalProps) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null); // Store the result from the FastAPI response
    const [error, setError] = useState<string | null>(null); // Store any error that occurs during the request

    useEffect(() => {
        setResult(null); // Reset result when essayId changes
        setError(null); // Reset error when essayId changes
    }, [essayId]); // Dependency on essayId
    const handleSubmit = async () => {
        if (!content) return; // If content is empty, don't send the request

        setLoading(true); // Show loading indicator

        try {
            const response = await fetch('http://localhost:8000/score-essay/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }), // Send the essay content
            });

            if (!response.ok) {
                throw new Error('Failed to score the essay');
            }

            const data = await response.json();
            setResult(data); // Store the result
            toast('에세이가 성공적으로 평가되었습니다.', { theme: 'success' }); // Show success toast
        } catch (error) {
            setError('에세이를 평가중 에러 발생');
            toast((error as any).message, { theme: 'failure' }); // Show error toast
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full  justify-center p-2 text-center items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:w-full sm:max-w-sm data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                        <div className="bg-white px-2 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-center w-full justify-center">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <p className="text-center text-gray-500">
                                        {result ? '평가완료' : loading ? '평가중' : '아직 평가하지 않았습니다.'}
                                    </p>
                                    {loading ? (
                                        <div className="flex justify-center align-middle text-center h-20">
                                            <span className=" loading loading-dots loading-md bg-teal-800"></span>
                                        </div>
                                    ) : (
                                        <RadarChart
                                            value={result && result.scores ? result.scores : null}
                                            isOpen={isOpen}
                                        />
                                    )}

                                    <div className="w-full text-center">
                                        <button
                                            disabled={loading || result}
                                            onClick={handleSubmit}
                                            className="font-[200] m-2 hover:bg-teal-500 mx-auto bg-teal-600 rounded-md py-1 px-3 text-white text-center ">
                                            {loading ? '평가중..' : result ? '평가 완료..' : '평가하기'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

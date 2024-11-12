// components/NewTopicModal.tsx
'use client';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';

import { useState, FormEvent } from 'react';
import toast, { toastConfig } from 'react-simple-toasts';
import 'react-simple-toasts/dist/style.css';
import 'react-simple-toasts/dist/theme/failure.css';
import 'react-simple-toasts/dist/theme/success.css';

toastConfig({
    theme: 'failure',
    duration: 5000,
    position: 'top-right',
    clickClosable: true,
    maxVisibleToasts: 3,
});

import { useQueryClient, useMutation } from 'react-query';

interface NewTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewTopicModal({ isOpen, onClose }: NewTopicModalProps) {
    const [isChecked, setIsChecked] = useState(true);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked); // Update state based on checkbox status
    };

    const queryClient = useQueryClient();

    const mutation = useMutation(
        async (newTopic: { title: string; is_public: boolean }) => {
            const response = await fetch('/api/topic/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTopic),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            return data;
        },
        {
            onSuccess: (data) => {
                toast(data.message, { theme: 'success' });
                queryClient.invalidateQueries('topics'); // Refetch topics list
                onClose(); // Close the modal
            },
            onError: (error: any) => {
                toast(error.message || 'An error occurred');
            },
        }
    );

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            title: formData.get('title') as string,
            is_public: isChecked, // assuming `is_public` is a checkbox or select
        };

        mutation.mutate(data);
    };
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full  justify-center p-4 text-center items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start justify-between">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                        새로운 주제 만들기
                                    </DialogTitle>
                                </div>
                                <div className="flex items-start mb-5">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                                            required
                                            defaultChecked
                                            onChange={handleCheckboxChange}
                                        />
                                    </div>
                                    <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        공개
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <form onSubmit={handleSubmit} className="w-full" method="POST" action="/api/topic/new">
                                <div className="flex items-center border-b border-teal-500 py-2">
                                    <input
                                        name="title"
                                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                        type="text"
                                        placeholder="Topic"
                                        aria-label="Full name"
                                    />

                                    <button
                                        className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                                        type="submit">
                                        Create
                                    </button>
                                    <button
                                        className="flex-shrink-0 border-transparent border-4 text-teal-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
                                        type="button"
                                        onClick={() => {
                                            onClose();
                                        }}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}

'use client';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeContent, changeEssayId } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import Editor from '../../components/Editor/Editor';
import { useQueryClient, useMutation } from 'react-query';
import { Essay } from '@/lib/features/essay/essaySlice';
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

export default function Essays() {
    const essay = useAppSelector((state) => state.essay);
    const dispatch = useAppDispatch();
    const firstTextRef = useRef<string>('');
    const changeFirstText = (value: string) => {
        firstTextRef.current = value;
    };

    let router = useRouter();

    useEffect(() => {
        if (essay.topic == '') {
            router.back();
        }
    }, [essay.topic]);

    const queryClient = useQueryClient();

    const mutation = useMutation(
        async (newEssay: Essay) => {
            const response = await fetch('/api/essay/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEssay),
            });
            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(data.message || 'Something went wrong');
            }

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            return data as { message: string; essayId: string };
        },
        {
            onSuccess: (data) => {
                toast(data.message, { theme: 'success' });
                dispatch(changeEssayId({ essayId: data.essayId }));
                queryClient.refetchQueries({
                    predicate: (query) => {
                        // Make sure the queryKey is properly typed
                        const queryKey = query.queryKey[0];
                        return (
                            typeof queryKey === 'string' &&
                            (queryKey.startsWith('essays') || queryKey.startsWith('topics'))
                        );
                    },
                });
            },
            onError: (error: any) => {
                const errorMessage = error instanceof Error ? error.message : 'An error occurred';
                toast(errorMessage);
            },
        }
    );

    const handleSave = async () => {
        // 나중에 추가적으로 에세이 보이는 페이지로 넘어가야한다.

        const data = {
            ...essay,
        };

        mutation.mutate(data);
    };

    return (
        <div className="flex-1 rounded-md bg-white mt-8 mx-3">
            <div>
                <div className="md:flex items-center w-full bg-gray-400 text-white border border-b border-b-gray-300 p-3 ">
                    <h1 className="my-2 md:my-0 md:flex-1 text-xl">{essay.topic}</h1>
                    <button
                        className="py-2 md:py-0 my-1 md:my-0 rounded-2xl w-full md:w-auto  md:ml-2 px-2 md:rounded-md text-black bg-white md:h-8  hover:text-gray-400 duration-300"
                        onClick={handleSave}>
                        {essay.essayId ? 'Update' : 'Save'}
                    </button>
                </div>
                <div>
                    {essay.content.map((outlineContent, i) => {
                        return (
                            <div className="py-3 px-5 shadow-sm break-words" key={i.toString()}>
                                <p className="p-2 pl-4 text-2xl dark:text-white">{outlineContent.outline}</p>
                                <Editor idx={i} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

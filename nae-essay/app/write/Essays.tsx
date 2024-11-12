'use client';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeContent, changeEssayId } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Editor from '../../components/Editor/Editor';
import { useQueryClient, useMutation } from 'react-query';
import { Essay, clearEssay } from '@/lib/features/essay/essaySlice';
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

    let router = useRouter();

    useEffect(() => {
        if (essay.topic == '' || essay == undefined) {
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

    const [saveKey, setSaveKey] = useState<number>(0);
    const saveRef = useRef<number>(0);
    const savedRef = useRef<number>(0);
    const handleSave = async () => {
        setSaveKey(saveKey + 1);
    };

    // 클릭 했을시에 MyOnSavePlugin 에서 htmlString 을 저장한뒤에 => POST 요청 한다.
    const essayHTMLString = essay.content.map((item) => item.htmlString ?? '').join('');
    useEffect(() => {
        if (saveKey != 0 && saveKey > saveRef.current && essayHTMLString != '') {
            saveRef.current = saveKey;
            const filteredEssay = {
                ...essay, // Keep other properties of `essay`
                content: essay.content.map((item) => {
                    // Return a new object with `content` removed
                    const { content, ...rest } = item; // Exclude the `content` property
                    return rest;
                }),
            };

            mutation.mutate(filteredEssay);
            router.push('/topics/' + essay.topicId);
            // 나중에 추가적으로 에세이 보이는 페이지로 넘어가야한다.
        }
    }, [saveKey, essayHTMLString]);

    useEffect(() => {
        if (savedRef.current > 0) {
            dispatch(clearEssay());
        }
    }, [savedRef]);

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
                                <Editor idx={i} saveKey={saveKey} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

'use client';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeContent } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Editor from '../../components/Editor/Editor';

export default function Essays() {
    const essay = useAppSelector((state) => state.essay);

    let router = useRouter();

    useEffect(() => {
        if (essay.topic == '') {
            router.back();
        }
    }, [essay.topic]);

    return (
        <div className="flex-1 rounded-md bg-white mt-8 mx-3">
            <div>
                <div className="md:flex items-center w-full bg-gray-400 text-white border border-b border-b-gray-300 p-3 ">
                    <h1 className="my-2 md:my-0 md:flex-1 text-xl">{essay.topic}</h1>
                    <button className="py-2 md:py-0 my-1 md:my-0 rounded-2xl w-full md:w-auto  md:ml-2 px-2 md:rounded-md text-black bg-white font-light md:h-8  hover:text-gray-400 duration-300">
                        Save
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

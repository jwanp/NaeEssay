'use client';

import Editor from '../../components/Editor/Editor';
import SideBar from './sideBar';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeContent } from '@/lib/features/essay/essaySlice';

export default function Write() {
    const dispatch = useAppDispatch();
    const essay = useAppSelector((state) => state.essay);

    return (
        <div className="max-w-7xl md:min-h-screen flex flex-col md:flex-row m-auto">
            <SideBar></SideBar>
            <div className="flex-1 rounded-md bg-white mt-8 mx-3">
                <div>
                    <div className="flex items-center w-full bg-gray-400 text-white border border-b border-b-gray-300 p-3 ">
                        <h1 className="flex-1 text-lg">{essay.topic}</h1>
                        <button className="px-2 rounded-md text-black bg-white font-light h-8  hover:text-gray-400 duration-300">
                            Save
                        </button>
                    </div>
                    {essay.content.map((outlineContent, i) => {
                        return (
                            <div className="py-3 px-5 shadow-sm break-words" key={i.toString()}>
                                <p className="p-2 pl-4 text-2xl dark:text-white',">{outlineContent.outline}</p>
                                <Editor idx={i} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

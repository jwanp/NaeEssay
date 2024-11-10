'use client';
import { MdDeleteOutline } from 'react-icons/md';
import { GrPowerCycle } from 'react-icons/gr';
import { RxHamburgerMenu } from 'react-icons/rx';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { changeOutline, addOutline, deleteOutline } from '@/lib/features/essay/essaySlice';

enum Edit {
    Delete,
    None,
    ReArrange,
}

export default function SideBar() {
    const essay = useAppSelector((state) => state.essay);
    const dispatch = useAppDispatch();

    const [editTopic, setEditTopic] = useState<Edit>(Edit.None);
    return (
        <div className="px-3 ">
            <div className="w-full top-16 left-0 mt-8 md:w-80 bg-white rounded-sm">
                <div className="flex border-b border-b-gray-300 p-3  ">
                    <p className="text-gray-500 border-white flex-1">Outline Topics</p>
                    <button
                        className="bg-gray-400 px-2 rounded-md text-sm text-white font-light hover:bg-gray-300 duration-200"
                        onClick={() => {
                            if (editTopic == Edit.None) {
                                setEditTopic(Edit.Delete);
                            } else if (editTopic == Edit.Delete) {
                                setEditTopic(Edit.ReArrange);
                            } else {
                                setEditTopic(Edit.None);
                            }
                        }}>
                        <GrPowerCycle />
                    </button>
                </div>

                <ul className="p-3">
                    {essay.content.map((outlineContent, i) => {
                        return (
                            <li className="flex mb-2" key={i}>
                                {editTopic == Edit.Delete && (
                                    <button
                                        className="flex items-center p-2 bg-green-400 rounded-s-md shadow-md text-white hover:bg-green-300"
                                        onClick={() => {
                                            dispatch(deleteOutline({ idx: i }));
                                        }}>
                                        <MdDeleteOutline></MdDeleteOutline>
                                    </button>
                                )}
                                {editTopic == Edit.ReArrange && (
                                    <button className="flex items-center p-2 bg-green-400 rounded-s-md shadow-md text-white hover:bg-gren-300">
                                        <RxHamburgerMenu></RxHamburgerMenu>
                                    </button>
                                )}

                                <textarea
                                    className="flex p-2 shadow-md  w-full focus:outline-none resize-none h-10"
                                    rows={1}
                                    placeholder="a new topic"
                                    defaultValue={outlineContent.outline}
                                    onChange={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = `${target.scrollHeight}px`;
                                        dispatch(changeOutline({ value: target.value, idx: i }));
                                    }}
                                />
                            </li>
                        );
                    })}

                    <button
                        className="w-full bg-green-400 text-white p-1 hover:bg-green-300 duration-300"
                        onClick={() => {
                            dispatch(addOutline());
                        }}>
                        +<span className="text-xs"> Add a new outline Topic</span>
                    </button>
                </ul>
            </div>
        </div>
    );
}

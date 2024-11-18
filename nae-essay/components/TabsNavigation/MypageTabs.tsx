'use client';

import React, { useState } from 'react';
import { TETabs, TETabsContent, TETabsItem, TETabsPane } from 'tw-elements-react';
import MyEssayTable from '../Tables/MyEssayTable';
import MyLikeTable from '../Tables/MyLikeTable';
import MyBookmarkTable from '../Tables/MyBookmarkTable';
export default function MypageTabs(): JSX.Element {
    const [basicActive, setBasicActive] = useState('tab1');

    const handleBasicClick = (value: string) => {
        if (value === basicActive) {
            return;
        }
        setBasicActive(value);
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="mb-3 mt-5 px-2">
            <div className="flex justify-between align-middle">
                <TETabs className="">
                    <TETabsItem
                        className={`${basicActive == 'tab1' && ' border-teal-500'}  hover:bg-gray-200 px-3  md:px-4 pt-3 pb-2 md:pt-4 md:pb-3 `}
                        onClick={() => handleBasicClick('tab1')}
                        active={basicActive === 'tab1'}>
                        <span className="text-[14px] md:text-[16px] font-[300]">내 에세이</span>
                    </TETabsItem>
                    <TETabsItem
                        className={`${basicActive == 'tab2' && ' border-teal-500'} hover:bg-gray-200 px-4  md:px-6 pt-3 pb-2 md:pt-4 md:pb-3 `}
                        onClick={() => handleBasicClick('tab2')}
                        active={basicActive === 'tab2'}>
                        <span className="text-[14px] md:text-[16px] font-[300]">좋아요</span>
                    </TETabsItem>
                    <TETabsItem
                        className={`${basicActive == 'tab3' && ' border-teal-500'} hover:bg-gray-200 px-4  md:px-6 pt-3 pb-2 md:pt-4 md:pb-3 `}
                        onClick={() => handleBasicClick('tab3')}
                        active={basicActive === 'tab3'}>
                        <span className="text-[14px] md:text-[16px] font-[300]">북마크</span>
                    </TETabsItem>
                </TETabs>

                <div className="relative flex items-center">
                    <button
                        onClick={() => {
                            toggleDropdown();
                        }}
                        className={` mx-5 inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:bg-gray-300  focus:outline-none`}
                        type="button">
                        <svg
                            className="w-4 h-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 16 3">
                            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                        </svg>
                        <span className="sr-only">Comment settings</span>
                    </button>
                    <div
                        className={`${!isDropdownOpen && 'hidden'} top-[50px] right-[-20px] absolute z-10 w-28 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
                        <ul className="py-1 text-sm text-gray-700 ">
                            <li>
                                <button
                                    onClick={async () => {
                                        toggleDropdown();
                                    }}
                                    className="w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    계정 삭제
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <TETabsContent>
                <TETabsPane show={basicActive === 'tab1'}>
                    <MyEssayTable />
                </TETabsPane>
                <TETabsPane show={basicActive === 'tab2'}>
                    <MyLikeTable></MyLikeTable>
                </TETabsPane>
                <TETabsPane show={basicActive === 'tab3'}>
                    <MyBookmarkTable />
                </TETabsPane>
            </TETabsContent>
        </div>
    );
}

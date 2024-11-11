'use client';

import { EssayType } from '@/lib/definitions';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    DocumentIcon,
    FilledDocumentIcon,
    BookmarkIcon,
    FilledBookmarkIcon,
    PreviousIcon,
    NextIcon,
    LikeIcon,
    CommentIcon,
} from './Icons';
import EssaySearch from '../Search/EssaySearch';

import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeEssayCount, changeEssayTopicTitle } from '@/lib/features/sort/SortSlice';

import { useQuery } from 'react-query';

import { getDatePrintFormat } from '@/utils/string';

export default function EssayTable({ id }: { id: string }): React.ReactElement {
    const dispatch = useAppDispatch();

    // 데이터 불러오기
    const essaySort = useAppSelector((state) => state.essaySort.name);
    const limit = 100;

    const {
        data: essays = [],
        isLoading,
        isError,
    } = useQuery<EssayType[]>(['essays', id, essaySort], async () => {
        const response = await fetch(`/api/essay/essays?topicId=${id}&sortBy=${essaySort}&limit=${limit}`);
        const data = await response.json();

        return data;
    });

    // 페이지 번호 조정
    const [currentPage, setCurrentPage] = useState(0);
    const [pageRange, setPageRange] = useState({ startPage: 0, endPage: 4 });

    const rowsPerPage: number = 15;
    const totalPages = Math.ceil(essays.length / rowsPerPage);
    const handlePrevious = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const startPage = Math.max(0, Math.min(currentPage - 2, totalPages - 5));
        const endPage = Math.min(totalPages - 1, startPage + 4);
        setPageRange({ startPage, endPage });
    }, [currentPage, totalPages]);

    useEffect(() => {
        dispatch(changeEssayCount({ value: essays.length }));
    }, [essays]);

    return (
        <div className="max-w-[1200px] bg-white rounded-sm">
            <div className=" px-[20px] hidden md:flex w-full   text-left h-[56px] text-[#000000b3] border-[#f0f0f0] border-b-2">
                <div className="mr-4 content-center flex-1 font-medium text-base ">에세이</div>
                <div className="mr-4 content-center w-[180px] font-medium text-base">저자</div>
                <div className="mr-4 content-center w-[105px] font-medium text-base">날짜</div>
                <div className="content-center w-[200px]"></div>
            </div>
            <div>
                {essays && essays.length <= 0 ? (
                    <div className="flex justify-center content-center px-[20px] py-[16px] bg-white  text-[15px] font-[400px] border-[#f0f0f0] border-b h-[67px] text-[#00000080] ">
                        새로운 에세이를 작성하세요
                    </div>
                ) : (
                    essays &&
                    essays
                        .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
                        .map((essay, idx) => {
                            return (
                                <div key={essay.id}>
                                    {/* 전체 사이즈 */}
                                    <div className="hidden md:flex content-center px-[20px] py-[16px] bg-white  text-[15px] font-[400px] border-[#f0f0f0] border-b h-[67px] text-[#00000080] ">
                                        <Link href={'essay/' + essay.id} className="mr-4 content-center flex-1 min-w-0">
                                            <h4 className="truncate max-w-full font-normal text-base  text-black">
                                                {essay.content[0].outline && essay.content[0].outline}
                                            </h4>
                                            <p className="truncate max-w-full text-[13px]">
                                                {essay.content[0].text && essay.content[0].text}
                                            </p>
                                        </Link>
                                        <div className="min-w-0 mr-4 content-center w-[180px]">
                                            <div className="truncate max-w-full">{essay.author}</div>
                                        </div>
                                        <div className="whitespace-nowrap mr-4 content-center w-[105px] text-[13px]">
                                            {getDatePrintFormat(essay.date)}
                                        </div>
                                        <div className="content-center flex gap-5 w-[200px] text-[14px]">
                                            <div className="flex content-center">
                                                <CommentIcon />
                                                <div className="ml-[6px] content-center">{essay.commentCount}</div>
                                            </div>
                                            <div className="flex content-center">
                                                <LikeIcon />
                                                <div className="ml-[6px] content-center">{essay.likeCount}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 테블릿 이하 사이즈 */}
                                    <div
                                        key={essay.id}
                                        className="md:hidden content-center px-[20px] py-[16px] bg-white text-[15px] font-[400px] border-[#f0f0f0] border-b  text-[#00000080]">
                                        <div className="whitespace-nowrap mr-4 content-center w-[105px] text-[13px]">
                                            {getDatePrintFormat(essay.date)}
                                        </div>
                                        <Link href={'essay/' + essay.id} className="mr-4 content-center flex-1 min-w-0">
                                            <h4 className="truncate max-w-full font-normal text-base  text-black">
                                                {essay.content[0].outline}
                                            </h4>
                                            <p className="truncate max-w-full text-[13px]">{essay.content[0].text}</p>
                                        </Link>
                                        <div className="flex justify-between">
                                            <div className="min-w-0 mr-4 content-center w-[180px]">
                                                <div className="truncate max-w-full">{essay.author}</div>
                                            </div>
                                            <div className="content-center flex justify-end gap-5 w-[200px] text-[14px]">
                                                <div className="flex content-center">
                                                    <CommentIcon />
                                                    <div className="ml-[6px] content-center">{essay.commentCount}</div>
                                                </div>
                                                <div className="flex content-center">
                                                    <LikeIcon />
                                                    <div className="ml-[6px] content-center">{essay.likeCount}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                )}
            </div>
            <div className="w-full flex justify-center h-[80px]">
                <nav className="px-[8px] py-[16px]" aria-label="Page navigation example">
                    <ul className="flex items-center -space-x-px h-10 text-base">
                        <li>
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage == 0}
                                className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Previous</span>
                                <PreviousIcon />
                            </button>
                        </li>
                        {Array.from({ length: pageRange.endPage - pageRange.startPage + 1 }, (_, index) => {
                            const page = pageRange.startPage + index;
                            if (index == currentPage) {
                                return (
                                    <li key={page}>
                                        <button
                                            aria-current="page"
                                            className="z-10 flex items-center justify-center px-4 h-10 leading-tight text-green-600 border border-green-300 bg-green-50 hover:bg-green-100 hover:text-green-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                                            {page + 1}
                                        </button>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={page}>
                                        <button
                                            onClick={() => {
                                                handlePageClick(page);
                                            }}
                                            className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                            {page + 1}
                                        </button>
                                    </li>
                                );
                            }
                        })}

                        <li>
                            <button
                                onClick={handleNext}
                                disabled={currentPage == totalPages - 1}
                                className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                <span className="sr-only">Next</span>
                                <NextIcon />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            <EssaySearch />
        </div>
    );
}

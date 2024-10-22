'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { openNav } from './navSlice';
import { getServerSession } from 'next-auth';
import { Session } from 'next-auth';

export default function NavBar({ session }: { session: Session | null }) {
    // const dispatch = useAppDispatch();null
    // const isOpen = useAppSelector((state) => state.navOpen.isOpen);
    useEffect(() => {
        let isOpen: HTMLInputElement = document.getElementById('isOpen') as HTMLInputElement;
        if (isOpen.checked) {
            setIsOpen(true);
        }
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className=" bg-white px-6">
            <div className="flex h-16 shadow-sm justify-between max-w-7xl mx-auto items-center ">
                <Link href="/">Nae Essay</Link>
                <div className="md:flex font-light text-sm hidden  ">
                    <label className="inline-flex cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-black"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                    </label>
                    <Link href="/topics" className="px-5 hover:text-green-600 transition duration-300 pt-1">
                        Topics
                    </Link>
                    <Link href="/learn" className="px-5 hover:text-green-600 transition duration-300 pt-1">
                        Learn
                    </Link>
                    <Link href="/qna" className="px-5 hover:text-green-600 transition duration-300 pt-1">
                        QnA
                    </Link>
                    <Link href="/posts" className="px-5 hover:text-green-600 transition duration-300 pt-1">
                        Posts
                    </Link>
                    {session ? (
                        <button
                            onClick={() => {
                                signOut();
                            }}
                            className="mx-5 px-4 py-1 text-white text-center bg-red-400 hover:bg-red-300 transition duration-300 rounded-sm">
                            Sign out
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                signIn();
                            }}
                            className="mx-5 px-4 py-1 text-white text-center bg-green-400 hover:bg-green-300 transition duration-300 rounded-sm">
                            Sign in
                        </button>
                    )}
                </div>
                <div className="flex items-center justify-center md:hidden hover:bg-gray-200  h-9 w-9  rounded-sm">
                    <label className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                        <input
                            id="isOpen"
                            type="checkbox"
                            className="sr-only peer"
                            onClick={() => {
                                // dispatch(openNav({ isOpen: !isOpen }));
                                setIsOpen(!isOpen);
                            }}
                        />
                        <span className="w-5 h-0.5 block bg-gray-700 origin-center transition-all duration-300 peer-checked:rotate-45 peer-checked:translate-y-1.5" />
                        <span className="w-5 h-0.5 block bg-gray-700 origin-center transition-all duration-300 peer-checked:opacity-0" />
                        <span className="w-5 h-0.5 block bg-gray-700 origin-center transition-all duration-300 peer-checked:-rotate-45 peer-checked:-translate-y-1.5" />
                    </label>
                </div>
            </div>
            {isOpen && (
                <div className="bg-white flex flex-col py-5 px-6 gap-3 md:hidden">
                    <Link
                        href="/signin"
                        className="flex justify-center items-center font-light h-9 mx-5  text-white text-center bg-green-500 hover:bg-green-600 transition duration-300 rounded-md">
                        Sign in
                    </Link>
                    <Link
                        href="/topics"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        Topics
                    </Link>
                    <Link
                        href="/learn"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        Learn
                    </Link>
                    <Link
                        href="/qna"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        QnA
                    </Link>
                    <Link
                        href="/posts"
                        className="flex justify-center items-center font-light h-9 mx-5 px-4 py-1 rounded-md hover:bg-gray-200 transition duration-300 ">
                        Posts
                    </Link>
                </div>
            )}
        </div>
    );
}

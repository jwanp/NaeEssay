'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { openNav } from './navSlice';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

export default function NavBar({ session }: { session: Session | null }) {
    // const dispatch = useAppDispatch();null
    // const isOpen = useAppSelector((state) => state.navOpen.isOpen);
    const { data: userSession, status } = useSession();
    let email = userSession?.user?.email;
    useEffect(() => {
        let isOpen: HTMLInputElement = document.getElementById('isOpen') as HTMLInputElement;
        if (isOpen.checked) {
            setIsOpen(true);
        }
    });

    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <div className=" bg-white px-6 fixed top-0 left-0 z-50 w-full ">
            <div className="flex h-16 shadow-sm justify-between max-w-7xl mx-auto items-center ">
                <Link href="/">Nae Essay</Link>
                <div className="hidden md:flex font-light text-sm   ">
                    <Link href="/topics" className="px-5 hover:text-teal-600 transition duration-300 pt-1">
                        Topics
                    </Link>
                    {/* <Link href="/learn" className="px-5 hover:text-teal-600 transition duration-300 pt-1">
                        Learn
                    </Link> */}
                    {/* <Link href="/qna" className="px-5 hover:text-teal-600 transition duration-300 pt-1">
                        QnA
                    </Link> */}
                    {email && (
                        <Link href="/mypage" className="px-5 hover:text-teal-600 transition duration-300 pt-1">
                            My page
                        </Link>
                    )}
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
                            className="mx-5 px-4 py-1 text-white text-center bg-teal-400 hover:bg-teal-300 transition duration-300 rounded-sm">
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
                    {!session ? (
                        <button
                            onClick={() => {
                                signIn();
                            }}
                            className="flex justify-center items-center font-light h-9 mx-5  text-white text-center bg-teal-500 hover:bg-teal-600 transition duration-300 rounded-md">
                            Sign in
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                signOut();
                            }}
                            className="flex justify-center items-center font-light h-9 mx-5  text-white text-center bg-red-400 hover:bg-red-300 transition duration-300 rounded-md">
                            Sign out
                        </button>
                    )}

                    <Link
                        href="/topics"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        Topics
                    </Link>
                    {/* <Link
                        href="/learn"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        Learn
                    </Link> */}
                    <Link
                        href="/mypage"
                        className="flex justify-center items-center font-light h-10 mx-5  rounded-md hover:bg-gray-100 transition duration-300">
                        My page
                    </Link>
                </div>
            )}
        </div>
    );
}

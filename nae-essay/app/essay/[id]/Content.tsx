'use client';
import { FilledLikeIcon, LikeIcon } from '@/components/Icons/Icons';
import { EssayContentType } from '@/lib/definitions';

import { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useSession } from 'next-auth/react';
import toast from 'react-simple-toasts';
import { useQueryClient } from 'react-query';
import { increaseLikeCount, decreaseLikeCount } from '@/lib/features/essay/essaySlice';
import { useRouter } from 'next/navigation';
export default function Content() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const essay = useAppSelector((state) => state.essay);
    const hasRunRef = useRef(false);
    useEffect(() => {
        if (!essay.content[0].htmlString && !hasRunRef.current) {
            hasRunRef.current = true;
            router.back();
        }
    }, []);
    const essayContent = essay.content;

    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll handler to track the visible content index
    const handleScroll = () => {
        const visibleIdx = contentRefs.current.findIndex((ref) => {
            if (ref) {
                const rect = ref.getBoundingClientRect();
                // Check if element is within the viewport
                return rect.top >= 0 && rect.top <= window.innerHeight / 2;
            }
            return false;
        });

        if (visibleIdx !== -1 && visibleIdx !== activeIdx) {
            setActiveIdx(visibleIdx);
        }
    };
    const { data: session } = useSession();
    const [Liked, setLiked] = useState<boolean>(!!(essay.myLikeIds && essay.myLikeIds.length > 0));
    const [likeId, setLikeId] = useState<string | undefined | null>(essay.myLikeIds && essay.myLikeIds[0]);
    const queryClient = useQueryClient();
    const likeHandler = async () => {
        if (!session) {
            toast('로그인하지 않았습니다.');
            return;
        }
        try {
            if (Liked) {
                // Delete existing bookmark
                const response = await fetch('/api/essay/like/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ likeId }),
                });

                if (response.ok) {
                    setLikeId(undefined);
                    setLiked(false);
                    dispatch(decreaseLikeCount());

                    // Refetch queries related to likes
                    queryClient.refetchQueries('essays');
                    queryClient.refetchQueries('myEssays');
                    queryClient.refetchQueries('myLikes');
                } else {
                    setLiked(false);
                    const error = await response.json();
                    console.log(error.message);
                }
            } else {
                // Create new like
                const response = await fetch('/api/essay/like/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ essayId: essay._id }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setLikeId(data.likeId);
                    setLiked(true);
                    dispatch(increaseLikeCount());

                    // Refetch queries related to likes
                    queryClient.refetchQueries('essays');
                    queryClient.refetchQueries('myEssays');
                    queryClient.refetchQueries('myLikes');
                } else {
                    const error = await response.json();
                    console.log(error.message);
                }
            }
        } catch (error) {
            console.error('Error handling likes', error);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeIdx, essayContent]); // Dependency array to update when content changes
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (Liked) {
            buttonRef.current?.focus();
        }
    }, [Liked]);

    return (
        <div className="md:flex mx-auto space-y-4 md:space-y-0 md:space-x-6">
            {/* Mobile Sidebar */}
            <aside className="md:hidden w-full transition-all duration-500 ease-in-out rounded-sm overflow-hidden">
                <ul className="border-l-2 border-teal-500 p-4 space-y-2 text-gray-700 text-center md:text-start">
                    {essayContent &&
                        essayContent.map((content: EssayContentType, idx: number) => {
                            if (activeIdx == idx) {
                                return (
                                    <li key={idx} className="text-teal-600 font-semibold truncate">
                                        {' '}
                                        <a href={`#${content.outline}`}>{content.outline}</a>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={idx} className=" truncate">
                                        <a className="hover:underline " href={`#${content.outline}`}>
                                            {content.outline}
                                        </a>
                                    </li>
                                );
                            }
                        })}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="w-full md:max-w-3xl md:min-w-[620px] p-8 bg-white shadow-md mx-auto text-left">
                {essayContent &&
                    essayContent.map((content: EssayContentType, idx: number) => (
                        <div
                            key={idx}
                            ref={(el) => {
                                contentRefs.current[idx] = el; // This line correctly assigns the ref to the current array index
                            }}>
                            <p id={content.outline} className="text-2xl font-bold mb-6">
                                {content.outline}
                            </p>
                            {content.htmlString && (
                                <div
                                    className="text-gray-800 mb-4"
                                    dangerouslySetInnerHTML={{ __html: content.htmlString }}
                                />
                            )}
                        </div>
                    ))}

                <button
                    ref={buttonRef}
                    onClick={likeHandler}
                    type="button"
                    className="bg-teal-400 mx-auto flex gap-3 items-center rounded px-6 py-2 text-xs uppercase leading-normal shadow-lg transition duration-150 ease-in-out 
           hover:bg-teal-300 hover:shadow-md 
            focus:shadow-md focus:outline-none focus:ring-0 
            active:shadow-md 
           motion-reduce:transition-none 
           dark:shadow-black/30 dark:hover:shadow-md dark:focus:shadow-md dark:active:shadow-md">
                    {Liked ? (
                        <FilledLikeIcon fill="teal" stroke="teal" />
                    ) : (
                        <FilledLikeIcon fill="white" stroke="white" />
                    )}
                </button>
            </main>

            {/* Desktop Sidebar */}
            <aside className="md:self-start hidden md:block md:sticky md:top-[100px] md:w-auto md:max-w-[300px] transition-all duration-500 ease-in-out rounded-sm overflow-hidden">
                <ul className="border-l-2 border-teal-500 p-4 space-y-2 text-gray-700 text-center md:text-start">
                    {essayContent &&
                        essayContent.map((content: EssayContentType, idx: number) => {
                            if (activeIdx == idx) {
                                return (
                                    <li key={idx} className="text-teal-600 font-semibold truncate">
                                        {' '}
                                        <a href={`#${content.outline}`}>{content.outline}</a>
                                    </li>
                                );
                            } else {
                                return (
                                    <li key={idx} className=" truncate">
                                        <a className="hover:underline " href={`#${content.outline}`}>
                                            {content.outline}
                                        </a>
                                    </li>
                                );
                            }
                        })}
                </ul>
            </aside>
        </div>
    );
}

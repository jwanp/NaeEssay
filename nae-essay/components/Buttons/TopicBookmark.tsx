'use client';
import { useState } from 'react';
import { BookmarkIcon, FilledBookmarkIcon } from '../Icons/Icons';
import { useQueryClient } from 'react-query';

import toast from 'react-simple-toasts';
interface TopicBookmarkProps {
    topicId: string;
    bookmarkId?: string | null;
}
import { useSession } from 'next-auth/react';

export default function TopicBookmark({ topicId, bookmarkId: initialBookmarkId }: TopicBookmarkProps) {
    const { data: session } = useSession();

    const queryClient = useQueryClient();
    const [isBookmarked, setIsBookmarked] = useState<boolean>(
        initialBookmarkId !== undefined && initialBookmarkId != ''
    );
    const [bookmarkId, setBookmarkId] = useState<string | undefined | null>(initialBookmarkId);

    const clickHandler = async () => {
        if (!session) {
            toast('로그인하지 않았습니다.');
            return;
        }
        try {
            if (isBookmarked) {
                // Delete existing bookmark
                const response = await fetch('/api/bookmark/delete', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookmarkId }),
                });

                if (response.ok) {
                    setBookmarkId(undefined);
                    setIsBookmarked(false);

                    // Refetch queries related to bookmarks
                    queryClient.refetchQueries('topics');
                    queryClient.refetchQueries('essays');
                } else {
                    setIsBookmarked(false);
                    const error = await response.json();
                    console.log(error.message);
                }
            } else {
                // Create new bookmark
                const response = await fetch('/api/bookmark/new', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topicId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setBookmarkId(data.bookmarkId);
                    setIsBookmarked(true);

                    // Refetch queries related to bookmarks
                    queryClient.refetchQueries('topics');
                    queryClient.refetchQueries('essays');
                } else {
                    const error = await response.json();
                    console.log(error.message);
                }
            }
        } catch (error) {
            console.error('Error handling bookmarks', error);
        }
    };

    return (
        <div
            onClick={clickHandler}
            className="hover:border-teal-400 hover:text-teal-500 border border-teal-500 cursor-pointer w-[100px] items-center flex justify-center bg-gray-200 rounded-md h-[48px] text-sm text-teal-600">
            {isBookmarked ? <FilledBookmarkIcon /> : <BookmarkIcon />}
            <p className="px-1">북마크</p>
        </div>
    );
}

'use client';
import { useState } from 'react';
import { BookmarkIcon, FilledBookmarkIcon } from '../Icons/Icons';
import { useQueryClient } from 'react-query';

import toast from 'react-simple-toasts';
interface TopicBookmarkProps {
    topicId: string;
    initialBookmarkId?: string | null;
}
import { useSession } from 'next-auth/react';

export default function TopicBookmark({ topicId, initialBookmarkId }: TopicBookmarkProps) {
    const { data: session } = useSession();

    const queryClient = useQueryClient();
    const [isBookmarked, setIsBookmarked] = useState<boolean>(
        initialBookmarkId != null && initialBookmarkId !== undefined && initialBookmarkId != ''
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
                    queryClient.refetchQueries('BookmarkedTopics');
                    queryClient.refetchQueries('myEssays');
                    queryClient.refetchQueries('myLikes');
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
                    queryClient.refetchQueries('BookmarkedTopics');
                    queryClient.refetchQueries('myEssays');
                    queryClient.refetchQueries('myLikes');
                } else {
                    const error = await response.json();
                    if (error.message == '이미 북마크를 했습니다.') {
                        setIsBookmarked(true);
                        setBookmarkId(error.bookmarkId);
                        return;
                    }
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
            className="w-full  rounded-3xl md:rounded-md  md:w-[100px] hover:border-teal-400 hover:text-teal-500 border border-teal-500 cursor-pointer  items-center flex justify-center bg-gray-200 h-[48px] text-sm text-teal-600">
            {isBookmarked ? <FilledBookmarkIcon /> : <BookmarkIcon />}
            <p className="px-1">북마크</p>
        </div>
    );
}

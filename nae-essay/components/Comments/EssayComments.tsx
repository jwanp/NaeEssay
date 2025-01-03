'use client';
import { getDatePrintFormat } from '@/utils/string';
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useAppSelector, useDeleteComment } from '@/lib/hooks';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/lib/hooks';
import { changeEssayComment, deleteEssayComment, pushEssayComment } from '@/lib/features/essay/essaySlice';
import { EssayComment } from '@/lib/definitions';
import { usePostComment, useUpdateComment } from '@/lib/hooks';
interface CommentType {
    _id: string;
    username: string;
    email: string;
    content: string;
    date: string;
    edited: boolean;
}

export default function EssayComments() {
    const dispatch = useAppDispatch();
    const { data: session } = useSession();

    const essayId: string | null = useAppSelector((state) => state.essay._id);
    const comments: CommentType[] = useAppSelector((state) => state.essay.comment);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean[]>(comments ? Array(comments.length).fill(false) : []);
    const [isCommentUpdating, setIsCommentUpdating] = useState<boolean[]>(
        comments ? Array(comments.length).fill(false) : []
    );
    const toggleDropdown = (index: number) => {
        setIsDropdownOpen((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index]; // Toggle the specific dropdown
            return newState;
        });
    };

    const [newComment, setNewComment] = useState('');
    const updatingCommentRef = useRef<string[]>(comments ? Array(comments.length).fill('') : []);

    const postComment = usePostComment();
    const updateComment = useUpdateComment();
    const deleteComment = useDeleteComment();
    const handleUpdate = async (index: number) => {
        if (!updatingCommentRef.current[index].trim()) {
            alert('댓글을 작성해주세요.');
            return;
        }
        if (!essayId) {
            alert('essayId missing');
            return;
        }
        try {
            const result = await updateComment.mutateAsync({
                commentContent: updatingCommentRef.current[index],
                commentId: comments[index]._id,
            });

            dispatch(
                changeEssayComment({
                    idx: index,
                    value: { ...comments[index], ...result },
                })
            );
            setIsCommentUpdating((state) => {
                const copy = [...state];
                copy[index] = !state[index];
                return copy;
            });
        } catch (error) {
            alert('Error updating comment');
            console.error('Error updating comment:', error);
        }
    };
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!newComment.trim()) {
            alert('댓글을 작성해주세요.');
            return;
        }
        if (!essayId) {
            alert('essayId missing');
            return;
        }

        try {
            const result = await postComment.mutateAsync({ commentContent: newComment, essayId: essayId });

            dispatch(
                pushEssayComment({
                    value: { ...result },
                })
            );
            setNewComment('');
        } catch (error) {
            alert('Error posting comment');
            console.error('Error posting comment:', error);
        }
    };

    return (
        <section className="my-3 dark:bg-gray-900 py-8 lg:py-16 antialiased">
            <div className="max-w-2xl px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                        댓글 ({comments && comments.length})
                    </h2>
                </div>
                <form className="mb-6" onSubmit={handleSubmit}>
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <textarea
                            value={newComment}
                            onChange={(e) => {
                                setNewComment(e.target.value);
                            }}
                            rows={6}
                            id="comment"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..."
                            required></textarea>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-teal-600 rounded-lg focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-800 hover:bg-teal-700">
                        댓글 작성
                    </button>
                </form>
                {/* 새로운 article: border-t border-gray-200  */}
                {/* reply article:  mb-3 ml-6 lg:ml-12  */}
                {comments &&
                    comments.map((comment, index) => {
                        return (
                            <article
                                key={comment._id}
                                className={`${index > 0 && 'border-t'} border-gray-300 relative p-6 text-base  dark:bg-gray-900`}>
                                <footer className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                            {comment.username}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <time>{getDatePrintFormat(comment.date)}</time>
                                        </p>
                                    </div>
                                    {session?.user?.email == comment.email && (
                                        <div>
                                            <button
                                                onClick={() => {
                                                    toggleDropdown(index);
                                                }}
                                                className={`inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 rounded-lg hover:bg-gray-300  focus:outline-none`}
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
                                                className={`${!isDropdownOpen[index] && 'hidden'} top-[65px] right-[-15px] absolute z-10 w-28 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600`}>
                                                <ul className="py-1 text-sm text-gray-700 ">
                                                    <li>
                                                        <button
                                                            onClick={async () => {
                                                                toggleDropdown(index);
                                                                setIsCommentUpdating((state) => {
                                                                    const copy = [...state];
                                                                    copy[index] = !state[index];
                                                                    return copy;
                                                                });
                                                            }}
                                                            className="w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            {isCommentUpdating[index] ? '취소' : '수정'}
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={async () => {
                                                                const result = await deleteComment.mutateAsync({
                                                                    commentId: comment._id,
                                                                });
                                                                dispatch(deleteEssayComment({ idx: index }));
                                                                toggleDropdown(index);
                                                            }}
                                                            className="w-full block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            삭제
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </footer>

                                <div
                                    className={`${isCommentUpdating[index] && 'hidden'} text-gray-500 dark:text-gray-400`}>
                                    <p>{comment.content}</p>
                                    {comment.edited && <p className="italic text-teal-600 mt-1">(수정됨)</p>}
                                </div>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleUpdate(index);
                                    }}
                                    className={`${!isCommentUpdating[index] && 'hidden'} mb-6`}>
                                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                        <textarea
                                            defaultValue={comment.content}
                                            onChange={(e) => {
                                                updatingCommentRef.current[index] = e.target.value;
                                            }}
                                            id="comment"
                                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                            placeholder="Write a comment..."
                                            required></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-teal-600 rounded-lg focus:ring-4 focus:ring-teal-100 dark:focus:ring-teal-800 hover:bg-teal-700">
                                        수정
                                    </button>
                                </form>
                            </article>
                        );
                    })}
            </div>
        </section>
    );
}

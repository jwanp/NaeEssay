// 공통 리액트 훅
'use client';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppDispatch, RootState, AppStore } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

import { useMutation, useQueryClient } from 'react-query';

export const usePostComment = () => {
    const queryClient = useQueryClient();

    return useMutation(
        async ({ commentContent, essayId }: { commentContent: string; essayId: string }) => {
            const response = await fetch('/api/essay/comment/new', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: commentContent, essayId: essayId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post comment');
            }

            return response.json(); // Assuming the response contains commentId and message
        },
        {
            onSuccess: () => {
                // Refetch the "essays" query to update the comments list
                queryClient.refetchQueries('essays');
            },
        }
    );
};

export const useUpdateComment = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ commentContent, commentId }: { commentContent: string; commentId: string }) => {
            const response = await fetch('/api/essay/comment/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: commentContent, commentId: commentId }),
            });
            if (!response.ok) {
                throw new Error('Failed to post comment');
            }
            return response.json();
        },
        {
            // On success, refetch the comments to update the list
            onSuccess: () => {
                queryClient.refetchQueries('essays');
            },
        }
    );
};

export const useDeleteComment = () => {
    const queryClient = useQueryClient();
    return useMutation(
        async ({ commentId }: { commentId: string }) => {
            const response = await fetch('/api/essay/comment/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentId: commentId }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }
            return response.json();
        },
        {
            // On success, refetch the comments to update the list
            onSuccess: () => {
                queryClient.refetchQueries('essays');
            },
        }
    );
};

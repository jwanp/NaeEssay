// 공통 리액트 훅
'use client';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppDispatch, RootState, AppStore } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

export const useWatchId = () => {
    const location = useLocation();
    const [currentId, setCurrentId] = useState<string | null>(null);

    useEffect(() => {
        // Extract the hash from the location (e.g., "#section-2")
        const hash = location.hash;

        if (hash) {
            // The ID will be everything after the '#' (e.g., "section-2")
            setCurrentId(hash.substring(1)); // Remove the '#' character
        }
    }, [location]); // Re-run the effect whenever the location changes

    return currentId;
};

export default useWatchId;

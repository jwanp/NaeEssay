// 공통 리액트 훅
'use client';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppDispatch, RootState, AppStore } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface QueryParamProps {
    keyName: string;
}

interface QueryParamProps {
    keyName: string;
}

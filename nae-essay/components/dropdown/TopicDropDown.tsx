'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';

import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { changeTopicSort } from '@/lib/features/sort/SortSlice';

type koreanSortType = {
    id: number;
    name: '최신순' | '에세이' | '북마크';
};

const koreanSorts: koreanSortType[] = [
    { id: 1, name: '최신순' },
    { id: 2, name: '에세이' },
    { id: 3, name: '북마크' },
];

type englishSortType = {
    id: number;
    name: 'date' | 'essays' | 'bookmarks';
};

const englishSorts: englishSortType[] = [
    { id: 1, name: 'date' },
    { id: 2, name: 'essays' },
    { id: 3, name: 'bookmarks' },
];

export default function TopicDropDown() {
    const sort = useAppSelector((state) => state.topicSort);
    const dispatch = useAppDispatch();
    return (
        <div className="mx-auto w-[120px] ">
            <Combobox
                value={koreanSorts[sort.id - 1]}
                onChange={(sortValue) => {
                    sortValue == null
                        ? dispatch(changeTopicSort(englishSorts[0]))
                        : dispatch(changeTopicSort(englishSorts[sortValue.id - 1]));
                }}>
                <div className="relative ">
                    <ComboboxInput
                        readOnly
                        className={clsx(
                            'rounded-md text-center data-[focus]:border  border-green-400 bg-gray-200 h-[48px] w-full py-1.5 pr-8 pl-3 text-sm  text-green-600',
                            'focus:outline-none '
                        )}
                        displayValue={(sort: koreanSortType) => sort?.name}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 group-data-[hover]:fill-green-500" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'border  border-green-400  border-t-0 rounded-b-md w-[var(--input-width)] bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}>
                    {koreanSorts.map((sortValue) => (
                        <ComboboxOption
                            key={sortValue.id}
                            value={sortValue}
                            className="group flex cursor-default items-center gap-2  py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <CheckIcon className=" invisible size-4 fill-green-500 group-data-[selected]:visible" />
                            <div className="text-sm/6 text-black">{sortValue.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}

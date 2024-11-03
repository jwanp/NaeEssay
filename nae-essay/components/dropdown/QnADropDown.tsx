'use client';

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { useState } from 'react';

type sortType = {
    id: number;
    name: string;
};

const sorts: sortType[] = [
    { id: 1, name: '최신순' },
    { id: 2, name: '댓글순' },
    { id: 3, name: '좋아요' },
];

export default function QnADropDown() {
    const [selected, setSelected] = useState<sortType | null>(sorts[1]);

    return (
        <div className="mx-auto w-[120px] ">
            <Combobox value={selected} onChange={(value) => setSelected(value)}>
                <div className="relative ">
                    <ComboboxInput
                        readOnly
                        className={clsx(
                            'rounded-md text-center data-[focus]:border  border-green-400 bg-gray-200 h-[48px] w-full py-1.5 pr-8 pl-3 text-sm  text-green-600',
                            'focus:outline-none '
                        )}
                        displayValue={(sort: sortType) => sort?.name}
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
                    {sorts.map((sort) => (
                        <ComboboxOption
                            key={sort.id}
                            value={sort}
                            className="group flex cursor-default items-center gap-2  py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <CheckIcon className=" invisible size-4 fill-green-500 group-data-[selected]:visible" />
                            <div className="text-sm/6 text-black">{sort.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}

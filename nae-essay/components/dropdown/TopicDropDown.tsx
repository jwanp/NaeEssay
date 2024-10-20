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
    { id: 2, name: '에세이' },
    { id: 3, name: '북마크' },
];

export default function Example() {
    const [selected, setSelected] = useState<sortType | null>(sorts[1]);

    return (
        <div className="mx-auto w-[120px] ">
            <Combobox value={selected} onChange={(value) => setSelected(value)}>
                <div className="relative">
                    <ComboboxInput
                        readOnly
                        className={clsx(
                            'border-gray-400 bg-gray-200 h-[48px] w-full py-1.5 pr-8 pl-3 text-sm/6 text-gray-700',
                            'focus:outline-none '
                        )}
                        displayValue={(sort: sortType) => sort?.name}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-black/60 group-data-[hover]:fill-black" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'rounded-b-md w-[var(--input-width)]  border border-white bg-white p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}>
                    {sorts.map((sort) => (
                        <ComboboxOption
                            key={sort.id}
                            value={sort}
                            className="group flex cursor-default items-center gap-2  py-1.5 px-3 select-none data-[focus]:bg-white/10">
                            <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                            <div className="text-sm/6 text-black">{sort.name}</div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}

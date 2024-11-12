'use client';
import { EssayContentType } from '@/lib/definitions';
import { useEffect, useState, useRef } from 'react';

interface ContentProps {
    essayContent: EssayContentType[];
}

export default function Content({ essayContent }: ContentProps) {
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

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [activeIdx, essayContent]); // Dependency array to update when content changes

    return (
        <div className="md:flex mx-auto space-y-4 md:space-y-0 md:space-x-6">
            {/* Mobile Sidebar */}
            <aside className="md:hidden w-full transition-all duration-500 ease-in-out rounded-sm overflow-hidden">
                <ul className="border-l-2 border-green-300 p-4 space-y-2 text-gray-700 text-center md:text-start">
                    {essayContent.map((content: EssayContentType, idx: number) => {
                        if (activeIdx == idx) {
                            return (
                                <li key={idx} className="text-green-500 font-semibold truncate">
                                    {' '}
                                    <a href={`#${content.outline}`}>{content.outline}</a>
                                </li>
                            );
                        } else {
                            return (
                                <li key={idx} className="truncate">
                                    <a href={`#${content.outline}`}>{content.outline}</a>
                                </li>
                            );
                        }
                    })}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="w-full md:max-w-3xl md:min-w-[620px] p-8 bg-white shadow-md mx-auto text-left">
                {essayContent.map((content: EssayContentType, idx: number) => (
                    <div
                        key={idx}
                        ref={(el) => {
                            contentRefs.current[idx] = el; // This line correctly assigns the ref to the current array index
                        }}>
                        <p id={content.outline} className="text-2xl font-bold mb-6">
                            {content.outline}
                        </p>
                        <div className="text-gray-800 mb-4" dangerouslySetInnerHTML={{ __html: content.htmlString }} />
                    </div>
                ))}
            </main>

            {/* Desktop Sidebar */}
            <aside className="md:self-start hidden md:block md:sticky md:top-[100px] md:w-auto md:max-w-[300px] transition-all duration-500 ease-in-out rounded-sm overflow-hidden">
                <ul className="border-l-2 border-green-300 p-4 space-y-2 text-gray-700 text-center md:text-start">
                    {essayContent.map((content: EssayContentType, idx: number) => {
                        if (activeIdx == idx) {
                            return (
                                <li key={idx} className="text-green-500 font-semibold truncate">
                                    {' '}
                                    <a href={`#${content.outline}`}>{content.outline}</a>
                                </li>
                            );
                        } else {
                            return (
                                <li key={idx} className="truncate">
                                    <a href={`#${content.outline}`}>{content.outline}</a>
                                </li>
                            );
                        }
                    })}
                </ul>
            </aside>
        </div>
    );
}

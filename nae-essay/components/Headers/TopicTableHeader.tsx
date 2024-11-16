'use client';
import TopicDropDown from '@/components/dropdown/TopicDropDown';
import NewTopicButton from '@/components/Buttons/NewTopicButton';
import { useAppSelector } from '@/lib/hooks';

export default function TopicTableHeader() {
    const topicCount = useAppSelector((state) => state.topicSort.totalCount);

    return (
        <>
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl ">주제</h1>
                    <h4 className="font-medium text-base ml-6 text-teal-600">{topicCount}개 주제</h4>
                </div>

                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}

                    <TopicDropDown />
                    <div className="hidden md:block ">
                        <NewTopicButton full={false} />
                    </div>
                </div>
            </div>
            <div className="md:hidden ">
                <NewTopicButton full={true} />
            </div>
        </>
    );
}

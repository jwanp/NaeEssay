import TopicTable from '@/components/Tables/TopicTable';
import TopicTableHeader from '@/components/Headers/TopicTableHeader';

export default function Topics() {
    return (
        <div className="max-w-[1240px]  min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <TopicTableHeader />

            <TopicTable />
        </div>
    );
}

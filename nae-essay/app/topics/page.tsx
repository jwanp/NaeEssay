import TopicTable from '@/components/Tables/TopicTable';
import TopicTableHeader from '@/components/Headers/TopicTableHeader';

export default function Topics() {
    // const [datePrintFormat, setDatePrintFormat] = useState('');
    // useEffect(() => {
    //     const dummyDate = new Date();
    //     setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    // }, []);

    // let topics: TopicType[] = [];
    // for (let i = 0; i < 30; i += 1) {
    //     topics.push({
    //         id: i.toString(),
    //         title: `why do we have to help people in difficult situations ${i}`,
    //         author: 'jwanp',
    //         date: datePrintFormat,
    //         essays: 16,
    //         bookmarks: 20,
    //         is_public: true,
    //     });
    // }

    // let topic_count = topics.length;

    return (
        <div className="max-w-[1240px]  min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <TopicTableHeader />

            <TopicTable />
        </div>
    );
}

import QnATable from '@/components/Tables/QnATable';
import QnATableHeader from '@/components/Headers/QnATableHeader';
export default function QnA() {
    // const [datePrintFormat, setDatePrintFormat] = useState('');
    // useEffect(() => {
    //     const dummyDate = new Date();
    //     setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    // }, []);

    // let qnas: QnAType[] = [];

    // for (let i = 0; i < 30; i += 1) {
    //     qnas.push({
    //         id: i.toString(),
    //         title: `why do we have to help people in difficult situations ${i}`,
    //         author: 'jwanp',
    //         date: datePrintFormat,
    //         comments: 16,
    //         likes: 20,
    //     });
    // }

    return (
        <div className="max-w-[1240px] min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
            {/* header */}
            <QnATableHeader />
            <QnATable />
        </div>
    );
}

import EssayTable from '@/components/Tables/EssayTable';
import EssayTableHeader from '@/components/Headers/EssayTableHeader';
import { connectDB } from '@/utils/database';
import { ObjectId } from 'mongodb';

import { redirect } from 'next/navigation';
import toast from 'react-simple-toasts';
type Params = {
    id: string;
};

export default async function Essays({ params }: { params: Params }) {
    // const [datePrintFormat, setDatePrintFormat] = useState('');
    // useEffect(() => {
    //     const dummyDate = new Date();
    //     setDatePrintFormat(getDatePrintFormat(dummyDate.toString()));
    // }, []);

    // let essays: EssayType[] = [];

    // for (let i = 0; i < 30; i += 1) {
    //     essays.push({
    //         id: i.toString(),
    //         topic: `why do we have to help people in difficult situations 0`,
    //         author: 'jwanp',
    //         date: datePrintFormat,
    //         public: true,
    //         content: [
    //             {
    //                 outline: `outline${i + 1}`,
    //                 content: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati, cupiditate quas. Corrupti alias temporibus soluta laudantium sapiente voluptate voluptatibus a facilis laboriosam aliquid necessitatibus nobis, optio illum sit repellat saepe.`,
    //             },
    //             { outline: 'outline2', content: 'content2' },
    //         ],
    //         comments: 10,
    //         likes: 10,
    //     });
    // }
    // let essaysCount: number = essays.length;
    // let topic: string = essays[0].topic;
    let db = (await connectDB).db('nae-essay');
    let result = await db.collection('topic').findOne({ _id: new ObjectId(params.id) });

    if (result == null) {
        toast('잘못된 요청입니다.');
        redirect('/topics');
    } else {
        return (
            <div className=" max-w-[1240px] min-h-screen pt-[20px] px-0 pb-[100px] mt-0 mx-auto">
                {/* header */}
                <EssayTableHeader topic={result.title} topicId={params.id} />
                <EssayTable id={params.id} />
            </div>
        );
    }
}

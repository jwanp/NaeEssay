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

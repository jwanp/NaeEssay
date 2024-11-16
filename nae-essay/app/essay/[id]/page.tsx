import Header from './Header';
import Content from './Content';
import EssayComments from '@/components/Comments/EssayComments';
export default async function Essay() {
    // const { essay, likes, comments } = await getEssayDetails(params.id);

    return (
        <div className="mx-auto p-5 max-w-6xl">
            <Header />
            <Content />
            <EssayComments />
        </div>
    );
}

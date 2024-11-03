type Params = {
    id: string;
};

export default function QnA({ params }: { params: Params }) {
    return <div>{params.id} Comming Soon</div>;
}

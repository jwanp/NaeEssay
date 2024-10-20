import TopicDropDown from '@/components/dropdown/TopicDropDown';

export default function Topics() {
    let topic_count = 11;

    let topics = [
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
        {
            topic: 'The Sliding Mr. Bones (Next Stop, Pottersville)',
            author: 'Malcolm Lockyer',
            date: '1961',
            bookmarks: 5,
            essays: 10,
        },
    ];

    return (
        <div className="max-w-[1240px] min-w-[1240px] min-h-screen md:min-w-[unset] pt-[64px] px-0 pb-[200px] mt-0 mx-auto">
            {/* header */}
            <div className="flex justify-between px-[40px] py-[20px]">
                <div className="flex items-center ">
                    <h1 className="font-medium text-xl">주제</h1>
                    <h4 className="font-medium text-base ml-6">{topic_count}개 주제</h4>
                </div>
                <div className="flex items-center">
                    {/* https://tailwindui.com/components/application-ui/forms/select-menus */}
                    <TopicDropDown />
                    <button className="px-3 bg-green-600 rounded-2xl text-white ml-[40px] h-[48px]">주제 만들기</button>
                </div>
            </div>
            <table className="table-auto w-full px-10 bg-white">
                <thead className="mb-2 h-[56px]">
                    <tr>
                        <th>주제</th>
                        <th>작성자</th>
                        <th>날짜</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {topics.map((topic, i) => (
                        <tr className="h-[56px]">
                            <td>{topic.topic}</td>
                            <td>{topic.author}</td>
                            <td>{topic.date}</td>
                            <td>
                                {topic.essays} {topic.bookmarks}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

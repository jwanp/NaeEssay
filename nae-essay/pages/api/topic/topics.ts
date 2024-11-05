// pages/api/topics.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '@/utils/database';

/*
/api/topic/topics?sortBy=${sortBy} 으로 날려야 한다.
- sortBy 변수는 bookmarks 혹은 date 이어야 한다.

client Side 예시
// components/TopicList.tsx
import { useQuery } from '@tanstack/react-query';

async function fetchTopics(sortBy: string) {
  const response = await fetch(`/api/topics?sortBy=${sortBy}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}

export default function TopicList({ sortBy }) {
  const { data: topics, error, isLoading } = useQuery(['topics', sortBy], () => fetchTopics(sortBy), {
    keepPreviousData: true, // Keep previous data while loading new data
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading topics: {error.message}</div>;

  return (
    <ul>
      {topics.map((topic) => (
        <li key={topic._id}>
          <h2>{topic.title}</h2>
          <p>Created at: {new Date(topic.date).toLocaleDateString()}</p>
          <p>Author: {topic.authorName}</p>
          <p>Bookmarks: {topic.bookmarkCount}</p>
        </li>
      ))}
    </ul>
  );
}



*/

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        let db = (await connectDB).db('nae-essay');

        // sortBy default value is date
        const { sortBy = 'date', limit = '1000' } = request.query;

        const topics = await db
            .collection('topic')
            .aggregate([
                {
                    $lookup: {
                        from: 'bookmark',
                        localField: '_id',
                        foreignField: 'topicId',
                        as: 'bookmark',
                    },
                },
                {
                    $addFields: {
                        bookmarkCount: { $size: '$bookmark' },
                    },
                },
                {
                    $lookup: {
                        from: 'essay',
                        localField: '_id',
                        foreignField: 'topicId',
                        as: 'essay',
                    },
                },
                {
                    $addFields: {
                        essayCount: { $size: '$essay' },
                    },
                },
                {
                    $sort: {
                        ...(sortBy === 'bookmarks' ? { bookmarkCount: -1 } : {}),
                        ...(sortBy === 'essays' ? { essayCount: -1 } : {}),
                        ...(sortBy === 'date' ? { date: -1 } : {}),
                    },
                },
            ])
            .toArray();
        const limitedTopics = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedTopics);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

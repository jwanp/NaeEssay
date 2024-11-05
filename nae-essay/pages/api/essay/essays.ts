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
        const { topicId = null, sortBy = 'date', limit = '1000' } = request.query;
        if (topicId == null) {
            return response.status(500).json('잘못된 요청 입니다.');
        }
        const topics = await db
            .collection('essay')
            .aggregate([
                // Filter for essays with the matching topicId
                {
                    $match: {
                        topicId: topicId,
                    },
                },
                {
                    $lookup: {
                        from: 'essay_like',
                        localField: '_id',
                        foreignField: 'essayId',
                        as: 'like',
                    },
                },
                {
                    $addFields: {
                        likeCount: { $size: '$like' },
                    },
                },
                {
                    $lookup: {
                        from: 'essay_comment',
                        localField: '_id',
                        foreignField: 'essayId',
                        as: 'comment',
                    },
                },
                {
                    $addFields: {
                        commentCount: { $size: '$comment' },
                    },
                },
                {
                    $sort: {
                        ...(sortBy === 'comments' ? { commentCount: -1 } : {}),
                        ...(sortBy === 'likes' ? { likeCount: -1 } : {}),
                        ...(sortBy === 'date' ? { date: -1 } : {}),
                    },
                },
            ])
            .toArray();
        const limitedEssays = topics.slice(0, parseInt(limit as string, 10));

        return response.status(200).json(limitedEssays);
    } catch {
        return response.status(500).json('db 연결중 에러가 발생했습니다.');
    }
}

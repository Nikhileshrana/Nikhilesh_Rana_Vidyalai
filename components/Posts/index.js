import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [start, setStart] = useState(0); // Track the starting index of posts
  const [limit, setLimit] = useState(10); // Number of posts to fetch per load
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPosts();
  }, [isSmallerDevice]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/v1/posts', {
        params: { start, limit: isSmallerDevice ? 5 : 10 },
      });
      setPosts([...posts, ...data]); // Append new posts to existing ones
      setStart(start + limit); // Increment starting index for next fetch
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fetchPosts();
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} /> // Ensure each post has a unique key
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!isLoading && posts.length > 0 && (
          <LoadMoreButton onClick={handleClick}>
            Load More
          </LoadMoreButton>
        )}
        {isLoading && (
          <LoadMoreButton disabled>
            Loading...
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
}

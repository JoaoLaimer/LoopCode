'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import HomeExerciseItem from '@/components/HomeExerciseItem';


export default function ListPage({ params }) {
  const actualParams = React.use(params);
  const { id, username } = actualParams;

  const router = useRouter();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    const response = await fetch(`${baseUrl}/lists/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      router.push('/404');
    }
    const data = await response.json();
    return data;
  };

  const handleClickUser = (username) => {
    router.push(`/users/${username}`);
  };

  useEffect(() => {
    setLoading(true);
    fetchData()
      .then(data => {
        setList(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ mt: 6 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        list && (
          <div>
            <Typography variant="h4">
              {list.name}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Criado por
              <span
                onClick={() => handleClickUser(list.ownerUsername)}
                style={{ color: "#8B5CF6", cursor: 'pointer', marginLeft: 4 }}
              >
                {list.ownerUsername}
              </span>
              <span style={{ marginLeft: 4 }}>
                em {list.createdAt ? new Date(list.createdAt).toLocaleDateString() : 'Data desconhecida'}
              </span>
            </Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {list.description?.length > 120
                ? list.description.slice(0, 120) + '...'
                : list.description}
            </Typography>

            {list.exercises && list.exercises.length > 0 ? (
              <Stack spacing={1}>
                {list.exercises.map((exercise) => (
                  <HomeExerciseItem key={exercise.id} exercise={exercise} />
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" mt={2}>
                Nenhum exercício nesta lista.
              </Typography>
            )}
          </div>
        )
      )}
    </Box>
  );
}

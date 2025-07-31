'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  List,
} from '@mui/material';
import { useRouter } from 'next/navigation';

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
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
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
    <Container maxWidth="md" sx={{ mt: 6}}>
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
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Criado por: {list.ownerUsername}
            </Typography>

            {list.exercises && list.exercises.length > 0 ? (
              <List>
                {list.exercises.map((exercise) => (
                            <Box
              key={exercise.id}
              onClick={() => router.push(`/exercises/${exercise.id}`)}
              role="button"
              tabIndex={0}
              sx={{
                bgcolor: "card.primary",
                p: 2,
                borderRadius: 5,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
                boxShadow: 3,
                width: "100%",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                marginBottom: 2,
                "&:hover": {
                  boxShadow: 6,
                  bgcolor: "primary.dark",
                },
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "white" }}>
                {exercise.title}
              </Typography>

              <Typography variant="body2" color="gray">
                Criado por{" "}
                {exercise ? (
                  <a
                    href={`/users/${exercise.createdBy.username}`}
                    style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: "bold" }}
                  >
                    {exercise.createdBy.username}
                  </a>
                ) : (
                  "Carregando..."
                )}
              </Typography>

              <Typography variant="body2" color="gray">
                {exercise.description}
              </Typography>
      
            </Box>
                ))}
              </List>
            ) : (
              <Typography variant="body1" mt={2}>
                Nenhum exercício nesta lista.
              </Typography>
            )}
          </div>
        )
      )}
    </Container>
  );
}

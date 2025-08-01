"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import HomeExerciseItem from "@/components/HomeExerciseItem";
import HomeListItem from "@/components/HomeListItem";
import { useRouter } from "next/navigation";

const filtros = ["Exercícios", "Listas"];

export default function HomePage() {
  const [filtro, setFiltro] = useState("Exercícios");

  const [voteStatusMap, setVoteStatusMap] = useState({});
  const [exercises, setExercises] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [lists, setLists] = useState([]);
  const [currentListPage, setCurrentListPage] = useState(0);
  const [totalListPages, setTotalListPages] = useState(1);
  const [loadingLists, setLoadingLists] = useState(false);

  const sentinelRef = useRef(null);
  const sentinelRefLists = useRef(null);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getExercises = async (page = 0) => {
    try {
      const response = await fetch(`${baseUrl}/exercises?page=${page}&sortBy=votes&order=desc`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar exercícios");
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getLists = async (page = 0) => {
    try {
      const response = await fetch(`${baseUrl}/lists?page=${page}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar listas");
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const loadMoreExercises = useCallback(async () => {
    if (loading || currentPage >= totalPages) return;
    setLoading(true);
    const data = await getExercises(currentPage);
    if (data) {
      setExercises((prev) => [...prev, ...data.content]);

      const voteMap = {};
      data.content.forEach((ex) => {
        if (ex.userVote === 1) voteMap[ex.id] = "up";
        else if (ex.userVote === -1) voteMap[ex.id] = "down";
        else voteMap[ex.id] = null;
      });
      setVoteStatusMap((prev) => ({ ...prev, ...voteMap }));

      setTotalPages(data.totalPages);
      setCurrentPage((prev) => prev + 1);
    }
    setLoading(false);
  }, [currentPage, totalPages, loading]);

  const loadMoreLists = useCallback(async () => {
    if (loadingLists || currentListPage >= totalListPages) return;
    setLoadingLists(true);
    const data = await getLists(currentListPage);
    if (data) {
      setLists((prev) => [...prev, ...data.content]);
      setTotalListPages(data.totalPages);
      setCurrentListPage((prev) => prev + 1);
    }
    setLoadingLists(false);
  }, [currentListPage, totalListPages, loadingLists]);

  useEffect(() => {
    const sentinel =
      filtro === "Exercícios" ? sentinelRef.current : sentinelRefLists.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first.isIntersecting) return;

        if (filtro === "Exercícios" && !loading && currentPage < totalPages) {
          loadMoreExercises();
        }

        if (
          filtro === "Listas" &&
          !loadingLists &&
          currentListPage < totalListPages
        ) {
          loadMoreLists();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [
    filtro,
    loading,
    loadingLists,
    currentPage,
    totalPages,
    currentListPage,
    totalListPages,
    loadMoreExercises,
    loadMoreLists,
  ]);

  const handleVote = async (exerciseId, type) => {
    try {
      const response = await fetch(
        `${baseUrl}/exercises/${exerciseId}/${type}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        console.error("Erro ao votar");
        return;
      }
      updateVoteLocalmente(exerciseId, type);
    } catch (error) {
      console.error("Erro na requisição de voto:", error);
    }
  };

  const updateVoteLocalmente = (exerciseId, type) => {
    setExercises((prevExercises) =>
      prevExercises.map((ex) => {
        if (ex.id !== exerciseId) return ex;

        const currentVote = voteStatusMap[exerciseId];
        let delta = 0;
        let newStatus = currentVote;

        if (type === "upvote") {
          if (currentVote === "up") {
            delta = -1;
            newStatus = null;
          } else if (currentVote === "down") {
            delta = 2;
            newStatus = "up";
          } else {
            delta = 1;
            newStatus = "up";
          }
        } else if (type === "downvote") {
          if (currentVote === "down") {
            delta = 1;
            newStatus = null;
          } else if (currentVote === "up") {
            delta = -2;
            newStatus = "down";
          } else {
            delta = -1;
            newStatus = "down";
          }
        }

        setVoteStatusMap((prev) => ({
          ...prev,
          [exerciseId]: newStatus,
        }));

        return {
          ...ex,
          voteCount: ex.voteCount + delta,
        };
      })
    );
  };

  const handleFiltroClick = (item) => {
    setFiltro(item);

    if (item === "Exercícios" && exercises.length === 0) {
      loadMoreExercises();
    }

    if (item === "Listas" && lists.length === 0) {
      setCurrentListPage(0);
      setLists([]);
      loadMoreLists();
    }
  };

  return (
    <Box className="pt-5">
      <Stack direction="row" spacing={2} mb={3} pl={2} flexWrap="wrap">
        {filtros.map((item) => (
          <Chip
            key={item}
            label={item}
            clickable
            color={filtro === item ? "primary" : "default"}
            onClick={() => handleFiltroClick(item)}
            sx={{
              bgcolor: filtro === item ? "primary.main" : "card.dark",
              color: "white",
            }}
          />
        ))}
      </Stack>

      {filtro === "Exercícios" && (
        <>
          <Stack spacing={2} sx={{ borderRadius: "5px", padding: 2 }}>
            {exercises.map((exercise) => (
              <HomeExerciseItem
                key={exercise.id}
                exercise={exercise}
                voteStatus={voteStatusMap[exercise.id]}
                onVote={handleVote}
              />
            ))}
          </Stack>
          <Box ref={sentinelRef} display="flex" justifyContent="center" mt={4}>
            {loading && <CircularProgress color="primary" />}
          </Box>
        </>
      )}

      {filtro === "Listas" && (
        <>
          <Box sx={{ mt: 2, px: 2 }}>
            <Stack spacing={2}>
              {lists.length === 0 && !loadingLists && (
                <Typography color="gray">Nenhuma lista encontrada.</Typography>
              )}

              {lists.map((list) => (
                <HomeListItem key={list.id} list={list} />
              ))}

              {loadingLists && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <CircularProgress color="primary" />
                </Box>
              )}
            </Stack>
            <Box
              ref={sentinelRefLists}
              display="flex"
              justifyContent="center"
              mt={4}
            ></Box>
          </Box>
        </>
      )}
    </Box>
  );
}

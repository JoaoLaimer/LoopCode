"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AuthGuard from "../auth-guard";

function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("exercicios");
  const [exercises, setExercises] = useState({
    content: [],
    totalPages: 1,
    number: 0,
    first: true,
    last: true,
  });
  const [page, setPage] = useState(1);

  const verifyExercise = async (id) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    try {
      const response = await fetch(`${baseUrl}/exercises/${id}/verify`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      alert("Verified exercise successfully");
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const getExercises = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(
        `${baseUrl}/exercises?page=${page - 1}&size=5`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched exercises:", data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    if (selectedSection === "exercicios") {
      const fetchData = async () => {
        const data = await getExercises();
        if (data) {
          setExercises(data);
        } else {
          setExercises({
            content: [],
            totalPages: 1,
            number: 0,
            first: true,
            last: true,
          });
          console.error("Failed to fetch exercises");
        }
      };
      fetchData();
    }
  }, [page, selectedSection]);

  const handleNextPage = () => {
    if (!exercises.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (!exercises.first) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "usuarios":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Usuários
          </Typography>
        );
      case "moderadores":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Moderadores
          </Typography>
        );
      case "administradores":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Administradores
          </Typography>
        );
      case "bans":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Bans
          </Typography>
        );
      case "timeouts":
        return (
          <Typography variant="h5" sx={{ color: "white" }}>
            Lista de Timeouts
          </Typography>
        );
      case "exercicios":
        return (
          <Box
            sx={{
              height: "80vh",
              overflow: "auto",
              scrollbarGutter: "stable",
              "&::-webkit-scrollbar": {
                width: "8px",
                backgroundColor: "#232136",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#5b46d6",
                borderRadius: "8px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#7c5fff",
              },
              scrollbarWidth: "thin",
              scrollbarColor: "#5b46d6 #232136",
            }}
          >
            {Array.isArray(exercises.content) &&
            exercises.content.length > 0 ? (
              <>
                {exercises.content.map((exercise) => (
                  <Card
                    key={exercise.id}
                    sx={{ mb: 2, bgcolor: "#1e1e2e", color: "white" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          ID: {exercise.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: exercise.verified
                              ? "lightgreen"
                              : "lightcoral",
                          }}
                        >
                          {exercise.verified ? "Verificado" : "Não verificado"}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ mt: 1 }}>
                        {exercise.title}
                      </Typography>
                      <Typography variant="body2">
                        {exercise.description}
                      </Typography>
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() =>
                            alert(`Delete exercise ${exercise.id}`)
                          }
                        >
                          <DeleteIcon />
                        </Button>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          disabled={exercise.verified}
                          onClick={() => {
                            verifyExercise(exercise.id)
                              .then(() => getExercises())
                              .then((data) => {
                                if (data) setExercises(data);
                              });
                          }}
                        >
                          <VerifiedUserRounded />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination Controls */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: 4,
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handlePreviousPage}
                    disabled={exercises.first}
                  >
                    <ArrowBackIosNewIcon />
                  </Button>
                  <Typography>
                    Página {exercises.number + 1} de {exercises.totalPages}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={exercises.last}
                  >
                    <ArrowForwardIosIcon />
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2">
                Nenhum exercício encontrado.
              </Typography>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        color: "white",
        p: 4,
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{ width: 400, display: "flex", flexDirection: "column", gap: 4 }}
      >
        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Usuários
          </Typography>
          <Box
            sx={{
              bgcolor: "card.primary",
              p: 2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color: selectedSection === "usuarios" ? "card.main" : "white",
                }}
                fullWidth
                onClick={() => setSelectedSection("usuarios")}
              >
                Usuários
              </Button>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color:
                    selectedSection === "moderadores" ? "card.main" : "white",
                }}
                fullWidth
                onClick={() => setSelectedSection("moderadores")}
              >
                Moderadores
              </Button>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color:
                    selectedSection === "administradores"
                      ? "card.main"
                      : "white",
                }}
                fullWidth
                onClick={() => setSelectedSection("administradores")}
              >
                Administradores
              </Button>
            </Box>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Moderação
          </Typography>
          <Box
            sx={{
              bgcolor: "#1e1e2e",
              p: 2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              gap: 1,
            }}
          >
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "bans" ? "card.main" : "white",
              }}
              fullWidth
              onClick={() => setSelectedSection("bans")}
            >
              Bans
            </Button>
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "timeouts" ? "card.main" : "white",
              }}
              fullWidth
              onClick={() => setSelectedSection("timeouts")}
            >
              Timeouts
            </Button>
          </Box>
        </Box>

        <Box sx={{ bgcolor: "#5b46d6", borderRadius: 2 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Exercícios
          </Typography>
          <Box
            sx={{
              bgcolor: "#1e1e2e",
              p: 2,
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <Button
              sx={{
                justifyContent: "flex-start",
                color: selectedSection === "exercicios" ? "card.main" : "white",
                mb: 1,
              }}
              fullWidth
              onClick={() => setSelectedSection("exercicios")}
            >
              Exercícios
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pl: 20, fontSize: "1rem" }}>{renderContent()}</Box>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "MOD"]}>
      <Dashboard />
    </AuthGuard>
  );
}

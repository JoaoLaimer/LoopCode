"use client";

import React from "react";
import { Box, Typography, IconButton, Chip, Stack } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import VerifiedUserRounded from "@mui/icons-material/VerifiedUserRounded";
import GppBadRounded from "@mui/icons-material/GppBadRounded";
import CodeIcon from "@mui/icons-material/Code";
import CalculateIcon from "@mui/icons-material/Calculate";
import { useRouter } from "next/navigation";

export default function HomeExerciseItem({ exercise, voteStatus, onVote }) {
  const router = useRouter();

  const showFireIcon = exercise.voteCount >= 1;

  const truncateDescription = (desc, limit = 100) => {
    if (!desc) return "";
    return desc.length > limit ? desc.slice(0, limit).trim() + "..." : desc;
  };

  return (
    <Box
      onClick={() => router.push(`/exercises/${exercise.id}`)}
      role="button"
      tabIndex={0}
      sx={{
        position: "relative",
        bgcolor: "card.primary",
        p: 2,
        borderRadius: 2,
        width: "100%",
        height: 110,
        cursor: "pointer",
        transition: "all 0.1s ease-in-out",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 6,
          bgcolor: "primary.dark",
        },
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Container título e chips separados */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            color: "white",
            flex: 1,
            mr: 2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {exercise.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
          <Chip
            size="small"
            icon={<CalculateIcon />}
            label={
              exercise
                ? exercise.difficulty.charAt(0) +
                  exercise.difficulty.slice(1).toLowerCase()
                : "Carregando..."
            }
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />
          <Chip
            size="small"
            icon={<CodeIcon />}
            label={exercise ? exercise.language.name : "Carregando..."}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
            }}
          />

          <Chip
            size="small"
            icon={
              exercise.verified ? <VerifiedUserRounded /> : <GppBadRounded />
            }
            label={exercise.verified ? "Verificado" : "Não verificado"}
            sx={{
              bgcolor: exercise.verified ? "success.main" : "error.main",
              fontSize: "0.75rem",
              paddingLeft: 0.3,
              paddingRight: 0.3,
              marginRight: 0,
            }}
          />
        </Stack>
      </Box>

      <Typography variant="body2" color="gray">
        Criado por{" "}
        <a
          href={`/users/${exercise.createdBy.username}`}
          style={{
            color: "#8B5CF6",
            textDecoration: "none",
            fontWeight: "bold",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {exercise.createdBy.username}
        </a>
      </Typography>

      <Typography variant="body2" color="gray" sx={{ pr: 18, mt: 0.5 }}>
        {truncateDescription(exercise.description)}
      </Typography>

      {/* Bloco de votos fixo no canto inferior direito */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          position: "absolute",
          bottom: 12,
          right: 12,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showFireIcon && (
          <LocalFireDepartmentIcon
            sx={{ color: "primary.main", fontSize: 26 }}
          />
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "card.primary",
            borderRadius: "25px",
            border: "2px solid",
            borderColor: "primary.main",
            px: 1,
            py: 0.5,
            gap: 1,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            height: 35,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onVote(exercise.id, "upvote");
            }}
          >
            <ArrowDropUpIcon
              sx={{ color: voteStatus === "up" ? "primary.main" : "gray" }}
            />
          </IconButton>

          <Typography
            sx={{ color: "white", fontWeight: "bold", fontSize: "0.875rem" }}
          >
            {exercise.voteCount}
          </Typography>

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onVote(exercise.id, "downvote");
            }}
          >
            <ArrowDropDownIcon
              sx={{ color: voteStatus === "down" ? "primary.main" : "gray" }}
            />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
}

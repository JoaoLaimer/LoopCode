"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomeListItem({ list }) {
    const router = useRouter();

    return (
        <Box
            key={list.id}
            sx={{
                bgcolor: "card.primary",
                p: 2,
                borderRadius: 2,
                cursor: "pointer",
                "&:hover": {
                    bgcolor: "primary.dark",
                },
                height: 110,
                border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            onClick={() => router.push(`/lists/${list.id}`)}
            role="button"
            tabIndex={0}
        >
            <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ color: "white" }}
            >
                {list.name}
            </Typography>

            <Typography variant="body2" color="gray" mb={1} >
                    Criado por{" "}
                    <a
                      href={`/users/${list.ownerUsername}`}
                      style={{ color: "#8B5CF6", textDecoration: "none", fontWeight: "bold" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {list.ownerUsername}
                    </a>
                  </Typography>

            <Typography variant="body2" color="gray">
                {list.exercises.length} exercício(s) |{" "}
                Avaliação dos exercícios: {list.exercises.reduce((acc, ex) => acc + ex.voteCount, 0)}
            </Typography>

        </Box>
    )
}
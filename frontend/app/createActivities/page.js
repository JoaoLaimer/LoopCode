"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

export default function CreateExercisePage() {
  const [step, setStep] = useState(1);

  // Step 1 - Basic Info
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");

  // Step 2 - Code & Test Cases
  const [mainCode, setMainCode] = useState("");
  const [testInput, setTestInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const languages = ["JavaScript", "Python", "Java", "C++"];
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 700,
          bgcolor: "background.default",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        {step === 1 && (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Titulo do Exercício
            </Typography>
            <TextField
              fullWidth
              placeholder="Digite o título do exercício"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Typography variant="h6" gutterBottom>
              Linguagem
            </Typography>
            <TextField
              select
              fullWidth
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>
              Dificuldade
            </Typography>
            <TextField
              select
              fullWidth
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            >
              {difficulties.map((dif) => (
                <MenuItem key={dif} value={dif}>
                  {dif}
                </MenuItem>
              ))}
            </TextField>

            <Typography variant="h6" gutterBottom>
              Descrição
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Digite a descrição do exercício"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 4,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              sx={{ bgcolor: "#6D6AF2", ":hover": { bgcolor: "#5755d9" } }}
            >
              Next
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Main Code 
            </Typography>
            <TextField
              multiline
              minRows={6}
              fullWidth
              placeholder={`Write the main code with {user_code} placeholder\nEx:\nimport sys\na = int(sys.argv[1])\nb = int(sys.argv[2])\ndef sum(a,b):\n\t{user_code}\nprint(sum(a,b))`}
              value={mainCode}
              onChange={(e) => setMainCode(e.target.value)}
              sx={{
                mb: 3,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Inputs Teste
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              placeholder="One per line (e.g. 5, 10)"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              sx={{
                mb: 3,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Outputs Esperados
            </Typography>
            <TextField
              multiline
              minRows={4}
              fullWidth
              placeholder="One per line (e.g. 15)"
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              sx={{
                mb: 4,
                textarea: { color: "white" },
                "& .MuiOutlinedInput-root": { bgcolor: "#0f172a" },
              }}
            />

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleBack}
                sx={{ bgcolor: "#6D6AF2" }}
              >
                Back
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#6D6AF2" }}
                onClick={async () => {
                  const languageMap = {
                    JavaScript: 1,
                    Python: 2,
                    Java: 3,
                    "C++": 4,
                  };

                  const inputList = testInput
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);
                  const outputList = expectedOutput
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean);

                  if (inputList.length !== outputList.length) {
                    alert("Each input must have a corresponding expected output.");
                    return;
                  }

                  const testCases = inputList.map((input, i) => ({
                    input,
                    expectedOutput: outputList[i],
                  }));

                  const requestBody = {
                    title,
                    description,
                    mainCode,
                    difficulty: difficulty.toUpperCase(),
                    languageId: languageMap[language],
                    testCases,
                  };

                  try {
                    const response = await fetch("http://localhost:8080/exercises", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(requestBody),
                    });

                    if (!response.ok) throw new Error("Error creating exercise");

                    const created = await response.json();
                    console.log("Exercise created:", created);
                    alert("Exercise created successfully!");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to create exercise.");
                  }
                }}
              >
                Create
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

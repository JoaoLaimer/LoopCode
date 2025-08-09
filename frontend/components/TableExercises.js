import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    IconButton,
    Menu,
    MenuItem,
    Box,
    TextField,
    InputAdornment, 
    Button,
    Typography
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { VerifiedUserRounded } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TableExercises({
    exercises,
    isActionAllowed,
    verifyExercise,
    isSearching,
    getExercises,
    setExercises,
    deleteExercise,
    searchExercises,
    searchQuery,
    setSearchQuery,
    setIsSearching,
    setPage,
    handlePreviousPage,
    handleNextPage,
    handleClearSearch 
}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedExercise, setSelectedExercise] = useState(null);

    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event, exercise) => {
        setAnchorEl(event.currentTarget);
        setSelectedExercise(exercise);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedExercise(null);
    };

    const handleDelete = async (id) => {
        const success = await deleteExercise(id);
        if (success) {
            setExercises((prev) => ({
                ...prev,
                content: prev.content.filter((ex) => ex.id !== id),
            }));
        }
        handleMenuClose();
    };

    const handleVerify = async (id) => {
        await verifyExercise(id);
        const data = isSearching && searchQuery.trim()
            ? await searchExercises(searchQuery)
            : await getExercises();
        if (data) setExercises(data);
        handleMenuClose();
    };

    const getStatusChip = (verified) => (
        <Chip
            label={verified ? "Verificado" : "Não verificado"}
            size="small"
            sx={{
                bgcolor: verified ? "success.main" : "error.main",
                color: "white",
                fontWeight: "bold",
            }}
        />
    );

    const renderMenuItems = (exercise) => {
        return [
            isActionAllowed("delete") && (
                <MenuItem key="delete" onClick={() => handleDelete(exercise.id)}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Excluir
                </MenuItem>
            ),
            isActionAllowed("verify") && (
                <MenuItem
                    key="verify"
                    disabled={exercise.verified}
                    onClick={() => handleVerify(exercise.id)}
                >
                    <VerifiedUserRounded fontSize="small" sx={{ mr: 1 }} /> Verificar
                </MenuItem>
            )
        ].filter(Boolean);
    };

    const columns = ["ID", "Título", "Descrição", "Status", "Ações"];

    return (
        <Box>
            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={`Buscar exercícios por título...`}
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value.trim()) {
                            setIsSearching(true);
                            setPage(1);
                        } else {
                            setIsSearching(false);
                            setPage(1);
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchQuery && (
                            <InputAdornment position="end">
                                <Button
                                    onClick={handleClearSearch}
                                    sx={{ minWidth: "auto", p: 1 }}
                                >
                                    <ClearIcon sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                                </Button>
                            </InputAdornment>
                        ),
                        sx: {
                            color: "white",
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255, 255, 255, 0.3)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "rgba(255, 255, 255, 0.5)",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "primary.main",
                            },
                        },
                    }}
                    sx={{
                        "& .MuiInputBase-input::placeholder": {
                            color: "rgba(255, 255, 255, 0.5)",
                            opacity: 1,
                        },
                    }}
                />
            </Box>
            <TableContainer component={Paper} sx={{ bgcolor: "#1e1e2e", mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "primary.secondary" }}>
                            {columns.map((col) => (
                                <TableCell
                                    key={col}
                                    sx={{ color: "white", fontWeight: "bold" }}
                                >
                                    {col}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {exercises.content.map((exercise) => (
                            <TableRow
                                key={exercise.id}
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a3e" },
                                    bgcolor: "card.primary",
                                }}
                            >
                                <TableCell sx={{ color: "white" }}>{exercise.id}</TableCell>
                                <TableCell sx={{ color: "white" }}>{exercise.title}</TableCell>
                                <TableCell sx={{ color: "white", maxWidth: "300px" }}>
                                    {exercise.description.length > 50
                                        ? `${exercise.description.substring(0, 50)}...`
                                        : exercise.description}
                                </TableCell>
                                <TableCell>{getStatusChip(exercise.verified)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleMenuOpen(e, exercise)}
                                    >
                                        <MoreVertIcon sx={{ color: "white" }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Menu
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                >
                    {selectedExercise && renderMenuItems(selectedExercise)}
                </Menu>
            </TableContainer>


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
                              <Typography sx={{ color: "white" }}>
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
        </Box>
    );
}

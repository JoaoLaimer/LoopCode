import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Button,
    TextField,
    InputAdornment,
    Typography  
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DeleteIcon from "@mui/icons-material/Delete";

export default function TableLists(
    {
        lists,
        isActionAllowed,
        deleteList,
        setLists,
        setIsSearching,
        setSearchQuery,
        setPage,
        searchQuery,
        handleClearSearch,
        handleNextPage,
        handlePreviousPage
    }) {
    return (
        <Box>
            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={`Buscar listas por nome...`}
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
            <TableContainer
                component={Paper}
                sx={{ bgcolor: "#1e1e2e", mb: 3 }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "primary.secondary" }}>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                ID
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Nome
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Descrição
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Dono
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Exercícios
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Criado Em
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lists.content.map((list) => (
                            <TableRow
                                key={list.id}
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a3e" },
                                    bgcolor: "card.primary",
                                }}
                            >
                                <TableCell sx={{ color: "white" }}>
                                    {list.id}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {list.name}
                                </TableCell>
                                <TableCell sx={{ color: "white", maxWidth: "300px" }}>
                                    {list.description?.length > 100
                                        ? `${list.description.substring(0, 100)}...`
                                        : list.description}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {list.ownerUsername}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {Array.isArray(list.exercises)
                                        ? list.exercises.length
                                        : 0}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {list.createdAt
                                        ? new Date(list.createdAt).toLocaleString()
                                        : ""}
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        {isActionAllowed("delete") && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() =>
                                                    deleteList(list.id).then((success) => {
                                                        if (success) {
                                                            setLists((prev) => ({
                                                                ...prev,
                                                                content: prev.content.filter(
                                                                    (l) => l.id !== list.id
                                                                ),
                                                            }));
                                                        }
                                                    })
                                                }
                                            >
                                                <DeleteIcon />
                                            </Button>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
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
                                disabled={lists.first}
                              >
                                <ArrowBackIosNewIcon />
                              </Button>
                              <Typography sx={{ color: "white" }}>
                                Página {lists.number + 1} de {lists.totalPages}
                              </Typography>
                              <Button
                                variant="contained"
                                onClick={handleNextPage}
                                disabled={lists.last}
                              >
                                <ArrowForwardIosIcon />
                              </Button>
                            </Box>
        </Box>
    );
}
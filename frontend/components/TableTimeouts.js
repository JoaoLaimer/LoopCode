import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Box,
    TextField,
    InputAdornment,
    Typography
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
export default function TableTimeouts(
    {
        timeouts,
        untimeoutUser,
        getTimeouts,
        setTimeouts,
        setSearchQuery,
        setIsSearching,
        setPage,
        searchQuery,
        handleClearSearch,
        handlePreviousPage,
        handleNextPage
    }) {
    return (
        <Box>
            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={`Buscar usuários com timeout por nome de usuário ou email...`}
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
                                Username
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Email
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Razão
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Admin
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Duração (min)
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Data de Início
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Data de Fim
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timeouts.content.map((timeout) => (
                            <TableRow
                                key={timeout.id}
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a3e" },
                                    bgcolor: "card.primary",
                                }}
                            >
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.timedOutUsername}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.timedOutUserEmail}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.reason}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.adminUsername}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.durationMinutes}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {new Date(timeout.timeoutDate).toLocaleString()}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {timeout.timeoutEndDate
                                        ? new Date(
                                            timeout.timeoutEndDate
                                        ).toLocaleString()
                                        : "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            untimeoutUser(timeout.timedOutUsername)
                                                .then(() => getTimeouts())
                                                .then((data) => {
                                                    if (data) setTimeouts(data);
                                                });
                                        }}
                                    >
                                        Remover Timeout
                                    </Button>
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
                    disabled={timeouts.first}
                >
                    <ArrowBackIosNewIcon />
                </Button>
                <Typography sx={{ color: "white" }}>
                    Página {timeouts.number + 1} de {timeouts.totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={timeouts.last}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </Box>
        </Box>
    );
}
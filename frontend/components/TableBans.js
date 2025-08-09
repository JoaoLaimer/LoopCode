import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    InputAdornment,
    TextField,
    Box,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TableBans(
    {
        bans,
        unbanUser,
        getBans,
        setBans,
        searchQuery,
        setSearchQuery,
        isSearching,
        setIsSearching,
        page,
        setPage,
        handleClearSearch,
        handleNextPage,
        handlePreviousPage
    }
) {
    return (
        <Box>
            {/* Search Input */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={`Buscar usuários banidos por nome de usuário ou email...`}
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
                                Data
                            </TableCell>
                            <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bans.content.map((ban) => (
                            <TableRow
                                key={ban.id}
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a3e" },
                                    bgcolor: "card.primary",
                                }}
                            >
                                <TableCell sx={{ color: "white" }}>
                                    {ban.bannedUsername}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {ban.bannedUserEmail}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {ban.banReason}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {ban.adminUsername}
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>
                                    {new Date(ban.banDate).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => {
                                            unbanUser(ban.bannedUsername)
                                                .then(() => getBans())
                                                .then((data) => {
                                                    if (data) setBans(data);
                                                });
                                        }}
                                    >
                                        Desbanir
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
                    disabled={bans.first}
                >
                    <ArrowBackIosNewIcon />
                </Button>
                <Typography sx={{ color: "white" }}>
                    Página {bans.number + 1} de {bans.totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={bans.last}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </Box>
        </Box>
    );
}
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useState } from "react";

export default function TableUsers({
    users,
    isActionAllowed,
    banUser,
    timeoutUser,
    handleRoleChange,
    isSearching,
    searchQuery,
    selectedSection,
    setUsers,
    setSearchQuery,
    setIsSearching,
    setPage,
    handleClearSearch,
    handlePreviousPage,
    handleNextPage,
    getUsers,
    searchUsers

}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const open = Boolean(anchorEl);

    const refreshUsers = () => {
        if (isSearching && searchQuery.trim()) return searchUsers(searchQuery);
        if (selectedSection === "usuarios") return getUsers("USER");
        if (selectedSection === "moderadores") return getUsers("MOD");
        if (selectedSection === "administradores") return getUsers("ADMIN");
    };

    const handleAction = (actionFn, username) => {
        actionFn(username)
            .then((result) => result && refreshUsers())
            .then((data) => data && setUsers(data));
        handleClose();
    };

    const getRoleColor = (role) => {
        switch (role) {
            case "ADMIN": return "#ff7043";
            case "MOD": return "#66bb6a";
            default: return "#42a5f5";
        }
    };

    const handleClickMenu = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const renderMenuItems = (user) => {
        const canBanOrTimeout = user.role === "USER" || user.role === "MOD";

        return [
            canBanOrTimeout && isActionAllowed("ban") && (
                <MenuItem key="ban" onClick={() => handleAction(banUser, user.username)}>
                    Ban
                </MenuItem>
            ),
            canBanOrTimeout && isActionAllowed("timeout") && (
                <MenuItem key="timeout" onClick={() => handleAction(timeoutUser, user.username)}>
                    Timeout
                </MenuItem>
            ),
            isActionAllowed("changeRole") && (
                <MenuItem
                    key="changeRole"
                    onClick={() => {
                        handleRoleChange(user);
                        handleClose();
                    }}
                >
                    Mudar Papel
                </MenuItem>
            )
        ].filter(Boolean);
    };


    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder={`Buscar usuários por nome de usuário ou email...`}
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
                            {["Username", "Email", "Papel", "Streak", "Ações"].map((header) => (
                                <TableCell
                                    key={header}
                                    sx={{ color: "white", fontWeight: "bold" }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.content.map((user) => (
                            <TableRow
                                key={user.username}
                                sx={{
                                    "&:hover": { bgcolor: "#2a2a3e" },
                                    bgcolor: "card.primary"
                                }}
                            >
                                <TableCell sx={{ color: "white" }}>{user.username}</TableCell>
                                <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        sx={{
                                            bgcolor: getRoleColor(user.role),
                                            color: "white",
                                            fontWeight: "bold"
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: "white" }}>{user.dailyStreak}</TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => handleClickMenu(e, user)}
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
                    open={open}
                    onClose={handleClose}
                >
                    {selectedUser && renderMenuItems(selectedUser)}
                </Menu>
            </TableContainer>

            {/* Pagination */}
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
                    disabled={users.first}
                >
                    <ArrowBackIosNewIcon />
                </Button>
                <Typography sx={{ color: "white" }}>
                    Página {users.number + 1} de {users.totalPages}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNextPage}
                    disabled={users.last}
                >
                    <ArrowForwardIosIcon />
                </Button>
            </Box>
        </Box>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import AuthGuard, { useAuth } from "../auth-guard";

import TableUsers from "@/components/TableUsers";
import TableBans from "@/components/TableBans";
import TableTimeouts from "@/components/TableTimeouts";
import TableExercises from "@/components/TableExercises";
import TableLists from "@/components/TableLists";

const EMPTY_PAGE = { content: [], totalPages: 1, number: 0, first: true, last: true };

const SECTIONS = {
  USERS: "usuarios",
  MODS: "moderadores",
  ADMINS: "administradores",
  BANS: "bans",
  TIMEOUTS: "timeouts",
  EXERCISES: "exercicios",
  LISTS: "listas",
};

function Dashboard() {
  const { role: userRole } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // UI / controle
  const [selectedSection, setSelectedSection] = useState(SECTIONS.USERS);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Dados paginados
  const [users, setUsers] = useState(EMPTY_PAGE);
  const [exercises, setExercises] = useState(EMPTY_PAGE);
  const [bans, setBans] = useState(EMPTY_PAGE);
  const [timeouts, setTimeouts] = useState(EMPTY_PAGE);
  const [lists, setLists] = useState(EMPTY_PAGE);

  // Dialog / role change
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // ---------- Permissões ----------
  const isSectionAllowed = (section) => {
    if (userRole === "ADMIN") return true;
    if (userRole === "MOD") {
      return [SECTIONS.USERS, SECTIONS.EXERCISES, SECTIONS.TIMEOUTS].includes(section);
    }
    return false;
  };

  const isActionAllowed = (action) => {
    if (userRole === "ADMIN") return true;
    if (userRole === "MOD") {
      const allowedActions = ["timeout", "verify", "removeTimeout"];
      return allowedActions.includes(action);
    }
    return false;
  };

  // Garante que MODs comecem em seção permitida (disparado quando userRole muda)
  useEffect(() => {
    if (userRole && !isSectionAllowed(selectedSection)) {
      setSelectedSection(SECTIONS.USERS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);


  // ---------- Helper de fetch (centraliza Authorization / tratamento) ----------
  const fetchJson = async (endpoint, init = {}) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { ...(init.headers || {}) };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${baseUrl}${endpoint}`, { ...init, headers });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      // tentamos parsear json; se não for json, devolvemos texto
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) return await res.json();
      return await res.text();
    } catch (err) {
      console.error("fetchJson error:", err);
      return null;
    }
  };

  // ---------- Ações ----------
  const verifyExercise = async (id) => {
    const result = await fetchJson(`/exercises/${id}/verify`, { method: "PATCH" });
    if (result !== null) alert("Exercício verificado com sucesso");
    return result;
  };

  const banUser = async (username) => {
    const reason = prompt("Por favor, insira o motivo do banimento:");
    if (!reason) {
      console.error("O motivo do banimento é obrigatório");
      return null;
    }
    return await fetchJson(`/users/${username}/ban`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banReason: reason }),
    });
  };

  const unbanUser = async (username) => {
    return await fetchJson(`/users/${username}/unban`, { method: "PATCH" });
  };

  const timeoutUser = async (username) => {
    const reason = prompt("Por favor, insira o motivo do timeout:");
    if (!reason) {
      console.error("O motivo do timeout é obrigatório");
      return null;
    }
    const durationInput = prompt("Por favor, insira a duração do timeout em minutos:");
    if (!durationInput) {
      console.error("A duração do timeout é obrigatória");
      return null;
    }
    const durationMinutes = parseInt(durationInput, 10);
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      alert("Por favor, insira um número válido e positivo para a duração");
      return null;
    }
    return await fetchJson(`/users/${username}/timeout`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, durationMinutes }),
    });
  };

  const untimeoutUser = async (username) => {
    return await fetchJson(`/users/${username}/untimeout`, { method: "PATCH" });
  };

  const deleteExercise = async (id) => {
    const sure = confirm("Tem certeza que deseja deletar este exercício?");
    if (!sure) return false;
    const res = await fetchJson(`/exercises/${id}`, { method: "DELETE" });
    return res !== null;
  };

  const deleteList = async (id) => {
    const sure = confirm("Tem certeza que deseja deletar esta lista?");
    if (!sure) return false;
    const res = await fetchJson(`/lists/${id}`, { method: "DELETE" });
    return res !== null;
  };

  const changeUserRole = async (username, newRole) => {
    const res = await fetchJson(`/users/${username}/role?role=${newRole}`, { method: "PATCH" });
    if (res !== null) {
      alert(`Papel alterado com sucesso de ${username} para ${newRole}`);
      return true;
    } else {
      alert("Falha ao alterar papel");
      return false;
    }
  };

  // ---------- Carregamento dos dados ----------
  useEffect(() => {
    let active = true;

    const load = async () => {
      const searching = isSearching && searchQuery.trim().length > 0;

      if (selectedSection === SECTIONS.EXERCISES) {
        const endpoint = searching
          ? `/exercises/search?q=${encodeURIComponent(searchQuery)}&page=${page - 1}&size=9`
          : `/exercises?page=${page - 1}&size=9`;
        const data = await fetchJson(endpoint);
        if (!active) return;
        setExercises(data || EMPTY_PAGE);
        return;
      }

      if (selectedSection === SECTIONS.LISTS) {
        const endpoint = searching
          ? `/lists/search?q=${encodeURIComponent(searchQuery)}&page=${page - 1}&size=9`
          : `/lists?page=${page - 1}&size=9`;
        const data = await fetchJson(endpoint);
        if (!active) return;
        setLists(data || EMPTY_PAGE);
        return;
      }

      if ([SECTIONS.USERS, SECTIONS.MODS, SECTIONS.ADMINS].includes(selectedSection)) {
        const roleParam =
          selectedSection === SECTIONS.USERS ? "USER" : selectedSection === SECTIONS.MODS ? "MOD" : "ADMIN";
        const endpoint = searching
          ? `/users/search?q=${encodeURIComponent(searchQuery)}&role=${roleParam}&page=${page - 1}&size=9`
          : `/users?page=${page - 1}&size=9&role=${roleParam}`;
        const data = await fetchJson(endpoint);
        if (!active) return;
        setUsers(data || EMPTY_PAGE);
        return;
      }

      if (selectedSection === SECTIONS.BANS) {
        const endpoint = searching
          ? `/users/bans/search?q=${encodeURIComponent(searchQuery)}&page=${page - 1}&size=9`
          : `/users/bans?page=${page - 1}&size=9&active=true`;
        const data = await fetchJson(endpoint);
        if (!active) return;
        setBans(data || EMPTY_PAGE);
        return;
      }

      if (selectedSection === SECTIONS.TIMEOUTS) {
        const endpoint = searching
          ? `/users/timeouts/search?q=${encodeURIComponent(searchQuery)}&page=${page - 1}&size=9`
          : `/users/timeouts?page=${page - 1}&size=9&active=true`;
        const data = await fetchJson(endpoint);
        if (!active) return;
        setTimeouts(data || EMPTY_PAGE);
        return;
      }
    };

    load();

    return () => {
      active = false; 
    };
  }, [selectedSection, page, searchQuery, isSearching, baseUrl]);

  // ---------- Helpers de UI / paginação ----------
  const getCurrentPageData = () => {
    switch (selectedSection) {
      case SECTIONS.EXERCISES:
        return exercises;
      case SECTIONS.BANS:
        return bans;
      case SECTIONS.TIMEOUTS:
        return timeouts;
      case SECTIONS.LISTS:
        return lists;
      default:
        return users;
    }
  };

  const handleNextPage = () => {
    const current = getCurrentPageData();
    if (!current.last) setPage((p) => p + 1);
  };

  const handlePreviousPage = () => {
    const current = getCurrentPageData();
    if (!current.first) setPage((p) => p - 1);
  };

  const handleSectionChange = (section) => {
    if (!isSectionAllowed(section)) return;
    setSelectedSection(section);
    setPage(1);
    setSearchQuery("");
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setPage(1);
  };

  // ---------- Role dialog ----------
  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setSelectedRole("");
    setRoleDialogOpen(true);
  };

  const handleRoleConfirm = async () => {
    if (selectedUser && selectedRole) {
      const ok = await changeUserRole(selectedUser.username, selectedRole);
      if (ok) {
        // atualiza a lista de usuários conforme a seção atual
        if (selectedSection === SECTIONS.USERS) {
          const data = await fetchJson(`/users?page=${page - 1}&size=9&role=USER`);
          setUsers(data || EMPTY_PAGE);
        } else if (selectedSection === SECTIONS.MODS) {
          const data = await fetchJson(`/users?page=${page - 1}&size=9&role=MOD`);
          setUsers(data || EMPTY_PAGE);
        } else if (selectedSection === SECTIONS.ADMINS) {
          const data = await fetchJson(`/users?page=${page - 1}&size=9&role=ADMIN`);
          setUsers(data || EMPTY_PAGE);
        }
      }
    }
    setRoleDialogOpen(false);
    setSelectedUser(null);
    setSelectedRole("");
  };

  const getRoleOptions = () => {
    if (selectedSection === SECTIONS.USERS) return ["MOD", "ADMIN"];
    if (selectedSection === SECTIONS.MODS) return ["USER", "ADMIN"];
    if (selectedSection === SECTIONS.ADMINS) return ["USER", "MOD"];
    return [];
  };

  // ---------- Renderização condicional do conteúdo ----------
  const renderContent = () => {
    switch (selectedSection) {
      case SECTIONS.USERS:
      case SECTIONS.MODS:
      case SECTIONS.ADMINS:
        return (
          <TableUsers
            users={users}
            isActionAllowed={isActionAllowed}
            banUser={banUser}
            timeoutUser={timeoutUser}
            handleRoleChange={handleRoleChange}
            isSearching={isSearching}
            searchQuery={searchQuery}
            selectedSection={selectedSection}
            setUsers={setUsers}
            setSearchQuery={setSearchQuery}
            setIsSearching={setIsSearching}
            setPage={setPage}
            handleClearSearch={handleClearSearch}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            getUsers={
              async (role) => {
                const data = await fetchJson(`/users?page=${page - 1}&size=9&role=${role}`);
                if (data) setUsers(data);
                return data;
              }
            }
            searchUsers={
              async (query) => {
                const data = await fetchJson(`/users/search?q=${encodeURIComponent(query)}&page=${page - 1}&size=9`);
                if (data) setUsers(data);
                return data;
              }
            }
          />
        );

      case SECTIONS.BANS:
        return (
          <TableBans
            bans={bans}
            unbanUser={unbanUser}
            getBans={async () => {
              const data = await fetchJson(`/users/bans?page=${page - 1}&size=9&active=true`);
              if (data) setBans(data);
              return data;
            }}
            setBans={setBans}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsSearching={setIsSearching}
            page={page}
            setPage={setPage}
            handleClearSearch={handleClearSearch}
            handleNextPage={handleNextPage}
            handlePreviousPage={handlePreviousPage}
          />
        );

      case SECTIONS.TIMEOUTS:
        return (
          <TableTimeouts
            timeouts={timeouts}
            untimeoutUser={untimeoutUser}
            getTimeouts={async () => {
              const data = await fetchJson(`/users/timeouts?page=${page - 1}&size=9&active=true`);
              if (data) setTimeouts(data);
              return data;
            }}
            setTimeouts={setTimeouts}
            setSearchQuery={setSearchQuery}
            setIsSearching={setIsSearching}
            setPage={setPage}
            searchQuery={searchQuery}
            handleClearSearch={handleClearSearch}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
          />
        );

      case SECTIONS.EXERCISES:
        return (
          <TableExercises
            exercises={exercises}
            isActionAllowed={isActionAllowed}
            verifyExercise={verifyExercise}
            isSearching={isSearching}
            getExercises={async () => {
              const data = await fetchJson(`/exercises?page=${page - 1}&size=9`);
              if (data) setExercises(data);
              return data;
            }}
            setExercises={setExercises}
            deleteExercise={deleteExercise}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsSearching={setIsSearching}
            setPage={setPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            handleClearSearch={handleClearSearch}
          />
        );

      case SECTIONS.LISTS:
        return (
          <TableLists
            lists={lists}
            isActionAllowed={isActionAllowed}
            deleteList={deleteList}
            setLists={setLists}
            setIsSearching={setIsSearching}
            setSearchQuery={setSearchQuery}
            setPage={setPage}
            searchQuery={searchQuery}
            handleClearSearch={handleClearSearch}
          />
        );

      default:
        return null;
    }
  };

  // ---------- JSX  ----------
  return (
    <Box sx={{ display: "flex", height: "90vh", color: "white", marginTop: 6 }}>
      
      {/* Sidebar */}
      <Box sx={{ width: 200, display: "flex", flexDirection: "column", gap: 4 }}>
        <Box sx={{ bgcolor: "primary.secondary" }}>
          <Typography variant="h6" sx={{ p: 1.5 }}>
            Usuários
          </Typography>
          <Box sx={{ bgcolor: "card.primary", p: 1 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {isSectionAllowed(SECTIONS.USERS) && (
                <Button
                  sx={{ justifyContent: "flex-start", color: selectedSection === SECTIONS.USERS ? "card.main" : "white" }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.USERS)}
                >
                  Usuários
                </Button>
              )}

              {isSectionAllowed(SECTIONS.MODS) && (
                <Button
                  sx={{ justifyContent: "flex-start", color: selectedSection === SECTIONS.MODS ? "card.main" : "white" }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.MODS)}
                >
                  Moderadores
                </Button>
              )}

              {isSectionAllowed(SECTIONS.ADMINS) && (
                <Button
                  sx={{
                    justifyContent: "flex-start",
                    color: selectedSection === SECTIONS.ADMINS ? "card.main" : "white",
                  }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.ADMINS)}
                >
                  Administradores
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {(isSectionAllowed(SECTIONS.BANS) || isSectionAllowed(SECTIONS.TIMEOUTS)) && (
          <Box sx={{ bgcolor: "primary.secondary" }}>
            <Typography variant="h6" sx={{ p: 1.5 }}>
              Moderação
            </Typography>
            <Box sx={{ bgcolor: "card.primary", p: 1, gap: 1 }}>
              {isSectionAllowed(SECTIONS.BANS) && (
                <Button
                  sx={{ justifyContent: "flex-start", color: selectedSection === SECTIONS.BANS ? "card.main" : "white" }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.BANS)}
                >
                  Bans
                </Button>
              )}
              {isSectionAllowed(SECTIONS.TIMEOUTS) && (
                <Button
                  sx={{
                    justifyContent: "flex-start",
                    color: selectedSection === SECTIONS.TIMEOUTS ? "card.main" : "white",
                  }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.TIMEOUTS)}
                >
                  Timeouts
                </Button>
              )}
            </Box>
          </Box>
        )}

        {isSectionAllowed(SECTIONS.EXERCISES) && (
          <Box sx={{ bgcolor: "primary.secondary" }}>
            <Typography variant="h6" sx={{ p: 1.5 }}>
              Exercícios
            </Typography>
            <Box sx={{ bgcolor: "card.primary", p: 1 }}>
              <Button
                sx={{
                  justifyContent: "flex-start",
                  color: selectedSection === SECTIONS.EXERCISES ? "card.main" : "white",
                  mb: 1,
                }}
                fullWidth
                onClick={() => handleSectionChange(SECTIONS.EXERCISES)}
              >
                Exercícios
              </Button>
              {isSectionAllowed(SECTIONS.LISTS) && (
                <Button
                  sx={{ justifyContent: "flex-start", color: selectedSection === SECTIONS.LISTS ? "card.main" : "white" }}
                  fullWidth
                  onClick={() => handleSectionChange(SECTIONS.LISTS)}
                >
                  Listas
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, pl: 5 }}>{renderContent()}</Box>

      {/* Role Change Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogTitle>Muda papel de {selectedUser?.username}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Selecione Novo Papel</InputLabel>
            <Select value={selectedRole} label="Select New Role" onChange={(e) => setSelectedRole(e.target.value)}>
              {getRoleOptions().map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleRoleConfirm} variant="contained" disabled={!selectedRole}>
            Mudar Papel
          </Button>
        </DialogActions>
      </Dialog>
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

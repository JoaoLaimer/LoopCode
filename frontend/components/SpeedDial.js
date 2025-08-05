"use client";

import { SpeedDial, SpeedDialAction } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../app/auth-guard";

import MenuIcon from "@mui/icons-material/Menu";
import CodeIcon from "@mui/icons-material/Code";
import TodayIcon from "@mui/icons-material/Today";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DashboardIcon from "@mui/icons-material/Dashboard";

export default function CustomSpeedDial() {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, role } = useAuth() || {};
  const hiddenRoutes = ["/login", "/register"];

  if (hiddenRoutes.includes(pathname) || loading) {
    return null;
  }

  const isPrivileged = role === "ADMIN" || role === "MOD";

  return (
    <SpeedDial
      ariaLabel="Menu de ações"
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 1500,
      }}
      icon={<MenuIcon />}
    >
      <SpeedDialAction
        icon={<TodayIcon />}
        tooltipTitle="Desafio Diário"
        onClick={() => router.push("/daily-challenge")}
      />

      <SpeedDialAction
        icon={<FormatListBulletedIcon />}
        tooltipTitle="Criar Lista"
        onClick={() => router.push("/create-list")}
      />

      <SpeedDialAction
        icon={<CodeIcon />}
        tooltipTitle="Criar Exercício"
        onClick={() => router.push("/create-exercise")}
      />

      {isPrivileged && (
        <SpeedDialAction
          icon={<DashboardIcon />}
          tooltipTitle="Painel de Administração"
          onClick={() => router.push("/dashboard")}
        />
      )}
    </SpeedDial>
  );
}

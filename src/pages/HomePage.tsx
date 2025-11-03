"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Newspaper, Bell } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import AppHeader from "@/components/AppHeader";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-appBgLight pb-16">
      <AppHeader />

      <main className="flex-grow flex flex-col items-center justify-center space-y-6 p-4">
        <Link to="/reports" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueDark hover:bg-blue-900 flex items-center justify-start rounded-2xl shadow-md p-4">
            <FileText className="h-12 w-12 mr-4" />
            <div className="flex flex-col flex-grow items-start gap-1"> {/* Alterado para items-start */}
              <span className="text-2xl font-semibold">Relatórios</span>
              <span className="text-sm text-gray-200 text-left">Acompanhe o desenvolvimento da criança</span> {/* Alterado para text-left */}
            </div>
          </Button>
        </Link>
        <Link to="/calendar" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueMedium hover:bg-appBlueDark flex items-center justify-start rounded-2xl shadow-md p-4">
            <CalendarDays className="h-12 w-12 mr-4" />
            <div className="flex flex-col flex-grow items-start gap-1"> {/* Alterado para items-start */}
              <span className="text-2xl font-semibold">Cronograma</span>
              <span className="text-sm text-gray-200 text-left">Um calendário com rotinas da criança</span> {/* Alterado para text-left */}
            </div>
          </Button>
        </Link>
        <Link to="/news" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueMedium hover:bg-appBlueDark flex items-center justify-start rounded-2xl shadow-md p-4">
            <Newspaper className="h-12 w-12 mr-4" />
            <div className="flex flex-col flex-grow items-start gap-1"> {/* Alterado para items-start */}
              <span className="text-2xl font-semibold">Notícias</span>
              <span className="text-sm text-gray-200 text-left">Notícias sobre autismo em geral</span> {/* Alterado para text-left */}
            </div>
          </Button>
        </Link>
      </main>

      {/* Botão de Notificações Flutuante */}
      <Link to="/notifications" className="fixed top-6 right-4 z-40">
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full bg-appYellowActive hover:bg-yellow-600 text-appBlueDark shadow-lg"
        >
          <Bell className="h-7 w-7" />
        </Button>
      </Link>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
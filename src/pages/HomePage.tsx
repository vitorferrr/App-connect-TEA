"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Newspaper } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-20"> {/* Added pb-20 for bottom nav bar */}
      <header className="text-center py-8">
        <h1 className="text-3xl font-bold text-blue-700">Olá, Usuário!</h1>
        <p className="text-md text-gray-600 mt-2">Bem-vindo ao seu painel de controle.</p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center space-y-6">
        <Link to="/reports" className="w-full max-w-xs">
          <Button className="w-full h-24 text-lg bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center rounded-lg shadow-md">
            <FileText className="h-8 w-8 mb-2" />
            Relatórios
          </Button>
        </Link>
        <Link to="/calendar" className="w-full max-w-xs">
          <Button className="w-full h-24 text-lg bg-purple-500 hover:bg-purple-600 text-white flex flex-col items-center justify-center rounded-lg shadow-md">
            <CalendarDays className="h-8 w-8 mb-2" />
            Calendário
          </Button>
        </Link>
        <Link to="/news" className="w-full max-w-xs">
          <Button className="w-full h-24 text-lg bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center rounded-lg shadow-md">
            <Newspaper className="h-8 w-8 mb-2" />
            Notícias TEA
          </Button>
        </Link>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Newspaper } from "lucide-react";
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
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-semibold">Relatórios</span>
              <span className="text-sm text-gray-200">Acompanhe o desenvolvimento da criança</span>
            </div>
          </Button>
        </Link>
        <Link to="/calendar" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueMedium hover:bg-appBlueDark flex items-center justify-start rounded-2xl shadow-md p-4">
            <CalendarDays className="h-12 w-12 mr-4" />
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-semibold">Cronograma</span>
              <span className="text-sm text-gray-200">Um calendário com rotinas da criança</span>
            </div>
          </Button>
        </Link>
        <Link to="/news" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueMedium hover:bg-appBlueDark flex items-center justify-start rounded-2xl shadow-md p-4">
            <Newspaper className="h-12 w-12 mr-4" />
            <div className="flex flex-col items-start gap-1">
              <span className="text-2xl font-semibold">Notícias</span>
              <span className="text-sm text-gray-200">Notícias sobre autismo em geral</span>
            </div>
          </Button>
        </Link>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
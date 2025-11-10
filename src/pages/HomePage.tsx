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
        <p className="text-lg font-semibold text-appAccent text-center mb-6">Olá, Vitor! Como vai hoje?</p>
        <Link to="/reports" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBluePrimary hover:bg-appAccent flex items-center justify-start rounded-2xl shadow-lg p-4 transition-all hover:scale-105 border-2 border-transparent hover:border-appPuzzleYellow">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <FileText className="h-12 w-12" />
            </div>
            <div className="flex flex-col flex-grow items-start gap-1">
              <span className="text-2xl font-semibold">Relatórios</span>
              <span className="text-xs text-blue-100 text-left">Acompanhe o desenvolvimento da criança</span>
            </div>
          </Button>
        </Link>
        <Link to="/calendar" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appPuzzleGreen hover:bg-green-600 flex items-center justify-start rounded-2xl shadow-lg p-4 transition-all hover:scale-105 border-2 border-transparent hover:border-appPuzzleYellow">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <CalendarDays className="h-12 w-12" />
            </div>
            <div className="flex flex-col flex-grow items-start gap-1">
              <span className="text-2xl font-semibold">Cronograma</span>
              <span className="text-xs text-green-100 text-left">Um calendário com rotinas da criança</span>
            </div>
          </Button>
        </Link>
        <Link to="/news" className="w-full max-w-xs">
          <Button className="w-full h-36 text-white bg-appBlueSecondary hover:bg-appBluePrimary flex items-center justify-start rounded-2xl shadow-lg p-4 transition-all hover:scale-105 border-2 border-transparent hover:border-appPuzzleYellow">
            <div className="bg-white/20 rounded-full p-3 mr-4">
              <Newspaper className="h-12 w-12" />
            </div>
            <div className="flex flex-col flex-grow items-start gap-1">
              <span className="text-2xl font-semibold">Notícias</span>
              <span className="text-xs text-blue-100 text-left">Notícias sobre autismo em geral</span>
            </div>
          </Button>
        </Link>
      </main>

      <Link to="/notifications" className="fixed top-6 right-4 z-40">
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full bg-appPuzzleYellow hover:bg-appPuzzleRed text-white shadow-xl transition-all hover:scale-110"
        >
          <Bell className="h-7 w-7" />
        </Button>
      </Link>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
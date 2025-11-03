"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";

const ProfilePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50 p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700 ml-4">Perfil do Usuário</h1>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center text-center">
        <p className="text-lg text-gray-600">
          Esta é a página do Perfil.
        </p>
        <p className="text-md text-gray-500 mt-2">
          Aqui você pode visualizar e editar suas informações.
        </p>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default ProfilePage;
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Lock } from "lucide-react"; // Usando User e Lock para os ícones de Login/Senha

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="text-center mb-8">
        {/* Placeholder para o logo de quebra-cabeça */}
        <div className="w-24 h-24 mx-auto mb-4">
          <img src="/placeholder.svg" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-bold text-blue-800 mb-2">TESTE</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/login">
          <Button className="w-full h-12 bg-appBlueDark hover:bg-blue-900 text-white text-lg flex items-center justify-center rounded-full shadow-md">
            <User className="h-6 w-6 mr-2" /> Login
          </Button>
        </Link>
        <Link to="/register">
          <Button className="w-full h-12 bg-appBlueDark hover:bg-blue-900 text-white text-lg flex items-center justify-center rounded-full shadow-md">
            <Lock className="h-6 w-6 mr-2" /> Cadastre-se
          </Button>
        </Link>
        <Button variant="outline" className="w-full h-12 border-gray-300 text-gray-700 flex items-center justify-center rounded-full shadow-sm">
          <span className="font-bold text-xl mr-2">G</span>
          Conectar com o Google
        </Button>
        <p className="mt-4 text-center text-sm text-gray-700">
          Não tem uma conta?{" "}
          <Link to="/register" className="underline text-blue-600 hover:text-blue-800">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
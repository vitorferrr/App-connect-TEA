"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Puzzle } from "lucide-react"; // Importando o ícone Puzzle
import GoogleSignInButton from "@/components/GoogleSignInButton";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="text-center mb-8">
        {/* Ícone de quebra-cabeça simbolizando a inclusão autista */}
        <Puzzle className="h-24 w-24 mx-auto mb-4 text-appBlueDark" /> {/* Usando o ícone Puzzle */}
        <h1 className="text-4xl font-bold text-blue-800 mb-2">Connect TEA</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link to="/login">
          <Button className="w-full h-12 bg-appBlueDark hover:bg-blue-900 text-white text-lg flex items-center justify-center rounded-full shadow-md">
            <User className="h-6 w-6 mr-2" /> Login
          </Button>
        </Link>
        <GoogleSignInButton>
          Conectar com o Google
        </GoogleSignInButton>
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
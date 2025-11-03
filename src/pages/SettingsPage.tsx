"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false); // Exemplo de configuração

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-blue-700">Configurações</h1>
          <p className="text-sm text-gray-500">Gerencie suas preferências</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        {/* Seção de Notificações */}
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Notificações</CardTitle>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications-mode" className="text-base text-gray-700">
                Receber notificações
              </Label>
              <Switch
                id="notifications-mode"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
            <p className="text-sm text-gray-500">
              Ative ou desative as notificações para atualizações importantes.
            </p>
          </CardContent>
        </Card>

        {/* Seção de Aparência (Exemplo) */}
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Aparência</CardTitle>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="text-base text-gray-700">
                Modo Escuro
              </Label>
              <Switch
                id="dark-mode"
                checked={darkModeEnabled}
                onCheckedChange={setDarkModeEnabled}
              />
            </div>
            <p className="text-sm text-gray-500">
              Alterne entre o tema claro e escuro para o aplicativo.
            </p>
          </CardContent>
        </Card>

        {/* Seção de Conta (Exemplo de link) */}
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">Conta</CardTitle>
          <CardContent className="p-0 space-y-2">
            <Link to="/profile" className="block">
              <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50">
                Editar Perfil
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-blue-700 hover:bg-blue-50">
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default SettingsPage;
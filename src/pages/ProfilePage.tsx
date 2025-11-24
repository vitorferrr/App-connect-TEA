"use client";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  Settings,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  first_name: string;
  last_name: string;
  user_type: string;
  phone_number: string;
  email: string;
  avatar_url: string | null;
  updated_at: string; // Adicionado updated_at para cache-busting
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error(
          "Erro ao carregar informações do usuário. Por favor, faça login novamente."
        );
        navigate("/login");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "first_name, last_name, user_type, phone_number, avatar_url, updated_at"
        ) // Selecionar updated_at
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Erro ao carregar perfil: " + error.message);
        setLoading(false);
        return;
      }

      if (data) {
        setProfile({
          ...data,
          email: user.email || "",
        });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
    } else {
      toast.success("Você saiu da sua conta.");
      navigate("/");
    }
    setLoading(false);
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const safeFirst = (firstName ?? "").trim();
    const safeLast = (lastName ?? "").trim();

    // Se não tiver nada, devolve um "?"
    if (!safeFirst && !safeLast) {
      return "?";
    }

    const firstInitial = safeFirst ? safeFirst.charAt(0).toUpperCase() : "";
    const lastInitial = safeLast ? safeLast.charAt(0).toUpperCase() : "";

    return `${firstInitial}${lastInitial}` || "?";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-appBgLight">
        <p className="text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-appBgLight">
        <p className="text-red-600">Não foi possível carregar o perfil.</p>
      </div>
    );
  }

  // Adiciona o parâmetro de cache-busting ao URL do avatar
  const avatarSrcWithCacheBusting = profile.avatar_url
    ? `${profile.avatar_url}?t=${new Date(profile.updated_at).getTime()}`
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-blue-700">Perfil</h1>
          <p className="text-sm text-gray-500">Informações da conta</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        {/* Profile Summary Card */}
        <Card className="w-full p-6 flex flex-col items-center shadow-md">
          <Avatar className="h-24 w-24 mb-4 bg-blue-600 text-white text-3xl font-bold flex items-center justify-center">
            {avatarSrcWithCacheBusting ? (
              <AvatarImage
                src={avatarSrcWithCacheBusting}
                alt="Avatar do Usuário"
              />
            ) : (
              <AvatarFallback>
                {getInitials(profile.first_name, profile.last_name)}
              </AvatarFallback>
            )}
          </Avatar>
          <h2 className="text-xl font-semibold text-gray-800">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-sm text-gray-500">{profile.user_type}</p>
        </Card>

        {/* Personal Information Card */}
        <Card className="w-full p-6 shadow-md">
          <CardTitle className="text-lg font-semibold text-gray-800 mb-4">
            Informações pessoais
          </CardTitle>
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">
                    {showEmail ? profile.email : "********"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowEmail(!showEmail)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showEmail ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Telefone</p>
                <p className="font-medium text-gray-800">
                  {profile.phone_number || "Não informado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Link to="/edit-profile" className="w-full">
          <Button className="w-full h-12 bg-blue-100 hover:bg-blue-200 text-blue-700 text-lg flex items-center justify-start rounded-full shadow-sm px-6">
            <Settings className="h-6 w-6 mr-3" /> Editar Perfil
          </Button>
        </Link>
        <Button
          onClick={handleLogout}
          className="w-full h-12 bg-red-100 hover:bg-red-200 text-red-700 text-lg flex items-center justify-start rounded-full shadow-sm px-6"
        >
          <LogOut className="h-6 w-6 mr-3" /> Sair da conta
        </Button>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default ProfilePage;

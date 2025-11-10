"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, CircleDot } from "lucide-react"; // Added CheckCircle2 and CircleDot icons
import BottomNavBar from "@/components/BottomNavBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Erro ao carregar usuário. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar notificações: " + error.message);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao marcar como lida: " + error.message);
    } else {
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
      );
      toast.success("Notificação marcada como lida.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-appBgLight">
        <p className="text-gray-600">Carregando notificações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700 ml-4">Notificações</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-gray-600 text-center mb-4">
          Aqui você verá suas notificações importantes.
        </p>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id} className={cn("w-full shadow-md", !notification.is_read && "border-l-4 border-appBluePrimary")}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  {!notification.is_read ? (
                    <CircleDot className="h-5 w-5 text-appBluePrimary mr-2" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-gray-400 mr-2" />
                  )}
                  <CardTitle className={cn("text-lg", notification.is_read ? "text-gray-600" : "text-gray-800 font-semibold")}>
                    {notification.is_read ? "Notificação Lida" : "Nova Notificação"}
                  </CardTitle>
                </div>
                <span className="text-xs text-gray-500">
                  {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </span>
              </CardHeader>
              <CardContent className="pt-2">
                <p className={cn("text-gray-700", notification.is_read && "text-gray-500")}>
                  {notification.message}
                </p>
                {!notification.is_read && (
                  <Button
                    variant="link"
                    className="p-0 h-auto text-appBluePrimary hover:text-appAccent mt-2"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    Marcar como lida
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Nenhuma Notificação</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Você não tem novas notificações no momento.</p>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNavBar />
    </div>
  );
};

export default NotificationsPage;
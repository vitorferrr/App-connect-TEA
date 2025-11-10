"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BellOff, CheckCircle2 } from "lucide-react";
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

  const markAllAsRead = async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Erro ao carregar usuário. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false); // Only update unread ones

    if (error) {
      toast.error("Erro ao marcar notificações como lidas: " + error.message);
    } else {
      toast.success("Todas as notificações foram marcadas como lidas.");
      fetchNotifications(); // Re-fetch to update UI
    }
    setLoading(false);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;

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
          <>
            {unreadNotificationsCount > 0 && (
              <Button
                onClick={markAllAsRead}
                className="w-full bg-appPuzzleGreen hover:bg-green-600 text-white flex items-center justify-center gap-2 mb-4"
                disabled={loading}
              >
                <CheckCircle2 className="h-5 w-5" /> Marcar todas como lidas
              </Button>
            )}
            {notifications.map((notification) => (
              <Card key={notification.id} className={cn("w-full shadow-md", !notification.is_read && "border-l-4 border-appPuzzleYellow")}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className={cn("text-lg", notification.is_read ? "text-gray-700" : "text-appBluePrimary font-semibold")}>
                    {notification.is_read ? "Notificação" : "Nova Notificação"}
                  </CardTitle>
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className={cn("text-gray-700", !notification.is_read && "font-medium")}>
                    {notification.message}
                  </p>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Nenhuma Notificação</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center py-6">
              <BellOff className="h-12 w-12 text-gray-400 mb-4" />
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
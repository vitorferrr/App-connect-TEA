"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CalendarDays, Newspaper, Bell } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import AppHeader from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const HomePage = () => {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        // User not logged in, or error fetching user, no notifications to show
        setUnreadNotificationsCount(0);
        return;
      }

      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error("Erro ao carregar contagem de notificações não lidas:", error.message);
        setUnreadNotificationsCount(0);
      } else {
        setUnreadNotificationsCount(count || 0);
      }
    };

    fetchUnreadNotifications();

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, payload => {
        // Re-fetch notifications on any change (insert, update, delete)
        fetchUnreadNotifications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
          className="h-14 w-14 rounded-full bg-appPuzzleYellow hover:bg-appPuzzleRed text-white shadow-xl transition-all hover:scale-110 relative"
        >
          <Bell className="h-7 w-7" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadNotificationsCount}
            </span>
          )}
        </Button>
      </Link>

      <BottomNavBar />
    </div>
  );
};

export default HomePage;
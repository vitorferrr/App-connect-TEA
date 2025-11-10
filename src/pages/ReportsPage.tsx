"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
from "@/components/ui/select";
import { parse, subMonths, isAfter, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddReportDialog from "@/components/AddReportDialog"; // Importar o novo componente

interface Report {
  id: string;
  title: string;
  date: string; // Stored as string, parsed to Date for filtering
  content: string;
  report_type: string; // New field
}

// Helper function to parse Brazilian date format
const parseBrazilianDate = (dateString: string): Date | null => {
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date(), { locale: ptBR }); // Assuming YYYY-MM-DD from Supabase
  return isValid(parsedDate) ? parsedDate : null;
};

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("recent"); // Default filter for date
  const [selectedReportType, setSelectedReportType] = useState("all"); // Default filter for type
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      toast.error("Erro ao carregar usuário. Por favor, faça login novamente.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false }); // Order by date descending by default

    if (error) {
      toast.error("Erro ao carregar relatórios: " + error.message);
    } else {
      setReports(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const reportsWithParsedDates = useMemo(() => {
    return reports.map(report => ({
      ...report,
      parsedDate: parseBrazilianDate(report.date),
    }));
  }, [reports]);

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reportsWithParsedDates;
    const now = new Date();

    // Filter by date range
    if (selectedFilter === "3months") {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = filtered.filter(report => report.parsedDate && isAfter(report.parsedDate, threeMonthsAgo));
    } else if (selectedFilter === "6months") {
      const sixMonthsAgo = subMonths(now, 6);
      filtered = filtered.filter(report => report.parsedDate && isAfter(report.parsedDate, sixMonthsAgo));
    }
    // "all" and "recent" don't need initial filtering based on date range

    // Filter by report type
    if (selectedReportType !== "all") {
      filtered = filtered.filter(report => report.report_type === selectedReportType);
    }

    // Always sort from most recent to oldest
    return filtered.sort((a, b) => {
      if (!a.parsedDate || !b.parsedDate) return 0; // Handle cases where date parsing failed
      return b.parsedDate.getTime() - a.parsedDate.getTime();
    });
  }, [selectedFilter, selectedReportType, reportsWithParsedDates]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-appBgLight">
        <p className="text-gray-600">Carregando relatórios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-32">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon" className="text-appBluePrimary hover:bg-appBlueSecondary/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-appBluePrimary ml-4">Relatórios de Hugo</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-appAccent/80 text-center mb-4">
          Acompanhe o desenvolvimento de Hugo na escola.
        </p>

        <div className="w-full flex justify-between gap-2 mb-4">
          <Select onValueChange={setSelectedFilter} defaultValue={selectedFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mais recente</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="all">Todos</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedReportType} defaultValue={selectedReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Observação Diária">Observação Diária</SelectItem>
              <SelectItem value="Médico">Médico</SelectItem>
              <SelectItem value="Social/Cognitivo">Social/Cognitivo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="w-full shadow-lg border-2 border-appBlueSecondary/20">
          <CardHeader className="bg-gradient-to-r from-appBluePrimary to-appBlueSecondary text-white rounded-t-lg">
            <CardTitle className="text-xl">Relatórios</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedReports.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredAndSortedReports.map((report) => (
                  <AccordionItem key={report.id} value={report.id}>
                    <AccordionTrigger className="text-left text-base font-medium text-gray-800 hover:no-underline">
                      <div className="flex flex-col items-start">
                        <span>{report.title}</span>
                        <span className="text-sm text-gray-500 font-normal">
                          {format(parseBrazilianDate(report.date) || new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })} - {report.report_type}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 text-sm p-2 border-t mt-2 pt-2">
                      {report.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-gray-500">Nenhum relatório encontrado para o período ou tipo selecionado.</p>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Floating Add Report Button */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs">
        <Button
          onClick={() => setIsAddReportDialogOpen(true)}
          className="w-full h-14 bg-appPuzzleGreen hover:bg-green-600 text-white text-lg flex items-center justify-center rounded-full shadow-xl gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="h-6 w-6" />
          Adicionar Relatório
        </Button>
      </div>

      <AddReportDialog
        isOpen={isAddReportDialogOpen}
        onOpenChange={setIsAddReportDialogOpen}
        onReportAdded={fetchReports}
      />

      <BottomNavBar />
    </div>
  );
};

export default ReportsPage;
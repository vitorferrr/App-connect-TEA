"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PlusCircle, Download } from "lucide-react"; // Importar o ícone Download
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
import { parse, subMonths, isAfter, isValid, format } from "date-fns"; // Import format
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddReportDialog from "@/components/AddReportDialog";

interface Report {
  id: string;
  title: string;
  date: string; // Stored as string, parsed to Date for filtering
  content: string;
  report_type: string;
}

// Helper function to parse Brazilian date format, made more robust
const parseBrazilianDate = (dateString: string | null | undefined): Date | null => {
  if (typeof dateString !== 'string' || !dateString.trim()) {
    return null;
  }
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date(), { locale: ptBR });
  return isValid(parsedDate) ? parsedDate : null;
};

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [childName, setChildName] = useState("da Criança"); // State to hold child's name

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("Erro ao carregar usuário. Por favor, faça login novamente.");
        setLoading(false);
        return;
      }

      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (reportsError) {
        toast.error("Erro ao carregar relatórios: " + reportsError.message);
        setReports([]);
      } else {
        setReports(reportsData || []);
      }

      // Fetch child's name from profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("child_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar nome da criança:", profileError.message);
        setChildName("da Criança"); // Fallback
      } else if (profileData?.child_name) {
        setChildName(profileData.child_name);
      } else {
        setChildName("da Criança"); // Fallback if child_name is null
      }

    } catch (error: any) {
      toast.error("Ocorreu um erro inesperado ao carregar dados: " + error.message);
      setReports([]);
      setChildName("da Criança");
    } finally {
      setLoading(false);
    }
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

    // Filter by report type
    if (selectedReportType !== "all") {
      filtered = filtered.filter(report => report.report_type === selectedReportType);
    }

    // Always sort from most recent to oldest
    return filtered.sort((a, b) => {
      if (!a.parsedDate || !b.parsedDate) return 0;
      return b.parsedDate.getTime() - a.parsedDate.getTime();
    });
  }, [selectedFilter, selectedReportType, reportsWithParsedDates]);

  const handleDownloadReport = (report: Report) => {
    const formattedDate = report.parsedDate ? format(report.parsedDate, "dd-MM-yyyy", { locale: ptBR }) : "DataDesconhecida";
    const fileName = `Relatorio_${report.title.replace(/\s/g, '_')}_${formattedDate}.txt`;
    const fileContent = `
Relatório: ${report.title}
Tipo: ${report.report_type}
Data: ${report.parsedDate ? format(report.parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Data Desconhecida"}

Conteúdo:
${report.content}
    `.trim();

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Relatório baixado com sucesso!");
  };

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
        <h1 className="text-2xl font-bold text-appBluePrimary ml-4">Relatórios de {childName}</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-appAccent/80 text-center mb-4">
          Acompanhe o desenvolvimento de {childName} na escola.
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
                    <AccordionTrigger className="text-left text-base font-medium text-gray-800 hover:no-underline flex justify-between items-center">
                      <div className="flex flex-col items-start flex-grow">
                        <span>{report.title || "Sem Título"}</span>
                        <span className="text-sm text-gray-500 font-normal">
                          {report.parsedDate ? format(report.parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Data Desconhecida"} - {report.report_type || "Tipo Desconhecido"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion from toggling
                          handleDownloadReport(report);
                        }}
                        className="text-appPuzzleYellow hover:bg-appPuzzleYellow/20 ml-2"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 text-sm p-2 border-t mt-2 pt-2">
                      {report.content || "Sem conteúdo."}
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
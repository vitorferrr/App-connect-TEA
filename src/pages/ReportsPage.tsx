"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  PlusCircle,
  Download,
  FileTextIcon,
  ImageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
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
} from "@/components/ui/select";
import { parse, subMonths, isAfter, isValid, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddReportDialog from "@/components/AddReportDialog";
import { jsPDF } from "jspdf";
import {
  cn,
  getRandomAppRandomBgColorClass,
  getRandomAppRandomBorderColorClass,
} from "@/lib/utils"; // Importar funções de cor aleatória

interface Report {
  id: string;
  title: string;
  date: string;
  content: string;
  report_type: string;
  attachments: string[] | null;
}

type ReportWithParsed = Report & { parsedDate?: Date | null };

// Helper function to parse Brazilian date format, made more robust
const parseBrazilianDate = (
  dateString: string | null | undefined
): Date | null => {
  if (typeof dateString !== "string" || !dateString.trim()) {
    return null;
  }
  const parsedDate = parse(dateString, "yyyy-MM-dd", new Date(), {
    locale: ptBR,
  });
  return isValid(parsedDate) ? parsedDate : null;
};

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("recent");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [isAddReportDialogOpen, setIsAddReportDialogOpen] = useState(false);
  const [childName, setChildName] = useState("da Criança");

  // estado para edição no popup
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [reportBeingEdited, setReportBeingEdited] = useState<Report | null>(
    null
  );

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error(
          "Erro ao carregar usuário. Por favor, faça login novamente."
        );
        setLoading(false);
        return;
      }

      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*, attachments")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (reportsError) {
        toast.error("Erro ao carregar relatórios: " + reportsError.message);
        setReports([]);
      } else {
        setReports(reportsData || []);
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("child_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(
          "Erro ao carregar nome da criança:",
          profileError.message
        );
        setChildName("da Criança");
      } else if (profileData?.child_name) {
        setChildName(profileData.child_name);
      } else {
        setChildName("da Criança");
      }
    } catch (error: any) {
      toast.error(
        "Ocorreu um erro inesperado ao carregar dados: " + error.message
      );
      setReports([]);
      setChildName("da Criança");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const reportsWithParsedDates = useMemo<ReportWithParsed[]>(() => {
    return reports.map((report) => ({
      ...report,
      parsedDate: parseBrazilianDate(report.date),
    }));
  }, [reports]);

  const filteredAndSortedReports = useMemo<ReportWithParsed[]>(() => {
    let filtered = reportsWithParsedDates;
    const now = new Date();

    if (selectedFilter === "3months") {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = filtered.filter(
        (report) =>
          report.parsedDate && isAfter(report.parsedDate, threeMonthsAgo)
      );
    } else if (selectedFilter === "6months") {
      const sixMonthsAgo = subMonths(now, 6);
      filtered = filtered.filter(
        (report) =>
          report.parsedDate && isAfter(report.parsedDate, sixMonthsAgo)
      );
    }

    if (selectedReportType !== "all") {
      filtered = filtered.filter(
        (report) => report.report_type === selectedReportType
      );
    }

    return filtered.sort((a, b) => {
      if (!a.parsedDate || !b.parsedDate) return 0;
      return b.parsedDate.getTime() - a.parsedDate.getTime();
    });
  }, [selectedFilter, selectedReportType, reportsWithParsedDates]);

const handleDownloadAttachment = async (attachmentUrl: string) => {
  try {
    const response = await fetch(attachmentUrl);
    if (!response.ok) {
      throw new Error(
        "Falha ao baixar o arquivo (HTTP " + response.status + ")"
      );
    }

    const blob = await response.blob();
    const filename = getAttachmentDisplayName(attachmentUrl) || "anexo";

    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err: any) {
    console.error(err);
    toast.error(
      "Erro ao baixar anexo: " + (err?.message || "erro desconhecido")
    );
  }
};

    // ---- DOWNLOAD PDF (já funcional) ----
  const handleDownloadReport = (report: Report) => {
    const doc = new jsPDF();

    // Usa a mesma função de parse já usada na página
    const parsedDate = parseBrazilianDate(report.date);
    const formattedDate = parsedDate
      ? format(parsedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
      : "Data desconhecida";

    const safeTitle = report.title || "Sem título";

    const fileName = `Relatorio_${safeTitle.replace(/\s/g, "_")}_${format(
      new Date(),
      "yyyyMMdd_HHmmss"
    )}.pdf`;

    // Título
    doc.setFontSize(18);
    doc.text(`Relatório: ${safeTitle}`, 14, 20);

    // Metadados
    doc.setFontSize(12);
    doc.text(`Tipo: ${report.report_type || "Não informado"}`, 14, 30);
    doc.text(`Data: ${formattedDate}`, 14, 36);

    // Conteúdo
    doc.setFontSize(14);
    doc.text("Conteúdo:", 14, 48);
    doc.setFontSize(12);

    const contentText = report.content || "Sem conteúdo.";
    const contentLines = doc.splitTextToSize(contentText, 180);
    let y = 56;
    doc.text(contentLines, 14, y);

    doc.save(fileName);
    toast.success("Relatório baixado como PDF!");
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileTextIcon className="h-4 w-4 text-gray-500" />;
  };

  const getAttachmentDisplayName = (ref: string) => {
  // Pega só o último pedaço do caminho
  const lastSegment = ref.split("/").pop() || ref;

  // Se tiver um "-", assume padrão "timestamp-nome.ext"
  const dashIndex = lastSegment.indexOf("-");
  if (dashIndex !== -1) {
    return lastSegment.slice(dashIndex + 1); // tudo depois do primeiro "-"
  }

  // Caso não tenha "-", devolve como está
  return lastSegment;
};


  // ---- DELETE ----
  const handleDeleteReport = async (reportId: string) => {
  const confirmed = window.confirm(
    "Tem certeza que deseja deletar este relatório e seus anexos? Essa ação não pode ser desfeita."
  );
  if (!confirmed) return;

  // pega o relatório atual na lista para ver os anexos
  const report = reports.find((r) => r.id === reportId);

  // 1) se tiver anexos, tenta apagar do Storage
  if (report?.attachments && report.attachments.length > 0) {
    // converte URL pública em caminho de arquivo dentro do bucket
    const filePaths = report.attachments
      .map((url) => {
        try {
          const u = new URL(url);
          // pathname: /storage/v1/object/public/report_attachments/<filePath>
          const prefix = "/storage/v1/object/public/report_attachments/";
          if (u.pathname.startsWith(prefix)) {
            return u.pathname.slice(prefix.length);
          }
          // fallback: tenta achar /report_attachments/ em qualquer lugar
          const idx = u.pathname.indexOf("/report_attachments/");
          if (idx !== -1) {
            return u.pathname.slice(idx + "/report_attachments/".length);
          }
          return null;
        } catch {
          return null;
        }
      })
      .filter((p): p is string => !!p);

    console.log("Caminhos para deletar no storage:", filePaths);

    if (filePaths.length > 0) {
      const { data, error: storageError } = await supabase.storage
        .from("report_attachments")
        .remove(filePaths);

      console.log("Resultado do remove no storage:", data, storageError);

      if (storageError) {
        console.error(storageError);
        toast.error(
          "Erro ao excluir arquivos do relatório: " + storageError.message
        );
        // se quiser, pode dar return aqui pra não deletar o relatório sem apagar arquivos
        // return;
      }
    }
  }

  // 2) apagar o registro do relatório na tabela
  const { error } = await supabase.from("reports").delete().eq("id", reportId);

  if (error) {
    toast.error("Erro ao deletar relatório: " + error.message);
    return;
  }

  // 3) atualizar estado local
  setReports((prev) => prev.filter((r) => r.id !== reportId));
  toast.success("Relatório e anexos deletados com sucesso.");
};

  // ---- EDIT (abre o mesmo popup de adicionar) ----
  const openCreateDialog = () => {
    setDialogMode("create");
    setReportBeingEdited(null);
    setIsAddReportDialogOpen(true);
  };

  const openEditDialog = (report: ReportWithParsed) => {
    // tiramos parsedDate e guardamos só os campos do banco
    const { id, title, content, date, report_type, attachments } = report;
    setReportBeingEdited({
      id,
      title,
      content,
      date,
      report_type,
      attachments,
    });
    setDialogMode("edit");
    setIsAddReportDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsAddReportDialogOpen(open);
    if (!open) {
      // limpa estado ao fechar
      setDialogMode("create");
      setReportBeingEdited(null);
    }
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
          <Button
            variant="ghost"
            size="icon"
            className="text-appBluePrimary hover:bg-appBlueSecondary/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-appBluePrimary ml-4">
          Relatórios de {childName}
        </h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-appAccent/80 text-center mb-4">
          Acompanhe o desenvolvimento de {childName} na escola.
        </p>

        <div className="w-full flex justify-between gap-2 mb-4">
          <Select
            onValueChange={setSelectedFilter}
            defaultValue={selectedFilter}
          >
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

          <Select
            onValueChange={setSelectedReportType}
            defaultValue={selectedReportType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="Observação Diária">
                Observação Diária
              </SelectItem>
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
                {filteredAndSortedReports.map((report) => {
                  const headerBgClass = getRandomAppRandomBgColorClass();
                  const itemBorderClass = getRandomAppRandomBorderColorClass();
                  return (
                    <AccordionItem
                      key={report.id}
                      value={report.id}
                      className={cn(
                        "mt-2 rounded-lg overflow-hidden",
                        itemBorderClass
                      )}
                    >
                      <AccordionTrigger
                        className={cn(
                          "text-left text-base font-medium text-white hover:no-underline flex justify-between items-center p-4",
                          headerBgClass
                        )}
                      >
                        <div className="flex flex-col items-start flex-grow">
                          <span>{report.title || "Sem Título"}</span>
                          <span className="text-sm text-blue-100 font-normal">
                            {report.parsedDate
                              ? format(
                                  report.parsedDate,
                                  "dd 'de' MMMM 'de' yyyy",
                                  { locale: ptBR }
                                )
                              : "Data Desconhecida"}{" "}
                            - {report.report_type || "Tipo Desconhecido"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          {/* Download PDF */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(report);
                            }}
                            className="text-white hover:bg-white/20"
                          >
                            <Download className="h-5 w-5" />
                          </Button>

                          {/* Editar (abre o mesmo popup) */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDialog(report);
                            }}
                            className="text-white hover:bg-white/20"
                          >
                            <Pencil className="h-5 w-5" />
                          </Button>

                          {/* Deletar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteReport(report.id);
                            }}
                            className="text-white hover:bg-red-500/30"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-sm p-4 border-t bg-white">
                        {report.content || "Sem conteúdo."}
                        {report.attachments &&
                          report.attachments.length > 0 && (
                            <div className="mt-4">
                              <p className="font-semibold text-gray-800 mb-2">
                                Anexos:
                              </p>
                              <div className="space-y-2">
                                {report.attachments.map(
                                  (attachmentUrl: string, index: number) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDownloadAttachment(attachmentUrl);
                                      }}
                                      className="flex items-center gap-2 text-blue-600 hover:underline text-sm text-left w-full"
                                    >
                                      {getFileIcon(attachmentUrl)}
                                      {getAttachmentDisplayName(attachmentUrl)}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            ) : (
              <p className="text-center text-gray-500 p-4">
                Nenhum relatório encontrado para o período ou tipo selecionado.
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-xs">
        <Button
          onClick={openCreateDialog}
          className="w-full h-14 bg-appPuzzleGreen hover:bg-green-600 text-white text-lg flex items-center justify-center rounded-full shadow-xl gap-2 transition-all hover:scale-105"
        >
          <PlusCircle className="h-6 w-6" />
          Adicionar Relatório
        </Button>
      </div>

      <AddReportDialog
        isOpen={isAddReportDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onReportAdded={fetchReports}
        mode={dialogMode}
        initialReport={reportBeingEdited}
      />

      <BottomNavBar />
    </div>
  );
};

export default ReportsPage;
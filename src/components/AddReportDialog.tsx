"use client";

import { parse, isValid } from "date-fns";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  XCircle,
  FileTextIcon,
  ImageIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SimpleReport {
  id: string;
  title: string;
  date: string; // yyyy-MM-dd
  content: string;
  report_type: string;
  attachments: string[] | null;
}

interface AddReportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onReportAdded: () => void;
  mode?: "create" | "edit"; // NOVO: modo do diálogo
  initialReport?: SimpleReport | null; // NOVO: relatório sendo editado
}

const reportTypes = [
  { value: "Observação Diária", label: "Observação Diária" },
  { value: "Médico", label: "Médico" },
  { value: "Social/Cognitivo", label: "Social/Cognitivo" },
];

const AddReportDialog = ({
  isOpen,
  onOpenChange,
  onReportAdded,
  mode = "create",
  initialReport,
}: AddReportDialogProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState<string | undefined>(undefined);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setDate(new Date());
    setReportType(undefined);
    setSelectedFiles([]);
  };

  // Quando abrir em modo edição, preencher com os dados do relatório
  // Quando abrir em modo criação, limpar o formulário
  useEffect(() => {
    if (mode === "edit" && initialReport) {
      setTitle(initialReport.title || "");
      setContent(initialReport.content || "");
      setReportType(initialReport.report_type || undefined);

      // initialReport.date vem como "yyyy-MM-dd" do Supabase
      if (initialReport.date) {
        const parsed = parse(initialReport.date, "yyyy-MM-dd", new Date());
        setDate(isValid(parsed) ? parsed : new Date());
      } else {
        setDate(new Date());
      }

      setSelectedFiles([]); // não pré-carregamos arquivos antigos
    } else if (mode === "create" && isOpen) {
      resetForm();
    }
  }, [mode, initialReport, isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />;
    }
    return <FileTextIcon className="h-4 w-4 text-gray-500" />;
  };

  const handleSaveReport = async () => {
    if (!title.trim() || !content.trim() || !date || !reportType) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        toast.error(
          "Usuário não autenticado. Por favor, faça login novamente."
        );
        setLoading(false);
        return;
      }

      // Upload de arquivos (se existirem)
      let newAttachmentUrls: string[] = [];
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const filePath = `${user.id}/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("report_attachments")
            .upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            toast.error(
              `Erro ao fazer upload do arquivo ${file.name}: ${uploadError.message}`
            );
            setLoading(false);
            return;
          }

          const { data: publicUrlData } = supabase.storage
            .from("report_attachments")
            .getPublicUrl(filePath);

          if (publicUrlData?.publicUrl) {
            newAttachmentUrls.push(publicUrlData.publicUrl);
          }
        }
      }

      const formattedDate = format(date, "yyyy-MM-dd");

      // ---------- MODO EDIÇÃO ----------
      if (mode === "edit" && initialReport) {
        // Se o usuário anexar novos arquivos, somamos com os antigos.
        const mergedAttachments =
          newAttachmentUrls.length > 0
            ? [...(initialReport.attachments ?? []), ...newAttachmentUrls]
            : null; // se null, não mexemos nas attachments no update

        const updatePayload: any = {
          title: title.trim(),
          content: content.trim(),
          date: formattedDate,
          report_type: reportType,
        };

        // Só atualiza attachments se houve novos arquivos
        if (mergedAttachments !== null) {
          updatePayload.attachments = mergedAttachments;
        }

        const { error: updateError } = await supabase
          .from("reports")
          .update(updatePayload)
          .eq("id", initialReport.id);

        if (updateError) {
          toast.error("Erro ao atualizar relatório: " + updateError.message);
          setLoading(false);
          return;
        }

        toast.success("Relatório atualizado com sucesso!");
      } else {
        // ---------- MODO CRIAÇÃO ----------
        const { error: reportError } = await supabase.from("reports").insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          date: formattedDate,
          report_type: reportType,
          attachments: newAttachmentUrls.length > 0 ? newAttachmentUrls : null,
        });

        if (reportError) {
          toast.error("Erro ao adicionar relatório: " + reportError.message);
          setLoading(false);
          return;
        }

        // Notificação só na criação de novo relatório
        const { error: notificationError } = await supabase
          .from("notifications")
          .insert({
            user_id: user.id,
            message: `Novo relatório "${title.trim()}" adicionado em ${format(
              date,
              "dd/MM/yyyy",
              { locale: ptBR }
            )}.`,
            is_read: false,
          });

        if (notificationError) {
          console.error(
            "Erro ao adicionar notificação:",
            notificationError.message
          );
        }

        toast.success("Relatório adicionado com sucesso!");
      }

      resetForm();
      onOpenChange(false);
      onReportAdded();
    } catch (error: any) {
      toast.error("Ocorreu um erro inesperado: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar Relatório" : "Adicionar Novo Relatório"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize as informações do relatório."
              : "Preencha os detalhes para adicionar um novo relatório."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Conteúdo
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                side="top"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={ptBR}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reportType" className="text-right">
              Tipo
            </Label>
            <Select onValueChange={setReportType} value={reportType} required>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione o tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Anexos */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="attachments" className="text-right pt-2">
              Anexos
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="col-span-3"
              />
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    Arquivos selecionados:
                  </p>
                  {selectedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded-md"
                    >
                      <span className="flex items-center gap-2">
                        {getFileIcon(file.type)}
                        {file.name}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(file.name)}
                        className="h-6 w-6 text-red-500 hover:bg-red-100"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSaveReport} disabled={loading}>
            {loading
              ? mode === "edit"
                ? "Salvando..."
                : "Adicionando..."
              : mode === "edit"
              ? "Salvar alterações"
              : "Adicionar Relatório"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddReportDialog;

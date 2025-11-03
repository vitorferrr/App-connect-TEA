"use client";

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { parse, subMonths, isAfter, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Report {
  id: string;
  title: string;
  date: string;
  content: string;
}

const rawReportsData: Report[] = [
  {
    id: "report-1",
    title: "Relatório de Interação Social - Semana 1",
    date: "15 de Outubro de 2024",
    content:
      "Hugo demonstrou dificuldade em iniciar conversas com colegas durante o recreio. Observou-se que ele prefere brincadeiras individuais e, quando abordado, responde com frases curtas e evita contato visual prolongado. Sugere-se atividades em grupo estruturadas para incentivar a participação.",
  },
  {
    id: "report-2",
    title: "Relatório de Progresso em Comunicação - Semana 2",
    date: "22 de Outubro de 2024",
    content:
      "Após a implementação de atividades em duplas, Hugo conseguiu manter um breve diálogo sobre um tópico de interesse (dinossauros) com um colega. Ainda há desafios na manutenção da conversa e na compreensão de nuances sociais, mas houve um pequeno avanço na iniciativa de responder.",
  },
  {
    id: "report-3",
    title: "Relatório de Observação em Grupo - Semana 3",
    date: "29 de Outubro de 2024",
    content:
      "Durante uma atividade de contação de histórias em grupo, Hugo participou ativamente respondendo a perguntas diretas. No entanto, teve dificuldade em se inserir na discussão livre entre os colegas, preferindo ouvir. É importante continuar incentivando a expressão espontânea.",
  },
  {
    id: "report-4",
    title: "Relatório de Intervenção Social - Semana 4",
    date: "05 de Novembro de 2024",
    content:
      "Foi introduzido um sistema de 'cartões de conversa' para Hugo, com sugestões de frases para iniciar e manter diálogos. Ele utilizou os cartões em duas ocasiões, resultando em interações mais longas e com menos ansiedade. Os resultados são promissores para o desenvolvimento de suas habilidades sociais.",
  },
  {
    id: "report-5",
    title: "Relatório de Interação Social - Setembro",
    date: "10 de Setembro de 2024",
    content: "Relatório mais antigo sobre interações sociais de Hugo.",
  },
  {
    id: "report-6",
    title: "Relatório de Progresso - Agosto",
    date: "20 de Agosto de 2024",
    content: "Relatório de progresso geral de Hugo.",
  },
  {
    id: "report-7",
    title: "Relatório de Terapia Ocupacional - Julho",
    date: "01 de Julho de 2024",
    content: "Sessão de terapia ocupacional focada em habilidades motoras finas.",
  },
  {
    id: "report-8",
    title: "Relatório de Fonoaudiologia - Junho",
    date: "15 de Junho de 2024",
    content: "Acompanhamento da evolução da fala e comunicação verbal.",
  },
  {
    id: "report-9",
    title: "Relatório Comportamental - Maio",
    date: "28 de Maio de 2024",
    content: "Observações sobre padrões comportamentais em diferentes ambientes.",
  },
  {
    id: "report-10",
    title: "Relatório de Desenvolvimento Cognitivo - Abril",
    date: "05 de Abril de 2024",
    content: "Avaliação do desenvolvimento cognitivo e resolução de problemas.",
  },
  {
    id: "report-11",
    title: "Relatório de Interação Social - Março",
    date: "12 de Março de 2024",
    content: "Novas estratégias para promover a interação social em grupo.",
  },
  {
    id: "report-12",
    title: "Relatório Anual - Dezembro",
    date: "10 de Dezembro de 2023",
    content: "Relatório consolidado do ano de 2023, destacando os principais avanços.",
  },
];

// Helper function to parse Brazilian date format
const parseBrazilianDate = (dateString: string): Date | null => {
  const parsedDate = parse(dateString, "dd 'de' MMMM 'de' yyyy", new Date(), { locale: ptBR });
  return isValid(parsedDate) ? parsedDate : null;
};

const ReportsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState("recent"); // Default filter

  const reportsWithParsedDates = useMemo(() => {
    return rawReportsData.map(report => ({
      ...report,
      parsedDate: parseBrazilianDate(report.date),
    }));
  }, []);

  const filteredAndSortedReports = useMemo(() => {
    let filtered = reportsWithParsedDates;
    const now = new Date();

    if (selectedFilter === "3months") {
      const threeMonthsAgo = subMonths(now, 3);
      filtered = filtered.filter(report => report.parsedDate && isAfter(report.parsedDate, threeMonthsAgo));
    } else if (selectedFilter === "6months") {
      const sixMonthsAgo = subMonths(now, 6);
      filtered = filtered.filter(report => report.parsedDate && isAfter(report.parsedDate, sixMonthsAgo));
    }
    // "all" and "recent" don't need initial filtering based on date range

    // Always sort from most recent to oldest
    return filtered.sort((a, b) => {
      if (!a.parsedDate || !b.parsedDate) return 0; // Handle cases where date parsing failed
      return b.parsedDate.getTime() - a.parsedDate.getTime();
    });
  }, [selectedFilter, reportsWithParsedDates]);

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6 text-blue-700" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-blue-700 ml-4">Relatórios de Hugo</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-gray-600 text-center mb-4">
          Acompanhe o desenvolvimento de Hugo na escola.
        </p>

        <div className="w-full flex justify-end mb-4">
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
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAndSortedReports.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredAndSortedReports.map((report) => (
                  <AccordionItem key={report.id} value={report.id}>
                    <AccordionTrigger className="text-left text-base font-medium text-gray-800 hover:no-underline">
                      <div className="flex flex-col items-start">
                        <span>{report.title}</span>
                        <span className="text-sm text-gray-500 font-normal">{report.date}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 text-sm p-2 border-t mt-2 pt-2">
                      {report.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-center text-gray-500">Nenhum relatório encontrado para o período selecionado.</p>
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default ReportsPage;
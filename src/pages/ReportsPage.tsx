"use client";

import React from "react";
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

const reportsData = [
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
];

const ReportsPage = () => {
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

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {reportsData.map((report) => (
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
          </CardContent>
        </Card>
      </main>

      <BottomNavBar />
    </div>
  );
};

export default ReportsPage;
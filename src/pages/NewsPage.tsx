"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, getRandomAppRandomBgColorClass, getRandomAppRandomBorderColorClass } from "@/lib/utils"; // Importar funções de cor aleatória

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  date: string;
}

const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "Novas Descobertas sobre o Espectro Autista",
    summary: "Pesquisadores identificam novos marcadores genéticos que podem influenciar o desenvolvimento do autismo, abrindo portas para terapias mais personalizadas.",
    fullContent: "Uma equipe internacional de cientistas publicou um estudo inovador na revista 'Nature Neuroscience', revelando a descoberta de vários novos marcadores genéticos associados ao Transtorno do Espectro Autista (TEA). Essas descobertas podem levar a uma compreensão mais profunda das causas do autismo e, eventualmente, a abordagens terapêuticas mais direcionadas e eficazes. O estudo analisou dados genéticos de milhares de indivíduos, identificando padrões que antes não eram reconhecidos. Os pesquisadores esperam que este trabalho acelere o desenvolvimento de intervenções precoces e personalizadas para pessoas com TEA.",
    date: "10 de Novembro de 2024",
  },
  {
    id: "news-2",
    title: "A Importância da Inclusão Escolar para Crianças com TEA",
    summary: "Especialistas destacam os benefícios da inclusão de crianças autistas em ambientes escolares regulares, com o suporte adequado.",
    fullContent: "A inclusão escolar de crianças com Transtorno do Espectro Autista (TEA) é um tema de crescente importância. Em um recente seminário sobre educação inclusiva, diversos especialistas enfatizaram os múltiplos benefícios que a integração em escolas regulares, com o devido suporte pedagógico e adaptativo, pode trazer para o desenvolvimento social e acadêmico de alunos autistas. A interação com colegas neurotípicos, a exposição a diferentes métodos de ensino e a promoção da autonomia são fatores cruciais. No entanto, ressaltou-se a necessidade de formação contínua para educadores e a disponibilidade de recursos especializados para garantir uma inclusão verdadeiramente eficaz e acolhedora.",
    date: "05 de Novembro de 2024",
  },
  {
    id: "news-3",
    title: "Tecnologia Assistiva: Aliada no Desenvolvimento de Pessoas com Autismo",
    summary: "Aplicativos e dispositivos inovadores estão transformando a comunicação e o aprendizado para indivíduos no espectro autista.",
    fullContent: "A tecnologia assistiva tem se mostrado uma ferramenta poderosa para auxiliar pessoas com Transtorno do Espectro Autista (TEA) em diversas áreas. Desde aplicativos de comunicação alternativa e aumentativa (CAA) que permitem a expressão de pensamentos e necessidades, até dispositivos vestíveis que ajudam na regulação sensorial, as inovações tecnológicas estão abrindo novas portas. Especialistas em tecnologia e terapeutas ocupacionais discutiram em um congresso recente como essas ferramentas podem ser personalizadas para atender às necessidades individuais, promovendo maior independência, engajamento social e oportunidades de aprendizado para crianças e adultos com autismo.",
    date: "28 de Outubro de 2024",
  },
  {
    id: "news-4",
    title: "Desafios e Vitórias na Transição para a Vida Adulta com Autismo",
    summary: "A transição para a vida adulta apresenta desafios únicos para pessoas com autismo, mas também muitas histórias de sucesso e superação.",
    fullContent: "A passagem da adolescência para a vida adulta é um período complexo para todos, mas para indivíduos no espectro autista, pode apresentar desafios adicionais significativos. Questões como emprego, moradia independente, relacionamentos e acesso a serviços de saúde e apoio social são cruciais. No entanto, há inúmeras histórias inspiradoras de pessoas com autismo que, com o suporte adequado de suas famílias, comunidades e programas especializados, alcançaram grande sucesso em suas carreiras, construíram vidas independentes e contribuíram significativamente para a sociedade. A conscientização e a criação de mais oportunidades são fundamentais para apoiar essa transição.",
    date: "20 de Outubro de 2024",
  },
];

const NewsPage = () => {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-appBgLight p-4 pb-20">
      <header className="py-4 flex items-center">
        <Link to="/home">
          <Button variant="ghost" size="icon" className="text-appBluePrimary hover:bg-appBlueSecondary/20">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-appBluePrimary ml-4">Notícias TEA</h1>
      </header>

      <main className="flex-grow flex flex-col items-center w-full max-w-md mx-auto space-y-4">
        <p className="text-lg text-appAccent/80 text-center mb-4">
          Mantenha-se atualizado com as últimas notícias e informações sobre o autismo.
        </p>

        {newsArticles.map((article) => {
          const headerBgClass = getRandomAppRandomBgColorClass();
          const cardBorderClass = getRandomAppRandomBorderColorClass();

          return (
            <Card key={article.id} className={cn("w-full shadow-lg border-2 transition-all hover:scale-[1.02]", cardBorderClass)}>
              <CardHeader className={cn("text-white rounded-t-lg", headerBgClass)}>
                <CardTitle className="text-xl">{article.title}</CardTitle>
                <CardDescription className="text-sm text-blue-100">{article.date}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-700 mb-4">{article.summary}</p>
                <Button onClick={() => handleReadMore(article)} className="w-full bg-appBluePrimary hover:bg-appAccent text-white transition-all hover:scale-105">
                  Leia Mais
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </main>

      <BottomNavBar />

      {selectedArticle && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedArticle.title}</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {selectedArticle.date}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 text-gray-700 text-base">
              {selectedArticle.fullContent}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default NewsPage;
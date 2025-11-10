import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Função para obter uma classe de cor de fundo aleatória da nova paleta
export function getRandomAppRandomBgColorClass() {
  const colors = [
    "bg-appRandom-red",
    "bg-appRandom-dark-blue",
    "bg-appRandom-light-blue",
    "bg-appRandom-green",
    "bg-appRandom-yellow",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

// Função para obter uma classe de cor de borda aleatória da nova paleta
export function getRandomAppRandomBorderColorClass() {
  const colors = [
    "border-appRandom-red/30",
    "border-appRandom-dark-blue/30",
    "border-appRandom-light-blue/30",
    "border-appRandom-green/30",
    "border-appRandom-yellow/30",
  ];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
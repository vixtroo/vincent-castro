import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function scrollToSection(sectionId: string){
  const section = document.getElementById(sectionId);
  if(section){
    section.scrollIntoView();
  }
}

"use client";
import CTA from "@/components/ui/CTA";
import Header from "@/components/ui/header";
import Hero from "@/components/ui/hero";
import Features from "@/components/ui/features";
import Footer from "@/components/ui/footer";
import { useThemeStore } from "@/app/store/themeStore";  
import "@/app/globals.css";  

export default function Home() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();  

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark" : ""} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}

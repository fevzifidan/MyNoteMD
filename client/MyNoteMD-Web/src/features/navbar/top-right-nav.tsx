import LanguageSelector from "@/components/custom/LanguageSelector/LanguageSelector";
import { ThemeToggle } from "@/components/custom/ThemeToggle/ThemeToggle";
import { UserNav } from "./user-nav";

export const TopNav = () => {
  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Dil Seçici */}
      <LanguageSelector />
      
      {/* Tema (Dark/Light) Toggle */}
      <ThemeToggle />
      
      {/* Profil Dropdown */}
      <UserNav />
    </div>
  );
};
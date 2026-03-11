"use client";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { TopNav } from "@/features/navbar/top-right-nav";
import { GlobalSearch } from "@/features/search/components/global-search";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL'den mevcut arama terimini al
  const currentSearchTerm = searchParams.get("q") || "";

  // Dinamik Başlık ve Tip Belirleme
  const getHeaderInfo = () => {
    if (pathname.startsWith("/notes")) return { title: "Notlarım", type: "Notes" as const };
    if (pathname.startsWith("/collections")) return { title: "Koleksiyonlarım", type: "Collections" as const };
    return { title: "My Workspace", type: "Notes" as const };
  };

  const { title, type } = getHeaderInfo();

  // Arama terimi değiştiğinde URL'i güncelle
  const handleSearch = (term: string) => {
    if (term) {
      setSearchParams({ q: term });
    } else {
      searchParams.delete("q");
      setSearchParams(searchParams);
    }
  };

  // Arama tipi değiştiğinde (Notlar/Koleksiyonlar arası geçiş)
  const handleTypeChange = (newType: "Collections" | "Notes") => {
    const targetPath = newType === "Notes" ? "/notes" : "/collections";
    // Tipi değiştirirken mevcut aramayı koruyarak yönlendir
    navigate(`${targetPath}?q=${currentSearchTerm}`);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Sağ Üst Navigasyon */}
      <TopNav />
      
      {/* Sol Sidebar */}
      <Sidebar />

      {/* Ana İçerik Alanı */}
      <main className="transition-all duration-500 md:pl-20"> 
        <div className="container max-w-5xl mx-auto py-12 px-6">
          
          {/* ORTAK DİNAMİK HEADER */}
          <div className="flex flex-col space-y-8 mb-16 pt-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight italic animate-in fade-in slide-in-from-top-4">
              {title}
            </h1>
            
            <GlobalSearch 
              currentType={type}
              onTypeChange={handleTypeChange}
              onSearch={handleSearch}
              defaultValue={currentSearchTerm}
              placeholder={`${title} içinde ara...`}
            />
          </div>

          {/* SAYFA İÇERİĞİ (Gelen Component) */}
          <div className="animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
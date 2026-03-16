"use client";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sidebar } from "@/components/custom/FloatingSidebar/FloatingSidebar";
import { TopNav } from "@/features/navbar/top-right-nav";
import { GlobalSearch } from "@/features/search/components/global-search";
import { useTranslation } from "react-i18next";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation(["common", "dashboard"]);

  // Get search term from URL
  const currentSearchTerm = searchParams.get("q") || "";

  // Get dynamic header info
  const getHeaderInfo = () => {
    if (pathname.startsWith("/notes")) return { title: t("dashboard:myNotes"), type: "Notes" as const };
    if (pathname.startsWith("/collections")) return { title: t("dashboard:myCollections"), type: "Collections" as const };
    return { title: t("dashboard:myWorkspace"), type: "Notes" as const };
  };

  const { title, type } = getHeaderInfo();

  // Update URL when search term changes
  const handleSearch = (term: string) => {
    if (term) {
      setSearchParams({ q: term });
    } else {
      searchParams.delete("q");
      setSearchParams(searchParams);
    }
  };

  // Update URL when type changes
  const handleTypeChange = (newType: "Collections" | "Notes") => {
    const targetPath = newType === "Notes" ? "/notes" : "/collections";
    navigate(`${targetPath}?q=${currentSearchTerm}`);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Right Top Navigation */}
      <TopNav />

      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="transition-all duration-500 md:pl-20">
        <div className="container max-w-5xl mx-auto py-12 px-6">

          {/* Dynamic Header */}
          <div className="flex flex-col space-y-8 mb-16 pt-8 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight italic animate-in fade-in slide-in-from-top-4">
              {title}
            </h1>

            <GlobalSearch
              currentType={type}
              onTypeChange={handleTypeChange}
              onSearch={handleSearch}
              defaultValue={currentSearchTerm}
              placeholder={t("dashboard:searchSomething")}
            />
          </div>

          {/* Page Content (Incoming Component) */}
          <div className="animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
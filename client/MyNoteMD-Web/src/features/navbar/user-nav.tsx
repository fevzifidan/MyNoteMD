"use client";

import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Moon, Sun, Monitor, Languages } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { AVAILABLE_LANGUAGES, getFlagUrl } from "@/components/custom/LanguageSelector/config/languageConfig";

export function UserNav({ showAdditional }: { showAdditional?: boolean }) {
  const { user, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { i18n, t } = useTranslation(["common"]);

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  // Kullanıcı adının ilk harfini fallback için alalım
  const initials = user?.givenName?.substring(0, 1).toUpperCase() + user?.familyName?.substring(0, 1).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border bg-background shadow-sm hover:bg-accent transition-all">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.avatarUrl} alt={user?.givenName} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.givenName + " " + user?.familyName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground italic">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer gap-2">
          <User className="h-4 w-4" />
          <span>{t("common:actions.profile")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer gap-2">
          <Settings className="h-4 w-4" />
          <span>{t("common:actions.settings")}</span>
        </DropdownMenuItem>

        {showAdditional && <>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer gap-2">
              {theme === "light" && <Sun className="h-4 w-4" />}
              {theme === "dark" && <Moon className="h-4 w-4" />}
              {theme === "system" && <Monitor className="h-4 w-4" />}
              <span>{t("common:theme.appearance")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light" className="cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>{t("common:theme.light")}</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>{t("common:theme.dark")}</span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system" className="cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>{t("common:theme.system")}</span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer gap-2">
              <Languages className="h-4 w-4" />
              <span>{t("common:actions.language")}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={i18n.language}
                  onValueChange={(val) => i18n.changeLanguage(val)}
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <DropdownMenuRadioItem key={lang.code} value={lang.code} className="cursor-pointer">
                      <img
                        src={getFlagUrl(lang.countryCode)}
                        alt={lang.alt}
                        className="w-4 h-3 mr-2 object-cover rounded-sm"
                      />
                      <span>{lang.label}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </>}

        <DropdownMenuSeparator />

        {/* Destructive Logout Button */}
        <DropdownMenuItem
          onClick={logout}
          className="cursor-pointer gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("common:actions.logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
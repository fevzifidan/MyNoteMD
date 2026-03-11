"use client";

import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function UserNav() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  // Kullanıcı adının ilk harfini fallback için alalım
  const initials = user?.givenName?.substring(0, 1).toUpperCase() +  user?.familyName?.substring(0, 1).toUpperCase()|| "U";

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
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="cursor-pointer gap-2">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Destructive Logout Button */}
        <DropdownMenuItem 
          onClick={logout}
          className="cursor-pointer gap-2 text-destructive focus:bg-destructive focus:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserNavProps {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UserNav({ children, isOpen, setIsOpen }: UserNavProps) {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const logOut = () => {
    authClient.signOut();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between shadow-md mx-2 md:mx-5 my-2 rounded-lg">
      <h1 className="mx-4 font-bold text-2xl">Logo</h1>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <Menu size="60" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <div className="flex gap-3">
              <Avatar className="w-15 h-15">
                <AvatarFallback>
                  {session?.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="">
                <SheetTitle>{session?.user.name}</SheetTitle>
                <SheetDescription>{session?.user.email}</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="h-full py-4">
            <div className="h-full flex flex-col">
              {children} {/* Render children directly */}
            </div>
          </div>
          <Button className="m-1" onClick={logOut}>
            <LogOut className="mr-2" />
            Cerrar Sesión
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
}

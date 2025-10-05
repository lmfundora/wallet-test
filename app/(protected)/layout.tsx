"use client";
import { UserNav } from "@/components/nav/userNav";
import { Button } from "@/components/ui/button";
import { Home, WalletCards, BadgeCent, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Cuentas", href: "/accounts", icon: WalletCards },
    { name: "Operaciones", href: "/operations", icon: BadgeCent },
  ];
  return (
    <div className="">
      <UserNav isOpen={isOpen} setIsOpen={setIsOpen}>
        {navigation.map((item) => {
          return (
            <Button
              variant="secondary"
              className="my-1 mx-3"
              key={item.name}
              asChild // Use asChild to pass props to the Link component
            >
              <Link
                href={item.href}
                className="flex w-full justify-between"
                onClick={() => setIsOpen(false)}
              >
                <item.icon />
                <div className="flex justify-start w-2/3">{item.name}</div>
              </Link>
            </Button>
          );
        })}
      </UserNav>
      <div className="mx-4 md:mx-12">{children}</div>
    </div>
  );
}

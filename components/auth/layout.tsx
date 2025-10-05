import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AuthLayoutProps {
  title: string;
  description: string;
  isLogin: boolean;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  description,
  isLogin,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8 space-y-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24 rounded-full">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>
          {isLogin ? (
            <p>
              No tengo una cuenta aún. ¿Quieres{" "}
              <Link href="/signup" className="text-sky-600 underline">
                crear una
              </Link>
              ?
            </p>
          ) : (
            <p>
              Ya tienes una cuenta. ¿Quieres{" "}
              <Link href="/" className="text-sky-600 underline">
                entrar
              </Link>
              ?
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

import AuthLayout from "@/components/auth/layout";
import { LoginForm } from "@/components/auth/loginForm";

export default function Home() {
  return (
    <AuthLayout
      title="Login"
      isLogin={true}
      description="Enter your credentials to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}

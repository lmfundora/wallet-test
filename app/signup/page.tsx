import AuthLayout from "@/components/auth/layout";
import { SignUpForm } from "@/components/auth/signUpForm";

export default function SignUp() {
  return (
    <AuthLayout
      title="Sign Up"
      isLogin={false}
      description="Enter your details to create an account"
    >
      <SignUpForm />
    </AuthLayout>
  );
}

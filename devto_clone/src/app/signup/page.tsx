import { ClientProvider } from "../_components/ClientProvider";
import SignUp from "../_components/SignUp";

export default function SignUpPage() {
  return (
    <ClientProvider>
      <div className="container mx-auto mt-8 max-w-md">
        <h1 className="mb-6 text-3xl font-bold">Sign Up</h1>
        <SignUp />
      </div>
    </ClientProvider>
  );
}
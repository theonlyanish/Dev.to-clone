import { ClientProvider } from "../_components/ClientProvider";
import Login from "../_components/Login";

export default function LoginPage() {
  return (
    <ClientProvider>
      <div className="container mx-auto mt-8 max-w-md">
        <h1 className="mb-6 text-3xl font-bold">Log In</h1>
        <Login />
      </div>
    </ClientProvider>
  );
}
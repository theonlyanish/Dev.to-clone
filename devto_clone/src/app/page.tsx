import { ClientProvider } from "./_components/ClientProvider";
import HomeContent from "./_components/HomeContent";

export default function Home() {
  return (
    <ClientProvider>
      <HomeContent />
    </ClientProvider>
  );
}
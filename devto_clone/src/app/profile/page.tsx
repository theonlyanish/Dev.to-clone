import { ClientProvider } from "../_components/ClientProvider";
import ProfileComponent from "../_components/ProfileComponent";
import { getServerAuthSession } from "~/server/auth";

export default async function ProfilePage() {

  const session = await getServerAuthSession();

  return (
    <ClientProvider>
      <ProfileComponent userId={session?.user?.id} />
    </ClientProvider>
  );
}

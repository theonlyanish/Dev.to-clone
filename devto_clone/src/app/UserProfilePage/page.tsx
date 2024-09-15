import { ClientProvider } from "../_components/ClientProvider";
import UserProfileComponent from "../user/[userId]/UserProfileComponent";

export default function UserProfilePage({ params }: { params: { userId: string } }) {
  return (
    <ClientProvider>
      <UserProfileComponent userId={params.userId} />
    </ClientProvider>
  );
}

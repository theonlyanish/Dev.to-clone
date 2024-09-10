import { ClientProvider } from "../_components/ClientProvider";
import ProfileComponent from "../_components/ProfileComponent";

export default function ProfilePage() {
  return (
    <ClientProvider>
      <ProfileComponent />
    </ClientProvider>
  );
}

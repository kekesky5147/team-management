import { TeamManagementApp } from "@/components/team/TeamManagementApp";
import { applePage } from "@/lib/apple-ui";

export default function Home() {
  return (
    <main className={applePage}>
      <TeamManagementApp />
    </main>
  );
}

import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/session";
import { CareerSheetEditor } from "@/components/career-sheet/career-sheet-editor";

export default async function Home() {
  const email = await getSessionEmail();
  if (!email) {
    redirect("/login");
  }

  return <CareerSheetEditor email={email} />;
}

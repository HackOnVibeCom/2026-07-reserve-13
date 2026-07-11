import { PitchDesk } from "@/components/pitch-desk";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Desk · Tact",
  description: "Draft soft community posts and score spam risk for your new app.",
};

export default function AppPage() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader bare />
      <PitchDesk />
    </div>
  );
}

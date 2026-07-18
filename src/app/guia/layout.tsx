import { DesktopHeader } from "@/components/DesktopHeader";

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DesktopHeader />
      {children}
    </>
  );
}

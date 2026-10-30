import { Motion } from "./Motion";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { getStatusView } from "./ApplicationStatus";
import { PLAYBOOK_FALLBACK_URL } from "@/lib/content";
import { getSettings } from "@/lib/settings";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const v = getStatusView(settings);
  return (
    <>
      <Motion />
      <SiteHeader cta={{ label: v.cta, href: v.href, external: v.external }} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} playbookUrl={settings?.playbookUrl || PLAYBOOK_FALLBACK_URL} />
    </>
  );
}

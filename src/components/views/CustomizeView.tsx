import { useState, useMemo, useRef } from "react";
import { Search, Plug, CheckCircle2, Plus, Upload, X, Zap, Puzzle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useConnectors } from "@/hooks/use-connectors";
import { useSkills } from "@/hooks/use-skills";
import { usePlugins } from "@/hooks/use-plugins";
import { useAuth } from "@/contexts/AuthContext";
import { NewConnectorDialog } from "@/components/dialogs/NewConnectorDialog";
import { INTEGRATION_APPS, INTEGRATION_CATEGORIES } from "@/constants/integrations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const LIBRARY_PLUGINS = [
  { name: "Web Search", desc: "Search the web for real-time information", icon: "🔍" },
  { name: "Code Interpreter", desc: "Execute Python code for data analysis", icon: "🐍" },
  { name: "Image Generator", desc: "Generate images from text prompts", icon: "🖼️" },
  { name: "PDF Reader", desc: "Extract and analyze content from PDFs", icon: "📄" },
  { name: "Calendar", desc: "Manage calendar events and scheduling", icon: "📅" },
  { name: "Email Sender", desc: "Send emails through configured SMTP", icon: "✉️" },
];

function getFaviconUrl(appName: string): string {
  const domainMap: Record<string, string> = {
    "Gmail": "gmail.com", "Google Calendar": "calendar.google.com", "Google Drive": "drive.google.com",
    "Google Cloud BigQuery": "cloud.google.com", "Google Compute Engine": "cloud.google.com",
    "Slack": "slack.com", "Stripe": "stripe.com", "HubSpot": "hubspot.com", "Notion": "notion.so",
    "Figma": "figma.com", "Linear": "linear.app", "Asana": "asana.com", "Airtable": "airtable.com",
    "Calendly": "calendly.com", "ClickUp": "clickup.com", "Monday": "monday.com", "Canva": "canva.com",
    "Vercel": "vercel.com", "Netlify": "netlify.com", "Cloudflare": "cloudflare.com",
    "GitHub": "github.com", "PayPal": "paypal.com", "Razorpay": "razorpay.com", "Brex": "brex.com",
    "Zapier": "zapier.com", "Make": "make.com", "n8n": "n8n.io", "Miro": "miro.com",
    "Webflow": "webflow.com", "WordPress.com": "wordpress.com", "Wix": "wix.com",
    "Snowflake": "snowflake.com", "Databricks": "databricks.com", "Supabase": "supabase.com",
    "Sentry": "sentry.io", "PostHog": "posthog.com", "Amplitude": "amplitude.com",
    "Mixpanel": "mixpanel.com", "Intercom": "intercom.com", "Twilio": "twilio.com",
    "Apollo.io": "apollo.io", "Attio": "attio.com", "Close": "close.com",
    "Contentful": "contentful.com", "Sanity": "sanity.io", "Box": "box.com",
    "Docusign": "docusign.com", "PagerDuty": "pagerduty.com", "Jotform": "jotform.com",
    "Klaviyo": "klaviyo.com", "ActiveCampaign": "activecampaign.com", "Braze": "braze.com",
    "Customer.io": "customer.io", "MailerLite": "mailerlite.com", "Bitly": "bitly.com",
    "Ahrefs": "ahrefs.com", "Similarweb": "similarweb.com", "Shopify": "shopify.com",
    "Square": "squareup.com", "Plaid": "plaid.com", "Mercury": "mercury.com",
    "Ramp": "ramp.com", "Intuit QuickBooks": "quickbooks.intuit.com",
    "Intuit TurboTax": "turbotax.intuit.com", "Gusto": "gusto.com",
    "Workato": "workato.com", "Pendo": "pendo.io", "Gainsight": "gainsight.com",
    "Honeycomb": "honeycomb.io", "Telegram": "telegram.org", "Resend": "resend.com",
    "ElevenLabs": "elevenlabs.io", "Perplexity": "perplexity.ai", "Firecrawl": "firecrawl.dev",
    "Twitch": "twitch.tv", "PlanetScale": "planetscale.com", "AWS S3": "aws.amazon.com",
    "AWS Marketplace": "aws.amazon.com", "Crypto.com": "crypto.com",
    "Hugging Face": "huggingface.co", "Gamma": "gamma.app", "Excalidraw": "excalidraw.com",
    "Clerk": "clerk.com", "GoDaddy": "godaddy.com", "Zoho CRM": "zoho.com",
    "Zoho Books": "zoho.com", "Zoho Projects": "zoho.com", "ZoomInfo": "zoominfo.com",
    "Indeed": "indeed.com", "Dice": "dice.com", "Kiwi.com": "kiwi.com",
    "Trivago": "trivago.com", "Microsoft 365": "microsoft.com", "Microsoft Learn": "microsoft.com",
    "Outreach": "outreach.io", "Clay": "clay.com", "Cloudinary": "cloudinary.com",
    "Smartsheet": "smartsheet.com", "Egnyte": "egnyte.com",
    "Atlassian Rovo": "atlassian.com", "Jam": "jam.dev",
    "PubMed": "pubmed.ncbi.nlm.nih.gov", "Glean": "glean.com",
    "Fellow.ai": "fellow.app", "Fireflies": "fireflies.ai",
    "Krisp": "krisp.ai", "Granola": "granola.so", "Craft": "craft.do",
    "Circleback": "circleback.ai", "Mem": "mem.ai",
    "Clockwise": "getclockwise.com", "Process Street": "process.st",
    "Benchling": "benchling.com", "BioRender": "biorender.com",
    "Lumin": "luminpdf.com", "DocuSeal": "docuseal.co", "SignNow": "signnow.com",
    "LegalZoom": "legalzoom.com", "Harvey": "harvey.ai",
    "Consensus": "consensus.app", "FactSet": "factset.com",
    "Morningstar": "morningstar.com", "PitchBook": "pitchbook.com",
    "CB Insights": "cbinsights.com", "Daloopa": "daloopa.com",
    "Qlik": "qlik.com", "Hex": "hex.tech", "Airwallex": "airwallex.com",
    "Chronograph": "chronograph.pe", "Starburst": "starburst.io",
    "Dremio Cloud": "dremio.com", "MotherDuck": "motherduck.com",
    "Mermaid Chart": "mermaid.live", "LILT": "lilt.com",
    "lastminute.com": "lastminute.com", "Fever": "feverup.com",
    "Ticket Tailor": "tickettailor.com", "DirectBooker": "directbooker.com",
    "Wyndham Hotels": "wyndhamhotels.com",
    "G2": "g2.com", "Harmonic": "harmonic.ai", "Crossbeam": "crossbeam.com",
    "Common Room": "commonroom.io", "Local Falcon": "localfalcon.com",
    "Supermetrics": "supermetrics.com", "AirOps": "airops.com",
    "Tavily": "tavily.com", "Context7": "context7.com",
    "Day AI": "day.ai", "Clarify": "clarify.ai", "Pylon": "usepylon.com",
    "DevRev": "devrev.ai", "Postman": "postman.com", "Port IO": "port.io",
    "Base44": "base44.com", "Jentic": "jentic.com", "GraphOS": "apollographql.com",
    "Coupler.io": "coupler.io", "Windsor.ai": "windsor.ai",
    "CData": "cdata.com", "Blockscout": "blockscout.com",
    "Aiera": "aiera.com", "Aura": "aura.co", "Blackbaud": "blackbaud.com",
    "Campfire": "campfire.to", "LunarCrush": "lunarcrush.com",
    "Pigment": "pigment.com", "Omni Analytics": "omni.co",
    "Magic Patterns": "magicpatterns.com",
    "Benevity": "benevity.com", "Candid": "candid.org",
    "DataGrail": "datagrail.io", "Intapp Celeste": "intapp.com",
    "Metaview": "metaview.ai", "Visier": "visier.com",
    "Udemy Business": "business.udemy.com",
    "10x Genomics Cloud": "10xgenomics.com",
    "Midpage": "midpage.ai", "Granted": "granted.co",
    "Guru": "getguru.com",
    "Aiwyn Tax": "aiwyn.ai", "Clarity AI": "clarity.ai",
    "Bigdata.com": "bigdata.com",
    "Sprouts Data Intelligence": "sprouts.ai", "Vibe Prospecting": "vibe.co",
    "LSEG": "lseg.com", "MSCI": "msci.com", "S&P Global": "spglobal.com",
    "Moody's Analytics": "moodys.com", "MT Newswires": "mtnewswires.com",
    "Quartr": "quartr.com",
    "Cortellis": "cortellis.com", "Medidata": "medidata.com",
    "Owkin": "owkin.com", "Open Targets": "opentargets.org",
    "Clinical Trials": "clinicaltrials.gov", "CMS Coverage": "cms.gov",
    "ChEMBL": "ebi.ac.uk", "bioRxiv": "biorxiv.org",
    "Oracle NetSuite": "netsuite.com",
    "Acima Tax": "aiwyn.ai",
  };
  const domain = domainMap[appName];
  if (domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  // Fallback: try name-based domain guess
  const guess = appName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") + ".com";
  return `https://www.google.com/s2/favicons?domain=${guess}&sz=64`;
}

export function CustomizeView() {
  const [tab, setTab] = useState("integrations");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [connectingApp, setConnectingApp] = useState<string | null>(null);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showCreateSkill, setShowCreateSkill] = useState(false);
  const [showUploadSkill, setShowUploadSkill] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: connectors } = useConnectors();
  const { data: skills } = useSkills();
  const { data: plugins } = usePlugins();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Skill form
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillDesc, setSkillDesc] = useState("");
  const [skillKeywords, setSkillKeywords] = useState("");

  const connectedNames = useMemo(
    () => new Set((connectors ?? []).map((c) => c.name.toLowerCase())),
    [connectors]
  );

  const filteredApps = useMemo(() => {
    let apps = INTEGRATION_APPS;
    if (category !== "All") apps = apps.filter((a) => a.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      apps = apps.filter((a) => a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q));
    }
    return apps;
  }, [search, category]);

  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills ?? [];
    const q = search.toLowerCase();
    return (skills ?? []).filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }, [skills, search]);

  const filteredPlugins = useMemo(() => {
    if (!search.trim()) return plugins ?? [];
    const q = search.toLowerCase();
    return (plugins ?? []).filter(p => p.name.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q));
  }, [plugins, search]);

  const filteredLibPlugins = useMemo(() => {
    if (!search.trim()) return LIBRARY_PLUGINS;
    const q = search.toLowerCase();
    return LIBRARY_PLUGINS.filter(p => p.name.toLowerCase().includes(q));
  }, [search]);

  const handleConnect = async (appName: string) => {
    setConnectingApp(appName);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      const { error } = await supabase.from("connectors").insert([{
        name: appName, type: "mcp",
        description: INTEGRATION_APPS.find((a) => a.name === appName)?.description ?? "",
        config: {}, is_active: true, created_by: u?.id,
      }]);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} connected successfully`);
    } catch (err: any) {
      toast.error(err.message || "Failed to connect");
    } finally { setConnectingApp(null); }
  };

  const handleDisconnect = async (appName: string) => {
    const connector = (connectors ?? []).find((c) => c.name.toLowerCase() === appName.toLowerCase());
    if (!connector) return;
    try {
      const { error } = await supabase.from("connectors").delete().eq("id", connector.id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["connectors"] });
      toast.success(`${appName} disconnected`);
    } catch (err: any) { toast.error(err.message || "Failed to disconnect"); }
  };

  const handleCreateSkill = async () => {
    if (!skillName || !user) return;
    const { error } = await supabase.from("skills").insert({
      name: skillName, description: skillDesc, category: skillCategory || "custom",
      trigger_keywords: skillKeywords.split(",").map(k => k.trim()).filter(Boolean),
      created_by: user.id, is_active: true, is_system: false,
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`Skill "${skillName}" created`);
      qc.invalidateQueries({ queryKey: ["skills"] });
      setShowCreateSkill(false);
      setSkillName(""); setSkillCategory(""); setSkillDesc(""); setSkillKeywords("");
    }
  };

  const handleUploadSkill = async (files: FileList | null) => {
    if (!files || !user) return;
    for (const file of Array.from(files)) {
      const text = await file.text();
      try {
        const parsed = JSON.parse(text);
        await supabase.from("skills").insert({
          name: parsed.name || file.name.replace(/\.\w+$/, ""),
          description: parsed.description || "", category: parsed.category || "imported",
          trigger_keywords: parsed.trigger_keywords || [], sub_skills: parsed.sub_skills || [],
          created_by: user.id, is_active: true, is_system: false,
        });
        toast.success(`Imported "${parsed.name || file.name}"`);
      } catch {
        await supabase.from("skills").insert({
          name: file.name.replace(/\.\w+$/, ""), description: text.slice(0, 200),
          category: "imported", trigger_keywords: [],
          created_by: user.id, is_active: true, is_system: false,
        });
        toast.success(`Imported "${file.name}"`);
      }
    }
    qc.invalidateQueries({ queryKey: ["skills"] });
    setShowUploadSkill(false);
  };

  const addLibraryPlugin = async (item: typeof LIBRARY_PLUGINS[0]) => {
    if (!user) return;
    const { error } = await supabase.from("plugins").insert({
      name: item.name.toLowerCase().replace(/\s+/g, "_"), display_name: item.name,
      context: item.desc, created_by: user.id, is_active: true,
    });
    if (error) toast.error(error.message);
    else { toast.success(`${item.name} added`); qc.invalidateQueries({ queryKey: ["plugins"] }); }
  };

  const skillCategories = [...new Set(filteredSkills.map(s => s.category))];

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-6 py-5 border-b border-border">
        <h1 className="text-lg font-semibold text-foreground">Customize</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Integrations, skills, and plugins for your agents</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="flex flex-col">
        <div className="px-6 pt-4 pb-0 flex items-center gap-2 border-b border-border">
          <TabsList className="bg-transparent p-0 gap-1 h-auto">
            <TabsTrigger value="integrations" className="data-[state=active]:bg-card data-[state=active]:border-primary/30 rounded-t-lg rounded-b-none px-4 py-2 text-sm border border-transparent border-b-0">
              <Plug className="h-3.5 w-3.5 mr-1.5" /> Integrations
              <Badge variant="secondary" className="ml-2 text-[9px]">{INTEGRATION_APPS.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-card data-[state=active]:border-primary/30 rounded-t-lg rounded-b-none px-4 py-2 text-sm border border-transparent border-b-0">
              <Zap className="h-3.5 w-3.5 mr-1.5" /> Skills
              <Badge variant="secondary" className="ml-2 text-[9px]">{skills?.length ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="plugins" className="data-[state=active]:bg-card data-[state=active]:border-primary/30 rounded-t-lg rounded-b-none px-4 py-2 text-sm border border-transparent border-b-0">
              <Puzzle className="h-3.5 w-3.5 mr-1.5" /> Plugins
              <Badge variant="secondary" className="ml-2 text-[9px]">{(plugins?.length ?? 0) + LIBRARY_PLUGINS.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Search — shared */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="pl-9 h-9" />
          </div>

          {/* ───── Integrations Tab ───── */}
          <TabsContent value="integrations" className="m-0 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {INTEGRATION_CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowCustomDialog(true)} className="shrink-0 ml-3">
                <Plug className="h-3.5 w-3.5 mr-1.5" /> Custom
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{filteredApps.length} integrations</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredApps.map((app) => {
                const isConnected = connectedNames.has(app.name.toLowerCase());
                const isConnecting = connectingApp === app.name;
                return (
                  <div key={app.name} className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <img
                        src={getFaviconUrl(app.name)}
                        alt={app.name}
                        className="w-10 h-10 rounded-lg bg-muted p-1 shrink-0 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0 hidden">
                        {app.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-medium text-foreground truncate">{app.name}</h3>
                          {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{app.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <Badge variant="secondary" className="text-[10px]">{app.category}</Badge>
                      {isConnected ? (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDisconnect(app.name)}>Disconnect</Button>
                      ) : (
                        <Button size="sm" className="h-7 text-xs" disabled={isConnecting} onClick={() => handleConnect(app.name)}>{isConnecting ? "Connecting..." : "Connect"}</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ───── Skills Tab ───── */}
          <TabsContent value="skills" className="m-0 space-y-4">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setShowCreateSkill(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Create skill</Button>
              <Button size="sm" variant="outline" onClick={() => setShowUploadSkill(true)}><Upload className="h-3.5 w-3.5 mr-1" /> Upload skill</Button>
            </div>

            {showCreateSkill && (
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex justify-between items-center"><h4 className="text-sm font-medium">Create New Skill</h4><button onClick={() => setShowCreateSkill(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
                <Input placeholder="Skill name" value={skillName} onChange={e => setSkillName(e.target.value)} />
                <Input placeholder="Category (e.g. sales, marketing)" value={skillCategory} onChange={e => setSkillCategory(e.target.value)} />
                <Textarea placeholder="Description" value={skillDesc} onChange={e => setSkillDesc(e.target.value)} rows={2} />
                <Input placeholder="Trigger keywords (comma-separated)" value={skillKeywords} onChange={e => setSkillKeywords(e.target.value)} />
                <Button size="sm" onClick={handleCreateSkill} disabled={!skillName}>Create</Button>
              </div>
            )}

            {showUploadSkill && (
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex justify-between items-center"><h4 className="text-sm font-medium">Upload Skill File</h4><button onClick={() => setShowUploadSkill(false)}><X className="h-4 w-4 text-muted-foreground" /></button></div>
                <p className="text-xs text-muted-foreground">Upload .json or .md skill files</p>
                <input ref={fileRef} type="file" accept=".json,.md,.txt" multiple className="hidden" onChange={e => handleUploadSkill(e.target.files)} />
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-3.5 w-3.5 mr-1" /> Choose files</Button>
              </div>
            )}

            {skillCategories.map(cat => (
              <div key={cat}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{cat}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredSkills.filter(s => s.category === cat).map(skill => (
                    <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{skill.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{skill.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{skill.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filteredSkills.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No skills found. Create or upload one above.</p>}
          </TabsContent>

          {/* ───── Plugins Tab ───── */}
          <TabsContent value="plugins" className="m-0 space-y-4">
            {(filteredPlugins?.length ?? 0) > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredPlugins.map(p => (
                    <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                      <Puzzle className="h-4 w-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{p.display_name || p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.context}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Available</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredLibPlugins.map(p => (
                  <div key={p.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-primary/30 transition-colors">
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
                    </div>
                    <button onClick={() => addLibraryPlugin(p)} className="p-1 rounded hover:bg-card transition-colors"><Plus className="h-4 w-4 text-muted-foreground hover:text-foreground" /></button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <NewConnectorDialog open={showCustomDialog} onOpenChange={setShowCustomDialog} defaultType="mcp" />
    </div>
  );
}

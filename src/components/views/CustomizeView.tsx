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

 // ── Phase 1: Soft disconnect — filter by is_active ──
 const connectedNames = useMemo(
 () => new Set(
   (connectors ?? []).filter((c: any) => c.is_active !== false).map((c: any) => c.name.toLowerCase())
 ),
 [connectors]
 );

 const disconnectedNames = useMemo(
 () => new Set(
   (connectors ?? []).filter((c: any) => c.is_active === false).map((c: any) => c.name.toLowerCase())
 ),
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
 return (skills ?? []).filter((s: any) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
 }, [skills, search]);

 const filteredPlugins = useMemo(() => {
 if (!search.trim()) return plugins ?? [];
 const q = search.toLowerCase();
 return (plugins ?? []).filter((p: any) => p.name.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q));
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

 // ── Phase 1: Soft disconnect (sets is_active = false) ──
 const handleDisconnect = async (appName: string) => {
 const connector = (connectors ?? []).find((c: any) => c.name.toLowerCase() === appName.toLowerCase());
 if (!connector) return;

 const confirmed = window.confirm(
   `Disconnect ${appName}?\n\nYou'll lose access to ${appName} features but can reconnect later without re-authenticating.`
 );
 if (!confirmed) return;

 try {
   const { error } = await supabase
     .from("connectors")
     .update({ is_active: false })
     .eq("id", connector.id);

   if (error) throw error;
   qc.invalidateQueries({ queryKey: ["connectors"] });
   toast.success(`${appName} disconnected — you can reconnect anytime`);
 } catch (err: any) {
   toast.error(err.message || "Failed to disconnect");
 }
 };

 // ── Phase 1: Reconnect (sets is_active = true) ──
 const handleReconnect = async (appName: string) => {
 const connector = (connectors ?? []).find((c: any) => c.name.toLowerCase() === appName.toLowerCase());
 if (!connector) return;

 try {
   const { error } = await supabase
     .from("connectors")
     .update({ is_active: true })
     .eq("id", connector.id);

   if (error) throw error;
   qc.invalidateQueries({ queryKey: ["connectors"] });
   toast.success(`${appName} reconnected`);
 } catch (err: any) {
   toast.error(err.message || "Failed to reconnect");
 }
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

 const skillCategories = [...new Set(filteredSkills.map((s: any) => s.category))];

 return (
 <div className="flex-1 overflow-y-auto p-6">
 <div className="max-w-5xl mx-auto">
 <h1 className="text-2xl font-bold mb-1">Customize</h1>
 <p className="text-sm text-muted-foreground mb-6">Integrations, skills, and plugins for your agents</p>

 <Tabs value={tab} onValueChange={setTab}>
 <TabsList>
 <TabsTrigger value="integrations">Integrations <Badge variant="secondary" className="ml-1.5 text-[10px]">{INTEGRATION_APPS.length}</Badge></TabsTrigger>
 <TabsTrigger value="skills">Skills <Badge variant="secondary" className="ml-1.5 text-[10px]">{skills?.length ?? 0}</Badge></TabsTrigger>
 <TabsTrigger value="plugins">Plugins <Badge variant="secondary" className="ml-1.5 text-[10px]">{(plugins?.length ?? 0) + LIBRARY_PLUGINS.length}</Badge></TabsTrigger>
 </TabsList>

 {/* Search — shared */}
 <div className="relative mt-4 mb-4">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${tab}...`} className="pl-9 h-9" />
 </div>

 {/* ───── Integrations Tab ───── */}
 <TabsContent value="integrations">
 <div className="flex items-center gap-2 mb-4 flex-wrap">
 {INTEGRATION_CATEGORIES.map((cat) => (
 <button key={cat} onClick={() => setCategory(cat)}
 className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"}`}>
 {cat}
 </button>
 ))}
 </div>
 <div className="flex items-center justify-between mb-3">
 <Button variant="outline" size="sm" onClick={() => setShowCustomDialog(true)} className="shrink-0 ml-3">
 <Plus className="h-3.5 w-3.5 mr-1" /> Custom
 </Button>
 </div>
 <p className="text-xs text-muted-foreground mb-3">{filteredApps.length} integrations</p>

 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
 {filteredApps.map((app) => {
 const isConnected = connectedNames.has(app.name.toLowerCase());
 const isDisconnected = disconnectedNames.has(app.name.toLowerCase());
 const isConnecting = connectingApp === app.name;
 return (
 <div key={app.name} className="border border-border rounded-xl p-4 hover:border-primary/30 transition-colors group">
 <div className="flex items-start gap-3 mb-2">
 <img src={getFaviconUrl(app.name)} alt={app.name} className="w-8 h-8 rounded-lg" onError={(e) => {
 (e.target as HTMLImageElement).style.display = "none";
 (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
 }} />
 <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold hidden">
 {app.name.slice(0, 2).toUpperCase()}
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="text-sm font-medium truncate flex items-center gap-1.5">
 {app.name}
 {isConnected && <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />}
 </h3>
 <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{app.description}</p>
 </div>
 </div>
 <div className="flex items-center justify-between mt-2">
 <Badge variant="outline" className="text-[9px]">{app.category}</Badge>
 {isConnected ? (
   <Button
     variant="outline"
     size="sm"
     className="text-destructive hover:bg-destructive/10"
     onClick={() => handleDisconnect(app.name)}
   >
     Disconnect
   </Button>
 ) : isDisconnected ? (
   <Button
     variant="outline"
     size="sm"
     className="text-primary"
     onClick={() => handleReconnect(app.name)}
   >
     Reconnect
   </Button>
 ) : (
   <Button size="sm" onClick={() => handleConnect(app.name)}>
     {isConnecting ? "Connecting..." : "Connect"}
   </Button>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </TabsContent>

 {/* ───── Skills Tab ───── */}
 <TabsContent value="skills">
 <div className="flex items-center gap-2 mb-4">
 <Button size="sm" onClick={() => setShowCreateSkill(true)}><Plus className="h-3.5 w-3.5 mr-1" /> Create skill</Button>
 <Button size="sm" variant="outline" onClick={() => setShowUploadSkill(true)}><Upload className="h-3.5 w-3.5 mr-1" /> Upload skill</Button>
 </div>

 {showCreateSkill && (
 <div className="border border-border rounded-xl p-4 mb-4">
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-semibold">Create New Skill</h4>
 <button onClick={() => setShowCreateSkill(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
 </div>
 <div className="space-y-3">
 <Input placeholder="Skill name" value={skillName} onChange={(e) => setSkillName(e.target.value)} />
 <Input placeholder="Category (e.g. research, writing)" value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} />
 <Textarea placeholder="Description" value={skillDesc} onChange={(e) => setSkillDesc(e.target.value)} rows={2} />
 <Input placeholder="Trigger keywords (comma-separated)" value={skillKeywords} onChange={(e) => setSkillKeywords(e.target.value)} />
 <Button onClick={handleCreateSkill} disabled={!skillName}>Create Skill</Button>
 </div>
 </div>
 )}

 {showUploadSkill && (
 <div className="border border-border rounded-xl p-4 mb-4">
 <div className="flex items-center justify-between mb-3">
 <h4 className="text-sm font-semibold">Upload Skill File</h4>
 <button onClick={() => setShowUploadSkill(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
 </div>
 <p className="text-xs text-muted-foreground mb-2">Upload a JSON skill definition or plain text file.</p>
 <input ref={fileRef} type="file" accept=".json,.txt" multiple onChange={(e) => handleUploadSkill(e.target.files)} />
 </div>
 )}

 {skillCategories.map((cat: any) => (
 <div key={cat} className="mb-4">
 <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{cat}</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {filteredSkills.filter((s: any) => s.category === cat).map((skill: any) => (
 <div key={skill.id} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
 <div className="flex items-center gap-2">
 <Zap className="h-4 w-4 text-primary shrink-0" />
 <div className="min-w-0">
 <div className="text-sm font-medium truncate">{skill.name}</div>
 <div className="text-[10px] text-muted-foreground truncate">{skill.description}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 ))}
 </TabsContent>

 {/* ───── Plugins Tab ───── */}
 <TabsContent value="plugins">
 {/* Library plugins */}
 <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Plugin Library</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
 {filteredLibPlugins.map((item) => (
 <div key={item.name} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors flex items-center gap-3">
 <span className="text-xl">{item.icon}</span>
 <div className="flex-1 min-w-0">
 <div className="text-sm font-medium">{item.name}</div>
 <div className="text-[10px] text-muted-foreground">{item.desc}</div>
 </div>
 <Button size="sm" variant="outline" onClick={() => addLibraryPlugin(item)}>Add</Button>
 </div>
 ))}
 </div>

 {/* Custom plugins */}
 {filteredPlugins.length > 0 && (
 <>
 <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Custom Plugins</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {filteredPlugins.map((plugin: any) => (
 <div key={plugin.id} className="border border-border rounded-lg p-3 hover:border-primary/30 transition-colors">
 <div className="flex items-center gap-2">
 <Puzzle className="h-4 w-4 text-primary shrink-0" />
 <div className="min-w-0">
 <div className="text-sm font-medium truncate">{plugin.display_name}</div>
 <div className="text-[10px] text-muted-foreground truncate">{plugin.context}</div>
 </div>
 </div>
 </div>
 ))}
 </div>
 </>
 )}
 </TabsContent>
 </Tabs>
 </div>

 {showCustomDialog && <NewConnectorDialog open={showCustomDialog} onOpenChange={setShowCustomDialog} />}
 </div>
 );
}

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import {
  BarChart3, BookOpen, CheckCircle2, Edit3, FileText, LayoutDashboard,
  LogOut, Menu, Plus, RefreshCw, Search, ShieldCheck, Trash2, X
} from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Category, Prompt } from "../types/promptAdmin";
import { slugify, csvTags, formatAdminDate } from "../utils/promptAdmin";

const emptyCategory = {
  name: "", slug: "", description: "", seo_title: "", seo_description: "",
  is_published: true, sort_order: 0
};

const emptyPrompt = {
  category_id: "", title: "", slug: "", short_description: "", prompt_text: "",
  use_case: "", tags: "", is_published: true, sort_order: 0
};

export default function PromptAdminPage() {
  const [session, setSession] = useState<any>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const title = document.title;
    const existing = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const oldContent = existing?.content;
    const meta = existing || document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex,nofollow,noarchive";
    if (!existing) document.head.appendChild(meta);
    document.title = "Prompt Store Admin | TextCase";
    return () => {
      document.title = title;
      if (existing) existing.content = oldContent || "";
      else meta.remove();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!supabase) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await checkAdmin();
      else { setAuthorized(false); setLoading(false); }
    });
    const { data } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!mounted) return;
      setSession(next);
      if (next) await checkAdmin();
      else { setAuthorized(false); setLoading(false); }
    });
    return () => { mounted = false; data.subscription.unsubscribe(); };
  }, []);

  async function checkAdmin() {
    const { data, error } = await supabase
      .from("prompt_admins")
      .select("user_id")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id || "")
      .maybeSingle();
    setAuthorized(!error && !!data);
    setLoading(false);
  }

  if (loading) return <AdminCenter><AdminLoader/></AdminCenter>;
  if (!session) return <AdminLogin onLoggedIn={(s) => { setSession(s); checkAdmin(); }} />;
  if (!authorized) return <AdminDenied />;
  return <AdminDashboard session={session} />;
}

function AdminCenter({children}:{children:ReactNode}) {
  return <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-5">{children}</div>;
}
function AdminLoader(){ return <div className="flex flex-col items-center gap-3 text-gray-400"><div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"/><span>Checking admin access…</span></div>; }

function AdminLogin({onLoggedIn}:{onLoggedIn:(s:any)=>void}) {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(e:FormEvent){ e.preventDefault(); setBusy(true); setError("");
    const {data,error}=await supabase.auth.signInWithPassword({email,password});
    if(error) setError(error.message); else if(data.session) onLoggedIn(data.session);
    setBusy(false);
  }
  return <div className="min-h-screen bg-gray-950 flex items-center justify-center p-5">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-7 shadow-2xl">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white"><ShieldCheck/></div>
      <h1 className="text-2xl font-black text-white">Prompt Store Admin</h1>
      <p className="mt-1 mb-6 text-sm text-gray-400">Private TextCase administration panel</p>
      <label className="block text-sm font-semibold text-gray-200">Email
        <input className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/>
      </label>
      <label className="mt-4 block text-sm font-semibold text-gray-200">Password
        <input className="mt-2 w-full rounded-xl border border-gray-700 bg-gray-950 px-3 py-3 text-white outline-none focus:border-blue-500" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/>
      </label>
      {error && <div className="mt-4 rounded-xl bg-red-950/40 border border-red-900 p-3 text-sm text-red-300">{error}</div>}
      <button disabled={busy} className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50">{busy?"Signing in…":"Sign in"}</button>
      <p className="mt-5 text-center text-xs text-gray-500">Admin access is protected by Supabase RLS.</p>
    </form>
  </div>;
}

function AdminDenied(){
  return <AdminCenter><div className="max-w-md text-center rounded-2xl border border-gray-800 bg-gray-900 p-8"><ShieldCheck className="mx-auto text-amber-400"/><h1 className="mt-4 text-xl font-bold">Access denied</h1><p className="mt-2 text-sm text-gray-400">This account is authenticated but is not registered as a Prompt Store administrator.</p><button onClick={()=>supabase.auth.signOut()} className="mt-5 rounded-xl bg-gray-800 px-4 py-2 text-sm font-bold">Sign out</button></div></AdminCenter>;
}

function AdminDashboard({session}:{session:any}){
  const [tab,setTab]=useState<"overview"|"categories"|"prompts">("overview");
  const [categories,setCategories]=useState<Category[]>([]);
  const [prompts,setPrompts]=useState<Prompt[]>([]);
  const [busy,setBusy]=useState(false);
  const [notice,setNotice]=useState("");
  const [mobile,setMobile]=useState(false);

  const refresh=async()=>{
    setBusy(true);
    const [{data:c,error:ce},{data:p,error:pe}]=await Promise.all([
      supabase.from("prompt_categories").select("*").order("sort_order").order("name"),
      supabase.from("prompts").select("*, category:prompt_categories(name,slug)").order("sort_order").order("created_at",{ascending:false})
    ]);
    if(ce||pe) setNotice((ce||pe)?.message||"Could not load Prompt Store data.");
    else {setCategories((c||[]) as Category[]);setPrompts((p||[]) as Prompt[]);}
    setBusy(false);
  };
  useEffect(()=>{refresh()},[]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(""),3500);return()=>clearTimeout(t)},[notice]);

  return <div className="min-h-screen bg-gray-50 text-gray-900">
    <aside className={`${mobile?"translate-x-0":"-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 text-gray-200 transition-transform lg:translate-x-0`}>
      <div className="flex items-center gap-2 px-5 py-6 text-white font-black"><ShieldCheck className="text-blue-400"/> Prompt Admin</div>
      <div className="space-y-1 px-3">
        <AdminNav active={tab==="overview"} icon={<LayoutDashboard/>} label="Overview" onClick={()=>{setTab("overview");setMobile(false)}}/>
        <AdminNav active={tab==="categories"} icon={<BookOpen/>} label="Categories" onClick={()=>{setTab("categories");setMobile(false)}}/>
        <AdminNav active={tab==="prompts"} icon={<FileText/>} label="Prompts" onClick={()=>{setTab("prompts");setMobile(false)}}/>
      </div>
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
        <p className="truncate px-2 text-xs text-gray-500">{session.user.email}</p>
        <button onClick={()=>supabase.auth.signOut()} className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-white"><LogOut size={17}/> Sign out</button>
      </div>
    </aside>
    {mobile&&<div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={()=>setMobile(false)}/>}
    <main className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur lg:px-7">
        <div className="flex items-center gap-3"><button onClick={()=>setMobile(true)} className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"><Menu/></button><span className="font-bold">{tab==="overview"?"Overview":tab==="categories"?"Categories":"Prompts"}</span></div>
        <div className="flex items-center gap-2"><button onClick={refresh} className="rounded-lg p-2 hover:bg-gray-100" title="Refresh"><RefreshCw size={18} className={busy?"animate-spin":""}/></button><a href="/prompt-store" target="_blank" rel="noreferrer" className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold hover:bg-gray-200">Open Store</a></div>
      </header>
      {notice&&<div className="fixed right-4 top-20 z-50 rounded-xl bg-gray-950 px-4 py-3 text-sm text-white shadow-xl">{notice}</div>}
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {tab==="overview"&&<AdminOverview categories={categories} prompts={prompts} onPrompts={()=>setTab("prompts")}/>}
        {tab==="categories"&&<AdminCategories categories={categories} prompts={prompts} refresh={refresh} notify={setNotice}/>}
        {tab==="prompts"&&<AdminPrompts categories={categories} prompts={prompts} refresh={refresh} notify={setNotice}/>}
      </div>
    </main>
  </div>;
}

function AdminNav({active,icon,label,onClick}:{active:boolean;icon:ReactNode;label:string;onClick:()=>void}){
  return <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold ${active?"bg-blue-600 text-white":"text-gray-400 hover:bg-gray-900 hover:text-white"}`}>{icon}{label}</button>;
}

function AdminOverview({categories,prompts,onPrompts}:{categories:Category[];prompts:Prompt[];onPrompts:()=>void}){
  const cp=categories.filter(x=>x.is_published).length, pp=prompts.filter(x=>x.is_published).length;
  return <div>
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-black tracking-widest text-blue-600">PROMPT STORE</p><h1 className="mt-1 text-3xl font-black tracking-tight">Content Dashboard</h1><p className="mt-2 text-sm text-gray-500">Manage categories and prompt pages without exposing admin controls to visitors.</p></div><button onClick={onPrompts} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-bold text-white"><Plus size={17}/> New prompt</button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={<BookOpen/>} label="Categories" value={categories.length} meta={`${cp} published`}/>
      <Stat icon={<FileText/>} label="Prompts" value={prompts.length} meta={`${pp} published`}/>
      <Stat icon={<CheckCircle2/>} label="Published" value={cp+pp} meta="Live content"/>
      <Stat icon={<BarChart3/>} label="Drafts" value={(categories.length-cp)+(prompts.length-pp)} meta="Not public"/>
    </div>
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5"><h2 className="font-bold">Quick status</h2><p className="mt-2 text-sm text-gray-500">Public Prompt Store only reads published rows. Drafts remain hidden by RLS.</p></div>
  </div>;
}
function Stat({icon,label,value,meta}:{icon:ReactNode;label:string;value:number;meta:string}){return <div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-start gap-3"><div className="rounded-xl bg-gray-100 p-2">{icon}</div><div><p className="text-xs text-gray-500">{label}</p><p className="text-2xl font-black">{value}</p><p className="text-xs text-gray-400">{meta}</p></div></div></div>}

function AdminCategories({categories,prompts,refresh,notify}:{categories:Category[];prompts:Prompt[];refresh:()=>Promise<void>;notify:(s:string)=>void}){
  const [query,setQuery]=useState(""); const [editing,setEditing]=useState<Category|null>(null); const [creating,setCreating]=useState(false);
  const list=categories.filter(c=>`${c.name} ${c.slug}`.toLowerCase().includes(query.toLowerCase()));
  async function remove(c:Category){if(!confirm(`Delete "${c.name}"? Its prompts will also be deleted.`))return;const {error}=await supabase.from("prompt_categories").delete().eq("id",c.id);if(error)notify(error.message);else{notify("Category deleted.");await refresh()}}
  return <div><PageHead title="Categories" text="Create and control category landing pages." button="New category" onClick={()=>setCreating(true)}/>
    <Toolbar query={query} setQuery={setQuery} count={list.length}/>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">Name</th><th>Slug</th><th>Prompts</th><th>Status</th><th/></tr></thead><tbody>{list.map(c=><tr key={c.id} className="border-t border-gray-100"><td className="px-5 py-4"><b>{c.name}</b><small className="block max-w-sm truncate text-gray-400">{c.description}</small></td><td><code>{c.slug}</code></td><td>{prompts.filter(p=>p.category_id===c.id).length}</td><td><Status published={c.is_published}/></td><td className="pr-4 text-right"><button className="p-2 text-gray-500 hover:text-gray-900" onClick={()=>setEditing(c)}><Edit3 size={17}/></button><button className="p-2 text-red-500" onClick={()=>remove(c)}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>{!list.length&&<Empty text="No categories found."/>}</div>
    {(creating||editing)&&<CategoryModal initial={editing||undefined} close={()=>{setCreating(false);setEditing(null)}} saved={async()=>{setCreating(false);setEditing(null);await refresh();notify("Category saved.")}}/>}
  </div>;
}

function AdminPrompts({categories,prompts,refresh,notify}:{categories:Category[];prompts:Prompt[];refresh:()=>Promise<void>;notify:(s:string)=>void}){
  const [query,setQuery]=useState("");
  const [cat,setCat]=useState("");
  const [editing,setEditing]=useState<Prompt|null>(null);
  const [creating,setCreating]=useState(false);
  const list=prompts.filter((prompt)=>(!cat||prompt.category_id===cat)&&`${prompt.title} ${prompt.slug} ${(prompt.tags||[]).join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  async function remove(prompt:Prompt){
    if(!confirm(`Delete "${prompt.title}"?`)) return;
    const {error}=await supabase.from("prompts").delete().eq("id",prompt.id);
    if(error) notify(error.message); else { notify("Prompt deleted."); await refresh(); }
  }
  return <div>
    <PageHead title="Prompts" text="Create, edit and publish individual prompt pages." button="New prompt" disabled={!categories.length} onClick={()=>setCreating(true)}/>
    <div className="mb-4 flex flex-wrap gap-2">
      <div className="relative min-w-[240px] flex-1"><Search className="absolute left-3 top-3 text-gray-400" size={17}/><input className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" placeholder="Search prompts or tags…" value={query} onChange={e=>setQuery(e.target.value)}/></div>
      <select className="rounded-xl border border-gray-200 bg-white px-3 py-2.5" value={cat} onChange={e=>setCat(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <span className="self-center text-xs text-gray-500">{list.length} prompts</span>
    </div>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="px-5 py-3">Prompt</th><th>Category</th><th>Status</th><th>Order</th><th /></tr></thead><tbody>
        {list.map((prompt)=><tr key={prompt.id} className="border-t border-gray-100"><td className="px-5 py-4"><b>{prompt.title}</b><small className="block max-w-sm truncate text-gray-400">{prompt.short_description}</small></td><td>{prompt.category?.name || "—"}</td><td><Status published={prompt.is_published}/></td><td>{prompt.sort_order}</td><td className="pr-4 text-right"><button className="p-2 text-gray-500" onClick={()=>setEditing(prompt)}><Edit3 size={17}/></button><button className="p-2 text-red-500" onClick={()=>remove(prompt)}><Trash2 size={17}/></button></td></tr>)}
      </tbody></table></div>
      {!list.length && <Empty text={categories.length ? "No prompts found." : "Create a category first."}/>} 
    </div>
    {(creating||editing)&&<PromptModal initial={editing||undefined} categories={categories} close={()=>{setCreating(false);setEditing(null)}} saved={async()=>{setCreating(false);setEditing(null);await refresh();notify("Prompt saved.")}}/>}
  </div>;
}

function PageHead({title,text,button,onClick,disabled=false}:{title:string;text:string;button:string;onClick:()=>void;disabled?:boolean}){return <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h1 className="text-2xl font-black">{title}</h1><p className="mt-1 text-sm text-gray-500">{text}</p></div><button disabled={disabled} onClick={onClick} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"><Plus size={17}/>{button}</button></div>}
function Toolbar({query,setQuery,count}:{query:string;setQuery:(s:string)=>void;count:number}){return <div className="mb-4 flex items-center gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-gray-400" size={17}/><input className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 outline-none focus:border-blue-500" placeholder="Search…" value={query} onChange={e=>setQuery(e.target.value)}/></div><span className="text-xs text-gray-500">{count} categories</span></div>}
function Status({published}:{published:boolean}){return <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${published?"text-green-600":"text-amber-600"}`}><span className={`h-2 w-2 rounded-full ${published?"bg-green-500":"bg-amber-500"}`}/>{published?"Published":"Draft"}</span>}
function Empty({text}:{text:string}){return <div className="p-10 text-center text-sm text-gray-400">{text}</div>}

function CategoryModal({initial,close,saved}:{initial?:Category;close:()=>void;saved:()=>Promise<void>}){
  const [form,setForm]=useState<any>(initial?{...initial}:{...emptyCategory}); const [busy,setBusy]=useState(false);
  const u=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v}));
  async function save(e:FormEvent){e.preventDefault();setBusy(true);const payload={name:form.name.trim(),slug:slugify(form.slug||form.name),description:form.description.trim(),seo_title:form.seo_title?.trim()||null,seo_description:form.seo_description?.trim()||null,is_published:form.is_published,sort_order:Number(form.sort_order)||0,updated_at:new Date().toISOString()};const q=initial?supabase.from("prompt_categories").update(payload).eq("id",initial.id):supabase.from("prompt_categories").insert(payload);const {error}=await q;if(error)alert(error.message);else await saved();setBusy(false)}
  return <Modal title={initial?"Edit category":"New category"} close={close}><form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2">
    <Field label="Name"><input required value={form.name} onChange={e=>u("name",e.target.value)} onBlur={()=>!initial&&u("slug",slugify(form.name))}/></Field>
    <Field label="Slug"><input required value={form.slug} onChange={e=>u("slug",e.target.value)}/></Field>
    <Field label="Description" full><textarea rows={3} value={form.description} onChange={e=>u("description",e.target.value)}/></Field>
    <Field label="SEO title"><input value={form.seo_title||""} onChange={e=>u("seo_title",e.target.value)}/></Field>
    <Field label="SEO description"><textarea rows={2} value={form.seo_description||""} onChange={e=>u("seo_description",e.target.value)}/></Field>
    <Field label="Sort order"><input type="number" value={form.sort_order} onChange={e=>u("sort_order",e.target.value)}/></Field>
    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.is_published} onChange={e=>u("is_published",e.target.checked)}/> Published</label>
    <ModalActions busy={busy} close={close} label="Save category"/>
  </form></Modal>;
}

function PromptModal({initial,categories,close,saved}:{initial?:Prompt;categories:Category[];close:()=>void;saved:()=>Promise<void>}){
  const [form,setForm]=useState<any>(initial?{...initial,tags:(initial.tags||[]).join(", ")}:{...emptyPrompt,category_id:categories[0]?.id||""});const [busy,setBusy]=useState(false);
  const u=(k:string,v:any)=>setForm((f:any)=>({...f,[k]:v}));
  async function save(e:FormEvent){e.preventDefault();setBusy(true);const payload={category_id:form.category_id,title:form.title.trim(),slug:slugify(form.slug||form.title),short_description:form.short_description.trim(),prompt_text:form.prompt_text,use_case:form.use_case?.trim()||null,tags:csvTags(form.tags||""),is_published:form.is_published,sort_order:Number(form.sort_order)||0,updated_at:new Date().toISOString()};const q=initial?supabase.from("prompts").update(payload).eq("id",initial.id):supabase.from("prompts").insert(payload);const {error}=await q;if(error)alert(error.message);else await saved();setBusy(false)}
  return <Modal title={initial?"Edit prompt":"New prompt"} close={close}><form onSubmit={save} className="grid gap-4 p-5 sm:grid-cols-2">
    <Field label="Title"><input required value={form.title} onChange={e=>u("title",e.target.value)} onBlur={()=>!initial&&u("slug",slugify(form.title))}/></Field>
    <Field label="Category"><select required value={form.category_id} onChange={e=>u("category_id",e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
    <Field label="Slug"><input required value={form.slug} onChange={e=>u("slug",e.target.value)}/></Field>
    <Field label="Sort order"><input type="number" value={form.sort_order} onChange={e=>u("sort_order",e.target.value)}/></Field>
    <Field label="Short description" full><textarea rows={2} value={form.short_description} onChange={e=>u("short_description",e.target.value)}/></Field>
    <Field label="Prompt text" full><textarea required rows={12} value={form.prompt_text} onChange={e=>u("prompt_text",e.target.value)} className="font-mono text-sm"/></Field>
    <Field label="Use case"><textarea rows={3} value={form.use_case||""} onChange={e=>u("use_case",e.target.value)}/></Field>
    <Field label="Tags (comma separated)"><input value={form.tags} onChange={e=>u("tags",e.target.value)}/></Field>
    <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.is_published} onChange={e=>u("is_published",e.target.checked)}/> Published</label>
    <ModalActions busy={busy} close={close} label="Save prompt"/>
  </form></Modal>;
}
function Field({label,children,full=false}:{label:string;children:ReactNode;full?:boolean}){return <label className={full?"sm:col-span-2 block text-sm font-semibold":"block text-sm font-semibold"}>{label}<span className="mt-1.5 block">{children}</span></label>}
function Modal({title,children,close}:{title:string;children:ReactNode;close:()=>void}){return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"><div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-4"><h2 className="font-black">{title}</h2><button onClick={close} className="rounded-lg p-2 hover:bg-gray-100"><X size={18}/></button></div>{children}</div></div>}
function ModalActions({busy,close,label}:{busy:boolean;close:()=>void;label:string}){return <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={close} className="rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-bold">Cancel</button><button type="submit" disabled={busy} className="rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy?"Saving…":label}</button></div>}

"use client";

import { useCallback, useEffect, useState } from "react";

// Course sales page builder (issue 1, 19 Aug 2026).
//
// Everything on /courses/[slug] below the title is a row here — the pills, the
// sections, and the rows inside "What's included". Defaults included: they can
// be reworded, hidden, reordered and DELETED like anything else, which is the
// whole point. Nothing on that page is hardcoded any more.

type Item = {
    id: string;
    scope: string;
    kind: "pill" | "section" | "included";
    builtin: string | null;
    label: string;
    body: string | null;
    tone: string | null;
    position: number;
    hidden: boolean;
};

const TONES = ["violet", "slate", "green", "amber"] as const;

const GROUPS: { kind: Item["kind"]; title: string; blurb: string }[] = [
    { kind: "pill", title: "Pills", blurb: "The small badges under the course title." },
    { kind: "section", title: "Sections", blurb: "The blocks down the page, in this order." },
    { kind: "included", title: "What's included — rows", blurb: "The ticked list inside the “What's included” section." },
];

// What a built-in row pulls from the course itself. Shown in the UI so an admin
// understands why editing the label of "Course level" does not change the pill.
const BUILTIN_NOTE: Record<string, string> = {
    level: "Shows the course level from the LMS",
    duration: "Shows the course duration from the LMS",
    thumbnail: "Shows the course image from the LMS",
    about: "Shows the course description from the LMS",
    included: "Shows the “What's included” rows below",
};

export default function CoursePageBuilder() {
    const API = process.env.NEXT_PUBLIC_API_URL;
    const token = () => (typeof window === "undefined" ? "" : localStorage.getItem("adminToken"));

    const [items, setItems] = useState<Item[]>([]);
    const [scope, setScope] = useState("*");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState("");

    const load = useCallback(async () => {
        const res = await fetch(`${API}/api/admin/course-page-items`, {
            headers: { Authorization: `Bearer ${token()}` },
        });
        if (res.ok) setItems(await res.json());
    }, [API]);

    useEffect(() => { load(); }, [load]);

    async function call(path: string, init: RequestInit) {
        setBusy(true); setMsg("");
        const res = await fetch(`${API}/api/admin/course-page-items${path}`, {
            ...init,
            headers: {
                Authorization: `Bearer ${token()}`,
                "Content-Type": "application/json",
                ...(init.headers ?? {}),
            },
        });
        const data = await res.json().catch(() => ({}));
        setBusy(false);
        if (!res.ok) { setMsg(data.error ?? "Something went wrong"); return false; }
        await load();
        return true;
    }

    const scopes = Array.from(new Set(["*", ...items.map((i) => i.scope)]));
    const shown = items.filter((i) => i.scope === scope);

    return (
        <div className="p-6 max-w-5xl">
            <h1 className="text-2xl font-bold text-slate-900">Course page</h1>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
                Everything on a course’s sales page below the title. Changes are live immediately.
                Hiding keeps a row for later; deleting removes it for good — including the ones
                that came as defaults.
            </p>

            <div className="mt-5 flex items-center gap-3 flex-wrap">
                <label className="text-sm font-medium text-slate-700">Applies to</label>
                <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                    {scopes.map((sc) => (
                        <option key={sc} value={sc}>{sc === "*" ? "All courses (default)" : sc}</option>
                    ))}
                </select>
                <AddScope onAdd={(sc) => setScope(sc)} />
            </div>
            {scope !== "*" && (
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-2xl">
                    This course overrides the default <em>per group</em>: add one pill here and it
                    replaces <strong>all</strong> the default pills for this course, not just one.
                    Sections and included-rows work the same way.
                </p>
            )}

            {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}

            {GROUPS.map((g) => {
                const rows = shown.filter((i) => i.kind === g.kind).sort((a, b) => a.position - b.position);
                return (
                    <section key={g.kind} className="mt-8">
                        <div className="flex items-baseline justify-between gap-4 flex-wrap">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">{g.title}</h2>
                                <p className="text-sm text-slate-500">{g.blurb}</p>
                            </div>
                            <AddRow kind={g.kind} scope={scope} busy={busy}
                                onCreate={(body) => call("", { method: "POST", body: JSON.stringify(body) })} />
                        </div>

                        {rows.length === 0 && (
                            <p className="mt-3 text-sm text-slate-400 border border-dashed border-slate-200 rounded-xl px-4 py-6 text-center">
                                Nothing here. {scope === "*" ? "This group will not appear on any course page." : "This course falls back to the default."}
                            </p>
                        )}

                        <ul className="mt-3 space-y-2">
                            {rows.map((it, i) => (
                                <Row key={it.id} item={it} first={i === 0} last={i === rows.length - 1} busy={busy}
                                    onSave={(body) => call(`/${it.id}`, { method: "PUT", body: JSON.stringify(body) })}
                                    onDelete={() => call(`/${it.id}`, { method: "DELETE" })}
                                    onMove={(direction) => call(`/${it.id}/move`, { method: "POST", body: JSON.stringify({ direction }) })}
                                />
                            ))}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}

function Row({ item, first, last, busy, onSave, onDelete, onMove }: {
    item: Item; first: boolean; last: boolean; busy: boolean;
    onSave: (b: Partial<Item>) => Promise<boolean>;
    onDelete: () => Promise<boolean>;
    onMove: (d: "up" | "down") => Promise<boolean>;
}) {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState(item.label);
    const [body, setBody] = useState(item.body ?? "");
    const [tone, setTone] = useState(item.tone ?? "slate");

    return (
        <li className={`rounded-xl border border-slate-200 bg-white px-4 py-3 ${item.hidden ? "opacity-60" : ""}`}>
            {editing ? (
                <div className="space-y-3">
                    <input value={label} onChange={(e) => setLabel(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        placeholder={item.kind === "section" ? "Heading" : "Text"} />
                    {item.kind === "section" && !item.builtin && (
                        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            placeholder="Body text. Leave a blank line between paragraphs." />
                    )}
                    {item.kind === "pill" && (
                        <select value={tone} onChange={(e) => setTone(e.target.value)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                    )}
                    <div className="flex gap-2">
                        <button disabled={busy} onClick={async () => { if (await onSave({ label, body, tone })) setEditing(false); }}
                            className="rounded-lg bg-violet-600 text-white px-3 py-1.5 text-sm font-medium disabled:opacity-50">Save</button>
                        <button disabled={busy} onClick={() => setEditing(false)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">Cancel</button>
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-900 text-sm">{item.label}</span>
                            {item.hidden && <span className="text-[10px] uppercase tracking-wide bg-slate-100 text-slate-500 rounded px-1.5 py-0.5">Hidden</span>}
                            {item.builtin && <span className="text-[10px] uppercase tracking-wide bg-violet-50 text-violet-700 rounded px-1.5 py-0.5">Automatic</span>}
                            {item.kind === "pill" && item.tone && <span className="text-[10px] text-slate-400">{item.tone}</span>}
                        </div>
                        {item.builtin && <p className="text-xs text-slate-500 mt-0.5">{BUILTIN_NOTE[item.builtin]}</p>}
                        {item.body && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.body}</p>}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 text-slate-500">
                        <button disabled={busy || first} title="Move up" onClick={() => onMove("up")} className="px-1.5 disabled:opacity-30">↑</button>
                        <button disabled={busy || last} title="Move down" onClick={() => onMove("down")} className="px-1.5 disabled:opacity-30">↓</button>
                        <button disabled={busy} title={item.hidden ? "Show" : "Hide"} onClick={() => onSave({ hidden: !item.hidden })} className="px-1.5 text-xs">{item.hidden ? "Show" : "Hide"}</button>
                        <button disabled={busy} title="Edit" onClick={() => setEditing(true)} className="px-1.5 text-xs">Edit</button>
                        <button disabled={busy} title="Delete"
                            onClick={() => { if (confirm(`Delete “${item.label}”? This cannot be undone.`)) onDelete(); }}
                            className="px-1.5 text-xs text-red-600">Delete</button>
                    </div>
                </div>
            )}
        </li>
    );
}

function AddRow({ kind, scope, busy, onCreate }: {
    kind: Item["kind"]; scope: string; busy: boolean;
    onCreate: (b: Record<string, unknown>) => Promise<boolean>;
}) {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("");
    const [body, setBody] = useState("");
    const [tone, setTone] = useState("slate");

    if (!open) {
        return <button onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium">+ Add</button>;
    }
    return (
        <div className="w-full mt-3 rounded-xl border border-violet-200 bg-violet-50/40 p-4 space-y-3">
            <input value={label} onChange={(e) => setLabel(e.target.value)} autoFocus
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder={kind === "section" ? "Section heading, e.g. Mentors" : "Text"} />
            {kind === "section" && (
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Body text. Leave a blank line between paragraphs." />
            )}
            {kind === "pill" && (
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                    {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
            )}
            <div className="flex gap-2">
                <button disabled={busy || !label.trim()}
                    onClick={async () => {
                        const ok = await onCreate({ kind, scope, label, body: kind === "section" ? body : undefined, tone: kind === "pill" ? tone : undefined });
                        if (ok) { setOpen(false); setLabel(""); setBody(""); }
                    }}
                    className="rounded-lg bg-violet-600 text-white px-3 py-1.5 text-sm font-medium disabled:opacity-50">Add</button>
                <button onClick={() => setOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm">Cancel</button>
            </div>
        </div>
    );
}

function AddScope({ onAdd }: { onAdd: (slug: string) => void }) {
    const [slug, setSlug] = useState("");
    return (
        <div className="flex items-center gap-2">
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="course-slug"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm w-44" />
            <button disabled={!slug.trim()} onClick={() => { onAdd(slug.trim()); setSlug(""); }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40">
                Customise one course
            </button>
        </div>
    );
}

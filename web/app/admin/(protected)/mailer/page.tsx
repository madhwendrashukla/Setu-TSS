"use client";
import { useState, useRef } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SAMPLE_RECIPIENTS = `[
  { "email": "founder@startup.com", "name": "Rahul Sharma" },
  { "email": "ceo@company.in", "name": "Priya Mehta" },
  { "email": "hello@startup.io", "name": "Vikram Singh" }
]`;

interface SendResult {
    email: string;
    name: string;
    status: "pending" | "sent" | "failed";
    error?: string;
}

export default function AdminMailer() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [recipientsJson, setRecipientsJson] = useState("");
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [results, setResults] = useState<SendResult[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [summary, setSummary] = useState<{ sent: number; failed: number; errors: string[] } | null>(null);
    const [activeTab, setActiveTab] = useState<"compose" | "results">("compose");

    const parsedRecipients = (): { email: string; name: string }[] | null => {
        if (!recipientsJson.trim()) return null;
        try {
            const parsed = JSON.parse(recipientsJson);
            if (!Array.isArray(parsed)) {
                setJsonError("JSON must be an array.");
                return null;
            }
            const invalid = parsed.findIndex(r => !r.email);
            if (invalid >= 0) {
                setJsonError(`Item at index ${invalid} is missing "email" field.`);
                return null;
            }
            setJsonError(null);
            return parsed;
        } catch (e: any) {
            setJsonError(`Invalid JSON: ${e.message}`);
            return null;
        }
    };

    const handleSendAll = async () => {
        const recipients = parsedRecipients();
        if (!recipients) return;
        if (!subject.trim()) { alert("Please enter a subject."); return; }
        if (!message.trim()) { alert("Please enter a message."); return; }
        if (!confirm(`Send to ${recipients.length} recipient${recipients.length !== 1 ? "s" : ""}?`)) return;

        setIsSending(true);
        setSummary(null);
        setResults(recipients.map(r => ({ ...r, status: "pending" })));
        setActiveTab("results");

        try {
            const res = await fetch(`${API}/api/admin/mailer/send-bulk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({ subject, message, recipients }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send");

            // Update results from response
            setResults(prev => prev.map(r => {
                const failed = data.errors?.find((e: string) => e.startsWith(r.email));
                return { ...r, status: failed ? "failed" : "sent", error: failed };
            }));
            setSummary({ sent: data.sent, failed: data.failed, errors: data.errors || [] });
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleSendOne = async (recipient: { email: string; name: string }, idx: number) => {
        if (!subject.trim() || !message.trim()) {
            alert("Please fill subject and message first.");
            return;
        }
        setResults(prev => {
            const next = [...prev];
            next[idx] = { ...next[idx], status: "pending" };
            return next;
        });
        try {
            const res = await fetch(`${API}/api/admin/mailer/send-one`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("adminToken")}`,
                },
                body: JSON.stringify({ subject, message, email: recipient.email, name: recipient.name }),
            });
            const data = await res.json();
            setResults(prev => {
                const next = [...prev];
                next[idx] = { ...next[idx], status: res.ok ? "sent" : "failed", error: res.ok ? undefined : data.error };
                return next;
            });
        } catch (err: any) {
            setResults(prev => {
                const next = [...prev];
                next[idx] = { ...next[idx], status: "failed", error: err.message };
                return next;
            });
        }
    };

    const recipientCount = (() => {
        try { const p = JSON.parse(recipientsJson); return Array.isArray(p) ? p.length : 0; } catch { return 0; }
    })();

    const statusIcon = (s: SendResult["status"]) =>
        s === "sent" ? <i className="fas fa-check-circle text-green-500" /> :
        s === "failed" ? <i className="fas fa-times-circle text-red-500" /> :
        <i className="fas fa-clock text-yellow-400 animate-pulse" />;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mass Mailer</h1>
                    <p className="text-gray-500 text-sm mt-1">Send personalized emails to a list of recipients</p>
                </div>
                {results.length > 0 && summary && (
                    <div className="flex gap-3">
                        <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                            <i className="fas fa-check-circle" /> {summary.sent} Sent
                        </span>
                        {summary.failed > 0 && (
                            <span className="flex items-center gap-1.5 text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                                <i className="fas fa-times-circle" /> {summary.failed} Failed
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
                {(["compose", "results"] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                            activeTab === tab
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        {tab === "results" ? `Results ${results.length > 0 ? `(${results.length})` : ""}` : "Compose"}
                    </button>
                ))}
            </div>

            {activeTab === "compose" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Compose */}
                    <div className="space-y-5">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fas fa-pen-to-square text-purple-500" /> Email Content
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        placeholder="e.g. Join us for The Startup School Workshop!"
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                        Message
                                        <span className="ml-2 text-purple-400 normal-case font-normal">
                                            — use <code className="bg-purple-50 px-1 rounded">{"{{name}}"}</code> for personalization
                                        </span>
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder={`Hi {{name}},\n\nWe're thrilled to invite you to...\n\nBest regards,\nThe Startup School Team`}
                                        rows={10}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none font-mono"
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">HTML is supported. Use {"{{name}}"} and {"{{email}}"} as placeholders.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Recipients */}
                    <div className="space-y-5">
                        <div className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <i className="fas fa-users text-purple-500" /> Recipients JSON
                                </h2>
                                {recipientCount > 0 && (
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                                        {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            <textarea
                                value={recipientsJson}
                                onChange={e => { setRecipientsJson(e.target.value); setJsonError(null); }}
                                placeholder={SAMPLE_RECIPIENTS}
                                rows={14}
                                className={`w-full border rounded-xl px-4 py-3 text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 transition-all resize-none ${
                                    jsonError
                                        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50"
                                        : "border-gray-200 focus:border-purple-400 focus:ring-purple-100"
                                }`}
                            />

                            {jsonError && (
                                <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5">
                                    <i className="fas fa-exclamation-circle" /> {jsonError}
                                </p>
                            )}

                            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sample Structure</p>
                                <pre className="text-xs text-gray-600 whitespace-pre-wrap">{SAMPLE_RECIPIENTS}</pre>
                            </div>
                        </div>

                        <button
                            onClick={handleSendAll}
                            disabled={isSending || !!jsonError || recipientCount === 0 || !subject || !message}
                            className="w-full relative group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-60 group-hover:opacity-100 disabled:opacity-20 transition duration-300" />
                            <div className="relative flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl disabled:opacity-60">
                                {isSending ? (
                                    <><i className="fas fa-circle-notch fa-spin" /> Sending...</>
                                ) : (
                                    <><i className="fas fa-paper-plane" /> Send to {recipientCount || 0} Recipient{recipientCount !== 1 ? "s" : ""}</>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "results" && (
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    {results.length === 0 ? (
                        <div className="p-16 text-center text-gray-400">
                            <i className="fas fa-inbox text-4xl mb-4 block opacity-30" />
                            <p className="font-medium">No send results yet.</p>
                            <p className="text-sm mt-1">Compose and send to see results here.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-bold">Recipient</th>
                                    <th className="p-4 font-bold">Email</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((r, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-semibold text-gray-900">{r.name || "—"}</td>
                                        <td className="p-4 text-gray-500 text-sm">{r.email}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                                                r.status === "sent" ? "bg-green-50 text-green-600 border border-green-200" :
                                                r.status === "failed" ? "bg-red-50 text-red-600 border border-red-200" :
                                                "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                            }`}>
                                                {statusIcon(r.status)}
                                                {r.status === "pending" ? "Pending" : r.status === "sent" ? "Sent" : "Failed"}
                                            </span>
                                            {r.error && <p className="text-xs text-red-400 mt-1 max-w-xs truncate" title={r.error}>{r.error}</p>}
                                        </td>
                                        <td className="p-4">
                                            {r.status !== "sent" && (
                                                <button
                                                    onClick={() => handleSendOne(r, idx)}
                                                    className="text-xs font-bold text-purple-600 hover:text-purple-800 border border-purple-200 hover:border-purple-400 px-3 py-1.5 rounded-lg transition-all"
                                                >
                                                    {r.status === "failed" ? "Retry" : "Send"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}

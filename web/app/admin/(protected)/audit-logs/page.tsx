"use client";
import { useState, useEffect, useCallback } from "react";

interface LoginLog {
    id: string;
    email: string;
    status: "SUCCESS" | "FAILED";
    ip_address: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    device_type: string | null;
    os: string | null;
    browser: string | null;
    user_agent: string | null;
    failure_reason: string | null;
    created_at: string;
}

interface LogStats {
    totalAttempts: number;
    successfulCount: number;
    failedCount: number;
    lastLoginTime: string | null;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<LoginLog[]>([]);
    const [stats, setStats] = useState<LogStats>({
        totalAttempts: 0,
        successfulCount: 0,
        failedCount: 0,
        lastLoginTime: null,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | "SUCCESS" | "FAILED">("ALL");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const [copiedIp, setCopiedIp] = useState<string | null>(null);
    const [showClearModal, setShowClearModal] = useState(false);
    const [isClearing, setIsClearing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchLogs = useCallback(async (isSilent = false) => {
        if (!isSilent) setIsLoading(true);
        else setIsRefreshing(true);

        try {
            const token = localStorage.getItem("adminToken");
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "25",
                status: statusFilter,
                search: search.trim(),
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/login-logs?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs || []);
                setTotalPages(data.totalPages || 1);
                setTotalLogs(data.total || 0);
                if (data.stats) {
                    setStats(data.stats);
                }
            }
        } catch (error) {
            console.error("Failed to fetch login logs:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [page, statusFilter, search]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleCopyIp = (ip: string) => {
        navigator.clipboard.writeText(ip);
        setCopiedIp(ip);
        setTimeout(() => setCopiedIp(null), 2000);
    };

    const handleDeleteLog = async (id: string) => {
        setDeletingId(id);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/login-logs/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setLogs((prev) => prev.filter((item) => item.id !== id));
                setTotalLogs((prev) => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("Failed to delete log:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearAll = async () => {
        setIsClearing(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/login-logs`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.ok) {
                setLogs([]);
                setTotalLogs(0);
                setStats({
                    totalAttempts: 0,
                    successfulCount: 0,
                    failedCount: 0,
                    lastLoginTime: null,
                });
                setShowClearModal(false);
            }
        } catch (err) {
            console.error("Failed to clear logs:", err);
        } finally {
            setIsClearing(false);
        }
    };

    const getDeviceIcon = (deviceType: string | null, os: string | null) => {
        const d = (deviceType || "").toLowerCase();
        const o = (os || "").toLowerCase();

        if (d.includes("mac") || o.includes("mac") || d.includes("iphone") || d.includes("ipad") || o.includes("ios")) {
            return "fa-brands fa-apple text-slate-700";
        }
        if (d.includes("windows") || o.includes("windows")) {
            return "fa-brands fa-windows text-blue-500";
        }
        if (d.includes("android") || o.includes("android")) {
            return "fa-brands fa-android text-emerald-500";
        }
        if (d.includes("linux") || o.includes("linux")) {
            return "fa-brands fa-linux text-amber-500";
        }
        if (d.includes("mobile") || d.includes("phone")) {
            return "fa-solid fa-mobile-screen text-indigo-500";
        }
        if (d.includes("tablet")) {
            return "fa-solid fa-tablet-screen-button text-purple-500";
        }
        return "fa-solid fa-laptop text-slate-600";
    };

    const getBrowserIcon = (browser: string | null) => {
        const b = (browser || "").toLowerCase();
        if (b.includes("chrome")) return "fa-brands fa-chrome text-amber-500";
        if (b.includes("firefox")) return "fa-brands fa-firefox-browser text-orange-500";
        if (b.includes("safari")) return "fa-brands fa-safari text-blue-400";
        if (b.includes("edge")) return "fa-brands fa-edge text-cyan-600";
        if (b.includes("opera")) return "fa-brands fa-opera text-red-500";
        if (b.includes("brave")) return "fa-solid fa-shield-halved text-orange-600";
        return "fa-solid fa-globe text-slate-400";
    };

    const formatLogDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });
        } catch {
            return dateStr;
        }
    };

    const getRelativeTime = (dateStr: string) => {
        try {
            const now = new Date().getTime();
            const past = new Date(dateStr).getTime();
            const diffSec = Math.floor((now - past) / 1000);

            if (diffSec < 60) return "Just now";
            const diffMin = Math.floor(diffSec / 60);
            if (diffMin < 60) return `${diffMin}m ago`;
            const diffHr = Math.floor(diffMin / 60);
            if (diffHr < 24) return `${diffHr}h ago`;
            const diffDays = Math.floor(diffHr / 24);
            return `${diffDays}d ago`;
        } catch {
            return "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            <i className="fa-solid fa-shield-halved text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Login Activity & Audit Logs</h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Real-time monitoring of admin authentication attempts, IPs, geolocations, and devices.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                        onClick={() => fetchLogs(true)}
                        disabled={isLoading || isRefreshing}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 text-sm font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-60"
                        title="Refresh logs"
                    >
                        <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? "animate-spin text-purple-600" : ""}`}></i>
                        <span>Refresh</span>
                    </button>

                    {logs.length > 0 && (
                        <button
                            onClick={() => setShowClearModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-semibold transition-all active:scale-95"
                        >
                            <i className="fa-regular fa-trash-can"></i>
                            <span>Clear All</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xl shrink-0">
                        <i className="fa-solid fa-fingerprint"></i>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Attempts</span>
                        <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalAttempts.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xl shrink-0">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Successful Logins</span>
                        <div className="text-2xl font-black text-emerald-600 mt-0.5">{stats.successfulCount.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-xl shrink-0">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Failed / Blocked</span>
                        <div className="text-2xl font-black text-rose-600 mt-0.5">{stats.failedCount.toLocaleString()}</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-xl shrink-0">
                        <i className="fa-regular fa-clock"></i>
                    </div>
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Successful Login</span>
                        <div className="text-sm font-bold text-slate-900 mt-0.5">
                            {stats.lastLoginTime ? getRelativeTime(stats.lastLoginTime) : "No activity"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search by IP, Email, City, Device, OS, Browser..."
                        className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                    />
                    {search && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setPage(1);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <i className="fa-solid fa-xmark text-sm"></i>
                        </button>
                    )}
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start md:self-auto">
                    <button
                        onClick={() => {
                            setStatusFilter("ALL");
                            setPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        All ({stats.totalAttempts})
                    </button>
                    <button
                        onClick={() => {
                            setStatusFilter("SUCCESS");
                            setPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            statusFilter === "SUCCESS"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-emerald-700 hover:text-emerald-800"
                        }`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                        Success ({stats.successfulCount})
                    </button>
                    <button
                        onClick={() => {
                            setStatusFilter("FAILED");
                            setPage(1);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            statusFilter === "FAILED"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-rose-700 hover:text-rose-800"
                        }`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                        Failed ({stats.failedCount})
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading Login Logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-16 text-center space-y-3">
                        <div className="h-14 w-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 text-2xl mx-auto">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>
                        <h3 className="text-base font-bold text-slate-800">No Login Activity Found</h3>
                        <p className="text-sm text-slate-500 max-w-sm mx-auto">
                            {search || statusFilter !== "ALL"
                                ? "No audit records matched your search query or filter."
                                : "No login records have been captured yet. Future login attempts will appear here automatically."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                    <th className="py-3.5 px-4 sm:px-6">Status</th>
                                    <th className="py-3.5 px-4 sm:px-6">Email / Account</th>
                                    <th className="py-3.5 px-4 sm:px-6">IP & Geolocation</th>
                                    <th className="py-3.5 px-4 sm:px-6">Device & System Type</th>
                                    <th className="py-3.5 px-4 sm:px-6">Browser</th>
                                    <th className="py-3.5 px-4 sm:px-6">Date & Time</th>
                                    <th className="py-3.5 px-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium">
                                {logs.map((log) => {
                                    const isSuccess = log.status === "SUCCESS";
                                    const locationStr = [log.city, log.region, log.country].filter(Boolean).join(", ") || "Unknown Location";

                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                                            {/* Status Badge */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                {isSuccess ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                        SUCCESS
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200/70">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                                                        FAILED
                                                    </span>
                                                )}
                                            </td>

                                            {/* Email & Failure details */}
                                            <td className="py-4 px-4 sm:px-6">
                                                <div className="font-bold text-slate-900">{log.email}</div>
                                                {log.failure_reason && (
                                                    <div className="text-[11px] text-rose-600 mt-0.5 font-semibold flex items-center gap-1">
                                                        <i className="fa-solid fa-circle-exclamation text-[10px]"></i>
                                                        <span>{log.failure_reason}</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* IP Address & Location */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold select-all">
                                                        {log.ip_address || "Unknown IP"}
                                                    </span>
                                                    {log.ip_address && (
                                                        <button
                                                            onClick={() => handleCopyIp(log.ip_address!)}
                                                            className="text-slate-400 hover:text-purple-600 transition-colors"
                                                            title="Copy IP"
                                                        >
                                                            {copiedIp === log.ip_address ? (
                                                                <i className="fa-solid fa-check text-emerald-600 text-xs"></i>
                                                            ) : (
                                                                <i className="fa-regular fa-copy text-xs"></i>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <i className="fa-solid fa-location-dot text-rose-400 text-[10px]"></i>
                                                    <span>{locationStr}</span>
                                                </div>
                                            </td>

                                            {/* Device & System Type (Laptop, Android, Mac, Windows, etc.) */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 font-bold text-slate-800">
                                                    <i className={`${getDeviceIcon(log.device_type, log.os)} text-base`}></i>
                                                    <span>{log.device_type || "Desktop / Laptop"}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5 pl-6">
                                                    {log.os || "Unknown OS"}
                                                </div>
                                            </td>

                                            {/* Browser */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-800">
                                                    <i className={`${getBrowserIcon(log.browser)} text-base`}></i>
                                                    <span className="font-medium">{log.browser || "Unknown Browser"}</span>
                                                </div>
                                            </td>

                                            {/* Date & Time */}
                                            <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                                <div className="text-xs font-bold text-slate-800">{formatLogDate(log.created_at)}</div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">{getRelativeTime(log.created_at)}</div>
                                            </td>

                                            {/* Action */}
                                            <td className="py-4 px-4 text-center whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    disabled={deletingId === log.id}
                                                    className="text-slate-300 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors disabled:opacity-40"
                                                    title="Delete this record"
                                                >
                                                    {deletingId === log.id ? (
                                                        <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>
                                                    ) : (
                                                        <i className="fa-regular fa-trash-can text-sm"></i>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
                        <div>
                            Showing page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({totalLogs} total entries)
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold transition-all disabled:opacity-40"
                            >
                                <i className="fa-solid fa-chevron-left mr-1"></i> Prev
                            </button>
                            <span className="px-2 font-bold text-slate-900">{page}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 font-semibold transition-all disabled:opacity-40"
                            >
                                Next <i className="fa-solid fa-chevron-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Clear All Confirmation Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="h-12 w-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
                            <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Clear All Audit Logs?</h3>
                            <p className="text-sm text-slate-500 mt-1">
                                This will permanently delete all recorded admin authentication history. This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setShowClearModal(false)}
                                disabled={isClearing}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-slate-700 text-sm font-semibold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAll}
                                disabled={isClearing}
                                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-all shadow-md shadow-rose-600/20 disabled:opacity-60 flex items-center gap-2"
                            >
                                {isClearing ? (
                                    <>
                                        <i className="fa-solid fa-circle-notch fa-spin"></i> Clearing...
                                    </>
                                ) : (
                                    "Yes, Clear History"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

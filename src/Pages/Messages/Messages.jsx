import React, { useEffect, useState } from "react";
import "./Messages.css";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchMessages = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await fetch(
        "https://mohammed229.pythonanywhere.com/main/messages/"
      );

      let data;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = [{ id: "raw", user_name: "server", user_email: "", message: text }];
        }
      }

      if (Array.isArray(data)) setMessages(data);
      else if (data && Array.isArray(data.results)) setMessages(data.results);
      else if (typeof data === "object") {
        const arr = Object.keys(data).map((k) => ({ id: k, ...data[k] }));
        setMessages(arr);
      } else setMessages([]);
    } catch (err) {
      console.error("fetch messages error:", err);
      setFetchError("تعذر جلب الرسائل. تفقد السيرفر أو اتصال الشبكة.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    const name = (m.user_name || "").toLowerCase();
    const email = (m.user_email || "").toLowerCase();
    const msg = (m.message || "").toLowerCase();
    return name.includes(q) || email.includes(q) || msg.includes(q);
  });

  const handleDelete = async (id) => {
    if (!id) return;
    // optional confirm
    const ok = window.confirm("أكيد تريد تحذف هالرسالة؟ العملية ما بتنرجع.");
    if (!ok) return;

    // إضافة حالة حذف
    setDeletingIds((s) => new Set(s).add(id));

    try {
      const url = `https://mohammed229.pythonanywhere.com/main/delete_message/${id}/`;
      const res = await fetch(url, { method: "DELETE" });

      if (!res.ok) {
        // حاول قراءة نص الخطأ لو موجود
        let text = "";
        try {
          text = await res.text();
        } catch {}
        throw new Error(`فشل الحذف: ${res.status} ${res.statusText} ${text}`);
      }

      // إزالة الرسالة من الواجهة (optimistic)
      setMessages((prev) => prev.filter((m) => String(m.id) !== String(id)));
    } catch (err) {
      console.error("delete message error:", err);
      alert(
        "صارت مشكلة أثناء الحذف. تأكد من السيرفر أو جرب تحديث الصفحة. (تفاصيل في الكونسول)."
      );
    } finally {
      // إزالة حالة الحذف
      setDeletingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="messages-page">
      <header className="mp-header">
        <h1>📩 رسائل العملاء</h1>
        <div className="header-actions">
          <input
            className="search"
            placeholder="ابحث بالاسم أو البريد أو الرسالة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn small" onClick={fetchMessages} disabled={loading}>
            {loading ? "جارٍ التحديث..." : "تحديث"}
          </button>
        </div>
      </header>

      <main className="mp-main">
        <div className="list-card">
          {fetchError && <div className="fetch-error">{fetchError}</div>}
          {!fetchError && loading && <div className="loading">جارٍ التحميل...</div>}
          {!loading && filtered.length === 0 && (
            <div className="empty">لا يوجد رسائل حالياً.</div>
          )}

          <ul className="messages-list">
            {filtered.map((m, idx) => {
              const id = m.id ?? idx;
              const isDeleting = deletingIds.has(String(id)) || deletingIds.has(id);
              return (
                <li key={id} className="message-item">
                  <div className="meta">
                    <div className="left-meta">
                      <strong className="name">{m.user_name || "مجهول"}</strong>
                      <span className="email">{m.user_email || "—"}</span>
                    </div>

                    <div className="right-meta">
                      {m.created && <span className="date">{m.created}</span>}
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                        title="حذف الرسالة"
                      >
                        {isDeleting ? "جارٍ الحذف..." : "حذف"}
                      </button>
                    </div>
                  </div>

                  <div className="body">{m.message ?? (m.text || "")}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}

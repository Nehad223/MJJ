// DashboardWorks.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardWorks.css";

export default function DashboardWorks() {
  const navigate = useNavigate();

  const [works, setWorks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- حالة مودال تغيير كلمة السر ---
  const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState(null);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    type: "image",
    fileData: null,
    url: "",
    imageFile: null,
    videoFile: null,
    _tempObjectUrl: null,
  });

  // --- اضبط الروابط حسب الباك عندك ---
  const endpointList = "https://mohammed229.pythonanywhere.com/main/services/"; // GET
  const endpointAdd = "https://render-project1-qyk2.onrender.com/exercises/add-service-with-video/"; // POST (multipart)
  const endpointDeleteBase = "https://mohammed229.pythonanywhere.com/main/delete_service/"; // DELETE base (append id)
  // رابط تغيير كلمة السر — حسب المثال اللي عطيت: change-password
  const endpointChangePassword = "https://mohammed229.pythonanywhere.com/main/change-password/"; // POST { email, old_password, new_password, new_password_confirm }
  // ------------------------------------------------

  async function fetchWorks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpointList, { method: "GET" });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} ${txt ? "- "+txt : ""}`);
      }
      const data = await res.json();
      const array = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
      const normalized = array.map((it) => ({
        id: it.id || it._id || `${Math.random().toString(36).slice(2, 9)}`,
        title: it.name || it.title || "",
        date: it.date || it.created_at || "",
        description: it.content || it.description || "",
        type:
          it.type ||
          (it.url && /\.(mp4|webm|ogg)$/i.test(it.url) ? "video" : "image"),
        fileData: null,
        url: it.url || it.image_url || null,
        raw: it,
      }));
      setWorks(normalized);
    } catch (err) {
      console.error("fetchWorks error:", err);
      setError(err.message || "Error fetching works");
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWorks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (form._tempObjectUrl) {
        try { URL.revokeObjectURL(form._tempObjectUrl); } catch (e) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    if (form._tempObjectUrl) {
      try { URL.revokeObjectURL(form._tempObjectUrl); } catch (e) {}
    }
    setForm({
      title: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      type: "image",
      fileData: null,
      url: "",
      imageFile: null,
      videoFile: null,
      _tempObjectUrl: null,
    });
    setIsOpen(true);
  }

  async function handleDelete(id) {
    if (!confirm("بدك تحذف هالعمل؟ العملية ما بتنرجع")) return;

    try {
      let url;
      if (endpointDeleteBase.endsWith("/")) {
        url = `${endpointDeleteBase}${id}/`;
      } else {
        url = `${endpointDeleteBase}/${id}/`;
      }

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (res.status === 204) {
        await fetchWorks();
        alert("تم الحذف بنجاح");
        return;
      }

      const text = await res.text().catch(() => "");
      let ok = res.ok;
      try {
        const j = JSON.parse(text || "{}");
        if (typeof j.success !== "undefined") ok = !!j.success;
      } catch (e) {}

      if (!ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText} ${text ? "- " + text : ""}`);
      }

      await fetchWorks();
      alert("تم الحذف بنجاح");
    } catch (err) {
      console.error("delete error:", err);
      alert("خطأ أثناء الحذف: " + (err.message || ""));
    }
  }

  function handleImageChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return setForm((s) => ({ ...s, imageFile: null, fileData: null }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((s) => ({ ...s, imageFile: f, fileData: ev.target.result }));
    };
    reader.readAsDataURL(f);
  }

  function handleVideoChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return setForm((s) => ({ ...s, videoFile: null, fileData: null }));
    const objectUrl = URL.createObjectURL(f);
    if (form._tempObjectUrl) {
      try { URL.revokeObjectURL(form._tempObjectUrl); } catch (e) {}
    }
    setForm((s) => ({ ...s, videoFile: f, fileData: objectUrl, _tempObjectUrl: objectUrl }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("المطلوب: عنوان العمل");
    if (!form.description.trim()) return alert("المطلوب: شرح عن العمل");
    submitCreate();
  }

  function submitCreate() {
    const fd = new FormData();
    fd.append("name", form.title);
    fd.append("content", form.description);
    fd.append("date", form.date || new Date().toISOString().slice(0, 10));
    if (form.imageFile) fd.append("image", form.imageFile);
    if (form.videoFile) fd.append("video", form.videoFile);
    if (!form.imageFile && !form.videoFile && form.url) {
      fd.append("url", form.url);
    }

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpointAdd);

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const p = Math.round((event.loaded / event.total) * 100);
        setProgress(p);
      }
    };

    xhr.onload = async function () {
      setUploading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          await fetchWorks();
          setIsOpen(false);
          cleanupFormAndInputs();
          alert("انضاف العمل بنجاح");
        } catch (err) {
          console.warn("fetch after add failed", err);
          alert("انضاف العمل (جزئياً) — حدث خطأ عند تحديث القائمة.");
        }
      } else {
        alert(`خطأ من السيرفر: ${xhr.status} ${xhr.statusText}\n${xhr.responseText || ""}`);
      }
    };

    xhr.onerror = function () {
      setUploading(false);
      setProgress(0);
      alert("صارت مشكلة خلال الاتصال بالسيرفر. شيك الـ CORS أو الشبكة.");
    };

    xhr.send(fd);
  }

  function cleanupFormAndInputs() {
    if (form._tempObjectUrl) {
      try {
        URL.revokeObjectURL(form._tempObjectUrl);
      } catch (e) {}
    }
    setForm({
      title: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      type: "image",
      fileData: null,
      url: "",
      imageFile: null,
      videoFile: null,
      _tempObjectUrl: null,
    });
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  }

  // --- وظائف تغيير كلمة السر ---
  function openChangePwd() {
    setPwdForm({ current: "", newPwd: "", confirm: "" });
    setChangeError(null);
    setIsChangePwdOpen(true);
  }

  async function submitChangePassword(e) {
    e.preventDefault();
    setChangeError(null);

    if (!pwdForm.current.trim() || !pwdForm.newPwd.trim() || !pwdForm.confirm.trim()) {
      return setChangeError("مطلوب تعبئة كل الحقول");
    }
    if (pwdForm.newPwd !== pwdForm.confirm) return setChangeError("كلمتا المرور الجديدتين مش متطابقتين");
    if (pwdForm.newPwd.length < 6) return setChangeError("كلمة المرور لازم تكون 6 أحرف على الأقل");

    setChangeLoading(true);
    try {
      // الحصول على الإيميل من sessionStorage (جلسة)
      const email = sessionStorage.getItem("adminEmail") || "";

      const payload = {
        email,
        old_password: pwdForm.current,
        new_password: pwdForm.newPwd,
        new_password_confirm: pwdForm.confirm,
      };

      const res = await fetch(endpointChangePassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // لو تستخدم توكن:
          // "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(payload),
      });

      const txt = await res.text().catch(() => "");
      let json = {};
      try { json = JSON.parse(txt || "{}"); } catch (e) {}

      if (res.status === 401) {
        throw new Error(json.message || "كلمة السر الحالية غير صحيحة");
      }

      const ok = res.ok || (typeof json.success !== "undefined" ? !!json.success : false);

      if (!ok) {
        const serverMsg = (json.message || json.error || txt || "").toString();
        if (serverMsg) throw new Error(serverMsg);
        throw new Error(`خطأ من السيرفر: ${res.status} ${res.statusText}`);
      }

      alert("تم تغيير كلمة السر بنجاح");
      setIsChangePwdOpen(false);
      // اختياري: تسجّل الخروج بعد تغيير كلمة السر
      // handleLogout();
    } catch (err) {
      console.error("change password error:", err);
      const msg = (err && err.message) ? err.message : "خطأ أثناء تغيير كلمة السر";
      setChangeError(msg);
    } finally {
      setChangeLoading(false);
    }
  }

  // --- زر خروج (ينظف الجلسة) ---
  function handleLogout() {
    sessionStorage.removeItem("isAuth");
    sessionStorage.removeItem("adminEmail");
    sessionStorage.removeItem("token"); // لو مخزن توكن
    navigate("/auth");
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>لوحة تحكم معرض الأعمال</h1>
        <div className="header-actions">
          <button onClick={openAdd} className="btn btn-primary" aria-label="إضافة عمل جديد">
            <span className="icon">＋</span>
            <span>إضافة عمل جديد</span>
          </button>

          <button
            onClick={() => navigate("/messages")}
            className="btn btn-primary btn-messages"
            title="صفحة الرسائل"
            aria-label="الرسائل"
          >
            <span className="icon">✉️</span>
            <span>الرسائل</span>
          </button>

          <button
            onClick={openChangePwd}
            className="btn btn-primary btn-change-pwd"
            title="تغيير كلمة السر"
            aria-label="تغيير كلمة السر"
          >
            <span className="icon">🔒</span>
            <span>تغيير كلمة السر</span>
          </button>

          <button onClick={handleLogout} className="btn btn-secondary" title="تسجيل الخروج" aria-label="تسجيل الخروج">
            <span className="icon">⎋</span>
            <span>خروج</span>
          </button>
        </div>
      </div>

      {loading && <div className="loading">جاري جلب البيانات...</div>}
      {error && <div className="error">خطأ: {error}</div>}

      <div className="works-grid">
        {works.map((w) => (
          <div key={w.id} className="work-card">
            <div className="media">
              {w.type === "video" ? (
                <video controls>
                  <source src={w.url || w.fileData} />
                  متصفحك لا يدعم الفيديو
                </video>
              ) : (
                <img src={w.url || w.fileData} alt={w.title} />
              )}
            </div>

            <div className="info">
              <h2 className="work-title">{w.title}</h2>
              <p className="date">{w.date}</p>
              <p className="desc">{w.description}</p>
              <div className="actions">
                <button onClick={() => handleDelete(w.id)} className="btn btn-danger">حذف</button>
              </div>
            </div>
          </div>
        ))}

        {!loading && works.length === 0 && <div className="empty">لا يوجد أعمال لعرضها.</div>}
      </div>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>إضافة عمل جديد</h3>
              <button onClick={() => { setIsOpen(false); }} className="close">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="form">
              <label>العنوان</label>
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />

              <label>التاريخ</label>
              <input type="date" value={form.date} onChange={(e) => setForm((s) => ({ ...s, date: e.target.value }))} />

              <label>الشرح</label>
              <textarea value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}></textarea>

              <label>نوع الوسيط</label>
              <select value={form.type} onChange={(e) => setForm((s) => ({ ...s, type: e.target.value }))}>
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
              </select>

              <label>ارفع صورة (اختياري)</label>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} />

              <label>ارفع فيديو (اختياري)</label>
              <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoChange} />

              <label>أو رابط مباشر للصورة/الفيديو</label>
              <input value={form.url} onChange={(e) => setForm((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." />

              <div className="preview">
                {form.fileData || form.url ? (
                  form.type === "video" ? (
                    <video controls>
                      <source src={form.fileData || form.url} />
                    </video>
                  ) : (
                    <img src={form.fileData || form.url} alt="preview" />
                  )
                ) : (
                  <span>  لا يوجد معاينة</span>
                )}
              </div>

              {uploading && (
                <div className="upload-progress">
                  <div className="upload-text">جارٍ الرفع: {progress}%</div>
                  <div className="bar">
                    <div className="bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => { setIsOpen(false); }} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={uploading}>إضافة العمل</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مودال تغيير كلمة السر */}
      {isChangePwdOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>تغيير كلمة السر</h3>
              <button onClick={() => { setIsChangePwdOpen(false); }} className="close">✕</button>
            </div>

            <form onSubmit={submitChangePassword} className="form">
              <label>كلمة السر الحالية</label>
              <input type="password" value={pwdForm.current} onChange={(e) => setPwdForm((s) => ({ ...s, current: e.target.value }))} />

              <label>كلمة السر الجديدة</label>
              <input type="password" value={pwdForm.newPwd} onChange={(e) => setPwdForm((s) => ({ ...s, newPwd: e.target.value }))} />

              <label>تأكيد كلمة السر الجديدة</label>
              <input type="password" value={pwdForm.confirm} onChange={(e) => setPwdForm((s) => ({ ...s, confirm: e.target.value }))} />

              {changeError && <div className="error">{changeError}</div>}

              <div className="form-actions">
                <button type="button" onClick={() => setIsChangePwdOpen(false)} className="btn btn-secondary">إلغاء</button>
                <button type="submit" className="btn btn-primary" disabled={changeLoading}>{changeLoading ? 'جاري التغيير...' : 'تغيير كلمة السر'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

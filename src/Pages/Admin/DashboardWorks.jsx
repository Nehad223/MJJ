import React, { useEffect, useState, useRef } from "react";
import "./DashboardWorks.css";

export default function DashboardWorks() {
  const [works, setWorks] = useState(() => {
    try {
      const raw = localStorage.getItem("works_dashboard_v1");
      return raw ? JSON.parse(raw) : sampleData();
    } catch (e) {
      return sampleData();
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [form, setForm] = useState({
    title: "",
    date: "",
    description: "",
    type: "image",
    fileData: null,   // data-uri للمعاينة (صورة)
    url: "",
    imageFile: null,  // File object للصورة
    videoFile: null,  // File object للفيديو
  });

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("works_dashboard_v1", JSON.stringify(works));
  }, [works]);

  function sampleData() {
    return [
      {
        id: "w-1",
        title: "تصميم واجهة متجر إلكتروني",
        date: "2025-09-01",
        description: "واجهة بسيطة وسريعة للموبايل والديسك توب.",
        type: "image",
        fileData: null,
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=60",
      },
      {
        id: "w-2",
        title: "فيديو شرح منتج",
        date: "2025-08-10",
        description: "فيديو قصير يقدم مميزات المنتج.",
        type: "video",
        fileData: null,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
    ];
  }

  function openAdd() {
    setEditingId(null);
    setForm({
      title: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      type: "image",
      fileData: null,
      url: "",
      imageFile: null,
      videoFile: null,
    });
    setIsOpen(true);
  }

  function openEdit(id) {
    const w = works.find((x) => x.id === id);
    if (!w) return;
    setEditingId(id);
    setForm({
      title: w.title,
      date: w.date,
      description: w.description,
      type: w.type || (w.url && w.url.match(/\.mp4|\.webm|\.ogg/) ? "video" : "image"),
      fileData: w.fileData || null,
      url: w.url || "",
      imageFile: null,
      videoFile: null,
    });
    setIsOpen(true);
  }

  function handleDelete(id) {
    if (!confirm("بدك تحذف هالعمل؟ العملية ما بتنرجع")) return;
    setWorks((prev) => prev.filter((w) => w.id !== id));
  }

  // image input (preview + file)
  function handleImageChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return setForm((s) => ({ ...s, imageFile: null, fileData: null }));
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((s) => ({ ...s, imageFile: f, fileData: ev.target.result }));
    };
    reader.readAsDataURL(f);
  }

  // video input (no data-uri preview to avoid memory issues, use URL or file object)
  function handleVideoChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return setForm((s) => ({ ...s, videoFile: null }));
    setForm((s) => ({ ...s, videoFile: f }));
  }

  // الإرسال للباك اند مع progress
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return alert("المطلوب: عنوان العمل");
    if (!form.description.trim()) return alert("المطلوب: شرح عن العمل");

    // إعداد FormData حسب اللي بعثوه لك بالـ curl
    const fd = new FormData();
    fd.append("name", form.title);
    fd.append("content", form.description);
    fd.append("date", form.date || new Date().toISOString().slice(0, 10));

    // اذا في ملف صورة أرسله
    if (form.imageFile) {
      fd.append("image", form.imageFile);
    }
    // لو في ملف فيديو أرسله
    if (form.videoFile) {
      fd.append("video", form.videoFile);
    }

    // لو المستخدم حط رابط بدل رفع، ممكن نبعته كـ url - بس تأكد الباك يدعم:
    // fd.append('image_url', form.url);

    const endpoint = "https://render-project1-qyk2.onrender.com/exercises/add-service-with-video/";

    setUploading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    // لو بدك تبعت توكن: xhr.setRequestHeader('Authorization', 'Bearer ...');

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const p = Math.round((event.loaded / event.total) * 100);
        setProgress(p);
      }
    };

    xhr.onload = function () {
      setUploading(false);
      setProgress(0);
      if (xhr.status >= 200 && xhr.status < 300) {
        let data = null;
        try {
          data = JSON.parse(xhr.responseText);
        } catch (err) {
          data = null;
        }

        // بناء عنصر جديد للعرض في الواجهة
        const newItem = data && (data.id || data._id)
          ? {
              id: data.id || data._id,
              title: form.title,
              date: form.date,
              description: form.description,
              type: form.videoFile ? "video" : "image",
              fileData: null,
              url: data.url || null, // لو الباك رجع رابط التخزين
            }
          : {
              id: `w-${Date.now()}`,
              title: form.title,
              date: form.date,
              description: form.description,
              type: form.videoFile ? "video" : "image",
              fileData: form.fileData || null,
              url: form.url || null,
            };

        setWorks((prev) => [newItem, ...prev]);
        setIsOpen(false);
        // صفّي الفورم
        setForm({
          title: "",
          date: "",
          description: "",
          type: "image",
          fileData: null,
          url: "",
          imageFile: null,
          videoFile: null,
        });
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (videoInputRef.current) videoInputRef.current.value = "";
        alert("انضاف العمل بنجاح");
      } else {
        let responseText = xhr.responseText || "";
        alert(`خطأ من السيرفر: ${xhr.status} ${xhr.statusText}\n${responseText}`);
      }
    };

    xhr.onerror = function () {
      setUploading(false);
      setProgress(0);
      alert("صارت مشكلة خلال الاتصال بالسيرفر. شيك الـ CORS أو الشبكة.");
    };

    xhr.send(fd);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>لوحة تحكم معرض الأعمال</h1>
        <button onClick={openAdd} className="btn-add">إضافة عمل جديد</button>
      </div>

      <div className="works-grid">
        {works.map((w) => (
          <div key={w.id} className="work-card">
            <div className="media">
              {w.type === "video" ? (
                <video controls>
                  <source src={w.fileData || w.url} />
                  متصفحك لا يدعم الفيديو
                </video>
              ) : (
                <img src={w.fileData || w.url} alt={w.title} />
              )}
            </div>

            <div className="info">
              <h2>{w.title}</h2>
              <p className="date">{w.date}</p>
              <p>{w.description}</p>
              <div className="actions">
                <button onClick={() => openEdit(w.id)} className="btn-edit">تعديل</button>
                <button onClick={() => handleDelete(w.id)} className="btn-delete">حذف</button>
              </div>
            </div>
          </div>
        ))}

        {works.length === 0 && <div className="empty">ما في أعمال بعد. اضغط "إضافة عمل جديد" لتبلش.</div>}
      </div>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingId ? "تعديل العمل" : "إضافة عمل جديد"}</h3>
              <button onClick={() => setIsOpen(false)} className="close">✕</button>
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
                    // عرض الفيديو من url أو من ملف لو رجع رابط
                    <video controls>
                      <source src={form.fileData || form.url} />
                    </video>
                  ) : (
                    <img src={form.fileData || form.url} alt="preview" />
                  )
                ) : (
                  <span>ما في معاينة بعد</span>
                )}
              </div>

              {uploading && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>جارٍ الرفع: {progress}%</div>
                  <div style={{ background: "#eee", height: 8, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${progress}%`, height: "100%", background: "#0071f8" }}></div>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={() => setIsOpen(false)} className="btn-cancel">إلغاء</button>
                <button type="submit" className="btn-save" disabled={uploading}>{editingId ? "حفظ التعديلات" : "إضافة العمل"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

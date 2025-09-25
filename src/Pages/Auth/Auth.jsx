// AdminLogin.jsx
import React, { useState } from "react";
import "./Auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://mohammed229.pythonanywhere.com/main/api/check-credentials/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const dataText = await res.text().catch(() => "");
      let data = {};
      try { data = JSON.parse(dataText || "{}"); } catch (e) { /* ignore parse error */ }

      setLoading(false);

      if (res.ok && data.success) {
        // نحفظ حالة الجلسة في sessionStorage (تختفي لما يغلّق التبويب/المتصفح)
        sessionStorage.setItem("isAuth", "true");
        // نخزن الإيميل اللي بيرجع من السيرفر أو اللي دخله المستخدم
        if (data.email) sessionStorage.setItem("adminEmail", data.email);
        else sessionStorage.setItem("adminEmail", email);

        // لو الـ API رجع توكن تحفظه (اختياري) - مثال:
        // if (data.token) sessionStorage.setItem("token", data.token);

        // توجيه للداشبورد
        window.location.href = "/admin";
        return;
      }

      if (res.status === 401) {
        setError("كلمة السر خاطئة!");
        return;
      }

      const msg = (data.message || data.error || dataText || "").toString().toLowerCase();
      if (msg.includes("password") || msg.includes("pass") || msg.includes("كلمة")) {
        setError("كلمة السر خاطئة!");
        return;
      }

      setError("بيانات الدخول غير صحيحة!");
    } catch (err) {
      setLoading(false);
      setError("حدث خطأ أثناء الاتصال بالخادم.");
      console.error(err);
    }
  };

  return (
    <div className="admin-login-container">
      <form
        className="admin-login-form"
        onSubmit={handleLogin}
        autoComplete="off"
      >
        <h2>تسجيل دخول الأدمن</h2>
        {error && <div className="error">{error}</div>}
        <input
          type="email"
          name="email"
          placeholder="الإيميل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}

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

      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        // ✅ نحفظ حالة تسجيل الدخول
        localStorage.setItem("isAuth", "true");
        // نوجّه المستخدم للداشبورد
        window.location.href = "/admin";
        return;
      }

      if (res.status === 401) {
        setError("كلمة السر خاطئة!");
        return;
      }

      const msg = (data.message || data.error || "").toString().toLowerCase();
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
          autoComplete="new-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}

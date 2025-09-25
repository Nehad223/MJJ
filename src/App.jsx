// App.jsx
import { useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Pages/Main/NavBar";
import CallUs from "./Pages/CallUs/CallUs";
import Main from "./Pages/Main/Main";
import Projects from "./Pages/Projects/Projects";
import Service from "./Pages/Service/Service";
import Footers from "./Pages/Footers/Fotters";
import WorkDetails from "./Pages/WorkDetails/WorkDetails";
import DashboardWorks from "./Pages/Admin/DashboardWorks";
import Messages from "./Pages/Messages/Messages";
import Auth from "./Pages/Auth/Auth";
import ProtectedRoute from "./Pages/Auth/ProtectedRoute"; // ✅ استدعاء الملف الجديد

function App() {
  const mainRef = useRef(null);
  const serviceRef = useRef(null);
  const projectsRef = useRef(null);
  const callUsRef = useRef(null);

  const scrollTo = (section) => {
    switch (section) {
      case "main":
        mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "service":
        serviceRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "projects":
        projectsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      case "callus":
        callUsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        break;
      default:
        break;
    }
  };

  const Home = () => (
    <div>
      <NavBar onScrollTo={scrollTo} />

      <div ref={mainRef}>
        <Main goToCallUs={() => scrollTo("callus")} />
      </div>

      <div ref={serviceRef}>
        <Service />
      </div>

      <div ref={projectsRef}>
        <Projects />
      </div>

      <div ref={callUsRef}>
        <CallUs />
      </div>

      <Footers />
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/work/:id" element={<WorkDetails />} />

      {/* 🛡️ المسارات المحمية */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardWorks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      {/* صفحة تسجيل الدخول */}
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

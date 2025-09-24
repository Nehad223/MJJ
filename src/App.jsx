import { useRef } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./Pages/Main/NavBar";
import CallUs from "./Pages/CallUs/CallUs";
import Main from "./Pages/Main/Main";
import Projects from "./Pages/Projects/Projects";
import Service from "./Pages/Service/Service";
import Footers from "./Pages/Footers/Fotters";
import WorkDetails from "./Pages/WorkDetails/WorkDetails";
import DashboardWorks from "./Pages/Admin/DashboardWorks";

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

  // الصفحة الرئيسية
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
     <Route path="/admin" element={<DashboardWorks/>} />

    </Routes>
  );
}

export default App;

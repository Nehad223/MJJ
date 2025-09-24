import { useRef } from "react";
import NavBar from "./Pages/Main/NavBar"; // أو المسار الصحيح للـ NavBar
import CallUs from "./Pages/CallUs/CallUs";
import Main from "./Pages/Main/Main";
import Projects from "./Pages/Projects/Projects";
import Service from "./Pages/Service/Service";
import Footers from "./Pages/Footers/Fotters";

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

  return (
    <div>
      {/* NavBar موجودة في App عشان توصل لكل الـ refs */}
      <NavBar onScrollTo={scrollTo} />

      {/* كل سكشن ملفوف بـ ref */}
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
}

export default App;

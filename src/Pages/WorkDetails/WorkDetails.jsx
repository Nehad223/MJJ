import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "./WorkDetails.css";

export default function WorkDetails() {
  const { id } = useParams();
  const location = useLocation();
  const workFromState = location.state?.work;

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 992;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const handler = (e) => setIsDesktop(e.matches);
    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);
    setIsDesktop(mq.matches);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  if (!workFromState) {
    return (
      <div className="wd-container">
        <p>ما في بيانات لعرضها — افتح تفاصيل العمل عن طريق السلايدر.</p>
        <p>أو <Link to="/">ارجع للسلايدر</Link> وحاول مرة تانية.</p>
      </div>
    );
  }

  const { image_url, video_url, company, name, date, content, title } = workFromState;

  // دالة لتنسيق التاريخ بالعربي
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  };

  // تحديد عنصر الوسائط للعرض
  const mediaElement = image_url
    ? <img className="wd-image" src={image_url} alt={title || name} />
    : video_url
    ? <video className="wd-image" src={video_url} controls />
    : null;

  return (
    <div className="wd-container mt-5 container">

      {isDesktop ? (
        <div className="wd-grid-desktop">
          <div className="wd-image-wrap mt-5">
            {mediaElement || <div className="wd-image-placeholder">ما في صورة ولا فيديو</div>}
          </div>
          <div className="wd-text container">
            <div className="wd-company">{company}</div>
            <h1 className="wd-title">{title || name}</h1>
            <div className="wd-date">{formatDate(date)}</div>
            <div className="wd-content"><p>{content}</p></div>
          </div>
        </div>
      ) : (
        <div className="wd-mobile">
          <div className="wd-header">
            <div className="wd-company">{company}</div>
            <h1 className="wd-title">{title || name}</h1>
            <div className="wd-date">{formatDate(date)}</div>
          </div>
          <div className="wd-image-wrap">
            {mediaElement || <div className="wd-image-placeholder">ما في صورة ولا فيديو</div>}
          </div>
          <div className="wd-content"><p>{content}</p></div>
        </div>
      )}
    </div>
  );
}

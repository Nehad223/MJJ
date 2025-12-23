import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "./WorkDetails.css";

export default function WorkDetails() {
  const { id } = useParams();
  const location = useLocation();
  const workFromState = location.state?.work;

  // Desktop detection
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 992;
  });

  // Strong animation state
  const [animatePage, setAnimatePage] = useState(false);

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

  // Trigger animation on page load
  useEffect(() => {
    setTimeout(() => setAnimatePage(true), 30);
  }, []);

  if (!workFromState) {
    return (
      <div className="wd-container">
        <p>لا يوجد بيانات لعرضها — افتح تفاصيل العمل عن طريق السلايدر.</p>
        <p>
          أو <Link to="/">ارجع للسلايدر</Link> وحاول مرة تانية.
        </p>
      </div>
    );
  }

  const { image_url, video_url, company, name, date, content, title } =
    workFromState;

  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(d);
  };

  const mediaElement = image_url ? (
    <img className="wd-image" src={image_url} alt={title || name} />
  ) : video_url ? (
    <video className="wd-image" src={video_url} controls />
  ) : null;

  return (
    <div
      className={`page-strong-enter ${
        animatePage ? "page-strong-active" : ""
      }`}
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary" dir="rtl">
        <div className="container-fluid d-flex justify-content-between align-items-center">

          {/* Logo */}
          <a
            className="navbar-brand mx-lg-5"
            href="#"
            onClick={(e) => e.preventDefault()}
            style={{ fontWeight: "700", fontSize: "1.5rem" }}
          >
         +
          </a>

          {/* Back Button */}
          <Link to={-1} className="btn-back me-lg-3">
            <span className="arrow">←</span>
            <span className="text">رجوع</span>
          </Link>
        </div>
      </nav>

      {/* Page Content */}
      <div className="wd-container mt-5 container">
        {isDesktop ? (
          <div className="wd-grid-desktop">
            <div className="wd-image-wrap mt-5">
              {mediaElement || (
                <div className="wd-image-placeholder">لا يوجد صورة ولا فيديو</div>
              )}
            </div>

            <div className="wd-text container mt-5 text-end">
              <div className="wd-company mt-3">{company}</div>
              <h1 className="wd-title">{title || name}</h1>
              <div className="wd-date">{formatDate(date)}</div>
              <div className="wd-content">
                <p>{content}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="wd-mobile text-end">
            <div className="wd-header">
              <div className="wd-company">{company}</div>
              <h1 className="wd-title">{title || name}</h1>
              <div className="wd-date">{formatDate(date)}</div>
            </div>
            <div className="wd-image-wrap">
              {mediaElement || (
                <div className="wd-image-placeholder">لا يوجد صورة ولا فيديو</div>
              )}
            </div>
            <div className="wd-content">
              <p>{content}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

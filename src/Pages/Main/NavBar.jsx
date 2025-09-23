import React from 'react';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand mx-lg-5" href="#">MJ+</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse mx-lg-5" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto  mb-lg-4 ">
            <li className="nav-item mx-lg-3">
              <a className="nav-link active" href="#">الرئيسية</a>
            </li>
            <li className="nav-item mx-lg-3">
              <a className="nav-link" href="#">خدماتنا</a>
            </li>
            <li className="nav-item mx-lg-3">
              <a className="nav-link" href="#">مشاريعنا</a>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default NavBar;


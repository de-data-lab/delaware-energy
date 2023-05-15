import { NavLink, Link } from "react-router-dom";
import "./header.css";
import logo from "/logos/dsha-logo-transparent.svg";
// import info from "/icons/info-icon.svg";
import info from "/icons/info-icon-curved.svg";

const HeaderLogo = () => {
  return (
    <div className="header-logo">
      <Link to="/" className="logo-link">
        <img src={logo} className="logo" alt="Delaware State Housing Authority logo"></img>
        <h1 className="header-title">DSHA Test App</h1>
      </Link>
    </div>
  );
};

const HeaderLinks = () => {
  return (
    <div className="collapse navbar-collapse nav-links" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/">
          Map
        </NavLink>
        <NavLink className="nav-link" to="/explorer">
          District Explorer
        </NavLink>
        <NavLink
          className="nav-link"
          to="/info"
        >
          Information
          <img
            className="info-icon"
            src={info}
          ></img>
        </NavLink>
      </div>
    </div>
  );
};

const HeaderTabBar = () => {
  return (
    <div className="header-tab-bar">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>
  );
};

const Header = () => {
  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <HeaderLogo />
        <HeaderTabBar />
        <HeaderLinks />
      </nav>
    </div>
  );
};

export default Header;

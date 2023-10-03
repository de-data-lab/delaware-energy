import { NavLink } from "react-router-dom";
import "./Header.css";

const HeaderLogo = () => {
  return (
    <div className="header-logo">
      <h1 className="header-title">Energy Efficiency Investment Funds Across Delaware's Legislative
        Districts</h1>
    </div>
  );
};

function HeaderLinks() {
  return (
    <div className="collapse navbar-collapse nav-links" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/">
          Map
        </NavLink>
        <NavLink className="nav-link" to="/graph">
          Graph
        </NavLink>
      </div>
    </div>
  );
}

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

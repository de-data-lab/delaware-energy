import { NavLink } from "react-router-dom";
import "./Header.css";

const HeaderLogo = () => {
  return (
    <div className="header-logo">
      <h1 className="header-title">LIHTC District Comparer</h1>
    </div>
  );
};

function HeaderLinks() {

  return (
    <div className="collapse navbar-collapse nav-links" id="navbarNavAltMarkup">
  <div className="navbar-nav ms-auto">
      <NavLink className="nav-link" to="/">
        Map
      </NavLink>
      <NavLink className="nav-link" to="/graph">
        Graph
      </NavLink>
  </div>
  </div>
  )
}

const Header = ({ children }) => {
  return (
    <div className="header">
      <nav className="w-100 navbar navbar-expand-lg navbar-dark">
      <h1 className="header-title">{children}</h1>
      <HeaderLinks />
      </nav>
    </div>
  );
};

export default Header;

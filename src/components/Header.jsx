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
  <div className="navbar-nax">
    <NavLink className="nav-link" to="/">
      Map
    </NavLink>
    <NavLink className="nav-link" to="/graphs">
      Map
    </NavLink>
  </div>;
}

const Header = ({ children }) => {
  return (
    <div className="header">
      <h1 className="header-title">{children}</h1>
      <HeaderLinks />
    </div>
  );
};

export default Header;

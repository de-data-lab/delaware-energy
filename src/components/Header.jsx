import "./header.css";
import logo from "/logos/dsha-logo-transparent.svg"

const HeaderLogo = () => {
  return (
    <div className="header-logo">
        <a href="/" className="header-link">
          <img src={logo} className="logo"></img>
          <h1 className="header-title">DSHA Test App</h1>
        </a>
    </div>
  );
};

const HeaderTabBar = ({ page, setPage }) => {
  // Toggle Button for map + explorer
  const handlePageChange = () => {
    setPage(!page);
  };

  return (
    <div className="header-tab-bar">
      {/* <button onClick={handlePageChange}>Here</button> */}
      <label className="header-toggle-label" htmlFor="toggle-switch">
        Map
      </label>
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="toggle-switch"
          onClick={handlePageChange}
        ></input>
      </div>
      <label className="header-toggle-label" htmlFor="toggle-switch">
        District Explorer
      </label>
    </div>
  );
};

const Header = ({ page, setPage }) => {
  return (
    <div className="header">
      <div className="header-container">
        <HeaderLogo />
        <HeaderTabBar page={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default Header;

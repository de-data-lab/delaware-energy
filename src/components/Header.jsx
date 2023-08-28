import "./Header.css";

const HeaderLogo = () => {
  return (
    <div className="header-logo">
        <h1 className="header-title">LIHTC District Comparer</h1>
    </div>
  );
};


const Header = ({children}) => {
  return (
    <div className="header">
      <h1 className="header-title">{children}</h1>
    </div>
  );
};

export default Header;
import "./Footer.css"
import { Link } from "react-router-dom";
import TILogo from "/logos/techimpact_mainlogo_clear_space.svg"
import logo from "/logos/dsha-logo-blue-transparent.svg";

export const Footer = () => {

  return (
    <footer className="footer">
        <Link to="http://www.destatehousing.com/" target="_blank" rel="noreferrer">
            <img src={logo} className="footer-logo" alt="Delaware State Housing Authority homepage"></img>
        </Link>
        <Link to="https://techimpact.org/" target="_blank" rel="noreferrer">
            <img src={TILogo} className="ti-logo" alt="Tech Impact homepage"></img>
        </Link>
    </footer>
  )
};

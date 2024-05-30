import "./Footer.css"
import TILogo from "/techimpact_mainlogo_clear_space.svg"

const Footer = () => {

  return (
    <footer className="footer">
        <a href="https://techimpact.org/" target="_blank" rel="noreferrer">
            <img src={TILogo} className="ti-logo" alt="Tech Impact homepage"></img>
        </a>
    </footer>
  )
};

export default Footer;
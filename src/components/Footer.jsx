import "./Footer.css"
import TILogo from "/images/techimpact_mainlogo_clear_space.svg"

export const Footer = () => {

  return (
    <footer className="footer">
        {/* <a href="" target="_blank" rel="noreferrer">
            <img className="footer-logo" src={} alt =""></img>
        </a> */}
        <a href="https://techimpact.org/" target="_blank" rel="noreferrer">
            <img className="footer-logo" src={TILogo} alt ="Tech Impact homepage"></img>
        </a>
    </footer>
  )
};

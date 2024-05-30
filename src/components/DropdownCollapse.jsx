import "./DropdownCollapse.css";
function DropdownCollapse({ button, toggleButton, openClass, closeClass, className, tab }) {
  return (
    <button
      tabIndex={tab === -1 ? -1 : 0}
      className={`${className} ` + (button ? closeClass : openClass)}
      aria-expanded={!button}
      aria-controls="dropdown-menu"
      aria-label="Toggle Dropdown Menu"
      type="button"
      onClick={toggleButton}
    ></button>
  );
}

export default DropdownCollapse;

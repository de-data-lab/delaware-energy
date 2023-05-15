import "./DropdownCollapse.css";

export const DropdownCollapse = ({button, toggleButton, openClass, closeClass}) => {

  return (
    <button
    className={"toggle-button " + (button ? closeClass : openClass)}
    aria-expanded={!button}
    aria-controls="dropdown-menu"
    aria-label="Toggle Dropdown Menu"
    type="button"
    onClick={toggleButton}>
    </button>
  )
};
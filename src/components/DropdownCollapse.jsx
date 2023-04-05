import "./DropdownCollapse.css";

export const DropdownCollapse = ({button, toggleButton}) => {

  return (
    <button
    className={"toggle-button " + (button ? "toggle-button-close" : "button-open")}
    aria-expanded={!button}
    aria-controls="dropdown-menu"
    aria-label="Toggle Dropdown Menu"
    type="button"
    onClick={toggleButton}>
    </button>
  )
};
import "./HoverInfo.css";

export const HoverInfo = () => {

  return (
    <div className="text-container">
      <li>
          <strong>Hover</strong> over a district to see more information.
      </li>
      <li>
      <strong>Click</strong> on multiple districts to sum their values. 
      </li>
      <li>
      <strong>Click again</strong> to deselect a district.
      </li>
      <li>
      With property locations on, <strong>click</strong> a point to see more info about that property.
      </li>
    </div>
  );
};

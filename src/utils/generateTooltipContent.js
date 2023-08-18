function generateTooltipContent(properties) {
  let tooltipHTML = "<div>";

  for (const key in properties) {
    if (key !== "index" && properties.hasOwnProperty(key)) {
      tooltipHTML += `<h3>${key}:</h3> <p>${properties[key]}<p>`;
    }
  }
  tooltipHTML += "</div>";
  return tooltipHTML;
}
export default generateTooltipContent
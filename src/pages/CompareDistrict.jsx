import { useState } from "react";
import StackedBar from "./StackedBar";
// import "./CompareDistrict.css";

function CompareDistrict({
    chartData,
    title,
    subtitle,
    xAxis,
    yAxis,
    series,
    filterColumn,
    filterValue,
    districtFilterValue,
    reference,
    boundary,
    checked
}) {

  //charts tooltip formatter
  const tooltipFormatter = (d) => {
    switch (variable) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        return `$${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}`;

      case "Population":
      case "Average Population per Tax Credit Unit":
        return `${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        })}`;

      default:
        return `${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 0,
        })}`;
    }
  };

  return (
    <>
      <div className="button-container">
        <div className="select-spacing">
          <h2 className="heading">
            {checked
              ? ""
              : "Compare Districts"}
          </h2>
          <h3 className="sub-heading">
            {boundary
              ? "House of Representatives"
              : "State Senate"}
          </h3>
        </div>
      </div>
      <StackedBar
        tooltipConfig={{
          placement: "top-end",
          autoPlace: false,
          customTitle: (d) => {
            if (d.data.district === "District Average") {
              return "State Average";
            }
            return `District ${d.data.district}`;
          },
          customContent: (d) =>
            `${d.key}: <strong>${tooltipFormatter(d.data[d.key])}</strong>`,
        }}
        chartData={chartData}
        title={title}
        subtitle={subtitle}
        xAxis={xAxis}
        yAxis={yAxis}
        series={series}
        filterColumn={filterColumn}
        filterValue={filterValue}
        districtFilterValue={districtFilterValue}
        reference={reference}
        boundary={boundary}
      />
      <p className="chart-note">* State Average represents the average of all  districts with tax credit units in that year (does not include districts with 0 tax credit units)</p>
    </>
  );
}

export default CompareDistrict;

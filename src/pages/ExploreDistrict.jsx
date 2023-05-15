import mapInfo from "../utils/mapInfo";
import { useState, useEffect } from "react";
import React from "react";
import { csv } from "d3";
import "./ExploreDistrict.css";
import dshaData from "../data/DSHA_districted.json";


function ExploreDistrict({
  chartData,
  districtFilterValue,
  collapseButton,
  filterColumn,
  funding,
  exploreDistrict,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
    csv(chartData).then((result) => {
      const filteredData = result.filter((i) =>
        filterColumn
          ? i[filterColumn] === `${exploreDistrict.value}` ||
            i[filterColumn] === "District Average"
          : i
      );
      setData(filteredData);
    });

    
  }, [exploreDistrict]);

  const properties = dshaData.features.filter(item => item.properties["Senate District"] === `${exploreDistrict.value}`)
  console.log(properties);

// Formatting data

  const formattedData = data.map((item) => {
    switch (item.variable) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        return {
          ...item,
          value: `$${parseFloat(item.value).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 0,
          })}`,
        };

      case "adj_popula":
      case "Average Population per Tax Credit Unit":
        return {
          ...item,
          value: `${parseFloat(item.value).toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
        };

      default:
        return {
          ...item,
          value: `${parseFloat(item.value).toLocaleString(undefined, {
            maximumFractionDigits: 1,
            minimumFractionDigits: 0,
          })}`,
        };
    }
  });

  const selectedDistrict = formattedData.filter(
    (d) => d.district !== "District Average"
  );
  const average = formattedData.filter(
    (d) => d.district === "District Average"
  );
  

  return (
    <>
      <div
        className={
          "explore-container " + (collapseButton ? "container-margin" : "")
        }
      >
        <h1 className="explore-header">{exploreDistrict.label}</h1>
        <div>
          <div className="explore-subheader">
            <div className="label-container">
              <h2 className="information-text">
                <strong>{mapInfo[funding].columns["adj_popula"]}:</strong>
              </h2>
              {selectedDistrict.map((district, i) => (
                <>
                  {district.variable === "adj_popula" ? (
                    <h2 className="information-text">{district.value}</h2>
                  ) : (
                    ""
                  )}
                </>
              ))}
            </div>
            <span className="divider"></span>
            <div className="label-container">
              <h2 className="information-text">
                <strong>{funding} properties:</strong>
              </h2>
              <h3 className="information-text">{properties.length}</h3>
            </div>
          </div>
          <table className="explore-table">
            <tbody>

            <tr>
              <th className="table-header"></th>
              <th className="table-header">District {exploreDistrict.value}</th>
              <th className="table-header">State Average</th>
            </tr>
            {selectedDistrict.map((district, i) => (
              <>
                {district.variable === "adj_popula" ? (
                  ""
                ) : (
                  <tr className="table-row-container">
                    <td className="table-row-header">
                      <strong>{mapInfo[funding].columns[district.variable]}</strong>
                    </td>
                    <td className="table-row">{district.value}</td>
                    <td className="table-row">{average[i].value}</td>
                  </tr>
                )}
              </>
            ))}
            </tbody>

          </table>
        </div>
      </div>
    </>
  );
}

export default ExploreDistrict;

import mapInfo from "../utils/mapInfo";
import { useState, useEffect } from "react";
import React from "react";
import { csv } from "d3";
import "./ExploreDistrict.css";
import dshaData from "../data/DSHA_districted.json";

function ExploreDistrict({
  chartData,
  collapseButton,
  filterColumn,
  fundingSource,
  exploreDistrict,
  year,
}) {
  const [data, setData] = useState([]);

  useEffect(() => {
      csv(chartData).then((result) => {
          const filteredDistricts = result.filter((i) =>
            filterColumn
              ? i[filterColumn] === `${exploreDistrict.value}` ||
                i[filterColumn] === "District Average"
              : i
          );

          const filteredYears = filteredDistricts.filter(
            (feature) =>
              parseFloat(feature["Tax Allocation Year"]) === parseFloat(year)
          );

          // filter out avg pop per tax credit unit
          const filteredData = filteredYears.filter(
            (feature) =>
              feature.variable !== "Average Population per Tax Credit Unit"
          );

          const sortedData = filteredData.sort((a, b) =>
            a.variable > b.variable ? 1 : -1
          );

          setData(sortedData);
        })

  }, [exploreDistrict, year]);

  const properties = dshaData.features.filter(
    (item) =>
      (`${item.properties["Senate District"]}` === `${exploreDistrict.value}`) &
      (`${item.properties["Tax Allocation Year"]}` === `${year}`)
  );

  // Formatting data
  const formattedData = data.map((item) => {
    switch (item.variable) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        return {
          ...item,
          value: `$${parseFloat(item.value).toLocaleString(undefined, {
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          })}`,
        };

      case "Population":
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
            maximumFractionDigits: 0,
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
        {selectedDistrict.length > 0 ? (
          <>
            <h1 className="explore-header">{exploreDistrict.label}</h1>
            <div>
              <div className="explore-subheader">
                <div className="label-container">
                  <h2 className="information-text">
                    <strong>
                      {mapInfo[fundingSource].columns["Population"]}:
                    </strong>
                  </h2>
                  {selectedDistrict.map((district, i) => (
                    <>
                      {district.variable === "Population" ? (
                        <h2 key={i} className="information-text">{district.value}</h2>
                      ) : (
                        ""
                      )}
                    </>
                  ))}
                </div>
                <span className="divider"></span>
                <div className="label-container">
                  <h2 className="information-text">
                    <strong>{fundingSource} properties:</strong>
                  </h2>
                  <h3 className="information-text">{properties.length}</h3>
                </div>
              </div>
              <table className="explore-table">
                <tbody>
                  <tr>
                    <th className="table-header">
                      {mapInfo[fundingSource].years[year]}
                    </th>
                    <th className="table-header">
                      District {exploreDistrict.value}
                    </th>
                    <th className="table-header"></th>
                    <th className="table-header">State Average</th>
                  </tr>
                  {selectedDistrict.map((district, i) => (
                    <>
                      {district.variable === "Population" ? (
                        ""
                      ) : (
                        <>
                          {year === "Sum over All Time" ? (
                            <tr key={i} className="table-row-container">
                              <td className="table-row-header">
                                <strong>
                                  {`${district["Tax Allocation Year"]}: `}
                                  {
                                    mapInfo[fundingSource].columns[
                                      district.variable
                                    ]
                                  }
                                </strong>
                              </td>
                              <td className="table-row">{district.value}</td>
                              <td className="compare">
                                {parseFloat(
                                  district.value.replace(/[^0-9\.]+/g, "")
                                ) >
                                parseFloat(
                                  average[i].value.replace(/[^0-9\.]+/g, "")
                                )
                                  ? ">"
                                  : "<"}
                              </td>
                              <td className="table-row">{average[i].value}</td>
                            </tr>
                          ) : (
                            <tr key={i} className="table-row-container">
                              <td className="table-row-header">
                                <strong>
                                  {
                                    mapInfo[fundingSource].columns[
                                      district.variable
                                    ]
                                  }
                                </strong>
                              </td>
                              <td className="table-row">{district.value}</td>
                              <td className="compare">
                                {parseFloat(
                                  district.value.replace(/[^0-9\.]+/g, "")
                                ) >
                                parseFloat(
                                  average[i].value.replace(/[^0-9\.]+/g, "")
                                )
                                  ? ">"
                                  : "<"}
                              </td>
                              <td className="table-row">{average[i].value}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="not-found">No LIHTC allocations for <strong>District {exploreDistrict.value}</strong> in <strong>{mapInfo[fundingSource].years[year]}</strong></div>
        )}
      </div>
    </>
  );
}

export default ExploreDistrict;

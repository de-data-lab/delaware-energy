import Select from "react-select";
import ChartTooltip, { useTooltip } from "../components/ChartTooltip";
import "./BarChart.css";

// @ts-check

import {
  autoType, axisBottom, axisLeft, csv,
  group,
  scaleBand, scaleLinear, scaleOrdinal,
  schemeCategory10, select, stack
} from "d3";
import React, { useEffect, useRef, useState } from "react";

/**
 * Defines a new line chart
 * @param {ExplorerChartProps} props The props for the chart
 */
function StackedBar({
  chartData,
  title,
  subtitle,
  xAxis,
  yAxis,
  series,
  filterColumn,
  filterValue,
  fundingSource,
  districtFilterValue,
  tooltipConfig,
  handleDistrictChange,
  district,
  districtOptions,
  collapseButton,
  reference,
}) {
  const [data, setData] = useState([]);
  const [stackedData, setStackedData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [colorScheme, setColorScheme] = useState(schemeCategory10);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const svg = useRef(null);

  const { tooltipData, showTooltip, tooltipRef } = useTooltip();

  const [isSearchable, setIsSearchable] = useState(true);

  useEffect(() => {
    csv(chartData, autoType).then((result) => {
      // Filter chart data on FilterColumn if it exists and equals filterValue
      const variableFilteredData = result.filter((i) =>
        filterColumn ? i[filterColumn] === `${filterValue}` : i
      );

      // Filter down to districts selected
      const filteredDistricts = variableFilteredData.filter((item) => {
        return districtFilterValue.some((f) => {
          return (
            f.value === parseInt(item.district) || item.district === reference
          );
        });
      });

      // Filter based on year selected
      // const filteredData = filteredDistricts.filter(item =>  item.properties["Tax Allocation Year"] === parseFloat(mapInfo[fundingSource].years[year]));
      setData(filteredDistricts);
    });
  }, [filterValue, districtFilterValue]);

  /** @type ConfigObject */
  const config = {
    mt: 100,
    mr: 60,
    mb: 30,
    ml: 120,
    ch: 500,
    cw: 700,
    height: function () {
      return this.ch + this.mb + this.mt;
    },
    width: function () {
      return this.cw + this.mr + this.ml;
    },
  };


  const scales = {
    x: scaleBand([config.ml, config.width() - config.mr])
      .padding(0.25)
      .domain(
        data
          .map((d) => parseInt(d[xAxis]))
          .sort(function (a, b) {
            return a - b;
          })
      ),
    y: scaleLinear([config.ch, config.mt]).domain([
      // min(
      //   data.filter((i) => !hiddenSeries.includes(i[series])),
      //   (d) => parseInt(d[yAxis])
      // ),
      0,
      600, // needs to be the maximum number of units added across all years for any given district
    ]),
    color: scaleOrdinal()
      .domain(Array.from(new Set(data.map((d) => d[series]))))
      .range(colorScheme),
  };

  const yAxisFormat = (d) => {
    switch (filterValue) {
      case "ALLOCATION AMOUNT":
      case "Average Allocation per Tax Credit Unit":
      case "Average Allocation per 100 Persons":
        return `$${parseFloat(d).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 0,
        })}`;

      case "adj_popula":
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

  /**
   * Draws or redraws the x and y axes
   */
  const drawAxes = () => {
    select(svg.current)
      .select(".x-axis")
      .transition()
      .call(
        axisBottom(scales.x)
          .tickSize(10)
          .tickFormat((d) => {
            if (isNaN(parseFloat(d))) {
              return "State Average";
            }
            return `District ${d}`;
          })
      )
      // Rotate x axis labels
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-1.25em")
      .attr("dy", "-.05em")
      .attr("transform", "rotate(-65)");

    select(svg.current)
      .select(".y-axis")
      .transition()
      .call(
        axisLeft(scales.y)
          .tickSize(-(config.width() - config.mr - config.ml))
          .tickPadding(20)

          // Incorporate money formatter
          .tickFormat(yAxisFormat)
      )
      .call((g) => g.selectAll(".tick line").attr("x1", 0));
  };

  

  useEffect(() => { 
    let nested = Array.from(group(data, d => d.district));

    let lihtcWide = nested.map(g => {
      let obj = {};
      obj["district"] = g[0]
      for (let year of Array.from(new Set(data.map(d => d["Tax Allocation Year"])))) {
        const match = g[1].find(d => { return d["Tax Allocation Year"]==year }); 
        obj[year] = match ? match.value : null
      }
      return obj
    })

    let stacked =  stack()
        .keys(Array.from(new Set(data.map(d => d["Tax Allocation Year"]))))(lihtcWide)
    
    
    let stackedWithKey = stacked.map(d => {
          d.forEach(v => {
            v.key = d.key; 
            v.data.name = v.data.district
          })
          return d
        }).sort((a, b) => a.key > b.key ? 1 : -1)

        setStackedData(stackedWithKey)
  }, [data])


  useEffect(() => {
    drawAxes();
  }, [data, hiddenSeries]);

  const handleMouseOver = (anchor, data) => {
    showTooltip(anchor, data);
  };

  return (
    <>
      <div
        className={
          "svg-container " + (collapseButton ? "container-margin" : "")
        }
      >
        <div className="legend-container">
          <label className="label-text">Select districts to compare:</label>
          <Select
            onChange={(e) => handleDistrictChange(e)}
            options={districtOptions.filter((item) => {
              return !district.some((f) => {
                return f.value === item.value;
              });
            })}
            id="react-select"
            name="districts"
            className="basic-multi-select"
            classNamePrefix="select"
            isSearchable={isSearchable}
            defaultValue={district}
            isMulti
          ></Select>
       
            <g className="legend">
            {stackedData
              .map((d, i) => (
                <g
                  opacity={hiddenSeries.includes(d.key) ? 0.2 : 1}
                  onMouseOver={() => {
                    setHovered(d.key);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                  }}
                  onClick={(e) => {
                    if (!hiddenSeries.includes(d.key)) {
                      setHiddenSeries([...hiddenSeries, d.key]);
                    } else {
                      setHiddenSeries(
                        hiddenSeries.filter((series) => series !== d.key)
                      );
                    }
                  }}
                  className="legend-entry"
                >
                  <rect
                    className="legend-rect"
                    fill={d.key === reference ? "none" : scales.color(d.key)}
                    stroke={d.key === reference ? "gray" : scales.color(d.key)}
                    strokeDasharray={d.key === reference ? "2 2" : ""}
                    rx="5"
                    ry="5"
                    height="20"
                    width="20"
                    transform={`translate(${
                      (config.width() / 4) * i + config.ml
                    }, ${config.ch + config.mb})`}
                  ></rect>
                  <text
                    textAnchor="start"
                    dominantBaseline="middle"
                    className="legend-text"
                    dx="30"
                    transform={`translate(${
                      (config.width() / 4) * i + config.ml
                    }, ${config.ch + config.mb + 11})`}
                  >
                    {d.key}
                  </text>
                </g>
              ))}
          </g>
        </div>
        <svg
          ref={svg}
          className="chart"
          viewBox={`0 0 ${config.width()} ${config.height()}`}
        >
          <g
            className="header"
            transform={`translate(${config.width() / 2}, ${config.mt / 2.1})`}
          >
            <text className="title" textAnchor="middle">
              {title}
            </text>
            <text className="subtitle" dy={25} textAnchor="middle">
              {subtitle}
            </text>
          </g>

          <g className="axes">
            <g className="x-axis" transform={`translate(0,${config.ch})`}></g>

            <g className="y-axis" transform={`translate(${config.ml},0)`}></g>
          </g>


          <g className="bars">
             {
              stackedData.map(year => year.map((d, i) => (
                <>
               
                <rect
                  key={d[xAxis]}
                  x={scales.x(parseInt(d.data[xAxis]))}
                  y={scales.y(d[1])}
                  // rx="2"
                  fill={d.data[xAxis] !== reference ? (scales.color(year)) : ("var(--grey)")}
                  width={scales.x.bandwidth()}
                  height={ (scales.y(d[0]) - scales.y(d[1]))}
                  className={`bar ${
                    hiddenSeries.includes(d.key)
                      ? "hidden"
                      : hovered && d.key !== hovered
                      ? "unfocus"
                      : ""
                  }`}
                  
                  onMouseOver={(e) => {
                    setHovered(d.key);
                    handleMouseOver(e, d);
                  }}

                  onMouseOut={() => setHovered(null)}
                ></rect>
                </>
              ))
             )}
          </g>

         
        </svg>
      </div>
      <div></div>
      <ChartTooltip
        data={tooltipData}
        xAxis={xAxis}
        yAxis={yAxis}
        anchor={tooltipRef}
        colorScale={scales.color}
        {...tooltipConfig}
      />
    </>
  );
}

export default StackedBar;

// Bar chart
/**
 * @typedef {Object} ExplorerChartProps
 * @property { string } chartData Path to the source data for the chart, should be an array of objects
 * @property {string} title The title of the chart
 * @property {string=} subtitle The subtitle of the chart
 * @property {string} xAxis The property (column) name containing the x-axis values
 * @property {string} yAxis The property (column) name containing the y-axis values
 * @property {string} series The property (column) name used to group the data into discrete series
 * @property {string=} reference Optional. The name of the series to be used as a reference
 * @property {string=} filterColumn Optional. The name of a column used to filter the data
 * @property {string=} filterValue Optional. The value of the filter column, if specified
 * @property {function(): number | string=} yAxisFormat A formatter function for the y-axis labels.
 */

// Bar chart config
/**
 * @todo Abstract this out into a reusable type/object, figure out responsive sizing
 * @typedef {object} ConfigObject
 * @property { number } mt The top margin
 * @property { number } mr The right margin
 * @property { number } mb The bottom margin
 * @property { number } ml The left margin
 * @property { number } ch The height of the chart area
 * @property { number } cw The width of the chart area
 * @property { function(): number } height Returns the total height of the plot, calculated as `ch + mt + mb`
 * @property { function(): number} width Returns the total width of the plot, calculated as `cw + ml + mr`
 */

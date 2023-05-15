import mapInfo from "../utils/mapInfo";
import Select from "react-select";
import "./BarChart.css";
import ChartTooltip, { useTooltip } from "../components/ChartTooltip";

// @ts-check

import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  csv,
  group,
  scaleBand,
  min,
  max,
  line,
  select,
  axisBottom,
  scaleLinear,
  axisLeft,
  scaleOrdinal,
  curveLinear,
  schemeCategory10,
} from "d3";

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

/**
 * Defines a new line chart
 * @param {ExplorerChartProps} props The props for the chart
 */
function BarChart({
  chartData,
  title,
  subtitle,
  xAxis,
  yAxis,
  filterColumn,
  filterValue,
  districtFilterValue,
  tooltipConfig,
  handleDistrictChange,
  district,
  districtOptions,
  collapseButton,
  reference,
}) {
  const [data, setData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [colorScheme, setColorScheme] = useState(schemeCategory10);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const svg = useRef(null);

  const { tooltipData, showTooltip, tooltipRef } = useTooltip();

  const [isSearchable, setIsSearchable] = useState(true);

  useEffect(() => {
    csv(chartData).then((result) => {
      const variableFilteredData = result.filter((i) =>
        filterColumn ? i[filterColumn] === `${filterValue}` : i
      );
      const filteredData = variableFilteredData.filter((item) => {
        return districtFilterValue.some((f) => {
          return (
            f.value === parseInt(item.district) || item.district === reference
          );
        });
      });
      setData(filteredData);
    });
  }, [filterValue, districtFilterValue]);

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

  /** @type ConfigObject */
  const config = {
    mt: 100,
    mr: 60,
    mb: 0,
    ml: 120,
    ch: 400,
    cw: 700,
    height: function () {
      return this.ch + this.mb + this.mt;
    },
    width: function () {
      return this.cw + this.mr + this.ml;
    },
  };

  const scales = {
    x: scaleBand([config.ml, config.width() - config.mr]).domain(
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
      max(
        data.filter((i) => !i.series),
        (d) => parseInt(d[yAxis])
      ),
    ]),
    color: scaleOrdinal()
      .domain(Array.from(new Set(data.map((d) => d[xAxis]))))
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
            return d;
          })
      );
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
              {" "}
              {title}{" "}
            </text>
            <text className="subtitle" dy={25} textAnchor="middle">
              {" "}
              {subtitle}{" "}
            </text>
          </g>

          <g className="axes">
            <g className="x-axis" transform={`translate(0,${config.ch})`}></g>

            <g className="y-axis" transform={`translate(${config.ml},0)`}></g>
          </g>

          <g className="bars">
            {data.map((d, seriesIndex) =>
              d[xAxis] !== reference ? (
                <rect
                  key={d[xAxis]}
                  x={scales.x(parseInt(d[xAxis]))}
                  y={scales.y(d[yAxis])}
                  fill="var(--blue)"
                  width={scales.x.bandwidth()}
                  height={config.ch - scales.y(d[yAxis])}
                  className={`bar ${
                    hiddenSeries.includes(d[0])
                      ? "hidden"
                      : hovered && d[0] !== hovered
                      ? "unfocus"
                      : ""
                  }`}
                  rx="5"
                  style={{
                    animationDelay: `${0.2 * seriesIndex}s`,
                  }}
                  onMouseOver={(e) => {
                    setHovered(d[0]);
                    handleMouseOver(e, d);
                  }}
                ></rect>
              ) : (
                <rect
                  key={d[xAxis]}
                  x={scales.x(parseInt(d[xAxis]))}
                  y={scales.y(d[yAxis])}
                  fill="var(--red)"
                  width={scales.x.bandwidth()}
                  height={config.ch - scales.y(d[yAxis])}
                  className={`bar ${
                    hiddenSeries.includes(d[0])
                      ? "hidden"
                      : hovered && d[0] !== hovered
                      ? "unfocus"
                      : ""
                  }`}
                  rx="5"
                  style={{
                    animationDelay: `${0.2 * seriesIndex}s`,
                  }}
                  onMouseOver={(e) => {
                    setHovered(d[0]);
                    handleMouseOver(e, d);
                  }}
                ></rect>
              )
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

export default BarChart;

import mapInfo from "../utils/mapInfo";
import "./BarChart.css";
import ChartTooltip, { useTooltip } from "./ChartTooltip";

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
  yAxisFormat,
  filterColumn,
  filterValue,
  districtFilterValue,
  tooltipConfig
}) {
  const [data, setData] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [colorScheme, setColorScheme] = useState(schemeCategory10);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const svg = useRef(null);

  const { 
    tooltipData, 
    showTooltip, 
    tooltipRef 
  } = useTooltip(); 

  useEffect(() => {
    csv(chartData).then((result) => {
      const variableFilteredData = result.filter((i) =>
        filterColumn ? i[filterColumn] === `${filterValue}` : i
      );
      const filteredData = variableFilteredData.filter(item => {
        return districtFilterValue.some((f) => {
          return f.value === parseInt(item.district);
        });
      })
      setData(filteredData.filter((d) => parseInt(d[xAxis]) !== 0));
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
    mt: 60,
    mr: 100,
    mb: 0,
    ml: 100,
    ch: 400,
    cw: 700,
    height: function () {
      return this.ch + this.mb + this.mt;
    },
    width: function () {
      return this.cw + this.mr + this.ml;
    },
  };

  // const groupedData = Array.from(group(data, (d) => d[series])).sort((a, b) =>
  //   a[0][0] > b[0][0] ? 1 : -1
  // );
  // iterable list of data grouped by level

  const legend = {
    mt: 60,
    mr: 0,
    mb: 60,
    ml: 60,
    ch: 400,
    cw: 250,
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
          // .tickFormat((d) => "District " + d)
      );

    select(svg.current)
      .select(".y-axis")
      .transition()
      .call(
        axisLeft(scales.y)
          .tickSize(-(config.width() - config.mr -config.ml))
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
  }

  return (
    <>
      <div className="svg-container">
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
            <text className="subtitle" dy={20} textAnchor="middle">
              {" "}
              {subtitle}{" "}
            </text>
          </g>

          <g className="axes">
            <g className="x-axis" transform={`translate(0,${config.ch})`}></g>

            <g className="y-axis" transform={`translate(${config.ml},0)`}></g>
          </g>

          <g className="bars">
            {data.map((d, seriesIndex) => (
              <rect
                key={d[seriesIndex]}
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
                  animationDelay: `${.5}s`,
                  marginRight: `${2}rem`
                }}
                onMouseOver = {(e) => {
                  setHovered(d[0])
                  handleMouseOver(e, d);
                }}
              ></rect>
            ))}
          </g>
        </svg>
      </div>
      <div></div>
      <ChartTooltip 
          data = {tooltipData}
          xAxis = {xAxis}
          yAxis = {yAxis}
          title = {`District ${xAxis}`}
          anchor = {tooltipRef}
          colorScale = {scales.color}
          {...tooltipConfig}
        />
    </>
  );
}

export default BarChart;

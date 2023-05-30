import ChartTooltip, { useTooltip } from "../components/ChartTooltip";
import "./BarChart.css";

// @ts-check

import {
  autoType, axisBottom, axisLeft, csv,
  group, sum,
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
  const [yMax, setYMax] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [colorScheme, setColorScheme] = useState(schemeCategory10);
  const [hiddenSeries, setHiddenSeries] = useState([]);

  const svg = useRef(null);

  const { tooltipData, showTooltip, tooltipRef } = useTooltip();

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
      
      setData(filteredDistricts);
    });
  }, [filterValue, districtFilterValue]);

  /** @type ConfigObject */
  const config = {
    mt: 100,
    mr: 60,
    mb: 100,
    ml: 120,
    ch: 450,
    cw: 800,
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
      y: scaleLinear([config.ch, config.mt]).domain([0,yMax]),
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
    let nested = Array.from(group(data.filter(i=>{ return !hiddenSeries.includes(i[series])}), d => d[xAxis]));

    

    let lihtcWide = nested.map(g => {
      let obj = {};
      obj["district"] = g[0]
      for (let year of Array.from(new Set(data.filter(i=>{ return !hiddenSeries.includes(i[series])}).map(d => d[series])))) {
        const match = g[1].find(d => { return d[series]==year }); 
        obj[year] = match ? match.value : null
      }
      return obj
    })


    let stacked =  stack().keys(Array.from(new Set(data.map(d => d[series]).sort((a, b) => a.key > b.key ? 1 : -1))))(lihtcWide)
    
    
    let stackedWithKey = stacked.map(d => {
          d.forEach(v => {
            v.key = d.key; 
            v.data.name = v.data[xAxis]
          })
          return d
        })

        // compute total for each stack, get max stack value, and then recompute y domain
        const stackTotalArray = nested.map(i => i[1]).map(j => sum(j, d => d[yAxis]));
        const stackMax = Math.max(...stackTotalArray);
        setYMax(stackMax + stackMax/5)
        setStackedData(stackedWithKey)
  }, [data, hiddenSeries])


  useEffect(() => {
    drawAxes();
  }, [yMax, data, hiddenSeries]);

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
        {/* <div className="legend-container">
        </div> */}
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
              stackedData
              .filter(i => { 
                return !hiddenSeries.includes(i.key)
              })
              .map(year => year.map((d, index) => (
                <rect
                  key={index}
                  x={scales.x(parseInt(d.data[xAxis]))}
                  y={scales.y(d[1])}
                  // rx="2"
                  // fill={d.data[xAxis] !== reference ? (scales.color(year)) : ("var(--grey)")}
                  fill={scales.color(d.key)}
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
              ))
             )}
          </g>
          <g className="legend">
            {stackedData
              .filter(d => { 
                return d.key !== 0
              })
              .map((j, index) => (
                <g
                  key={index}
                  opacity={hiddenSeries.includes(j.key) ? 0.2 : 1}
                  onMouseOver={() => {
                    setHovered(j.key);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                  }}
                  onClick={(e) => {
                    if (!hiddenSeries.includes(j.key)) {
                      setHiddenSeries([...hiddenSeries, j.key]);
                    } else {
                      setHiddenSeries(
                        hiddenSeries.filter((series) => series !== j.key)
                      );
                    }
                  }}
                  className="legend-entry"
                >
                  <rect
                    className="legend-rect"
                    fill={j.key === reference ? "none" : scales.color(j.key)}
                    // stroke={j.key === reference ? "gray" : scales.color(j.key)}
                    // strokeDasharray={j === reference ? "2 2" : ""}
                    rx="5"
                    ry="5"
                    height="20"
                    width="20"
                    transform={`translate(${
                      (config.height() / 7) * index + config.ml
                    }, ${config.ch + config.mb + 32})`}
                  ></rect>
                  <text
                    textAnchor="start"
                    dominantBaseline="middle"
                    className="legend-text"
                    dx="30"
                    transform={`translate(${
                      (config.height() / 7) * index + config.ml
                    }, ${config.ch + config.mb + 44})`}
                  >
                    {j.key}
                  </text>
                </g>
              ))}
          </g>
        </svg>
      </div>
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
import { useState } from "react";
import Select from "react-select";
import { allHouseData } from "../data/DSHA_SLDL_all_years/SLDL_data_objects";
import { allSenateData } from "../data/DSHA_SLDU_all_years/SLDU_data_objects";
import { generateStateAverage } from "../utils/graphUtils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
console.log(generateStateAverage(allHouseData, "Value of EEIF Grants Awarded"));
const data = generateStateAverage(allHouseData, "Value of EEIF Grants Awarded");
function GraphContainer() {
  function generateStackedBars(obj) {
    const keys = Object.keys(obj).filter((key) => key !== "name");

    const bars = keys.map((key) => (
      <Bar
        key={key}
        dataKey={key}
        stackId="stack"
        fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
      />
    ));
    return bars;
  }
  return (
    <div>
      <div className="graph-div">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* {generateStackedBars(data)} */}
            <Bar dataKey="2016" stackId="blah" fill="blue"/>
            <Bar dataKey="2017" stackId="blah" fill="red"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default GraphContainer;

import MapContainer from "./pages/MapContainer";
import { useState, createContext } from "react";
import "./App.css";
export const MapContext = createContext();
// import senateData2010 from "../data/senate_2010.json";
// import senateData2022 from "../data/senate_2022.json";
// const senateData2010Obj ={name:"senateData2010", data: senateData2010}
// const senateData2022Obj ={name:"senateData2022", data: senateData2022}
import { senateObj2014 } from "./data/DSHA_Population_SLDU_all_years/SLDU_data_objects";

function App() {
  const [source, setSource] = useState(senateObj2014);
  const [variable, setVariable] = useState("Population");
  const [year, setYear] = useState(2014);
  const [boundary, setBoundary] = useState("senate");
  return (
    <div>
      <MapContainer
        MapContext={MapContext}
        variable={variable}
        setVariable={setVariable}
        year={year}
        setYear={setYear}
        boundary={boundary}
        setBoundary={setBoundary}
        source={source}
        setSource={setSource}
      />
    </div>
  );
}

export default App;

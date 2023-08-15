import MapContainer from "./pages/MapContainer";
import { useState, createContext } from "react";
import "./App.css";
export const MapContext = createContext();

import { senateObj2014 } from "./data/DSHA_Population_SLDU_all_years/SLDU_data_objects";

function App() {
  const [source, setSource] = useState(senateObj2014);
  const [variable, setVariable] = useState("Estimated Population");
  const [points, setPoints] = useState(null);
  const [pointSource, setPointSource] = useState({name:null, data:null});
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
        points={points}
        setPoints={setPoints}
        pointSource={pointSource}
        setPointSource={setPointSource}
      />
    </div>
  );
}

export default App;

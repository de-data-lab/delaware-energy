import MapContainer from "./pages/MapContainer";
import { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
export const MapContext = createContext();

import { senateObj2016 } from "./data/DSHA_SLDU_all_years/SLDU_data_objects";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GraphContainer from "./pages/GraphContainer";

function App() {
  const [source, setSource] = useState(senateObj2016);
  const [variable, setVariable] = useState("Total Population");
  const [points, setPoints] = useState(null);
  const [pointSource, setPointSource] = useState({ name: null, data: null });
  const [year, setYear] = useState(2016);
  const [boundary, setBoundary] = useState("senate");

  return (
    <div id="page-container">
      <Header>
        Energy Efficiency Investment Funds Across Delaware's Legislative
        Districts
      </Header>
      <div id="content-container">
        <Routes>
          <Route
            path=""
            element={
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
            }
          />
          <Route path="/graph" element={<GraphContainer />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

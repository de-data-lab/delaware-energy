import React from "react";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
export const MapContext = React.createContext();

import "./index.css";

import Header from "./layout/Header";
import { MapContainer } from "./pages/MapContainer";
import { DistrictExplorer } from "./pages/DistrictExplorer";
import { Info } from "./pages/Info";
import { Footer } from "./layout/Footer";

function App() {

  // Dropdowns
  const [fundingSource, setFundingSource] = useState("LIHTC");
  // Dropdown for variable
  const [variable, setVariable] = useState("# of Tax Credit Units");
  // year
  const [year, setYear] = useState("All Time");


  return (
    <>
      <div id="page-container">
        <Header />
          <div id="content-container">
          <Routes>
            <Route path="" element={<MapContainer MapContext={MapContext} fundingSource={fundingSource} setFundingSource={setFundingSource} variable={variable} setVariable={setVariable} year={year} setYear={setYear}/>} />
            <Route path="explorer" element={<DistrictExplorer />}/>
            <Route path="info" element={<Info />} />
          </Routes>
          </div>
        <Footer />
      </div>
    </>
  );
}

export default App;

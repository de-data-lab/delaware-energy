import React from "react";
import { Route, Routes } from "react-router-dom";
export const MapContext = React.createContext();

import "./index.css";

import { MapContainer } from "./components/MapContainer";
import { Footer } from "./components/Footer";
import Header from "./components/Header";
import { DistrictExplorer } from "./components/DistrictExplorer";


function App() {
  return (
    <>
      <div id="page-container">
        <Header />
          <div id="content-container">
          <Routes>
            <Route path="/" element={<MapContainer MapContext={MapContext} />} />
            <Route path="/explorer" element={<DistrictExplorer />} />
            <Route path="/info" element={<DistrictExplorer />} />
          </Routes>
          </div>
        <Footer />
      </div>
    </>
  );
}

export default App;

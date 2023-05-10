import React from "react";
import { Route, Routes } from "react-router-dom";
export const MapContext = React.createContext();

import "./index.css";

import Header from "./components/Header";
import { MapContainer } from "./components/MapContainer";
import { DistrictExplorer } from "./components/DistrictExplorer";
import { Info } from "./components/Info";
import { Footer } from "./components/Footer";

function App() {
  return (
    <>
      <div id="page-container">
        <Header />
          <div id="content-container">
          <Routes>
            <Route path="" element={<MapContainer MapContext={MapContext} />} />
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

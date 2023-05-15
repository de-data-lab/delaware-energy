import React from "react";
import { Route, Routes } from "react-router-dom";
export const MapContext = React.createContext();

import "./index.css";

import Header from "./layout/Header";
import { MapContainer } from "./pages/MapContainer";
import { DistrictExplorer } from "./pages/DistrictExplorer";
import { Info } from "./pages/Info";
import { Footer } from "./layout/Footer";

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

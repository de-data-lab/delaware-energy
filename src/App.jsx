import React, { useState, useEffect } from 'react'; 
import './index.css';
import dshaData from './data/DSHA_districted.json'; 
import senateData from './data/aggregated_senate_new.json'; 

import { Map } from './components/Map';
import { MapContainer } from './components/MapContainer';
import { Footer } from './components/Footer';
import Header from './components/header';
import { DropdownMenu } from './components/DropdownMenu';


export const MapContext = React.createContext(); 

function App() {

  const [lng, setLng] = useState(-75.469);
  const [lat, setLat] = useState(39.063);
  const [zoom, setZoom] = useState(7.5);

  // data files change if needed
  const [mapData, setMapData] = useState(senateData);
  const [pointData, setPointData] = useState(dshaData);

  // Dropdowns
  const [fundingSource, setFundingSource] = useState("LIHTC");
  // Dropdown for variable
  const [variable, setVariable] = useState("aggregated_tax_credits");
  // building toggle
  const [building, setBuilding] = useState(false);
  // Toggle for district explorer
  const [page, setPage] = useState(true); 
  

  return (
    <div className="page-container">
      <Header page={page} setPage={setPage} />
      <MapContainer>
        {
        page ? 
          (<MapContext.Provider value={{ pointData, mapData, fundingSource, setFundingSource, variable, setVariable, building, setBuilding }}>
            <DropdownMenu />
            <Map lng={lng} lat={lat} zoom={zoom} />
          </MapContext.Provider>) 
        : 
        (<h1>District Explorer</h1>)
        }
      </MapContainer>
      <Footer/>
    </div>
  )
}

export default App

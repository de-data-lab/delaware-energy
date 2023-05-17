import React, { useState } from "react";

import dshaData from "../data/DSHA_districted.json";
import senateData from "../data/aggregated_with_geo.json";


import { DropdownMenu } from '../components/DropdownMenu';
import { Map } from './Map';


export const MapContainer = ({ MapContext }) => { 
    const [lng, setLng] = useState(-75.469);
    const [lat, setLat] = useState(39.063);
    const [zoom, setZoom] = useState(7.5);
  
    // data files change if needed
    const [mapData, setMapData] = useState(senateData);
    const [pointData, setPointData] = useState(dshaData);
  
    // Dropdowns
    const [fundingSource, setFundingSource] = useState("LIHTC");
    // Dropdown for variable
    const [variable, setVariable] = useState("# of Tax Credit Units");
    // year
    const [year, setYear] = useState(2022);
    // building toggle
    const [building, setBuilding] = useState(false);

    return (
        <MapContext.Provider value={{  pointData, mapData, fundingSource, setFundingSource, variable, setVariable, building, setBuilding, year, setYear }}>
            <DropdownMenu />
            <Map lng={lng} lat={lat} zoom={zoom} />
        </MapContext.Provider>
    )
}
import React, { useState, useEffect } from "react";

import dshaData from "../data/DSHA_districted.json";
import senateData from "../data/aggregated_with_geo_new.json";


import { DropdownMenu } from '../components/DropdownMenu';
import { Map } from './Map';
import { Slider } from "../components/Slider";


export const MapContainer = ({ MapContext, fundingSource, setFundingSource,variable, setVariable, year, setYear }) => { 
    const [lng, setLng] = useState(-75.469);
    const [lat, setLat] = useState(39.063);
    const [zoom, setZoom] = useState(7.5);
  
    // data files change if needed
    const [mapData, setMapData] = useState(senateData);
    const [pointData, setPointData] = useState(dshaData);
    
   
    // building toggle
    const [building, setBuilding] = useState(false);

    return (
        <MapContext.Provider value={{  pointData, mapData, fundingSource, setFundingSource, variable, setVariable, building, setBuilding, year, setYear }}>
            <DropdownMenu />
            {/* <Slider /> */}
            <Map lng={lng} lat={lat} zoom={zoom} />
        </MapContext.Provider>
    )
}
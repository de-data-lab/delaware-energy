import React, { useState } from "react";

import dshaData from "../data/DSHA_districted.json";
import senateData from "../data/aggregated_with_geo2020.json";

import { DropdownMenu } from '../components/DropdownMenu';
import { HoverInfo } from '../components/HoverInfo';
import { Map } from './Map';

export const MapContainer = ({ MapContext, fundingSource, setFundingSource,variable, setVariable, year, setYear, boundary, setBoundary }) => { 
    const [lng, setLng] = useState(-75.469);
    const [lat, setLat] = useState(39.063);
    const [zoom, setZoom] = useState(7.5);
  
    // data files change if needed
    const [mapData, setMapData] = useState(senateData);
    const [pointData, setPointData] = useState(dshaData);
    
    // building toggle
    const [building, setBuilding] = useState(false);

    return (
        <MapContext.Provider value={{ pointData, mapData, fundingSource, setFundingSource, variable, setVariable, building, setBuilding, year, setYear, boundary, setBoundary }}>
            <DropdownMenu />
            <Map lng={lng} lat={lat} zoom={zoom} />
        </MapContext.Provider>
    )
}
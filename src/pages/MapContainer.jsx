import React, { useState } from "react";
import Map from "../components/Map";
import DropdownMenu from "../components/DropdownMenu";

function MapContainer({
  MapContext,
  variable,
  setVariable,
  year,
  setYear,
  boundary,
  setBoundary,
  source,
  setSource,
}) {
  return (
    <MapContext.Provider
      value={{
        variable,
        setVariable,
        year,
        setYear,
        boundary,
        setBoundary,
        source,
        setSource,
      }}
    >
        <DropdownMenu/>
      <Map />
    </MapContext.Provider>
  );
}

export default MapContainer;

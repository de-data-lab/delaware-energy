import Map from "./components/map";
import { useState, createContext } from "react";
import "./App.css";
export const MapContext = createContext()
// import senateData2010 from "../data/senate_2010.json";
// import senateData2022 from "../data/senate_2022.json";
// const senateData2010Obj ={name:"senateData2010", data: senateData2010}
// const senateData2022Obj ={name:"senateData2022", data: senateData2022}

function App() {
  // const[source,setSource]= useState(senateData2010Obj)
  return (
    <div>
      <Map />
    </div>
  );
}

export default App;

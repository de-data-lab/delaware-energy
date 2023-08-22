import {scaleSequential, interpolateRdYlBu, interpolateBlues, interpolateOranges, interpolateGreens, bin, extent} from 'd3'; 

function colorPalette(data) {
  // Necessary to convert to numbers from strings
  
  let domain = extent(data); // return min and max
  let myColor = scaleSequential(interpolateGreens).domain(domain); // generate color scale
  let bin1 = bin(); 
  const myBin = bin1(data); // generate bins
  const stops = myBin.map(i => { 
    return [i.x0, myColor(i.x0) ]
  });
  
  return stops; 
}

export default colorPalette; 
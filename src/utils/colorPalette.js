import {scaleSequential, interpolateRdYlBu, interpolateBlues, interpolateOranges, interpolateGreens, bin, extent, interpolateArray} from 'd3'; 
import * as d3 from 'd3'

const startColor = d3.color('white')
const endColor = d3.color('#005a32')

function colorPalette(data) {
  // Necessary to convert to numbers from strings
  
  let domain = extent(data); // return min and max
  let myColor = scaleSequential(d3.interpolateRgb(startColor, endColor)).domain(domain); // generate color scale
  let bin1 = bin(); 
  const myBin = bin1(data); // generate bins
  const stops = myBin.map(i => { 
    return [i.x0, myColor(i.x0) ]
  });
  
  return stops; 
}

export default colorPalette; 
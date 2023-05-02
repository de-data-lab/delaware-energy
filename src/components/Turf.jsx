// Turf 
import Papa from 'papaparse'; 
import rhumbDistance from '@turf/rhumb-distance';
import { featureCollection, point } from '@turf/helpers'; 
import nearestPoint from '@turf/nearest-point';


export const Turf = () => {
  const [data, setData] = useState(null); 
  const [selected, setSelected] = useState({to: null, from: null, nearestPointFrom: null});
  const [results, setResults] = useState({distance: null, nearest: null})
  
  // Import csv data
const loadData = (file) => { 
  Papa.parse(file, {
    download: true, 
    header: true,
    delimiter: ",",
    complete: results => { locate(results.data)},
    error: (error) => { console.log(error) }
})
}

//  Once data is imported, data passed on
const locate = (data) => { 

 setData(data); 
//  setSelected(data[0]);
}


useEffect(() => {    
 loadData("/hud_data.csv")
}, [])

// Distance search
const searchDistance = () => {
  if (selected.from && selected.to !== null) {
    let from = point([selected.from.LATITUDE, selected.from.LONGITUDE]);
    let to = point([selected.to.LATITUDE, selected.to.LONGITUDE]);
    const options = {units: 'miles'};
        
    let distance = rhumbDistance(from, to, options);
    setResults({...results, distance: distance.toFixed(2)})
  }
}

// Nearest Point
  const searchNearestPoint = () => {
    
    if (selected.nearestPointFrom !== null) {
      let targetPoint = point([selected.nearestPointFrom.LATITUDE, selected.nearestPointFrom.LONGITUDE])
      let pointsObject = []
      
      data.forEach((property, i) => {
        if (property.LATITUDE || property.LONGITUDE) {
          pointsObject[i] = point([property.LATITUDE, property.LONGITUDE])
          return pointsObject
        }
      })

      if (pointsObject.length > 0 && targetPoint) {
        let points = featureCollection(pointsObject)
        console.log(pointsObject)
        console.log(points)
        let nearest = nearestPoint(targetPoint, points);
        console.log(nearest)
        setResults({...results, nearest: nearest})
      }
      
    }
  }

    return (
      <div>
        <label>From:</label>
        <select onChange = {(e) => { setSelected({...selected, from: data.find(i => i.HUD_ID === e.target.value)}) }}>
          {
          data &&
            data.map(row => (
              <option key={row.HUD_ID} value={row.HUD_ID}>
                {row.PROJECT}
              </option>
            ))
            }
        </select>
        <label>To:</label>
        <select onChange = {(e) => { setSelected({...selected, to: data.find(i => i.HUD_ID === e.target.value)}) }}>
          {
          data &&
            data.map(row => (
              <option key={row.HUD_ID} value={row.HUD_ID}>
                {row.PROJECT}
              </option>
            ))
            }
        </select>
        <button onClick={searchDistance}>Search</button>
        <div>
          { results.distance && 
          <h2>
          {results.distance} miles
          </h2>
          }
        </div>
        
        <label>Nearest Property</label>
        <select onChange = {(e) => { setSelected({...selected, nearestPointFrom: data.find(i => i.HUD_ID === e.target.value)}) }}>
          {
          data &&
            data.map(row => (
              <option key={row.HUD_ID} value={row.HUD_ID}>
                {row.PROJECT}
              </option>
            ))
            }
        </select>
        <button onClick={searchNearestPoint}>Search</button>
        <div>
          { results.nearest && 
          <h2>
          {results.nearest}
          </h2>
          }
        </div>
      </div>
    )
  };
  
export function generateAverage(allDataObj, key) {
  return allDataObj.reduce((result, dataObj) => {
    result[dataObj.year] = calculateAverage(dataObj.data.features, key);
    return result;
  }, {});
}

export function calculateAverage(features, key) {
  if (features.length === 0) {
    return 0;
  }

  const total = features.reduce((acc, feature) => {
    const value = feature.properties[key];
    if (!isNaN(value)) {
      return acc + value;
    } else {
      return acc;
    }
  }, 0);

  return total / features.length;
}
export function generateStateAverage(allDataObj, key) {
  return { name: "State Average", ...generateAverage(allDataObj, key) };
}

export function generateDistrictData(allDataObj,key, districtNum){
  return allDataObj.reduce((result, dataObj)=>{
    console.log(districtNum)
    console.log(dataObj.data.features)
    const foundDistrict = dataObj.data.features.find(obj => obj.properties["District"] === districtNum)
    console.log(foundDistrict.properties[key])
    result[dataObj.year] = foundDistrict.properties[key]
    return result
  },{name: `District ${districtNum}`})
}
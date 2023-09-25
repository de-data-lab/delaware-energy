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

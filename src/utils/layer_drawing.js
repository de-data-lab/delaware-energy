import colorPalette from "./colorPalette";

export const addNewLayer = (map, sourceName, data, variable) => {
  let aggregatedData = [];
  aggregatedData = data.features.map((district) =>
    district.properties[variable] === null ? 0 : district.properties[variable]
  );
  let stops = colorPalette(aggregatedData);

  const colorArray = [
    "interpolate",
    ["linear"],
    ["to-number", ["get", variable]],
  ];

  function determineLegendTitle() {
    if (variable === "Total Population") {
      return "Total Population";
    }
    if(variable === "Solar Households per 1000"){
      return "Solar Households per 1000 Households"
    } 
    if(variable === "Value of EEIF Grants Awarded"){
      return "Value of EEIF Grants Awarded in Dollars";
    }
    else {
      return "Test Legend Title";
    }
  }

  function determineLabels(){
    if (variable == "Value of EEIF Grants Awarded"){
      return  {
        0: "0",
        // Avg allocation
        1000: "$1K",
        1500: "$1.5K",
        2000: "$2K",
        5000: "$5K",
        2000: "$2K",
        2500: "$2.5K",
        3000: "$3K",
        3500: "$3.5K",
        4000: "$4K",
        5000: "$5K",
        6000: "$6K",
        7000: "$7K",
        8000: "$8K",
        10000: "$10K",
        12000: "$12K",
        14000: "$14K",
        15000: "$15K",
        16000: "$16K",
        18000: "$18K",
        20000: "$20K",
        25000: "$25K",
        30000: "$30K",
        35000: "$35K",
        40000: "$40K",
        50000: "$50K",
        60000: "$60K",
        80000: "$80K",
        100000: "$100K",
        120000: "$120K",
        140000: "$140k",
        150000: "$150K",
        160000: "$160K",
        200000: "$200K",
        250000: "$250K",
        300000: "$300K",
        400000: "$400K",
        500000: "$500K",
        600000: "$600K",
        700000: "$700K",
        800000: "$800K",
        1000000: "$1M",
        1200000: "$1.2M",
        1400000: "$1.4M",
        1500000: "$1.5M",
        1600000: "$1.6M",
        1800000: "$1.8M",
        2000000: "$2M",
        3000000: "$3M",
        4000000: "$4M",
        5000000: "$5M",
        6000000: "$6M",
        7000000: "$7M",
        8000000: "$8M",
      }
    }
  }

  stops.forEach((arr) => {
    colorArray.push(arr[0]);
    colorArray.push(arr[1]);
  });

  map.addSource(sourceName, {
    type: "geojson",
    data: data,
    generateId: true,
  });

  map.addLayer({
    id: "fill",
    type: "fill",
    source: sourceName,
    layout: {},
    paint: {
      "fill-color": colorArray,
      "fill-color-transition":{duration:20000},
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        0,
        ["boolean", ["feature-state", "click"], false],
        1,
        0.75,
      ],
    },
    metadata: {
      name: determineLegendTitle(),
      labels:determineLabels()
    },
  });

  map.addLayer({
    id: "line",
    type: "line",
    source: sourceName,
    paint: {
      "line-color": "#2c3d4f",
      "line-width": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        4,
        ["boolean", ["feature-state", "click"], false],
        4,
        1,
      ],
      "line-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        ["boolean", ["feature-state", "click"], false],
        1,
        0.5,
      ],
    },
  });
};

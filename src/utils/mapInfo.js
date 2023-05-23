export const mapInfo = {
  LIHTC: {
    meta: {
      source: [
        { name: "DSHA Housing Data", link: "http://www.destatehousing.com" },
      ],
      title: "Low-income Housing Tax Credits",
      displayName: "LIHTC",
    },
    columns: {
      ["# of Tax Credit Units"]: "Total tax credit units",
      ["ALLOCATION AMOUNT"]: "Total allocation amount",
      ["Average Allocation per Tax Credit Unit"]: "Average allocation amount per tax credit unit",
      ["Average Allocation per 100 Persons"]: "Average allocation amount per 100 persons",
      ["Average Population per Tax Credit Unit"]: "Average population per tax credit unit",
      ["adj_popula"]: "Population",
    },
    years: {
      "All Time": "All Years",
      2022: "2022",
      2021: "2021",
      2020: "2020",
      2019: "2019",
      2018: "2018",
      2017: "2017",
      2016: "2016",
    },
  },
};

export default mapInfo;

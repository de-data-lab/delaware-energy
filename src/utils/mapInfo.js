export const mapInfo = {
  LIHTC: {
    meta: {
      source: [
        {name: "DSHA Housing Data", link: "https://www.cdc.gov/places"},
      ],
      title: "Low-income Housing Tax Credits",
      displayName: "LIHTC"
    },
    columns: {
      ["aggregated_tax_credits"]: "Total tax credit units",
      ["aggregated_allocation_amount"]: "Total allocation amount",
      ["avg_allocation_per_unit"]: "Average allocation amount per unit",
      ["avg_allocation_per_100_persons"]: "Allocation amount per 100 persons",
      ["avg_population_per_tax_credit"]: "Avg population per tax credit",
      ["adj_popula"]: "Population",
    },
  },
};

export default mapInfo; 
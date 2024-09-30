import moment from "moment";

export function useYearOptions() {
  const startYear = 2024;
  const currYear = moment(Date.now()).get("year");
  const years = getAbleYears(startYear, currYear);

  const yearOpts = years.map((year) => ({ label: year.toString(), value: year }));

  return yearOpts;
}

function getAbleYears(startYear: number, currYear: number) {
  const ableYears = [];
  for (let year = startYear; year <= currYear; year++) {
    ableYears.push(year);
  }
  return ableYears;
}

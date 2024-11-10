// @ts-ignore
import shindenDescription from "@docchi/shinden-description";

export const download_discribe = async (series: string) => {
  console.log(await shindenDescription(series));
};

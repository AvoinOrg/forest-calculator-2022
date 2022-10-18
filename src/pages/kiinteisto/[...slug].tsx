import fetch from "isomorphic-unfetch";
import Head from "next/head";
import Boiler from "../../components/Boiler";
import NotFound from "../../components/NotFound";
import { subPages } from "../../utils";

const FORESTRIES = ["forestry_2", "forestry_3"];

const Estate = (props) => {
  return (
    <>
      <Head>
        <title>{props.data ? props.data.title : "Haku"} - Metsälaskuri</title>
        <meta name="viewport" />
      </Head>
      {props.data ? (
        <Boiler
          data={props.data}
          id={props.id}
          subPage={props.subPage}
          type={props.type}
          redirect={props.redirect}
        />
      ) : (
        <NotFound id={props.id} status={props.status} />
      )}
    </>
  );
};

// const getPrices = (code) => {
//   let val;
//   let prices;
//   try {
//     val = prov_map.find((x) => x.kunta_koodi === code).maakunta_koodi;
//     prices = price_map.filter((x) => x.Alueet.includes(val));
//   } catch (err) {}

//   if (!prices) prices = price_map.filter((x) => x.Alueet.includes("01"));

//   const realPrices = {};
//   for (const p of prices) {
//     const avgT = (Number(p.Mat) + Number(p.Kut) + Number(p.Kot)) / 3;
//     const avgK = (Number(p.Mak) + Number(p.Kuk) + Number(p.Kok)) / 3;
//     realPrices[p.Hakkuutapa] = { Kuit: avgK, Tuk: avgT };
//   }

//   return realPrices;
// };

const formatForestry = (forestry, forestArea) => {
  const formatted = {};

  // sum values together, etc
  for (const i in forestry) {
    for (const [key, value] of Object.entries(forestry[i])) {
      if (key === "area") {
        continue;
      }

      if (Number(i) === 0) {
        formatted[key] = value;
        continue;
      }

      if (
        key.includes("Bio") ||
        key.includes("Maa") ||
        key.includes("Sha") ||
        key.includes("NPV")
      ) {
        formatted[key] += forestry[i]["area"] * value;
        continue;
      }

      formatted[key] += value;
    }
  }

  const total = forestry.length;

  // get averages and stuff
  for (const [key, value] of Object.entries(formatted)) {
    if (
      key.includes("Bio") ||
      key.includes("Maa") ||
      key.includes("Sha") ||
      key.includes("NPV")
    ) {
      formatted[key] = value / forestArea;
      continue;
    }
  }

  return formatted;
};

const formatItemData = (itemData) => {
  const data = {};

  data["totalArea"] = itemData["total_area"];
  data["forestArea"] = itemData["forest_area"];
  data["estateIdText"] = itemData["estate_id_text"];
  data["geometry"] = JSON.parse(itemData["geometry"]);

  data["forestry_2"] = formatForestry(
    itemData["forestry_2"],
    itemData["forest_area"]
  );

  data["forestry_3"] = formatForestry(
    itemData["forestry_3"],
    itemData["forest_area"]
  );

  return data;
};

// const getPrice = (comparisonData, year, prices) => {
//   const kuit =
//     Number(comparisonData.forecast_data[3]["Kuit" + year]) *
//     prices["Harvennus"]["Kuit"];
//   const tuk =
//     Number(comparisonData.forecast_data[3]["Tuk" + year]) *
//     prices["Harvennus"]["Tuk"];
//   return tuk + kuit;
// };

// const formatCompareData = (comparisonData, prices) => {
//   const forecastVals = {};

//   const forecastHa =
//     comparisonData.forest_area - comparisonData.non_forecasted_area;

//   for (let key in forestryIndexes) {
//     const fi = forestryIndexes[key];
//     const forecast = {
//       P1: getPrice(comparisonData, 1, prices),
//       P2: getPrice(comparisonData, 2, prices),
//       P3: getPrice(comparisonData, 2, prices),
//       P4: getPrice(comparisonData, 3, prices),
//       P5: getPrice(comparisonData, 5, prices),
//     };
//     forecastVals[fi] = forecast;
//   }

//   const data = {
//     title: comparisonData.NAMEFIN,
//     areaHa: comparisonData.TOTALAREA * 100,
//     forestHa: comparisonData.forest_area,
//     forecastHa: forecastHa,
//     forecastVals: forecastVals,
//   };

//   return data;
// };

export const getServerSideProps = async (req) => {
  const id = req.query.slug[0];
  let subPage = null;
  let redirect = false;

  if (req.query.slug.length > 1) {
    const param = req.query.slug[1].toLowerCase();
    if (subPages.includes(param)) {
      subPage = param;
    }
  }

  if (!subPage) {
    subPage = subPages[0];

    if (req.query.slug.length > 1) {
      redirect = true;
    }
  }

  // const res = await fetch(process.env.API_URL + "/estate/" + id);
  const res = await fetch("https://localhost:3001/api" + "/estate/" + id);

  let data = null;

  if (res.status === 200) {
    const json = await res.json();
    data = formatItemData(json.estate);
  }

  const props = {
    props: {
      data,
      subPage,
      id,
      type: "estate",
      redirect,
      status: res.status,
    },
  };

  return props;
};

export default Estate;

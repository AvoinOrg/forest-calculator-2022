import fetch from "isomorphic-unfetch";
import Head from "next/head";
import Boiler from "../../components/Boiler";
import NotFound from "../../components/NotFound";
import { forestryIndexes, subPages } from "../../utils";

import price_map from "../../public/prices.json";
import prov_map from "../../public/prov_mun.json";

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
          comparisonData={props.comparisonData}
          id={props.id}
          subPage={props.subPage}
          type={props.type}
          redirect={props.redirect}
        />
      ) : (
        <NotFound text="Kiinteistötunnusta" id={props.id} />
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

const formatItemData = (itemData) => {
  const data = {};
  const forestry_1 = {};
  const forestry_2 = {};

  data["totalArea"] = itemData["total_area"];
  data["estateIdText"] = itemData["estate_id_text"];

  for (const i in itemData) {
    itemData[i];
  }

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

Estate.getInitialProps = async (req) => {
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

  const res = await fetch(process.env.API_URL + "/estate/" + id);

  let data = null;
  let comparisonData = null;

  if (res.status === 200) {
    const json = await res.json();
    data = formatItemData(json.estate);
  }

  return { data, comparisonData, subPage, id, type: "estate", redirect };
};

export default Estate;

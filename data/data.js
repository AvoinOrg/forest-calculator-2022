const { Pool } = require("pg");
const { v4 } = require("uuid");
const nodemailer = require("nodemailer");
const _ = require("lodash");

require("dotenv").config();

const COLS = [
  "Nku1",
  "Nku2",
  "Nku3",
  "Nku4",
  "Nku5",
  "Pku1",
  "Pku2",
  "Pku3",
  "Pku4",
  "Pku5",
  "NPV3",
  "Bio0",
  "Bio1",
  "Bio2",
  "Bio3",
  "Bio4",
  "Bio5",
  "Maa0",
  "Maa1",
  "Maa2",
  "Maa3",
  "Maa4",
  "Maa5",
  "Sha1",
  "Sha2",
  "Sha3",
  "Sha4",
  "Sha5",
];

const FORESTRIES = ["forestry_2", "forestry_3"];

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  database: process.env.PG_DBNAME,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const parseRes = (status, resData) => ({
  status,
  resData,
});

const formatEstateId = (id) => {
  id_parts = id.split("-");

  id_parts[0] = _.padStart(id_parts[0], 3, "0");
  id_parts[1] = _.padStart(id_parts[1], 3, "0");
  id_parts[2] = _.padStart(id_parts[2], 4, "0");
  id_parts[3] = _.padStart(id_parts[3], 4, "0");

  return id_parts.join("");
};

const formatData = (data, forestryData) => {
  // loop through data object and select columns and forestries
  const data_formatted = {};
  data_formatted["geometry"] = data[0].geometry_json;
  data_formatted["estate_id_text"] = data[0].estate_id_text;
  data_formatted["total_area"] = data[0].total_area / 10000; // square meters to hectares

  for (const i in FORESTRIES) {
    data_formatted[FORESTRIES[i]] = [];
  }

  let forestArea = 0;

  for (const i in forestryData) {
    const area = Number(forestryData[i].area);
    forestArea += Number(area);

    for (const j in FORESTRIES) {
      const f = forestryData[i][FORESTRIES[j]];
      const new_f = { area: area };

      for (const k in COLS) {
        new_f[COLS[k]] = f[COLS[k]];
      }

      data_formatted[FORESTRIES[j]].push(new_f);
    }
  }

  data_formatted["forest_area"] = forestArea;
  return data_formatted;
};

const nmUser = process.env.NODEMAILER_USER;
const nmEmail = process.env.NODEMAILER_EMAIL;

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.eu",
  port: 465,
  secure: true,
  auth: {
    user: nmUser,
    pass: process.env.NODEMAILER_PASS,
  },
});

const getEstate = async (id) => {
  const formId = formatEstateId(id);

  try {
    const res = await Promise.all([
      pool.query(
        ` 
        SELECT f.area, f.forestry_1, f.forestry_2, f.forestry_3, 
          f.forestry_4
        FROM 
            (SELECT 
              geometry
            FROM estate WHERE estate_id = $1) 
            AS e
        LEFT JOIN
            forest_parcel f
        ON 
          ST_INTERSECTS(e.geometry, f.geometry)
        AND
          ST_WITHIN(ST_POINTONSURFACE(f.geometry), e.geometry)
      `,
        [formId]
      ),
      pool.query(
        `
        SELECT
            estate_id_text, estate_id,
            ST_AREA(ST_ASGEOJSON(ST_UNION(geometry))) as total_area,
            ST_ASGEOJSON(ST_UNION(geometry)) as geometry_json
        FROM estate WHERE estate_id = $1 
        GROUP BY estate_id_text, estate_id;
        `,
        [formId]
      ),
    ]);

    if (res[0].rows.length > 0) {
      const data = formatData(res[1].rows, res[0].rows);
      return parseRes(200, data);
    } else {
      return parseRes(404, null);
    }
  } catch (err) {
    console.log(err);
    return parseRes(500, null);
  }
};

const sendOrder = async (data) => {
  date = Date.now();
  pool.query(
    `
      INSERT INTO 
        customer_order(
          id,
          ts,
          customer_name,
          email,
          areaId,
          areaType,
          orderType
        )
      VALUES(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
      )
    `,
    [
      v4(),
      date,
      data.name,
      data.email,
      data.areaId,
      data.areaType,
      data.orderType,
    ],
    (err) => {
      if (err) {
        console.log(err);
        return 500;
      } else {
        transporter
          .sendMail({
            from: `"Uusi tilaus - Metsälaskuri" <${forestUser}>`,
            to: nmEmail,
            subject: "Uusi tilaus: " + data.areaId,
            text: `
              Nimi: ${data.name}
              Email: ${data.email}
              Alueen tyyppi: ${data.areaType}
              Alueen nimi/tunnus: ${data.areaId}
              Tilauksen tyyppi: ${data.orderType}
              Ajankohta: ${new Date(date)}
            `,
          })
          .then((result) => console.log(result))
          .catch((error) => console.error(error));
        return 200;
      }
    }
  );
};

module.exports = { getEstate, sendOrder };

import fetch from "isomorphic-unfetch";
import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import Router from "next/router";
import Link from "next/link";
import _ from "lodash";

import { Theme } from "../styles";
import MunicipalityOutline from "./MunicipalityOutline";
import StockChart from "./StockChart";
import LineChart from "./LineChart";
import {
  subTitles,
  navTitles,
  subPages,
  radioVals,
  roundVal,
  getRatio,
  addThousandSpaces,
} from "../utils";

interface Props {
  data: any;
  id: string;
  subPage: string;
  type: string;
  redirect: boolean;
}

const Boiler = (props: Props) => {
  const [ready, setReady] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);

  const [chartVals, setChartVals] = useState<any>({});
  const [checked, setChecked] = useState({
    radio1: true,
    radio2: false,
    radio3: false,
  });

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formVal, setFormVal] = useState(props.data.estateIdText);
  const [isSending, setIsSending] = useState(false);

  const root = "/kiinteisto/";
  const typeName = "estate";

  const formNameTitle = "Kiinteistötunnus";

  const dropdownRef = useRef(null);

  // const forestryIndex = forestryIndexes[props.subPage];

  const handleOrderButtonClick = (e) => {
    Router.push(root + props.id + "/tilaus");
  };

  const handleArrowClick = (e) => {
    const spIndex = subPages.indexOf(props.subPage);
    const spNext = subPages[spIndex + 1];

    Router.push("/kiinteisto/" + props.id + "/" + spNext);
  };

  const handleArrowBackClick = (e) => {
    const spIndex = subPages.indexOf(props.subPage);
    const spPrev = subPages[spIndex - 1];

    Router.push("/kiinteisto/" + props.id + "/" + spPrev);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setisDropdownOpen(false);
    }
  };

  const handleRadioClick = (e) => {
    const radioChecks = {
      radio1: false,
      radio2: false,
      radio3: false,
    };

    radioChecks[e.target.value] = true;
    setChecked(radioChecks);
  };

  const getFormData = (): string => {
    let radioVal = "radio1";
    for (let key in checked) {
      if (checked[key]) {
        radioVal = key;
        break;
      }
    }

    const body = {
      name: formName,
      email: formEmail,
      areaId: formVal,
      areaType: typeName,
      orderType: radioVals[radioVal],
    };

    return JSON.stringify(body);
  };

  const handleSubmit = (e) => {
    setIsSending(true);
    fetch(process.env.API_URL + "/tilaus", {
      method: "POST",
      body: getFormData(),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsSending(false);
        if (res.status === 200) {
          Router.push("/tilaus");
        } else {
          Router.push("/tilaus_error");
        }
      })
      .catch((error) => {
        setIsSending(false);
        Router.push("/tilaus_error");
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    if (props.redirect) {
      Router.push(Router.pathname, root + props.id + "/", {
        shallow: true,
      });
    }

    const chartData = {
      nitrogen: {},
      phosphorus: {},
      cash: {},
      carbon: {},
      shannon: {},
    };

    chartData.nitrogen = {
      2: [
        props.data.forestry_2.Nku1,
        props.data.forestry_2.Nku2,
        props.data.forestry_2.Nku3,
        props.data.forestry_2.Nku4,
        props.data.forestry_2.Nku5,
      ],
      3: [
        props.data.forestry_3.Nku1,
        props.data.forestry_3.Nku2,
        props.data.forestry_3.Nku3,
        props.data.forestry_3.Nku4,
        props.data.forestry_3.Nku5,
      ],
    };

    chartData.phosphorus = {
      2: [
        props.data.forestry_2.Pku1,
        props.data.forestry_2.Pku2,
        props.data.forestry_2.Pku3,
        props.data.forestry_2.Pku4,
        props.data.forestry_2.Pku5,
      ],
      3: [
        props.data.forestry_3.Pku1,
        props.data.forestry_3.Pku2,
        props.data.forestry_3.Pku3,
        props.data.forestry_3.Pku4,
        props.data.forestry_3.Pku5,
      ],
    };

    chartData.carbon = {
      2: [
        props.data.forestry_2.Bio0 + props.data.forestry_2.Maa0,
        props.data.forestry_2.Bio1 + props.data.forestry_2.Maa1,
        props.data.forestry_2.Bio2 + props.data.forestry_2.Maa2,
        props.data.forestry_2.Bio3 + props.data.forestry_2.Maa3,
        props.data.forestry_2.Bio4 + props.data.forestry_2.Maa4,
        props.data.forestry_2.Bio5 + props.data.forestry_2.Maa5,
      ],
      3: [
        props.data.forestry_3.Bio0 + props.data.forestry_3.Maa0,
        props.data.forestry_3.Bio1 + props.data.forestry_3.Maa1,
        props.data.forestry_3.Bio2 + props.data.forestry_3.Maa2,
        props.data.forestry_3.Bio3 + props.data.forestry_3.Maa3,
        props.data.forestry_3.Bio4 + props.data.forestry_3.Maa4,
        props.data.forestry_3.Bio5 + props.data.forestry_3.Maa5,
      ],
    };

    chartData.shannon = {
      2: [
        props.data.forestry_2.Sha1,
        props.data.forestry_2.Sha2,
        props.data.forestry_2.Sha3,
        props.data.forestry_2.Sha4,
        props.data.forestry_2.Sha5,
      ],
      3: [
        props.data.forestry_3.Sha1,
        props.data.forestry_3.Sha2,
        props.data.forestry_3.Sha3,
        props.data.forestry_3.Sha4,
        props.data.forestry_3.Sha5,
      ],
    };

    chartData.cash = {
      2: [props.data.forestry_2.NPV3],
      3: [props.data.forestry_3.NPV3],
    };

    setChartVals(chartData);

    document.addEventListener("mousedown", handleOutsideClick);

    setReady(true);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (props.subPage === "tilaus") {
      setIsLastPage(true);
    } else {
      setIsLastPage(false);
    }
  });

  return (
    <>
      {ready && (
        <>
          <Container>
            <Overlay>
              <GraphContainer>
                <Link href={"/"}>
                  <LogoContainer>
                    <Logo />
                    {/* <LogoTextContainer>
                      <LogoText>Silvan Metsälaskuri</LogoText>
                      <LogoTitle />
                    </LogoTextContainer> */}
                  </LogoContainer>
                </Link>
                <MunOutlineContainer>
                  <MunicipalityOutline geometry={props.data.geometry} />
                </MunOutlineContainer>
                {!isLastPage ? (
                  <>
                    {props.subPage === "vesistovaikutukset" && (
                      <>
                        <BalanceRow>
                          <ChartContainerNarrow>
                            <ChartTitle>Typpi</ChartTitle>
                            <LineChart
                              data={chartVals.nitrogen}
                              colNames={["Jaksollinen", "Jatkuvapeitteinen"]}
                              xNames={["10v", "20v", "30v", "40v", "50v"]}
                              unit={"kg"}
                            />
                          </ChartContainerNarrow>
                          <ChartContainerNarrow>
                            <ChartTitle>Fosfori</ChartTitle>
                            <LineChart
                              data={chartVals.phosphorus}
                              colNames={["Jaksollinen", "Jatkuvapeitteinen"]}
                              xNames={["10v", "20v", "30v", "40v", "50v"]}
                              unit={"kg"}
                            />
                          </ChartContainerNarrow>
                        </BalanceRow>
                      </>
                    )}
                    {props.subPage === "talous" && (
                      <>
                        <BalanceRow>
                          <ChartContainer>
                            <ChartTitle>Nettotulojen nykyarvo</ChartTitle>
                            <StockChart
                              data={chartVals.cash}
                              colNames={["Jaksollinen", "Jatkuvapeitteinen"]}
                              unit={"€"}
                            />
                          </ChartContainer>
                        </BalanceRow>
                      </>
                    )}
                    {props.subPage === "hiilivarasto" && (
                      <>
                        <BalanceRow>
                          <ChartContainer>
                            <ChartTitle>Hiilivarasto</ChartTitle>
                            <LineChart
                              data={chartVals.carbon}
                              colNames={["Jaksollinen", "Jatkuvapeitteinen"]}
                              xNames={[
                                "0v",
                                "10v",
                                "20 v",
                                "30v",
                                "40v",
                                "50v",
                              ]}
                              unit={"t"}
                            />
                          </ChartContainer>
                        </BalanceRow>
                      </>
                    )}
                    {props.subPage === "monimuotoisuus" && (
                      <DiversityImageContainer>
                        <DiversityImage />
                      </DiversityImageContainer>
                    )}
                  </>
                ) : (
                  <>
                    {/* <ExampleContainer>
                      <Example />
                    </ExampleContainer> */}
                    {/* <GraphContainer>
                      <StockChart
                        data={{
                          item: {
                            Maa: 139.52681923424467,
                            Bio: 67.07519673777917
                          }
                        }}
                        colNames={stockColNames}
                      />
                    </GraphContainer> */}
                  </>
                )}
              </GraphContainer>
              <TextContainer>
                <TopContainer>
                  <WaveContainerTop>
                    <WaveTop />
                  </WaveContainerTop>
                  <BackgroundContainer>
                    <AvoinLink>
                      <AvoinLogo />
                    </AvoinLink>
                    <Title>{props.data.estateIdText}</Title>
                    <InfoTextContainer>
                      <InfoTextRowFirst>
                        <InfoTextKey>Pinta-ala:&nbsp;&nbsp;</InfoTextKey>
                        <InfoTextValue>
                          {addThousandSpaces(
                            roundVal(props.data.totalArea, 2)
                          ) + "ha"}
                        </InfoTextValue>
                      </InfoTextRowFirst>
                      <InfoTextRow>
                        <InfoTextKey>Metsää:&nbsp;&nbsp;</InfoTextKey>
                        <InfoTextValue>
                          {addThousandSpaces(
                            roundVal(props.data.forestArea, 2)
                          ) + "ha"}
                        </InfoTextValue>
                      </InfoTextRow>
                      {/* <InfoTextRow>
                        <InfoTextKey>
                          Laskennan kattavuus:&nbsp;&nbsp;
                        </InfoTextKey>
                        <InfoTextValue>
                          {roundVal(
                            getRatio(
                              props.data.forecastHa,
                              props.data.forestHa
                            ),
                            1
                          ) + "%"}
                        </InfoTextValue>
                      </InfoTextRow> */}
                    </InfoTextContainer>
                    {/* <OrderButton onClick={handleOrderButtonClick}>
                      <OrderButtonInner>
                        <OrderButtonText>
                          Tilaa metsäsuunnitelma
                        </OrderButtonText>
                      </OrderButtonInner>
                    </OrderButton> */}
                  </BackgroundContainer>
                </TopContainer>
                <BottomContainer>
                  <WaveContainerBottom>
                    <WaveBottom />
                  </WaveContainerBottom>
                  <BackgroundContainer>
                    <ContentContainer>
                      <ForestryDropdownTitle></ForestryDropdownTitle>
                      <ForestryDropdown ref={dropdownRef}>
                        <ForestryDropdownSelected
                          onClick={(e) => {
                            setisDropdownOpen(!isDropdownOpen);
                          }}
                        >
                          <ForestryLink>
                            {navTitles[props.subPage]}
                          </ForestryLink>
                          {isDropdownOpen ? (
                            <ForestryLink>&#x2c4;</ForestryLink>
                          ) : (
                            <ForestryLink> &#x2c5;</ForestryLink>
                          )}
                        </ForestryDropdownSelected>
                        <ForestryDropdownItems isOpen={isDropdownOpen}>
                          {props.subPage !== "vesistovaikutukset" && (
                            <Link href="/[root]/[id]" as={root + props.id}>
                              <ForestryLink
                                onClick={(e) => {
                                  setisDropdownOpen(false);
                                }}
                              >
                                Vesistövaikutukset
                              </ForestryLink>
                            </Link>
                          )}
                          {props.subPage !== "talous" && (
                            <Link href={root + props.id + "/talous"}>
                              <ForestryLink
                                onClick={(e) => {
                                  setisDropdownOpen(false);
                                }}
                              >
                                Talous
                              </ForestryLink>
                            </Link>
                          )}
                          {props.subPage !== "hiilivarasto" && (
                            <Link href={root + props.id + "/hiilivarasto"}>
                              <ForestryLink
                                onClick={(e) => {
                                  setisDropdownOpen(false);
                                }}
                              >
                                Hiilivarasto
                              </ForestryLink>
                            </Link>
                          )}
                          {props.subPage !== "monimuotoisuus" && (
                            <Link href={root + props.id + "/monimuotoisuus"}>
                              <ForestryLink
                                onClick={(e) => {
                                  setisDropdownOpen(false);
                                }}
                              >
                                Monimuotoisuus
                              </ForestryLink>
                            </Link>
                          )}
                          {!isLastPage && (
                            <Link href={root + props.id + "/tilaus"}>
                              <ForestryLink
                                onClick={(e) => {
                                  setisDropdownOpen(false);
                                }}
                              >
                                Metsäsuunnitelma
                              </ForestryLink>
                            </Link>
                          )}
                        </ForestryDropdownItems>
                      </ForestryDropdown>
                      {!isLastPage ? (
                        <>
                          {props.subPage === "vesistovaikutukset" && (
                            <>
                              <ExplanationContainer>
                                <ExplanationText>
                                  Metsän hakkuut aiheuttavat vesistöjä
                                  rehevöittäviä ravinnevalumia vesistöihin.
                                  Rehevöittävä vaikutus riippuu hakkuun
                                  voimakkuudesta. Tärkeimmät ravinteet ovat
                                  typpi ja fosfori.
                                </ExplanationText>
                                <ExplanationText>
                                  Jaksollinen metsänkäsittely aiheuttaa tällä
                                  kiinteistöllä 50 vuoden aikana{" "}
                                  <b>
                                    {_.round(_.sum(chartVals.nitrogen[3]), 2)}{" "}
                                    kilogramman{" "}
                                  </b>{" "}
                                  typpikuormituksen ja{" "}
                                  <b>
                                    {_.round(_.sum(chartVals.phosphorus[3]), 2)}{" "}
                                    kilogramman{" "}
                                  </b>{" "}
                                  fosforikuormituksen.
                                </ExplanationText>
                                <ExplanationText>
                                  Jatkuvapeitteinen metsänkäsittely aiheuttaa
                                  tällä kiinteistöllä 50 vuoden aikana{" "}
                                  <b>
                                    {_.round(_.sum(chartVals.nitrogen[2]), 2)}{" "}
                                    kilogramman{" "}
                                  </b>{" "}
                                  typpikuormituksen ja{" "}
                                  <b>
                                    {_.round(_.sum(chartVals.phosphorus[2]), 2)}{" "}
                                    kilogramman{" "}
                                  </b>{" "}
                                  fosforikuormituksen.
                                </ExplanationText>
                                <ExplanationText>
                                  Jatkuvapeitteinen metsänkäsittely aiheuttaa
                                  typpikuormitusta{" "}
                                  <b>
                                    {_.round(
                                      _.sum(chartVals.nitrogen[3]) -
                                        _.sum(chartVals.nitrogen[2]),
                                      2
                                    )}{" "}
                                    kg (
                                    {_.round(
                                      ((_.sum(chartVals.nitrogen[3]) -
                                        _.sum(chartVals.nitrogen[2])) /
                                        _.sum(chartVals.nitrogen[3])) *
                                        100,
                                      0
                                    )}{" "}
                                    %)
                                  </b>{" "}
                                  ja fosforikuormitusta{" "}
                                  <b>
                                    {_.round(
                                      _.sum(chartVals.phosphorus[3]) -
                                        _.sum(chartVals.phosphorus[2]),
                                      2
                                    )}{" "}
                                    kg (
                                    {_.round(
                                      ((_.sum(chartVals.phosphorus[3]) -
                                        _.sum(chartVals.phosphorus[2])) /
                                        _.sum(chartVals.phosphorus[3])) *
                                        100,
                                      0
                                    )}{" "}
                                    %){" "}
                                  </b>
                                  vähemmän kuin jaksollinen. Jos vähenemä on
                                  typen osalta yli 10 kg/ha/50 vuotta, voit olla
                                  oikeutettu subventoituun metsäsuunnitelmaan.
                                </ExplanationText>
                              </ExplanationContainer>
                            </>
                          )}

                          {props.subPage === "talous" && (
                            <>
                              <ExplanationContainer>
                                <ExplanationText>
                                  Metsänomistamisen kannattavuutta kuvaa
                                  parhaiten nettotulojen nykyarvo. Se sisältää
                                  kaikki tulevat metsänhoidon kulut ja puun
                                  myynnin tulot nykypäivän arvossa. Nettotulojen
                                  nykyarvo kuvaa metsän arvoa tästä hetkestä
                                  ikuisuuteen. Mitä kauempana tulevaisuudessa
                                  tulo tapahtuu, sitä pienempi sen arvo on nyt.
                                </ExplanationText>
                                <ExplanationText>
                                  Jatkuvapeitteinen metsänkäsittely antaa
                                  tyypillisesti tasaisemman tuoton kuin
                                  jaksollinen.
                                </ExplanationText>
                                <ExplanationText>
                                  Metsän arvo jaksollisella metsänkäsittelyllä
                                  on{" "}
                                  <b>{_.round(chartVals.cash[3], 0)} € / ha </b>
                                </ExplanationText>
                                <ExplanationText>
                                  Metsän arvo jatkuvapeitteisellä
                                  metsänkäsittelyllä on{" "}
                                  <b>{_.round(chartVals.cash[2], 0)} € / ha </b>
                                </ExplanationText>
                                <ExplanationText>
                                  Puun myynnin lisäksi metsä voi tuottaa myös
                                  muita taloudellisia hyötyjä.
                                  {/* Katso tästä esimerkki. */}
                                </ExplanationText>
                              </ExplanationContainer>
                            </>
                          )}

                          {props.subPage === "hiilivarasto" && (
                            <>
                              <ExplanationContainer>
                                <ExplanationText>
                                  Kun hiilivarasto kasvaa, metsä sitoo
                                  ilmakehästä enemmän hiiltä kuin se päästää
                                  (nettonielu). Kun hiilivarasto vähenee, metsä
                                  päästää ilmakehään hiiltä enemmän kuin sitoo
                                  (nettolähde). Hiilivaraston kasvu hillitsee
                                  ilmastonmuutosta.
                                </ExplanationText>
                                <ExplanationText>
                                  Jaksollisella metsänkäsittelyllä hiilivarasto
                                  on seuraavan 50 vuoden aikana keskimäärin{" "}
                                  <b>
                                    {_.round(_.mean(chartVals.carbon[3]), 1)}{" "}
                                    tonnia
                                  </b>{" "}
                                  hiiltä
                                </ExplanationText>
                                <ExplanationText>
                                  Jatkuvapeitteisellä metsänkäsittelyllä
                                  hiilivarasto on seuraavan 50 vuoden aikana
                                  keskimäärin{" "}
                                  <b>
                                    {_.round(_.mean(chartVals.carbon[2]), 1)}{" "}
                                    tonnia
                                  </b>{" "}
                                  hiiltä
                                </ExplanationText>
                                <ExplanationText>
                                  Jatkuvapeitteisen metsänkäsittelyn
                                  hiilivarasto on siis seuraavan 50 vuoden
                                  aikana keskimäärin{" "}
                                  <b>
                                    {_.round(
                                      _.mean(chartVals.carbon[2]) -
                                        _.mean(chartVals.carbon[3]),
                                      1
                                    )}{" "}
                                    tonnia (
                                    {_.round(
                                      ((_.mean(chartVals.carbon[2]) -
                                        _.mean(chartVals.carbon[3])) /
                                        _.mean(chartVals.carbon[3])) *
                                        100,
                                      1
                                    )}{" "}
                                    %)
                                  </b>{" "}
                                  suurempi kuin jaksollisessa. Tämä vastaa noin{" "}
                                  <b>
                                    {_.round(
                                      (_.mean(chartVals.carbon[2]) -
                                        _.mean(chartVals.carbon[3])) /
                                        10.3,
                                      1
                                    )}
                                  </b>{" "}
                                  keskivertosuomalaisen ilmastopäästöjä 50
                                  vuoden aikana.
                                </ExplanationText>
                                <ExplanationText>
                                  Hiilivaraston laskennassa huomioidaan puuston
                                  ja maaperän sisältämä hiili.
                                </ExplanationText>
                              </ExplanationContainer>
                            </>
                          )}

                          {props.subPage === "monimuotoisuus" && (
                            <>
                              <ExplanationContainer>
                                <ExplanationText>
                                  Metsät ovat tärkein uhanalaisten lajien
                                  elinympäristö. Uhanalaistumista aiheuttaa
                                  eniten metsien intensiivinen käyttö, jonka
                                  vuoksi vanhat metsät, isot puut ja lahopuu
                                  ovat vähentyneet.
                                </ExplanationText>
                                <ExplanationText>
                                  Jaksollisessa metsänkäsittelyssä
                                  uudistushakkuu tehdään useimmiten avohakkuuna,
                                  joka sekoittaa koko metsäekosysteemin.
                                  Jatkuvan kasvatuksen hakkuu on luonnon
                                  monimuotoisuuden kannalta vähemmän
                                  haitallinen. Jatkuvan kasvatuksen metsä säilyy
                                  peitteisenä ja näin tarjoaa jatkuvasti ruokaa
                                  ja suojaa monille metsälajeille.
                                </ExplanationText>
                              </ExplanationContainer>
                            </>
                          )}

                          <ArrowRow>
                            {props.subPage !== "vesistovaikutukset" && (
                              <ArrowBack onClick={handleArrowBackClick}>
                                <ArrowBackPoint />
                                <ArrowBackTail>
                                  {/* <ArrowText>
                              &nbsp;&nbsp;
                            </ArrowText> */}
                                </ArrowBackTail>
                              </ArrowBack>
                            )}

                            <Arrow onClick={handleArrowClick}>
                              <ArrowTail>
                                {/* <ArrowText>
                              &nbsp;&nbsp;
                              </ArrowText> */}
                              </ArrowTail>
                              <ArrowPoint />
                            </Arrow>
                          </ArrowRow>
                        </>
                      ) : (
                        <>
                          <ExplanationContainer>
                            <ExplanationHeader>
                              {subTitles[props.subPage]}
                            </ExplanationHeader>
                            <ExplanationText>
                              Voit pyytää tarjouksen jatkuvaan kasvatukseen
                              perustuvasta metsäsuunnitelmasta seuraavilta
                              tahoilta:
                              <ul>
                                <li>
                                  Arvometsä{" "}
                                  <a href="https://arvometsa.fi/">
                                    https://arvometsa.fi/
                                  </a>
                                </li>
                                <li>
                                  Innofor{" "}
                                  <a href="https://innofor.fi/">
                                    https://innofor.fi/{" "}
                                  </a>
                                </li>
                                <li>
                                  Metsätietopalvelu Silmu{" "}
                                  <a href="https://metsatietosilmu.fi/">
                                    https://metsatietosilmu.fi/
                                  </a>
                                </li>
                                <li>
                                  Metsäsuunnittelu Hollanti{" "}
                                  <a href="https://www.msh.fi/">
                                    https://www.msh.fi/
                                  </a>
                                </li>
                              </ul>
                            </ExplanationText>
                            <ExplanationText>
                              Jos jatkuvapeitteinen metsänkäsittely vähentäisi
                              selvästi vesistövaikutuksia sinun kiinteistölläsi,
                              voit saada metsäsuunnitelman puoleen hintaan.
                            </ExplanationText>
                            <ArrowRow>
                              <ArrowBack onClick={handleArrowBackClick}>
                                <ArrowBackPoint />
                                <ArrowBackTail>
                                  {/* <ArrowText>
                              &nbsp;&nbsp;
                              </ArrowText> */}
                                </ArrowBackTail>
                              </ArrowBack>
                            </ArrowRow>
                            {/* <PayInfoCol>
                              <PayInfoRow>
                                <PayInfoRadio
                                  type="radio"
                                  value="radio2"
                                  checked={checked.radio2}
                                  onChange={handleRadioClick}
                                />
                                <PayInfoValsCol>
                                  <PayInfoKey>
                                    <u>
                                      Metsänhoitosuunnitelma sisältäen
                                      arvonmäärityksen:
                                    </u>
                                    &nbsp;&nbsp;
                                  </PayInfoKey>
                                  <PayInfoValue>
                                    280 € + alv (sis. 40ha, lisähehtaarit 5€ /
                                    ha)
                                  </PayInfoValue>
                                  <PayInfoText>
                                    Metsäsuunnitelman tilaamalla määrität
                                    metsänhoitotavan yhdessä Arvometsän
                                    metsäasiantuntijan kanssa. Metsäsuunnitelma
                                    rakentuu valittujen toimenpiteiden
                                    mukaisesti.
                                  </PayInfoText>
                                </PayInfoValsCol>
                              </PayInfoRow>

                              <PayInfoRow>
                                <PayInfoRadio
                                  type="radio"
                                  value="radio3"
                                  checked={checked.radio3}
                                  onChange={handleRadioClick}
                                />
                                {props.type === "estate" ? (
                                  <PayInfoValsCol>
                                    <PayInfoKey>
                                      <u>
                                        Jätä yhteydenottopyyntö liittyen
                                        metsäsuunnitteluun ja arvonmäärityksen.
                                      </u>
                                    </PayInfoKey>
                                  </PayInfoValsCol>
                                ) : (
                                  <PayInfoValsCol>
                                    <PayInfoKey>
                                      <u>
                                        Jätä yhteydenottopyyntö liittyen
                                        metsäsuunnitteluun ja arvonmäärityksen.
                                      </u>
                                    </PayInfoKey>
                                  </PayInfoValsCol>
                                )}
                              </PayInfoRow>
                            </PayInfoCol> */}
                          </ExplanationContainer>
                          {/* <Form>
                            <FormLabel>Sähköpostiosoite</FormLabel>
                            <FormInput
                              type="text"
                              value={formEmail}
                              onChange={(e) => setFormEmail(e.target.value)}
                            />
                            <FormLabel>Nimi</FormLabel>
                            <FormInput
                              type="text"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                            />
                            <FormLabel>{formNameTitle}</FormLabel>
                            <FormInput
                              type="text"
                              value={formVal}
                              onChange={(e) => setFormVal(e.target.value)}
                            />
                            <FormButton
                              onClick={handleSubmit}
                              disabled={isSending}
                              isSending={isSending}
                            >
                              Lähetä tilaus
                            </FormButton>
                            <FormText>
                              Olemme teihin yhteydessä ja tarkistamme tilauksen
                              ennen toimitusta. Tietoja ei käytetä muihin
                              tarkoituksiin tai luovuteta kolmansille
                              osapuolille.
                            </FormText>
                          </Form> */}
                        </>
                      )}
                    </ContentContainer>
                  </BackgroundContainer>
                </BottomContainer>
              </TextContainer>
            </Overlay>
          </Container>
        </>
      )}
      <Test></Test>
    </>
  );
};

const Test: any = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Container: any = styled.div`
  background-image: url(${require("../public/img/forest.jpg")});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  flex: 1;
  min-height: 100%;
`;

const GraphContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
  padding: 0 0 0 20px;
`;

const Overlay: any = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  z-index: 1;
  background: rgba(110, 160, 140, 0.95);
`;

const MunOutlineContainer: any = styled.div`
  height: 220px;
  width: 300px;
  margin: 0 0 0 0;
  display: flex;
  justify-content: flex-end;
`;

const BalanceRow: any = styled.div`
  height: 240px;
  margin: 70px 20px 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BalanceCircle: any = styled.div`
  display: flex;
  height: 200px;
  width: 200px;
  background: ${Theme.color.secondary};
  border-radius: 300px;
  align-items: center;
  justify-content: center;
`;

const BalanceText: any = styled.p`
  position: absolute;
  left: auto;
  right: auto;
  margin: -70px 0 0 0;
`;

const BalanceValue: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  font-size: 3.1rem;
`;

const BalanceUnit: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  opacity: 0.6;
  font-size: 2.2rem;
  padding: 18px 0 0 0;
`;

const BalanceCircleSmall: any = styled.div`
  display: flex;
  height: 150px;
  width: 150px;
  background: ${Theme.color.secondary};
  border-radius: 300px;
  align-items: center;
  justify-content: center;
  margin: 0 30px 0 0;
`;

const BalanceTextSmall: any = styled.p`
  position: absolute;
  left: auto;
  right: auto;
  margin: -50px 0 0 0;
`;

const BalanceValueSmall: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  font-size: 2.5rem;
`;

const BalanceUnitSmall: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  opacity: 0.6;
  font-size: 1.5rem;
  padding: 12px 0 0 0;
`;

const HumanContainer: any = styled.div`
  height: 240px;
  display: flex;
  flex-direction: row;
  margin: 145px 20px 0 0;
  align-items: center;
`;

// const HumanIcon: any = styled.img.attrs(() => ({
//   src: require("../public/img/human.svg"),
// }))`
//   height: 14rem;
// `;

// const HumanText: any = styled.p`
//   font-family: ${Theme.font.secondary};
//   color: ${Theme.color.white};
//   font-size: 5rem;
//   margin: 1rem 0 0 -3.5rem;
// `;

const ChartTitle: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.white};
  font-size: 2rem;
  width: 100%;
  margin: 2rem 0 1.2rem 0;
  text-align: center;
`;

const ChartContainer: any = styled.div`
  height: 400px;
  width: 480px;
  margin: 150px 40px 0 0;
  padding: 0 0 0 40px;
`;

const ChartContainerNarrow: any = styled.div`
  height: 400px;
  width: 300px;
  margin: 150px 40px 0 0;
  padding: 0 0 0 40px;
  @media only screen and (max-width: 1330px) {
    margin: 150px 10px 0 0;
  }

  @media only screen and (max-width: 1330px) {
    width: 220px;
    margin: 150px 10px 0 0;
  }
`;

// const ExampleContainer: any = styled.div`
//   margin: 60px -20px 0 0;
//   display: flex;
//   flex: 1;
//   @media only screen and (max-width: 1330px) {
//     margin: 140px -20px 0 0;
//   }
// `;

// const Example: any = styled.img.attrs(() => ({
//   src: require("../public/img/example.png"),
// }))`
//   height: 900px;
//   @media only screen and (max-width: 1330px) {
//     height: 545px;
//   }
// `;

const DiversityImageContainer: any = styled.div`
  margin: 60px 40px 0 0;
  display: flex;
  flex: 1;
  @media only screen and (max-width: 1530px) {
    margin: 140px 20px 0 0;
  }
`;

const DiversityImage: any = styled.img.attrs(() => ({
  src: require("../public/img/diversity.png"),
}))`
  height: 450px;
  border: solid 2px ${Theme.color.white};
  @media only screen and (max-width: 1530px) {
    height: 300px;
  }
`;

const TextContainer: any = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 385px;
  align-items: flex-start;
`;

const TopContainer: any = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 0 0 4px 0;
`;

const BottomContainer: any = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  flex: 1;
`;

const BackgroundContainer: any = styled.div`
  display: flex;
  flex: 1;
  z-index: 3;
  background: ${Theme.color.white};
  flex-direction: column;
  padding: 0 15px 35px 0;
`;

const ContentContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 35rem;
  padding: 0 14px 50px 0;
  @media only screen and (max-width: 400px) {
    width: 320px;
  }
`;

const InfoTextContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 20px 0 0 0;
  padding: 4px 0 1px 11px;
  border-left: 3px solid ${Theme.color.primaryLight};
`;

const InfoTextRowFirst: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  line-height: 1rem;
  margin: -4px 0 0 0;
  font-size: 1.3rem;
`;

const InfoTextRow: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  line-height: 1rem;
  margin: 24px 0 0 0;
  font-size: 1.3rem;
  height: 20px;
`;

const InfoTextKey: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  margin: 0 0 0 0;
`;

const InfoTextValue: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-weight: 500;
  margin: 0 0 0 0;
`;

const ForestryDropdown: any = styled.div`
  font-family: ${Theme.font.secondary};
  font-size: 1.6rem;
  margin: 0 0 2.5rem 0;
  width: 100%;
  height: 45px;
  &:hover {
    cursor: pointer;
  }
`;

const ForestryDropdownSelected: any = styled.div`
  margin: 0;
  background: ${Theme.color.primary};
  color: ${Theme.color.white};
  display: flex;
  justify-content: space-between;
`;

const ForestryDropdownItems: any = styled("div")<{ isOpen: boolean }>`
  display: flex;
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  flex-direction: column;
  position: relative;
  background: ${Theme.color.primaryLight};
`;

const ForestryDropdownTitle: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1.1rem;
  margin: 15px 0 0 0;
  padding: 2rem 0 0.7rem 0;
`;

const ForestryLink: any = styled("p")`
  margin: 0;
  padding: 0.5rem 0.7rem 0.5rem 0.7rem;
  &:hover {
    background: ${Theme.color.primary};
    color: ${Theme.color.white};
  }
`;

const ExplanationContainer: any = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 2.5rem 0;
`;

const ExplanationHeader: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  font-size: 1.6rem;
  margin: 0 0 0 0;
`;

const ExplanationText: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1.1rem;
  margin: 8px 0 0 0;
`;

const ExplanationInfoRow: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 10px 0 0 0;
  font-size: 1rem;
  flex-wrap: wrap;
`;

const ExplanationInfoKey: any = styled.p`
  font-family: ${Theme.font.primary};
  font-size: 1.1rem;
  color: ${Theme.color.primary};
  margin: 0 0 0 0;
`;

const ExplanationInfoValue: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0 0;
`;

const PayInfoCol: any = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1rem;
  margin: 10px 0 0 0;
  font-size: 1rem;
`;

const PayInfoRow: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 30px 0 0 0;
`;

const PayInfoRadio: any = styled.input`
  margin: 2px 10px 0 0;
`;

const PayInfoValsCol: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const PayInfoKey: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1.15rem;
  margin: 0;
`;

const PayInfoValue: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  font-size: 1.6rem;
  margin: 7px 0 0 0;
`;

const PayInfoText: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1.1rem;
  margin: 8px 0 0 0;
`;

const Form: any = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0 0 0;
  width: 20rem;
`;

const FormLabel: any = styled.p`
  margin: 0;
  font-size: 1.4rem;
`;

const FormInput: any = styled.input`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  margin: 0 0 14px 0;
  padding: 5px;
  font-size: 1.2rem;
  background: ${Theme.color.secondaryLight};
  border: 1.5px inset;
`;

const FormButton: any = styled("div")<{ isSending: boolean }>`
  font-family: ${Theme.font.secondary};
  background: ${(props) =>
    props.isSending ? Theme.color.primaryLight : Theme.color.primary};
  color: ${Theme.color.white};
  padding: 10px;
  margin: 10px 0 0 0;
  font-size: 1.5rem;
  text-align: center;
  &:hover {
    cursor: ${(props) => (props.isSending ? "defualt" : "pointer")};
  }
`;

const FormText: any = styled.p`
  font-family: ${Theme.font.primary};
  color: ${Theme.color.primary};
  font-size: 1rem;
  margin: 8px 0 20rem 0;
`;

const Title: any = styled.p`
  font-family: ${Theme.font.secondary};
  color: ${Theme.color.primary};
  font-size: 4rem;
  margin: 120px 0 0 0;
  font-weight: 500;
`;

const OrderButton: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 14px 0 0;
`;

const OrderButtonInner: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${Theme.color.primary};
  height: 70px;
  width: 100%;
  max-width: 35rem;
  &:hover {
    cursor: pointer;
  }
`;

const OrderButtonText: any = styled.div`
  color: ${Theme.color.white};
  z-index: 2;
  text-align: center;
  font-size: 1.6rem;
`;

const ArrowRow: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 10px 0 0;
`;

const Arrow: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 0 10px 0 auto;
  width: 100px;
`;

const ArrowTail: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${Theme.color.primary};
  height: 30px;
  padding: 5px 0 5px 10px;
  width: 60px;
  &:hover {
    cursor: pointer;
  }
`;

const ArrowText: any = styled.div`
  color: ${Theme.color.secondaryLight};
  z-index: 2;
  text-align: center;
  font-size: 1.6rem;
`;

const ArrowPoint: any = styled.div`
  width: 0;
  height: 0;
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-left: 50px solid ${Theme.color.primary};
  margin: 0 0 0 -10px;
  &:hover {
    cursor: pointer;
  }
`;

const ArrowBack: any = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin: 0 auto 0 0;
  width: 100px;
`;

const ArrowBackTail: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${Theme.color.primary};
  height: 30px;
  padding: 5px 0 5px 10px;
  width: 60px;
  &:hover {
    cursor: pointer;
  }
`;
const ArrowBackPoint: any = styled.div`
  width: 0;
  height: 0;
  border-top: 40px solid transparent;
  border-bottom: 40px solid transparent;
  border-right: 50px solid ${Theme.color.primary};
  margin: 0 -10px 0 0;
  &:hover {
    cursor: pointer;
  }
`;

const WaveContainerTop: any = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  z-index: 2;
  position: relative;
  width: 130px;
  margin: 0 -45px 0 0;
`;

const WaveTop: any = styled.img.attrs(() => ({
  src: require("../public/img/wave-top.svg"),
}))`
  position: absolute;
  width: 130px;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const WaveContainerBottom: any = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2;
  position: relative;
  width: 130px;
  margin: 0 -45px 0 0;
`;

const WaveBottom: any = styled.img.attrs(() => ({
  src: require("../public/img/wave-bottom.svg"),
}))`
  position: absolute;
  width: 130px;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const LogoContainer: any = styled.div`
  display: flex;
  justify-content: flex-start;
  margin: 1.3rem auto 0 0.3rem;
  &:hover {
    cursor: pointer;
  }
`;

const LogoTextContainer: any = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`;

const Logo: any = styled.img.attrs(() => ({
  src: require("../public/img/silva-white.png"),
}))`
  height: 9rem;
  margin: 0 0.6rem -5px 0;
`;

const LogoTitle: any = styled.img.attrs(() => ({
  src: require("../public/img/arvometsa.svg"),
}))`
  width: 6rem;
  margin: 6px 0 -4px -1px;
`;

const LogoText: any = styled.p`
  color: ${Theme.color.white};
  font-family: ${Theme.font.primary};
  letter-spacing: 0.03rem;
  line-height: 1rem;
  font-size: 2rem;
  margin: 7px 0 0 -4px;
  font-weight: 500;
`;

const AvoinLink: any = styled.a.attrs(() => ({
  href: "https://www.avoin.org",
}))`
  margin: 0 0 0 auto;
`;

const AvoinLogo: any = styled.img.attrs(() => ({
  src: require("../public/img/avoin-black.svg"),
}))`
  width: 13rem;
  position: relative;
  top: 0;
  right: 0;
  overflow: hidden;
`;

const ErrorContainer: any = styled.div`
  color: ${Theme.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px;
`;

const ErrorText: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1.5rem;
`;

const ErrorLink: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1.2rem;
  margin: 40px 0 0 0;
  &:hover {
    cursor: pointer;
  }
`;

export default Boiler;

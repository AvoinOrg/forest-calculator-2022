import styled, { AnyStyledComponent } from "styled-components";

import { Theme } from "../styles";

const DIVIDER = 1000;

interface Props {
  geometry: any;
}

const MunicipalityOutline = (props: Props) => {
  const { minX, minY, maxX, maxY } = getMinMaxCoords(props.geometry);
  const coords = parseCoords(props.geometry, minX, minY);

  return (
    <Container>
      <svg
        height="100%"
        transform="scale(1,-1)"
        viewBox={"0 0 " + (maxX - minX) + " " + (maxY - minY)}
      >
        {coords.map((pol, key) => (
          <polygon
            fillRule="evenodd"
            key={key}
            fill={Theme.color.secondary}
            points={pol}
            stroke={Theme.color.white}
            strokeWidth={0.0025}
          />
        ))}
      </svg>
    </Container>
  );
};

const getMinMaxCoords = (
  geometry: any
): { minX: number; minY: number; maxX: number; maxY: number } => {
  let minX = null;
  let minY = null;

  let maxX = null;
  let maxY = null;

  const coords: number[][][] = geometry.coordinates;

  const recFind = (arr) => {
    const x = arr[0];
    if (Array.isArray(x)) {
      for (let i = 0; i < arr.length; i++) {
        recFind(arr[i]);
      }
    } else {
      const y = arr[1];

      if (!minX || minX > x) {
        minX = x;
      }

      if (!minY || minY > y) {
        minY = y;
      }

      if (!maxX || maxX < x) {
        maxX = x;
      }

      if (!maxY || maxY < y) {
        maxY = y;
      }
    }
  };

  recFind(coords);

  if (minX) {
    minX = minX / DIVIDER;
    minY = minY / DIVIDER;
    maxX = maxX / DIVIDER;
    maxY = maxY / DIVIDER;
  }

  return { minX, minY, maxX, maxY };
};

const parseCoords = (geometry: any, minX, minY): string[] => {
  const coords: number[][][] = geometry.coordinates;
  const coordStrs = [];

  const recFind = (arr): string => {
    let coordStr = "";

    const x = arr[0];
    if (Array.isArray(x)) {
      for (let i = 0; i < arr.length; i++) {
        coordStr += recFind(arr[i]);
      }
    } else {
      const y = arr[1];

      coordStr += `${x / DIVIDER - minX},${y / DIVIDER - minY} `;
    }

    return coordStr;
  };

  for (let i = 0; i < coords.length; i++) {
    const reVal = recFind(coords[i]);
    coordStrs.push(reVal.trim());
  }

  return coordStrs;
};

const Container: any = styled.div`
  height: 100%;
`;

export default MunicipalityOutline;

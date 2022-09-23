import styled from "styled-components";
import Link from "next/link";

import { Theme } from "../styles";

interface Props {
  id: string;
  status: number;
}

const NotFound = (props: Props) => {
  return (
    <ErrorContainer>
      {props.status === 204 ? (
        <>
          <ErrorText>
            Kiinteistötunnuksella "{props.id}" ei löytynyt metsävarakuvioita.
            Tarkista vielä kiinteistötunnus ja kokeile uudestaan.
          </ErrorText>
          <ErrorSubText>
            Laskuri hakee kiinteistön metsävaratiedot suoraan Metsäkeskuksen
            avoimesta metsävaratietokannasta. Valitettavasti näitä tietoja ei
            löydy kaikille kiinteistöille.
            <br></br>
            <br></br>
            Lisää metsävaratiedoista voit lukea Metsäkeskuksen sivuilta{" "}
            <a href="https://www.metsakeskus.fi/fi/avoin-metsa-ja-luontotieto/metsatietoaineistot/metsavaratiedot">
              https://www.metsakeskus.fi/fi/avoin-metsa-ja-luontotieto/metsatietoaineistot/metsavaratiedot
            </a>
          </ErrorSubText>
        </>
      ) : (
        <>
          <ErrorText>Kiinteistötunnusta "{props.id}" ei löydy.</ErrorText>
        </>
      )}
      <Link href="/">
        <ErrorLink>
          <u>Takaisin hakuun.</u>
        </ErrorLink>
      </Link>
    </ErrorContainer>
  );
};

const ErrorContainer: any = styled.div`
  color: ${Theme.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px;
  max-width: 700px;
  margin: 50px auto 0 auto;
`;

const ErrorText: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1.5rem;
`;

const ErrorSubText: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1rem;
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

export default NotFound;

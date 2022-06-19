import styled from "styled-components";
import { Theme } from "../styles";
import Link from "next/link";

const Success = () => {
  return (
    <Container>
      <SuccessText>Tilaus vastaanotettu!</SuccessText>
      <Link href="/">
        <SuccessLink>
          <u>Takaisin etusivulle</u>
        </SuccessLink>
      </Link>
    </Container>
  );
};

const Container: any = styled.div`
  color: ${Theme.color.secondary};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 5px;
`;

const SuccessText: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1.5rem;
  margin: 10rem 0 0 0;
`;

const SuccessLink: any = styled.p`
  color: ${Theme.color.primary};
  font-family: ${Theme.font.primary};
  font-size: 1.2rem;
  margin: 40px 0 0 0;
  &:hover {
    cursor: pointer;
  }
`;

export default Success;

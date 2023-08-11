import React from 'react';
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;
}

export const Section: React.FC<Props> = (props: Props) => {
  return (
    <Container backgroundColor={props.backgroundColor}>
      {props.children}
    </Container>
  );
}

const Container: React.FC<any> = styled.div`
  padding: 36px;
  background: ${(props: any) => props.backgroundColor};
`;
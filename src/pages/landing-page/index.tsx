import React from 'react';
import styled from "styled-components";
import { Section } from './Section';
import icon from './icon.png';

interface Props { }

export const LandingPage: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Section backgroundColor='#168eff'>
        <Gap height={20} />
        <center>
          <img src={icon} width="200px" alt='' />
        </center>
        <Title>דו-גלגל</Title>
        <Subtitle>רוכבים יחד אל עבר עיר בטוחה יותר</Subtitle>
      </Section>
      <Section>
        <SectionTitle>איך זה עובד?</SectionTitle>
        <Step>
          <StepLine />
          <Number>1.</Number>
          <StepText>
            מורידים את האפליקציה ומדליקים אותה לפני כל רכיבה.
            האפליקציה תאפשר לנו לדווח בזמן אמת על המסלולים שבהם עברתם.
          </StepText>
        </Step>
        <Step>
          <StepLine />
          <Number>2.</Number>
          <StepText> את המידע הזה אנחנו אוספים מקבוצה גדולה של רוכבים בעיר ומנגישים אותו לכולם באמצעות מפת-חום. שבילים שנמצאים בשימוש תדיר צבועים באדום, ואילו שבילים בשימוש פחות תדיר צבועים בירוק.</StepText>
        </Step>
        <Step >
          <Number>3.</Number>
          <StepText>לבסוף, המידע שאספנו ביחד מוצג למתכנני העיר, ואיתו אנחנו קובעים היכן יש לבנות שבילים חדשים, והיכן כדאי לשפר את השבילים הקיימים.</StepText>
        </Step>
      </Section >
    </>
  );
}


const Title = styled.h1`
  font-size: 80px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  text-align: center;
  margin-top: 24px;
  margin-bottom: 24px;
`

const Subtitle = styled.h2`
  font-size: 32px;
  font-weight: 200;
  color: #fff;
  text-align: center; 
`

const Gap: React.FC<{ height: number }> = styled.div`
  height: ${(props: any) => props.height}px;
`

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
`

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
  padding-bottom: 36px;
`

const StepText = styled.p`
  font-weight: 200;
  font-size: 24px;
  line-height: 1.5;
  color: #525252;
  padding-top: 12px;

  width: 60vw;
  margin: 0 auto;

  flex: 1;
  
`

const Number = styled.span`
  font-size: 36px;
  color: #1077d7;
  font-weight: 600;
  width: 1.5ch;
  margin-left: 24px;
  line-height: 1;
  background: #fff;
  display: inline-block;
  padding: 8px 0;
  z-index: 2;
  text-align: center;
`

const StepLine = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10px;
  background: #b5dbff;
  width: 3px;
`
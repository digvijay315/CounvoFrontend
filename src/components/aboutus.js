import React from "react";
import styled from "styled-components";
import Header from "./Layout/header";

// Color palette
const Colors = {
  primary: "#09316B",
  secondary: "#F4B400",
  accent: "#EDF6FF",
  text: "#22223B",
  background: "#ffffff",
  border: "#E9ECEF",
};

// Styled Components
const Wrapper = styled.div`
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
  color: ${Colors.text};
  background: ${Colors.background};
  min-height: 100vh;
  padding: 0;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem 4rem;
`;

const Title = styled.h1`
  font-size: 2.4rem;
  color: ${Colors.primary};
  text-align: center;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -.02em;
`;

const SubTitle = styled.h2`
  color: ${Colors.secondary};
  font-size: 1.35rem;
  font-weight: 600;
  margin: 32px 0 16px 0;
  text-align: left;
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const Paragraph = styled.p`
  font-size: 1.09rem;
  line-height: 1.68;
  letter-spacing: 0.01em;
  margin-top: 0;
  margin-bottom: 0.9em;
`;

const GoalsList = styled.ul`
  padding-left: 20px;
  margin: 16px 0 0 0;
`;

const Goal = styled.li`
  font-size: 1.07rem;
  margin-bottom: 10px;
  line-height: 1.5;
  &::marker {
    color: ${Colors.secondary};
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  gap: 28px;
  grid-template-columns: 1fr 1fr;
  margin: 1.7rem 0 2.2rem 0;

  @media (max-width: 730px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${Colors.accent};
  padding: 1.1rem 1.2rem 1.1rem 1.2rem;
  border-radius: 16px;
  border: 1px solid ${Colors.border};
  font-size: 1rem;
  line-height: 1.55;
  box-shadow: 0 1px 6px rgba(9,49,107,0.04);
`;

const ComplianceNote = styled.div`
  background: #f5f5fa;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-size: 0.97rem;
  color: #50505b;
  border-left: 4px solid ${Colors.secondary};
  margin-top: 1.8rem;
`;

const Highlight = styled.span`
  color: ${Colors.primary};
  font-weight: 500;
`;

export default function AboutUs() {
  return (
    <>
    <Header/>
    <Wrapper>
      <Container>
        <Title>About Us</Title>
        <Section>
          <Paragraph>
            <Highlight>Counvo</Highlight> is a technology-driven platform created to simplify how people connect with verified legal professionals in India. <b>We are not a law firm, and we do not provide legal advice.</b><br />
            Instead, we facilitate access by offering a secure, organized, and user-friendly space where individuals can find legal professionals and engage in conversations, all online.<br />
            Whether you&apos;re unsure about a legal issue, looking to understand your rights, or simply exploring the right professional to speak with — <Highlight>Counvo</Highlight> helps you take the first step, digitally and safely.
          </Paragraph>
        </Section>
        <Section>
          <SubTitle>Our Mission</SubTitle>
          <Paragraph>
            Our mission is to make <b>legal access more transparent, quicker, and inclusive.</b> At Counvo, we believe that understanding the law and connecting with the right professional shouldn&apos;t be a privilege limited to the few. We are working to:
          </Paragraph>
          <GoalsList>
            <Goal>
              <b>Make legal access more convenient,</b> especially for those who cannot afford to visit court premises or legal chambers.
            </Goal>
            <Goal>
              <b>Empower small-town, less affluent, and early-career legal professionals</b> by giving them a platform to be seen and contacted directly by potential clients.
            </Goal>
            <Goal>
              <b>Support users from all walks of life</b> in accessing trustworthy information and tools that can guide them in the right direction.
            </Goal>
            <Goal>
              <b>Leverage technology</b> to reduce delays, confusion, and lack of awareness that often surround legal issues in India.
            </Goal>
          </GoalsList>
        </Section>
        <Section>
          <SubTitle>Our Vision</SubTitle>
          <Paragraph>
            Our vision is to become India’s most <b>trusted tech platform</b> that brings <Highlight>clarity, convenience, and confidence</Highlight> to those navigating legal concerns. We aim to break the barriers of geography, cost, and inaccessibility — by enabling secure and seamless online interactions between people and professionals.
            <br /><br />
            We imagine a future where <b>every citizen</b>, regardless of their background, can better understand their legal position, and where <b>every qualified legal professional</b> has the opportunity to offer their services in a fair and transparent environment.
          </Paragraph>
        </Section>
        <Section>
          <SubTitle>What You’ll Find on Counvo</SubTitle>
          <FeaturesGrid>
            <FeatureCard>
              <b>✔ User-focused platform</b> that promotes safe and private communication
            </FeatureCard>
            <FeatureCard>
              <b>✔ Directory of independently verified professionals</b>
            </FeatureCard>
            <FeatureCard>
              <b>✔ Educational content</b> to help users get informed on common legal issues
            </FeatureCard>
            <FeatureCard>
              <b>✔ Chat and call tools</b>, with no need to visit an office
            </FeatureCard>
          </FeaturesGrid>
        </Section>
        <ComplianceNote>
          <b>Legal Compliance:</b> We strictly adhere to the Bar Council of India’s regulations, including those concerning the promotion of legal services. Counvo is not involved in the rendering of legal advice or in any profit-sharing with lawyers.
        </ComplianceNote>
      </Container>
    </Wrapper>
    </>
  );
}

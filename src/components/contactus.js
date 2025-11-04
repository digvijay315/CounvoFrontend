import React from "react";
import styled from "styled-components";
import { FaEnvelope, FaPhoneAlt, FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import Header from "./Layout/header";
import Footer from "./Layout/footer";

const Colors = {
  primary: "#09316B",
  secondary: "#F4B400",
  accent: "#EDF6FF",
  text: "#22223B",
  background: "#fff",
  border: "#E9ECEF"
};

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${Colors.background};
  color: ${Colors.text};
  font-family: 'Inter', 'Roboto', Arial, sans-serif;
`;

const Container = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem 4rem;

  @media (max-width: 600px) {
    padding: 1.5rem 0.7rem 3rem;
  }
`;

const Section = styled.section`
  margin-bottom: 2.6rem;
`;

const Title = styled.h1`
  color: ${Colors.primary};
  font-size: 2.1rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.01em;
  margin-bottom: 8px;
`;

const Subtitle = styled.h2`
  font-size: 1.18rem;
  color: ${Colors.secondary};
  font-weight: 600;
  margin-bottom: 8px;
`;

const Description = styled.p`
  font-size: 1.06rem;
  line-height: 1.60;
  margin-bottom: 25px;
`;

const ContactGrid = styled.div`
  display: grid;
  gap: 28px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 35px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

const ContactCard = styled.div`
  background: ${Colors.accent};
  border: 1px solid ${Colors.border};
  border-radius: 14px;
  padding: 1.3rem 1.1rem 1.3rem 1.3rem;
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
`;

const IconWrap = styled.span`
  color: ${Colors.primary};
  font-size: 1.35rem;
  margin-top: 1.5px;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2px;
`;

const InfoText = styled.div`
  font-size: 1rem;
  color: #434356;
`;

const SocialBar = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 8px;
`;

const SocialIcon = styled.a`
  background: ${Colors.secondary};
  color: ${Colors.primary};
  border-radius: 50%;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.24rem;
  text-decoration: none;
  transition: background 0.2s;
  &:hover { background: #ffeeb2; }
`;

const LegalBox = styled.div`
  margin-top: 2.3rem;
  background: #f5f5fa;
  padding: 1.03rem 1.2rem;
  border-radius: 10px;
  border-left: 4px solid ${Colors.secondary};
  color: #50505b;
  font-size: 0.985rem;
  line-height: 1.58;
`;

const Highlight = styled.span`
  color: ${Colors.primary};
  font-weight: 500;
`;

export default function ContactUs() {
  return (
     <>
     <Header/>
    <Wrapper>
      <Container>
        <Title>Contact Us</Title>

        <Section>
          <Description>
            Have a question? Need help understanding how to use <Highlight>Counvo</Highlight>? We’re here to guide you.<br/>
            At Counvo, we’re committed to building a transparent, user-first platform that lets you connect with independently verified legal professionals — securely and conveniently.<br/>
            Whether you're a user seeking support or a legal professional looking to join, we're just a message away.
          </Description>
        </Section>

        <Section>
          <ContactGrid>
            <ContactCard>
              <IconWrap>
                <FaEnvelope />
              </IconWrap>
              <ContactInfo>
                <InfoTitle>Email</InfoTitle>
                <InfoText>
                  <a href="mailto:admin@counvo.in" style={{color: Colors.primary, textDecoration: "underline"}}>admin@counvo.in</a>
                  <br />
                  <span style={{fontSize: '0.96em', color: '#878787'}}>For general inquiries, feedback, or technical support.</span>
                </InfoText>
              </ContactInfo>
            </ContactCard>
            <ContactCard>
              <IconWrap>
                <FaPhoneAlt />
              </IconWrap>
              <ContactInfo>
                <InfoTitle>Phone</InfoTitle>
                <InfoText>
                  <a href="tel:+919773676088" style={{color: Colors.primary, textDecoration: "underline"}}>+91 97736 76088</a>
                  <br />
                  <span style={{fontSize: '0.96em', color: '#878787'}}>Mon–Sat, 10AM – 6PM IST</span>
                </InfoText>
              </ContactInfo>
            </ContactCard>
          </ContactGrid>
        </Section>

        <Section>
          <Subtitle>Social Media</Subtitle>
          <Description>
            Stay connected for platform updates, awareness posts, and more.
          </Description>
          <SocialBar>
            <SocialIcon href="https://instagram.com/" aria-label="Instagram" target="_blank" rel="noopener">
              <FaInstagram />
            </SocialIcon>
            <SocialIcon href="https://facebook.com/" aria-label="Facebook" target="_blank" rel="noopener">
              <FaFacebookF />
            </SocialIcon>
            <SocialIcon href="https://linkedin.com/" aria-label="LinkedIn" target="_blank" rel="noopener">
              <FaLinkedinIn />
            </SocialIcon>
          </SocialBar>
        </Section>

        <Section>
          <Subtitle>For Legal Professionals</Subtitle>
          <Description>
            Are you a lawyer interested in joining <Highlight>Counvo</Highlight>?<br />
            We welcome professionals who want to expand their reach and serve clients digitally.<br />
            <b>Drop us an email at <a href="mailto:admin@counvo.in" style={{color: Colors.primary}}>admin@counvo.in</a></b> with your name, location, and area of practice.
          </Description>
        </Section>

        <LegalBox>
          <b>Legal Note:</b> Counvo is a facilitating platform and not a law firm. We do not offer legal advice or services.<br/>
          All interactions on the platform are between the user and the listed professionals. We fully comply with the Bar Council of India's rules and guidelines.
        </LegalBox>
      </Container>
    </Wrapper>
    <Footer/>
   </>
  );
}

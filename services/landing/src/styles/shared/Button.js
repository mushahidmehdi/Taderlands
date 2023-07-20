import React from 'react';
import styled from 'styled-components';

const Button = ({
  bg,
  clr,
  icon,
  borderClr,
  hoverBorderClr,
  hoverBg,
  hoverClr,
  boxShadow,
  type,
  text,
  onClick,
  sx,
}) => {
  return (
    <ButtonWrapper
      onClick={onClick}
      boxShadow={boxShadow}
      bg={bg}
      clr={clr}
      borderClr={borderClr}
      icon={icon}
      hoverBorderClr={hoverBorderClr}
      hoverClr={hoverClr}
      hoverBg={hoverBg}
      type={type}
      text={text}
      sx={sx}
    >
      {icon ? (
        <IconImage>
          <img
            src={icon}
            alt="icon"
            objectFit="contain"
            width={20}
            height={20}
          />
        </IconImage>
      ) : (
        ''
      )}
      <span>{text}</span>
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.button`
  display: flex;
  max-width: 47rem;
  justify-content: center;
  align-items: center;
  padding: 0.7rem 1rem;
  border-radius: 0.6rem;
  background-color: ${({ bg, theme }) => (bg ? bg : theme.primary.default)};
  color: ${({ clr }) => (clr ? clr : '#fff')};
  font-size: 1rem;
  border: 1.4px solid
    ${({ borderClr }) => (borderClr ? borderClr : 'transparent')};
  box-shadow: ${({ boxShadow }) =>
    boxShadow ? '0px 1px 2px 0px #1018280d' : ''};

  > span {
    font-family: 'Comfortaa';
    margin-inline: ${({ text }) => (text ? '1.3rem' : '')};
    font-weight: 300;
  }

  &:hover {
    cursor: pointer;
  }
  ${({ sx }) => sx}
`;

const IconImage = styled.div`
  display: flex;
  align-items: center;
  ${({ icon }) => icon !== '' && `width : 1.2rem; margin-inline-end: 0.1rem`}
`;

export default Button;

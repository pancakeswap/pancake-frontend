import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 39px;
`

const Tab = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  /* Light/Tertiary */
  background: ${({ theme }) => theme.colors.tertiary};
  /* Field/Inset */
  /* box-shadow: inset 0px 2px 2px -1px rgba(0, 0, 0, 0.2); */
  border-radius: 16px;
  position: relative;
  &:before{
    content:'';
    position:absolute;
    left:5%;
    opacity:0.5;
    top:0;
    left: 0;
    width:100%;
    height:100%;
    box-shadow: inset 0px 2px 2px -1px rgba(0, 0, 0, 0.2); 
    border-radius: 16px;
  }
`

const Button = styled.button<{ active: boolean }>`
  cursor: pointer;
  outline: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  background: ${({ theme }) => theme.colors.tertiary};
  box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.02);
  border-radius: 16px;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  ${({ active, theme }) => active && `
    background: ${theme.colors.primary};
    box-shadow: inset 0px -1px 0px rgba(14, 14, 44, 0.2);
    border-radius: 16px;
    color: ${theme.colors.invertedContrast};
  `}
`

export { Button, Wrapper, Tab }

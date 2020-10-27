import styled from "styled-components";

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: 32px;
  width: 32px;
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: inset 0px 2px 2px -1px rgba(74, 74, 104, 0.1);

  &:after {
    content: "";
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: transparent;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.secondary};
  }
  &:checked {
    background-color: ${({ theme }) => theme.colors.success};
    &:after {
      border-color: white;
    }
  }
`;

export default Checkbox;

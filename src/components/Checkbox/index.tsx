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
  &:focus {
    outline: none;
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  &:checked {
    background-color: ${({ theme }) => theme.colors.success};
    &:after {
      border-color: white;
    }
  }
`;

export default Checkbox;

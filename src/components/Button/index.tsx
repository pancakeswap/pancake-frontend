import styled from "styled-components";

export interface Props {
  variant?: 'primary';
}

const Button = styled.button<Props>``;

Button.defaultProps = {
  variant: 'primary',
};

export default Button;

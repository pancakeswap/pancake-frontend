import React, { useState } from "react";
import styled from 'styled-components';
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit';
import { TabsProps } from './types';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 39px;
`;

const Tabs: React.FC<TabsProps> = ({ children, startAt = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(startAt)

  const handleClick = (newIndex) => setSelectedTab(newIndex);
  return (
    <>
      <Wrapper>
        <ButtonMenu activeIndex={selectedTab} onClick={handleClick} size="sm">
          {children.map((item) => (
            <ButtonMenuItem key={`${item}${Math.random()}`}>
                {item.props.title}
            </ButtonMenuItem>
          ))}
        </ButtonMenu>
      </Wrapper>
      {children[selectedTab]}
    </>
  )
}

export default Tabs;

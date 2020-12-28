import React, { ReactElement, useState } from "react"
import { Wrapper, Tab } from './styles';
import TabTitle from "./TabTitle"

type Props = {
  children: ReactElement[],
  startAt?: number,
}


const Tabs: React.FC<Props> = ({ children, startAt = 0 }) => {
  const [selectedTab, setSelectedTab] = useState(startAt)

  return (
    <>
      <Wrapper>
        <Tab>
          {children.map((item, index) => (
            <TabTitle
              key={`${item}`}
              title={item.props.title}
              index={index}
              setSelectedTab={setSelectedTab}
              active={selectedTab === index}
            />
          ))}
        </Tab>
      </Wrapper>
      {children[selectedTab]}
    </>
  )
}

export default Tabs;

import React from "react"
import Tabs from './components/Tabs/Tabs';
import Tab from './components/Tabs/Tab'


const IfoTab: React.FC = () => {
  return (
    <Tabs>
      <Tab title="Next IFO">Next IFO</Tab>
      <Tab title="Past IFOs">Past IFO</Tab>
    </Tabs>
  );
}

export default IfoTab;

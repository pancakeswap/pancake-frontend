import React, {useState} from 'react'
import styled, {keyframes} from 'styled-components';
import variables from 'style/variables'
import MenuItem from './MenuItem'




const MenuContainer = styled.div`
  min-width:259px;
  min-height:calc(100vh - 80px);
  background-color:${variables.primary};
  color:#FFF;
  
  position:fixed;
  left:0;
  top:80px;
`;
const MenuBody= styled.div`
   padding-top:3rem;
  padding-bottom:3rem;
  overflow-y:scroll;
  height:80vh;
`;
const MenuFooter = styled.div`

height:6rem;
width:100%;
border-top:2px solid #FFF;
display:flex;
align-items:center;
justify-content:space-between;
padding-right:20px;

.leftSide{
  display:flex;
  align-items:center;
  span{
    margin-left:-10px;
  }
}
.rightSide{
  img{
    margin-left:5px;
  }
}


`;

const SubTitle =styled.div`
background-color: gray;
padding-left:30px;





`;

const Menu = () => {
 
  const [tradeIsActive, setTradeIsActive] = useState(false);
  const [listingsIsActive, setListingsIsActive] = useState(false);
  const [chartsIsActive, setChartsIsActive] = useState(false);
  const [moreIsActive, setMoreIsActive] = useState(false);
  

  return (
    <MenuContainer>
    <MenuBody>
     <MenuItem title="Home" to="/" src="/images/menu/home.svg"  />
     <MenuItem title="Trade" src="/images/menu/trade.svg"   onClick = {() => setTradeIsActive(prevState => !prevState)}  />
     {tradeIsActive && 
     <SubTitle>
       <MenuItem title="Exchange" to="/"  />
      <MenuItem title="Liquidity" to="/"  />
     </SubTitle>
      
    }
    <br />
     

     <MenuItem title="Farms" to="/farms" src="/images/menu/farms.svg"  />
     <MenuItem title="Pools" to="/pools" src="/images/menu/pools.svg"  />
     <MenuItem title="Listings" src="/images/menu/info.svg" onClick = {() => setListingsIsActive(prevState => !prevState)}   />
     {listingsIsActive && 
     <SubTitle>
        <MenuItem title="Exchange 1"  />
        <MenuItem title="Exchange 2"   />
        <MenuItem title="Exchange 3"   />
     </SubTitle>
      
    }
     <MenuItem title="Charts" src="/images/menu/info.svg" onClick = {() => setChartsIsActive(prevState => !prevState)}  />
      {chartsIsActive && 
      <SubTitle>
        <MenuItem title="Quickchart"  />
        <MenuItem title="Poocoin"   />
        <MenuItem title="DexGuru"  />
      </SubTitle>
      
    }
     <MenuItem title="More" src="/images/menu/info.svg" onClick = {() => setMoreIsActive(prevState => !prevState)}  />
      {moreIsActive && 
      <SubTitle>
        <MenuItem title="Docs"  />
        <MenuItem title="Github"  />
        <MenuItem title="Contact"  />
      </SubTitle>
      
    }
     <MenuItem title="Audit" src="/images/menu/info.svg"  />

     </MenuBody>


     <MenuFooter>
     <div className="leftSide">
     <img src="/images/menu/whiteCircle.svg" alt="" />
     <span> $1.43</span>
     </div>
     <div className="rightSide">
       <img src="/images/menu/twitter.svg" alt="twitter" />
     <img src="/images/menu/telegram.svg" alt="telegram" />
     </div>

     
     
     </MenuFooter>
    </MenuContainer>
   
  )
}

export default Menu

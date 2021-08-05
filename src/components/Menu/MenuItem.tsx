import React from 'react';
import styled from 'styled-components';
import { Link} from 'react-router-dom';
import { useTranslation } from 'contexts/Localization'



const MenuItemContainer = styled.div`

padding:1rem 3rem;
cursor:pointer;
display:flex;
align-items:center;
position:relative;
:hover{
    opacity:0.8;
}
img{
    margin-right:20px;
}
`;



const  MenuItem: React.FC< { 
    title: string;
    to?: string;
    onClick?: any;
    src?: any
 }> = ({title, to,onClick, src})=> {
  
    const { t } = useTranslation();
    

    
    
    return (
        <MenuItemContainer onClick = {onClick} > 
           {src  && <img src={src}  alt="info" />}
           {to ?  <Link  to={`${to}`}> {t(title)} </Link>  : <span>{t(title)}</span>}
          
        </MenuItemContainer>
    )
}

export default MenuItem

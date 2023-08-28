import styled from 'styled-components'
import Image from 'next/image'
import discord from '../../images/socials/1.png'
import twitter from '../../images/socials/2.png'
import telegram from '../../images/socials/3.png'
import instagram from '../../images/socials/4.png'

export const LeftImageWrapper = styled.div`
  width: 391px;
  height: 620px;
  position: absolute;
  top: 110px;
  left: calc(50% - 196px - 590px);
  img {
    position: absolute;

    &.discord {
      width: 180px;
      top: 357px;
      left: 29px;
      z-index: 2;
    }
    &.twitter {
      width: 230px;
      z-index: 3;
      top: 0;
      left: 30px;
    }
    &.telegram {
      width: 220px;
      top: 94px;
      left: 120px;
      z-index: 2;
    }
    &.instagram {
      width: 240px;
      left: 78px;
      top: 244px;
      z-index: 1;
    }
  }
`

export const LeftBottomBox: React.FC = () => {
  return (
    <LeftImageWrapper>
      <Image className="discord" src={discord} alt="discord" />
      <Image className="twitter" src={twitter} alt="twitter" />
      <Image className="telegram" src={telegram} alt="telegram" />
      <Image className="instagram" src={instagram} alt="instagram" />
    </LeftImageWrapper>
  )
}

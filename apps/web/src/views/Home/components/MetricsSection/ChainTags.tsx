import Image from 'next/image'
import styled from 'styled-components'
import bnbTag from '../../images/bnb-tag.png'
import aptosTag from '../../images/aptos-tag.png'
import ethTag from '../../images/eth-tag.png'
import polygonTag from '../../images/polygon-zkevm-tag.png'
import lineanTag from '../../images/linea-tag.png'

const Wrapper = styled.div`
  margin-top: 30px;
  white-space: nowrap;
  max-width: 800px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`
const TagWrapper = styled.div`
  display: inline-block;
  margin-right: 32px;
  scroll-snap-align: start;
`

export const ChainTags: React.FC = () => {
  return (
    <Wrapper>
      <TagWrapper>
        <Image src={bnbTag} alt="bnbTag" width={304} height={72} placeholder="blur" />
      </TagWrapper>
      <TagWrapper>
        <Image src={aptosTag} alt="aptosTag" width={186} height={72} placeholder="blur" />
      </TagWrapper>
      <TagWrapper>
        <Image src={ethTag} alt="ethTag" width={237} height={72} placeholder="blur" />
      </TagWrapper>
      <TagWrapper>
        <Image src={polygonTag} alt="polygonTag" width={214} height={72} placeholder="blur" />
      </TagWrapper>
      <TagWrapper>
        <Image src={lineanTag} alt="lineanTag" width={150} height={72} placeholder="blur" />
      </TagWrapper>
    </Wrapper>
  )
}

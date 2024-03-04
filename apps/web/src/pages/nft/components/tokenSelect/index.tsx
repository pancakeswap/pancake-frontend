import Image from 'next/image'
import arrow3 from '../../assets/arrow3.png'
import sgtIcon from '../../assets/sgt-icon.png'
import { Wrapper } from './index.style'

export default function TokenSelect() {
  return (
    <Wrapper>
      <div className="token-select__wrapper">
        <div className="token-select__selected">
          <Image src={sgtIcon} className="token-select__selected-icon" alt="icon" />
          <div className="token-select__selected-name">ACE</div>
          <Image src={arrow3} className="token-select__selected-arrow" alt="arrow" />
        </div>
      </div>
    </Wrapper>
  )
}

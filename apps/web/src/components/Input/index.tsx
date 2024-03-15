import Image from 'next/image'
import infoError from '../../../public/images/nfts2/info-error.svg'
import { Wrapper } from './index.style'

type IPriceInput = {
  label: string
  amount: string
  setAmount: (value: string) => void
  errorMsg?: string
}
export default function Input({ label, amount, setAmount, errorMsg }: IPriceInput) {
  return (
    <Wrapper>
      <div className={`price-input__wrapper ${errorMsg ? 'price-input__wrapper--error' : ''}`}>
        <div className="price-input__label-box">
          <div className="price-input__label">{label}</div>
        </div>
        <div className="price-input__input-box">
          <input
            className="price-input__input"
            placeholder=""
            value={amount}
            style={{ width: '340px', fontSize: '14px' }}
            onChange={(e) => {
              setAmount(e.target.value)
            }}
          />
        </div>
        {errorMsg && (
          <div className="price-input__error-box">
            <Image src={infoError} alt="error icon" className="price-input__error-icon" />
            <div className="price-input__error-msg">{errorMsg}</div>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

import Image from 'next/image'

import infoError from '../../../public/images/nfts2/info-error.svg'
import { Wrapper } from './index.style'

type IPriceInput = {
  label: string
  balance?: string
  amount: string
  setAmount: (value: string) => void
  errorMsg?: string
  suffix: React.ReactNode
}
export default function PriceInput({ label, balance, amount, setAmount, errorMsg, suffix }: IPriceInput) {
  return (
    <Wrapper>
      <div className={`price-input__wrapper ${errorMsg ? 'price-input__wrapper--error' : ''}`}>
        <div className="price-input__label-box">
          <div className="price-input__label">{label}</div>
          {balance !== undefined && (
            <div className="price-input__balance-box">
              <div className="price-input__balance-label">Balance</div>
              <div className="price-input__balance-value">0.00</div>
            </div>
          )}
        </div>
        <div className="price-input__input-box">
          <input
            className="price-input__input"
            type="number"
            placeholder=""
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {suffix && <div className="price-input__input-suffix">{suffix}</div>}
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

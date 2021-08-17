import React from 'react'
import './Landing.Styles.css'
import Header from './Header';
import TimeLine from './TimeLine';
import Tokenomics from './Tokenomics';
import Footer from './Footer';
import { APESWAP_EXCHANGE_URL, BASE_EXCHANGE_URL } from '../../config'
import tokens from '../../config/constants/tokens'
import { getAddress } from '../../utils/addressHelpers'
import { routes } from "../../routes"

interface LandingProps {
  handleAuthentication: any
}

const Landing: React.FC<LandingProps> = (props: LandingProps) =>{

  const { handleAuthentication } = props;

  const handleClick = () => {
    handleAuthentication();
  }

  return (
    <>
    <Header />
    <div className="section hero-section">
      <div className="container w-container">
        <img  src='/images/rugZombie/loader.gif' width="350" alt="" className="image" />
          <h1 className="heading">Bringing your rugged tokens<span className="text-span"> back from the dead</span></h1>
          {/* <p className="max_width_400">Rug zombie is a frictionless, yield-generating contract that allows you to seek shelter amidst the chaos of the market.<br />
          </p> */}
      </div>
      <div className="_40_percent_block">
        <div tabIndex={0} role="button" onClick={handleClick} onKeyDown ={handleClick} className="button-2 w-button">
          Launch App
        </div>
      </div>
      <div className="_40_percent_block">
        <a rel="noreferrer" target="_blank" href={`${APESWAP_EXCHANGE_URL}/swap?outputCurrency=${getAddress(tokens.zmbe.address)}`} className="button-2 w-button">
          Buy on Apeswap
        </a>
      </div>
      <div className="_40_percent_block">
        <a href={routes.GRAVEDIGGER} className="button-2 w-button">
          Suggest a grave
        </a>
      </div>
      <div className="_40_percent_block">
        <a href={routes.SPAWNWITHUS} className="button-2 w-button">
          Spawning Pool Application
        </a>
      </div>
      <div className="_40_percent_block-copy">
        <a href="https://dex.guru/token/0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5-bsc" rel="noreferrer" target="_blank" className="button-3 w-button">
          View Chart
        </a>
      </div>
      <div className="_40_percent_block-copy">
        <a href="https://app.gitbook.com/@rugzombie/s/docs/tokenomics" rel="noreferrer" target="_blank" className="button-3 w-button">
          View token info
        </a>
      </div>
      <div className="_40_percent_block-copy">
        <a href="https://t.me/rugzombie" rel="noreferrer" target="_blank" className="button-3 w-button">
          Join our telegram
        </a>
      </div>
    </div>
    <TimeLine />
    <Tokenomics />
    <Footer />
    </>
  )
}

export default Landing;

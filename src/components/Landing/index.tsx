import React from 'react'
import './Landing.Styles.css'
import Header from './Header';
import TimeLine from './TimeLine';
import Tokenomics from './Tokenomics';
import Footer from './Footer';
import { APESWAP_EXCHANGE_URL } from '../../config'
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
    <br /><br /><br /><br />
    <div className="section hero-section">
      <div className="container w-container">
        <img  src='/images/rugZombie/loader.gif' width="350" alt="" className="image" />
          <h1 className="heading">Bringing your rugged tokens<span className="text-span"> back from the dead</span></h1>
      </div>
      <div className="_40_percent_block">
        <div tabIndex={0} role="button" onClick={handleClick} onKeyDown ={handleClick} className="button-2 w-button">
          Launch App
        </div>
      </div>
      <div className="_40_percent_block">
        <a rel="noreferrer" target="_blank" href="https://rugzombie.medium.com/how-to-buy-zmbe-b763c2b3185f" className="button-2 w-button">
          How to Buy
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
      <div className="_40_percent_block">
        <a href="https://dex.guru/token/0x50ba8bf9e34f0f83f96a340387d1d3888ba4b3b5-bsc" rel="noreferrer" target="_blank" className="button-2 w-button">
          View Chart
        </a>
      </div>
      <div className="_40_percent_block">
        <a href="https://app.gitbook.com/@rugzombie/s/docs/tokenomics" rel="noreferrer" target="_blank" className="button-2 w-button">
          View token info
        </a>
      </div>
      <div className="_40_percent_block">
        <a href="https://t.me/rugzombie" rel="noreferrer" target="_blank" className="button-2 w-button">
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

import React from 'react'
import './Landing.Styles.css'
import NomicsLogo from "../../images/Nomics_Logo.svg"
import TelegramLogo from "../../images/TG_Logo.svg";
import CMCLogo from "../../images/CMC_Logo.svg";
import CGLogo from "../../images/CoinGecko_Logo.svg";
import EmailLogo from "../../images/Email_Logo.svg";
import MediumLogo from "../../images/Medium_Logo.svg";
import Publish0xLogo from "../../images/Publish0x_Logo.svg";
import RedditLogo from "../../images/Reddit_Logo.svg";
import TwitterLogo from "../../images/Twitter_Logo.svg";
import YouTubeLogo from "../../images/Youtube_Logo.svg";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer_section-2">
        <div className="footer_logo_wrap">
          <a href="/" className="brand_link w-inline-block">
            <img src="https://storage.googleapis.com/rug-zombie/RugZombieBanner.png" width="200" sizes="200px" alt="" className="footer_logo" />
          </a>
        </div>
      </div>
      <div className="copyrights_wrap-2">
        <div className="wrapper copyrights_wrapper">
          <div className="copyright">
            <a href="#Tokenomics" className="footer_link-2">Tokenomics</a>
            <a href="#How-To-Buy" className="footer_link-2"> | How to buy</a>
          </div>
          <div className="social_links_wrapper navbar_sm">
          <a href="mailto:info@rugzombie.io" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={EmailLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://coinmarketcap.com/currencies/rugzombie/" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={CMCLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://www.coingecko.com/en/coins/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={CGLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://rugzombie.medium.com/" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={MediumLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <br/>
            <a href="https://www.publish0x.com/@RugZombie-Undertaker" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={Publish0xLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://www.reddit.com/user/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={RedditLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://t.me/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={TelegramLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://twitter.com/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={TwitterLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://www.youtube.com/channel/UCJv0OdCDThvuJ_0lruZrm_w" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={YouTubeLogo} width="27" sizes="30px" alt="" className="image-3" />
            </a>
            <a href="https://nomics.com/assets/zmbe-zombie-token" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={NomicsLogo} width="45" sizes="30px" alt="" className="image-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

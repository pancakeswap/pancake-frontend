import React from 'react'
import './Landing.Styles.css'
import NomicsLogo from "../../images/Nomics_Graphicmark-Purple_200x200.png"

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
            <a href="#How-To-Buy" className="footer_link-2">| How to buy</a>
          </div>
          <div className="copyright">
            <a href="/" target="_blank" className="link">
              info@rugzombie.io
            </a>
          </div>
          <div className="social_links_wrapper navbar_sm">
            <a href="https://nomics.com/assets/zmbe-zombie-token" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src={NomicsLogo} width="18" sizes="20px" alt="" className="image-3" />
            </a>
            <a href="https://t.me/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src="https://uploads-ssl.webflow.com/60847fea0f393c67d6cd5297/60847fea0f393c065ecd52b3_Telegram.png" width="18" sizes="20px" alt="" className="image-3" />
            </a>
            <a href="https://twitter.com/rugzombie" rel="noreferrer" target="_blank" className="social_link w-inline-block">
              <img src="https://uploads-ssl.webflow.com/60847fea0f393c67d6cd5297/60847fea0f393c3cc6cd52b6_Twitter.png" width="21" sizes="20.99431800842285px" alt="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

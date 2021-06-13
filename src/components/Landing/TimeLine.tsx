import React from 'react'
import './Landing.Styles.css'

const TimeLine = () => {
  return (
    <div id="Timeline" className="section-3 timeline">
      <div id="How-To-Buy" className="tabs w-tabs">
          <div className="tabs-content-2 w-tab-content">
            <div data-w-tab="Tab 2" className="w-tab-pane w--tab-active">
              <h1 className="heading">How to buy $ZMBE</h1>
              <ul className="list-2">
                <li>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>1.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Download MetaMask or use</strong>
                    </span>
                  </p>
                  <p className="paragraph-23">
                    <span className="text-span-3">
                      <strong className="bold-text-4">an existing wallet</strong>
                    </span>
                  </p>
                  <p className="paragraph-18">
                    Head to metamask.io and download their wallet to your phone or chrome/firefox browser.
                  </p>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>2.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Go to pancakeswap.finance and</strong>
                    </span>
                  </p>
                  <p className="paragraph-23">
                    <span className="text-span-3">
                      <strong className="bold-text-4">11make sure its set to v1 (old)</strong>
                    </span>
                  </p>
                  <p className="paragraph-18">PancakeSwap is where you wll be performing the swap of your<br />current tokens to $Rug zombie.</p>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>3.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Get to the trade screen</strong>
                    </span>
                  </p>
                  <p className="paragraph-18">Click Connect at the top right of the screen, and then navigate<br />to Trade on the left sidebar.</p>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>4.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Select the $Rug zombie token</strong>
                    </span>
                  </p>
                  <p className="paragraph-18">Click on the Select a Currency button, and enter the $Rug zombie token contract:<br />
                    <a href="/" target="_blank">
                      0x5e90253fbae4dab78aa351f4e6fed08a64ab5590
                    </a>
                    </p>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>5.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Adjust your slippage to 12%</strong>
                      </span>
                    </p>
                  <p className="paragraph-18">Click Settings at the top right, and adjust your slippage to 12%<br />(sometimes it may be a bit more, depending on how much demand there is).</p>
                  <p className="paragraph-17">
                    <span className="text-span-2">
                      <strong>6.</strong>
                    </span>
                    <span className="text-span-3">
                      <strong className="bold-text">Swap away!</strong>
                    </span>
                  </p>
                  <p className="paragraph-18">Enter the amount you want to buy and swap away!<br />Remember to have enough BNB for gas fees!</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      <div className="w-layout-grid _3_col_grid buymobilesect">
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-4">
              <strong className="nummobile">1. </strong>
            </span>
            <strong>Download MetaMask or use</strong>
            <strong>an existing wallet</strong>
          </h3>
          <p className="paragraph-14">Head to metamask.io and download their wallet to your phone or chrome/firefox browser.</p>
        </div>
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-5">
              <strong className="nummobile">2. </strong>
            </span>
            <strong>Go to pancakeswap.finance and </strong>
            <strong>make sure its set to v1 (old)</strong>
          </h3>
          <p className="paragraph-16">PancakeSwap is where you wll be performing the swap of your<br />current tokens to $Rug zombie.</p>
        </div>
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-6">
              <strong className="nummobile">3. </strong>
            </span>
            <strong>Go to the trade screen</strong>
          </h3>
          <p className="paragraph-15">Click Connect at the top right of the screen, and then navigate<br />to Trade on the left sidebar.</p>
        </div>
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-7">
              <strong className="nummobile">4.</strong>
            </span>
            <strong> Select the $Rug zombie token</strong>
          </h3>
          <p className="paragraph-15">Click on the Select a Currency button, and enter the $Rug zombie token contract:<br />
            <a href="/" target="_blank">0x5e90253fbae4dab78aa<br />351f4e6fed08a64ab5590</a>
          </p>
        </div>
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-8">
              <strong className="nummobile">5. </strong>
            </span>
            <strong>Adjust your slippage to 12%</strong>
          </h3>
          <p className="paragraph-15">Click Settings at the top right, and adjust your slippage to 12%<br />(sometimes it may be a bit more, depending on how much demand there is).</p>
        </div>
        <div className="card buymobile">
          <h3 className="heading-4">
            <span className="text-span-9">
              <strong className="nummobile">6.</strong>
            </span>
            <strong> Swap away!</strong>
          </h3>
          <p className="paragraph-15">Enter the amount you want to buy and swap away!<br />Remember to have enough BNB for gas fees!</p>
        </div>
      </div>
    </div>
	
  )
}

export default TimeLine

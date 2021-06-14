import React from 'react';
import './Header.Styles.css';

const Header = () => {
	return (
		<header>
			<nav className="sc-WZYut nav-bar">
				<div className="sc-jSFjdj sc-gKAaRy egmVvb jsxqFW mainLogoDiv">
					<a aria-label="Pancake home page" className="sc-dsXzNU bYhZyP" href="/">
						<img alt="" src="https://storage.googleapis.com/rug-zombie/RugZombieBanner.png" className="logo" />
					</a>
				</div>
				<div role="navigation" className="nav-menu w-nav-menu jsxqFW">
					<a href="#Tokenomics" className="nav_link-2">Tokenomics</a>
					{/* <a href="#Timeline" className="nav_link-2">Timeline</a> */}
					<a href="#How-To-Buy" className="nav_link-2">How to buy</a>
					<a rel="noreferrer" target="_blank" href="https://rugzombie-1.gitbook.io/docs/" className="nav_link-2">Gitbook Documents</a>
					{/* <a href="#the-team" className="nav_link-2">Meet The Team</a> */}
				</div>
			</nav>
		</header>
	)
}

export default Header

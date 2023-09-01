import styled from 'styled-components'
import Link from 'next/link'
import { Lalezar } from 'next/font/google'

const lalezar = Lalezar({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const Tabs = styled.div`
  display: flex;
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
  overflow: hidden;
  background: #586687;
  height: 50px;
  @media (max-width: 576px) {
    width: 100%;
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(Link)`
  align-items: center;
  justify-content: center;
  width: 207px;
  height: 100%;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  @media (max-width: 576px) {
    width: 50%;
  }

  &.${activeClassName}.swap {
    background: #fff;
    color: #292640;
    border-radius: 100px;
  }
  &.${activeClassName}.pool {
    background: #fff;
    color: #292640;
    border-radius: 100px;
  }
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  return (
    <Tabs style={{ marginBottom: '30px' }}>
      <StyledNavLink
        id="swap-nav-link"
        className={`${active === 'swap' ? activeClassName : ''} swap ${lalezar.className}`}
        href="/"
      >
        Swap
      </StyledNavLink>
      <StyledNavLink
        id="pool-nav-link"
        className={`${active === 'pool' ? activeClassName : ''} pool ${lalezar.className}`}
        href="/liquidity"
      >
        Liquidity
      </StyledNavLink>
    </Tabs>
  )
}

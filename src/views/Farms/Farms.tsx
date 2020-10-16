import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Button from '../../components/Button'
import Page from '../../components/Page'
import WalletProviderModal from '../../components/WalletProviderModal'

import useModal from '../../hooks/useModal'

import Farm from '../Farm'

import FarmCards from './components/FarmCards'
import { TranslateString } from '../../utils/translateTextHelpers'

interface FarmsProps {
  removed: boolean
}

const Farms: React.FC<FarmsProps> = ({ removed }) => {
  const { path } = useRouteMatch()
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  return (
    <Switch>
      <Page>
        {true ? (
          <>
            <Route exact path={path}>
              <Title>
                {TranslateString(320, 'Stake FLIP tokens to stack CAKE')}
              </Title>
              <StyledLink exact activeClassName="active" to="/staking">
                Staking
              </StyledLink>
              <FarmCards removed={removed} />
              {removed ? (
                <NavLink exact activeClassName="active" to="/farms">
                  Active Pools
                </NavLink>
              ) : (
                <NavLink exact activeClassName="active" to="/removed">
                  Inactive Pools
                </NavLink>
              )}
              <Image src={require(`../../assets/img/cakecat.png`)} />
            </Route>
            <Route path={`${path}/:farmId`}>
              <Farm />
            </Route>
          </>
        ) : (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Button
              onClick={onPresentWalletProviderModal}
              text={`🔓 ${TranslateString(292, 'Unlock Wallet')}`}
            />
          </div>
        )}
      </Page>
    </Switch>
  )
}

const StyledLink = styled(NavLink)`
  display: none;
  @media (max-width: 400px) {
    display: block;
    background: #50d7dd;
    border-radius: 5px;
    line-height: 40px;
    font-weight: 900;
    padding: 0 20px;
    margin-bottom: 30px;
    color: #fff;
  }
`

const Image = styled.img`
  @media (max-width: 500px) {
    width: 100vw;
  }
`

const Title = styled.div`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 29px;
  width: 50vw;
  text-align: center;
  font-weight: 900;
  margin: 50px;
`

export default Farms

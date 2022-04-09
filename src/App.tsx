import React from 'react'
import styled from 'styled-components'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { Provider as ReduxProvider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ModalProvider } from 'react-hooks-async-modal'

import store, { history } from './store/store'

import AppRoutes from './AppRoutes'
import { hydrateAuth } from './store/auth/actionCreators'

store.dispatch(hydrateAuth())

const App: React.FC = () => (
  <ReduxProvider store={store}>
    <ConnectedRouter history={history}>
      <ThemeProvider theme={theme}>
        <StyledApp>
          <ModalProvider>
            <AppRoutes />
          </ModalProvider>
        </StyledApp>
      </ThemeProvider>
    </ConnectedRouter>
  </ReduxProvider>
)

const StyledApp = styled.div`
  background: linear-gradient(90deg, rgba(243,243,251,1) 0%, rgba(255,255,255,1) 100%);
  position: absolute;
  margin: 0;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: black;
  padding: 1em;
  align-items: stretch;
`

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#2881e2'
    },
    secondary: {
      main: '#e53ee2'
    }
  }
})

export default App

import styled from 'styled-components'

export const AuthFormLogo = styled.div`
  font-family: Montserrat, sans-serif;
  font-size: 63px;
  margin-left: -5px;
  background: linear-gradient(13deg, #ED7DEB 14%, #7DB3ED 64%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 3px;
  user-select: none;
`

export const AuthFormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const AuthFormUI = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 15px;
`

export const AuthFormUISpacer = styled.div`
  width: 15px;
`

export const AuthFormError = styled.div`
  font-size: 16px;
  color: red;
  border: 1px solid red;
  border-radius: 4px;
  padding: 15px;
  margin-top: 15px;
  display: flex;
  align-items: flex-start;

  & > div {
    margin-top: 3px;
    margin-left: 3px;
  }
  & > div:first-letter {
    text-transform: uppercase;
  }
`

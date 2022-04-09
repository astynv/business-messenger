import * as React from 'react'
import styled from 'styled-components'

import icon from '../../icons/search-icon512.png'

const Container = styled.div`
  flex-shrink: 0;

  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
  height: 3em;

  border-radius: 0.2em;
  box-shadow: 0px 0px 10px 0px #e7e7e7;
`

const StyledInput = styled.input`
  font-size: 1em;
  padding-left: 0.4em;
  width: 100%;
  border: none;
  outline: none;
`

const SearchIcon = styled.img`
  height: 0.75em;
  padding-left: 2em;
  filter: contrast(10%);
`

interface SearchBoxProps {
  className?: string
}

const SearchBox: React.FC<SearchBoxProps> = props => (
  <Container className={props.className}>
    <SearchIcon src={icon} />
    <StyledInput type='text' placeholder='Search' />
  </Container>
)

export default SearchBox

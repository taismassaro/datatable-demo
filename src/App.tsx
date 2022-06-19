import React, { useState } from 'react'
import styled from 'styled-components'
import { AddRowExample, FullExample, RowActionExample, SimpleExample} from './examples'

const RootContainer = styled.main`
  padding: 2rem;
  background-color: #f1f3f5;
  height: 100%;
`

const Header = styled.header`
  text-align: center;
`

const examples = {
  simple: <SimpleExample />,
  addRow: <AddRowExample />,
  rowAction: <RowActionExample />,
  full: <FullExample />
}

function App () {
  const [currentExample, setCurrentExample] = useState<keyof typeof examples>('simple')

  return (
    <RootContainer>
      <Header>
        <h1>DataTable Demo</h1>
      </Header>

      <select onChange={event => {
        const selectedExample = event.target.value as keyof typeof examples
        setCurrentExample(selectedExample)
        }}>
          <option value="simple">Simple table with GraphQL data</option>
          <option value="addRow">With ability to add new rows</option>
          <option value="rowAction">With ability to perform mutation on row data</option>
          <option value="full">Full example</option>
      </select>

      {examples[currentExample]}
    </RootContainer>
  )
}

export default App
import React from 'react'
import { styled } from '@theme'
import { Heading, TextEm } from '@components'

// For the master container of the form header
// This contains the title on the left and the 'required' on the right

const Header = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  '@mobile': { justifyContent: 'space-between' },

  variants: {
    alignTitle: {
      center: { justifyContent: 'center' }
    }
  }
})

// For the container of the required text on the right of the container
// This is needed so we can declare the color of the '*' on the left of the text

const Required = styled('div', {
  position: 'absolute',
  right: 0,
  display: 'flex',
  flexDirection: 'row',
  '> *:not(:last-child)': { marginRight: 12 },
  '@mobile': { position: 'relative', right: 'auto' }
})

// -------------- Typescript declarations -------------- //

interface HeaderProps {
  title: string
  titleSize?: 'l0'
  removeRequired?: boolean
  alignTitle?: 'center'
}

// ---------- This is the end of declarations ---------- //

export const FormHeader = ({ 
    title,
    titleSize, 
    alignTitle,
    removeRequired 
  }:HeaderProps) => {

  return(

    <Header {...{ alignTitle }}>
      <Heading 
        bold="bold" 
        size={ titleSize == 'l0' ? "l3" : 'l5'} 
        {...{ title }} 
      />
      
      { removeRequired && (
        <Required>
          <TextEm color="danger">*</TextEm>
          <Heading size="l0" title="Required" />
        </Required>
      )}
    </Header>

  )
}
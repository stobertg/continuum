import React from 'react'
import { styled } from '@theme'
import { AnimatedBlob } from '@components'

// For the master container of the stage backgrond
// This contains the blog that remains in a fixed position as the user scrolls down the page

const StageContainer = styled('section', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  paddingTop: 32,
  zIndex: 10,
  mixBlendMode: 'screen',

  // Here we remove all the interaction to the webGl background
  // This is so the user can not rotate or interact with the background

  '&, *': {
    pointerEvents: 'none !important',
    userSelect: 'none !important',
  }
})

// For the container of the blob to sit in the center of the master container
// This will hold the blob in the center of the container, where it changes shape when the user scrolls

const StageContent = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  width: '100%',
  height: '100%',
  maxHeight: 800,
  opacity: 1,
})

// ---------- This is the end of declarations ---------- //

export const StageBg = () => {
  return(
    
    <StageContainer>
      <StageContent>
        <AnimatedBlob />
      </StageContent>
    </StageContainer>

  )
}

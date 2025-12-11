import React from 'react'
import { ProgressSpinner} from 'primereact/progressspinner';

const Loading = () => {
  return (
    <div className='loading'>
        <ProgressSpinner strokeWidth="8" animationDuration=".5s" />
    </div>
  )
}

export default Loading
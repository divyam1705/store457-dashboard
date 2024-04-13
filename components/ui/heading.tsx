interface HeadingProps{
    title:string;
    description:string;
}
import React from 'react'

function Heading({title,description}:HeadingProps) {
  return (
    <div>
        <h2 className='text-3xl font-bold tracking-tight'>{title}</h2>
        <p className='test-sm text-muted-foreground'>
            {description}
        </p>
        </div>
  )
}

export default Heading
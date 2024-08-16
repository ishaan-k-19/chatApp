import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'

const Widget = ({title, value, Icon}) => {
  return (
    <Card className="max-w-sm w-full my-5">
        <CardHeader>
            <CardTitle className="flex flex-col gap-4 items-center justify-center">
                <div className='rounded-full border-[4px] w-20 h-20 border-neutral-700 justify-center items-center flex'>{value}</div>
                <div>{Icon}</div>
                <h5>{title}</h5>
            </CardTitle>
        </CardHeader>
        <CardContent>

        </CardContent>
    </Card>
  )
}

export default Widget

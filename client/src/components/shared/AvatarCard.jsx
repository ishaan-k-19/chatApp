import { transformImage } from '@/lib/features'
import { Avatar, AvatarImage } from '../ui/avatar'

const AvatarCard = ({avatars = [], max = 4}, style) => {

  return (
    <div className='flex gap-1'>
        <div max={max}>
            <div className='h-12 w-20' style={style}>
                <Avatar className='border-white left-9 absolute shadow-lg'>
                <AvatarImage
                key={Math.random()*100}
                src={transformImage(avatars[0])} 
                alt={`Avatar`}
                />
                </Avatar>
            </div>
        </div>
    </div>
  )
}

export default AvatarCard

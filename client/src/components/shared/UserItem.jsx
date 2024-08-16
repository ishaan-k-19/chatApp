
import { transformImage } from '@/lib/features'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { memo } from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'



const UserItem = ({user, handler, handlerIsLoading, isAdded = false, styling}) => {
    const {name, _id, avatar} = user
    const newAvatar = avatar.url ? avatar.url : avatar

  return (
    <li>
        <div className="flex items-center justify-between" style={{...styling}}>
            <div className='flex gap-2 items-center'>
            <Avatar className='object-cover my-4 shadow-lg border'>
                <AvatarImage className='object-cover' src={transformImage(newAvatar)}/>
            </Avatar>
            <p className='text-lg grow overflow-hidden' style={{display: "-webkit-box", WebkitLineClamp:1, WebkitBoxOrient:"vertical"}}>{name}</p>
            </div>

            <Button className='px-2 rounded-full' onClick={()=>handler(_id)} disabled={handlerIsLoading} variant={isAdded ? "destructive": ""}>
                {isAdded ? <MinusIcon/> : <PlusIcon/>}
            </Button>
        </div>
    </li>
  )
}

export default memo(UserItem)

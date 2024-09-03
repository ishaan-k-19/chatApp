import { memo } from 'react';
import { Link } from '../styles/StyledComponents';
import { useTheme } from '../ui/theme-provider';
import AvatarCard from './AvatarCard';
import { Avatar, AvatarImage } from '../ui/avatar';
import { transformImage } from '@/lib/features';
import { Separator } from '../ui/separator';

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
}) => {

  const {theme, systemTheme} = useTheme();


  return (
    <>
    <Link className='hover:bg-[#7b39ed] hover:bg-opacity-45 rounded-lg mx-2' to={`/chat/${_id}`}>
      <div
        className='rounded-lg md:gap-[1px] gap-3'
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.4rem 0rem',
          margin: '2px 0px',
          backgroundColor: sameSender ? '#7b39ed' : 'unset',
          color: sameSender || theme === 'dark' || theme === 'system' && systemTheme === 'dark' ? 'white' : 'unset',
          position: 'relative',
        }}
      >
        <Avatar className="object-cover md:my-2 md:ml-2 ml-10 shadow-lg">
          <AvatarImage className="object-cover" src={transformImage(avatar[0])} />
        </Avatar>

        <div className="flex-col flex">
          <h5 className='text-lg mx-2'>{name}</h5>
          {newMessageAlert && (
            <h6 className='text-lg'>{newMessageAlert.count} New Message</h6>
          )}
        </div>
        {isOnline & groupChat === false ? (
          <div className='w-[10px] h-[10px] rounded-full bg-green-500 absolute top-[50%] right-4 -translate-y-[50%]' />
        ) : (
          <div className='w-[10px] h-[10px] rounded-full top-[50%] right-4 -translate-y-[50%]' />
        )}
      </div>
    </Link>
    </>
  );
};

export default memo(ChatItem);

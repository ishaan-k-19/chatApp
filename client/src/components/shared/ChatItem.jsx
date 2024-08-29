import { memo } from 'react';
import { Link } from '../styles/StyledComponents';
import { useTheme } from '../ui/theme-provider';
import AvatarCard from './AvatarCard';

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
    <Link className='hover:bg-[#7b39ed] hover:bg-opacity-45 rounded-lg mx-2' to={`/chat/${_id}`}>
      <div
        className='rounded-lg'
        style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          padding: '0.6rem 0rem',
          margin: '5px 0px',
          backgroundColor: sameSender ? '#7b39ed' : 'unset',
          color: sameSender || theme === 'dark' || theme === 'system' && systemTheme === 'dark' ? 'white' : 'unset',
          position: 'relative',
        }}
      >
        <AvatarCard avatars={avatar}/>

        <div className="flex-col flex">
          <h5 className='text-xl mx-2'>{name}</h5>
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
  );
};

export default memo(ChatItem);

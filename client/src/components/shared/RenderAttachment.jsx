import { transformImage } from '@/lib/features';
import { FileJsonIcon } from 'lucide-react';
import React from 'react'

const RenderAttachment = (file, url) => {
  switch (file){
    case "video":
        return <video className='py-3' src={url} preload='none' width={"200px"} controls/>;
        
    case "image":
        return <img className='py-3' src={transformImage(url, 200)} alt="Attachment" width={"200px"} height={"150px"} controls/>;
    case "audio":
        return <audio className='py-3' src={url} preload='none' controls/>;
        
    default:
        return <FileJsonIcon/>;
  }
};

export default RenderAttachment

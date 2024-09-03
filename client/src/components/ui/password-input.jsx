import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const PasswordInput = React.forwardRef(({ className, type, ...props }, ref) => {

    const [showPassword, setShowPassword] = React.useState(false);

  return (
      <Input 
      type={showPassword ? "text" : "password"} 
      suffix={showPassword ? (<EyeIcon size={19} className="select-none" onClick={() => {setShowPassword(false)}}/> 
      ) : (
      <EyeOffIcon size={19} className="select-none" onClick={() => {setShowPassword(true)}}/>)} 
      className={className} 
      {...props} 
      ref={ref} />
    
  );
})
PasswordInput.displayName = "Input"

export { PasswordInput }

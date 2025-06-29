import React from "react";
import { Input } from "./input";

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ElementType;
  className?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
          <Icon className="h-5 w-5" />
        </span>
        <Input ref={ref} className={`pl-10 ${className}`} {...props} />
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };

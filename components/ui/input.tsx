import { InputHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex flex-col min-w-40 flex-1">
        {label && (
          <p className="text-white text-base font-medium leading-normal pb-2">
            {label}
          </p>
        )}
        <input
          className={clsx(
            "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-[#1172d4] h-14 placeholder:text-[#92adc9] p-[15px] text-base font-normal leading-normal",
            className
          )}
          ref={ref}
          {...props}
        />
      </label>
    );
  }
);

Input.displayName = "Input";

export { Input };




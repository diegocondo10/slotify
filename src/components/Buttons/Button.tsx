import classNames from "classnames";
import { useRouter } from "next/navigation";
import { Button as PrimeButton, ButtonProps as PrimeButtonProps } from "primereact/button";
import { FC, MouseEvent } from "react";

interface ButtonProps extends PrimeButtonProps {
  href?: string;
  variant?: "primary" | "secondary" | "danger" | "warning" | "info" | "help" | "success";
  outlined?: boolean;
  block?: boolean;
  sm?: boolean;
  lg?: boolean;
  text?: boolean;
  rounded?: boolean;
  access?: string;
}

const Button: FC<ButtonProps> = ({
  sm = false,
  lg = false,
  block = false,
  outlined = true,
  href,
  text = false,
  rounded = false,
  access,
  variant = "primary",
  className,
  onClick,
  type = "button",
  ...rest
}) => {
  const router = useRouter();

  const _onClick = (evt: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(evt);
    }

    if (href) {
      router.push(href);
    }
  };

  return (
    <PrimeButton
      className={classNames(
        {
          "p-button-rounded": rounded,
          [`p-button-${variant}`]: !!variant,
          "p-button-outlined": outlined,
          "p-button-text": text,
          "p-button-sm": sm,
          "p-button-lg": lg,
          "w-full": block,
        },
        className
      )}
      onClick={_onClick}
      type={type}
      {...rest}
    />
  );
};

export default Button;

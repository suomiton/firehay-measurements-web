import { PropsWithChildren } from "react";

interface RoundButtonProps {
  onClick: (value: string) => void;
  value: string;
  isActive: boolean;
}

function RoundButton({
  onClick,
  value,
  isActive,
  children,
}: PropsWithChildren<RoundButtonProps>) {
  const bgColor = isActive ? "bg-blue-200" : "bg-gray-200";

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    onClick(e.currentTarget.value);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${bgColor} rounded-full inline-flex p-2 text-xs ml-2`}
      value={value}
    >
      {children}
    </button>
  );
}

export default RoundButton;

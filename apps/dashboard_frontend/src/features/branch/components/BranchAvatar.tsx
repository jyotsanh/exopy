import { getAvatarColor } from "../constants/branch.constants";

interface BranchAvatarProps {
  name: string;
}

const BranchAvatar = ({ name }: BranchAvatarProps) => {
  const { bgColor, textColor } = getAvatarColor(name);

  return (
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center
                  font-bold text-lg shrink-0 ${bgColor} ${textColor}`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

export default BranchAvatar;

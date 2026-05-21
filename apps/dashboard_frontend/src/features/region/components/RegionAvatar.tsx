import { getAvatarColor } from "../constants/region.constants";

interface RegionAvatarProps {
  name: string;
}

const RegionAvatar = ({ name }: RegionAvatarProps) => {
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

export default RegionAvatar;

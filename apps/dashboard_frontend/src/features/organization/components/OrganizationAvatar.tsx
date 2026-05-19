// features/organization/components/OrganizationAvatar.tsx

import { getAvatarColor } from "../constants/organization.constants";

interface OrganizationAvatarProps {
  name: string;
}

const OrganizationAvatar = ({ name }: OrganizationAvatarProps) => {
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

export default OrganizationAvatar;
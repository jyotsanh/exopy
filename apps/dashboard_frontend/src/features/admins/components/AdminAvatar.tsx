import { getAvatarColor } from "../constants/admin.constants";

interface AdminAvatarProps {
  name: string;
  image?: string;
}

const AdminAvatar = ({ name, image }: AdminAvatarProps) => {
  const { bgColor, textColor } = getAvatarColor(name);

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-2xl object-cover shrink-0"
      />
    );
  }

  return (
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center
                  font-bold text-lg shrink-0 ${bgColor} ${textColor}`}
    >
      {(name?.charAt(0) ?? "?").toUpperCase()}
    </div>
  );
};

export default AdminAvatar;

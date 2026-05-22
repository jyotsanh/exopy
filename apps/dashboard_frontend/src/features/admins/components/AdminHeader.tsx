import { FiShield } from "react-icons/fi";

const AdminHeader = () => (
  <div className="flex items-center gap-4 mb-10">
    <div className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center">
      <FiShield className="text-foreground text-xl" />
    </div>
    <h1 className="text-2xl font-bold tracking-widest text-primary uppercase">
      Admins
    </h1>
  </div>
);

export default AdminHeader;

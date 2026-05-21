// features/organization/components/OrganizationHeader.tsx

import { FiHome } from "react-icons/fi";

const OrganizationHeader = () => (
  <div className="flex items-center gap-4 mb-10">
    <div className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center">
      <FiHome className="text-foreground text-xl" />
    </div>
    <h1 className="text-2xl font-bold tracking-widest text-primary uppercase">
      Organizations
    </h1>
  </div>
);

export default OrganizationHeader;

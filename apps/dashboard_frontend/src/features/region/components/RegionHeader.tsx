import { FiMapPin } from "react-icons/fi";

interface RegionHeaderProps {
  orgName?: string;
}

const RegionHeader = ({ orgName }: RegionHeaderProps) => (
  <div className="flex items-center gap-4 mb-10">
    <div className="w-11 h-11 rounded-2xl bg-card border border-border flex items-center justify-center">
      <FiMapPin className="text-foreground text-xl" />
    </div>
    <div>
      <h1 className="text-2xl font-bold tracking-widest text-primary uppercase">
        Regions
      </h1>
      {orgName && (
        <p className="text-sm text-muted-foreground mt-1">{orgName}</p>
      )}
    </div>
  </div>
);

export default RegionHeader;

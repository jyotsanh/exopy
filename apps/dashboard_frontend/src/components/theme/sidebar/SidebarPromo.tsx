import { Download } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
//in case mobile app vayo vane use gardimla hahaha
const SidebarPromo = () => {
  const { state } = useSidebar();
  
  if (state === "collapsed") return null;

  return (
    <div className="mx-3 mb-4 rounded-2xl bg-linear-to-br from-green-950 to-green-800 p-4 text-white relative overflow-hidden">
      <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/5" />
      <Download className="size-6 text-green-300 mb-2" />
      <p className="font-bold text-sm leading-tight mb-1">
        Download our Exopy
        <br />
        Mobile App
      </p>
      <p className="text-[11px] text-green-300 mb-3">Get easy in another way</p>
      <Button 
        size="sm" 
        className="w-full bg-green-400 hover:bg-green-300 text-green-950 font-bold"
      >
        Download
      </Button>
    </div>
  );
};

export default SidebarPromo;
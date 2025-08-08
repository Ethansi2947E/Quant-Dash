import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const DashboardNav = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/settings", label: "Settings" },
    { href: "/strategies", label: "Strategies" }, // Added Strategies link
  ];

  const handleNavigation = (href: string) => {
    // Handle navigation logic here
  };

  return (
    <div className="flex rounded-lg bg-slate-100 p-1">
      <Link
        href="/performance"
        onClick={() => handleNavigation("/performance")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/performance" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Performance
      </Link>
      <Link
        href="/win-loss"
        onClick={() => handleNavigation("/win-loss")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/win-loss" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Win/Loss Analysis
      </Link>
      <Link
        href="/history"
        onClick={() => handleNavigation("/history")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/history" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Trade History
      </Link>
      {/* New Strategies tab */}
      <Link
        href="/strategies"
        onClick={() => handleNavigation("/strategies")}
        className={cn(
          "rounded-md px-4 py-2 text-sm font-medium transition-colors",
          pathname === "/strategies" ? "bg-white shadow-sm" : "text-slate-600 hover:bg-white/50 hover:text-slate-900",
        )}
      >
        Strategies
      </Link>
    </div>
  );
};

export default DashboardNav;

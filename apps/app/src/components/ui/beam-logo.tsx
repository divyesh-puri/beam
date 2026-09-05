import { cn } from "@bb/shared-ui/lib/utils";
import beamLogoUrl from "../../../../../assets/beam-logo.svg";

export function BeamLogo({ className = "size-4" }: { className?: string }) {
  return (
    <img
      src={beamLogoUrl}
      alt=""
      aria-hidden="true"
      className={cn(className, "object-contain")}
    />
  );
}

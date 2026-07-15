import React from "react";
import singleExt from "../../assets/walls/single-ext.webp";
import singleInt from "../../assets/walls/single-int.webp";
import doubleExt from "../../assets/walls/double-ext.webp";
import doubleInt from "../../assets/walls/double-int.webp";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

// Option (c): a wall per door FAMILY whose opening matches that family's shape, selected by the
// door type. `door` = where the door sits in the opening (% of wall): it's sized by HEIGHT with
// its natural width, centered on centerX, resting on the threshold (bottom).
type WallCfg = { src: string; aspect: number; door: { bottom: number; height: number; centerX: number } };
const WALLS: Record<"single" | "side" | "double", { ext: WallCfg; int: WallCfg }> = {
  single: {
    ext: { src: singleExt, aspect: 768 / 1376, door: { bottom: 23.0, height: 42.0, centerX: 49.7 } },
    int: { src: singleInt, aspect: 768 / 1376, door: { bottom: 14.2, height: 61.0, centerX: 49.5 } },
  },
  // side-panel + double share the wide-opening wall until dedicated walls are added
  side: {
    ext: { src: doubleExt, aspect: 1408 / 768, door: { bottom: 10.2, height: 59.2, centerX: 50.0 } },
    int: { src: doubleInt, aspect: 768 / 1376, door: { bottom: 14.2, height: 61.0, centerX: 49.5 } },
  },
  double: {
    ext: { src: doubleExt, aspect: 1408 / 768, door: { bottom: 10.2, height: 59.2, centerX: 50.0 } },
    int: { src: doubleInt, aspect: 768 / 1376, door: { bottom: 14.2, height: 61.0, centerX: 49.5 } },
  },
};

const familyOf = (type: string): "single" | "side" | "double" =>
  type.includes("double") ? "double" : type.includes("side-panel") ? "side" : "single";

const WallScene: React.FC<WallSceneProps> = ({ doorImage, doorType, interior, isUpdating }) => {
  const fam = WALLS[familyOf(doorType || "")];
  const w = interior ? fam.int : fam.ext;
  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/5"
      style={{ aspectRatio: String(w.aspect), height: "min(84vh, 44rem)", maxWidth: "92vw" }}
    >
      <img src={w.src} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {doorImage && (
        <img
          src={doorImage}
          alt="Configured door"
          draggable={false}
          className={`door-image absolute transition-[filter,opacity] duration-200 ${
            isUpdating ? "blur-[2px] opacity-85" : ""
          }`}
          style={{
            height: `${w.door.height}%`,
            width: "auto",
            bottom: `${w.door.bottom}%`,
            left: `${w.door.centerX}%`,
            transform: "translateX(-50%)",
          }}
        />
      )}
    </div>
  );
};

export default WallScene;

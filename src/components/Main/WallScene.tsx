import React from "react";
import doubleExt from "../../assets/walls/double-ext.webp";
import doubleInt from "../../assets/walls/double-int.webp";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

// A wall per door FAMILY. The wall image fills a fixed-aspect "scene" box; that box is scaled to
// COVER the whole preview (overflow cropped at the edges), so the wall is full-bleed AND the door,
// positioned in scene-% coordinates, stays locked to the opening at any viewport size.
// door = where the door sits in the opening (% of the scene): height + centerX + threshold(bottom).
type WallCfg = { src: string; aspect: number; door: { bottom: number; height: number; centerX: number } };
const WALLS: Record<"single" | "side" | "double", { ext: WallCfg; int: WallCfg }> = {
  // TODO: dedicated LANDSCAPE single-door walls (narrow opening). Until then the single family
  // uses the wide landscape wall so it stays full-bleed (single doors show a wider reveal).
  single: {
    ext: { src: doubleExt, aspect: 1408 / 768, door: { bottom: 10.2, height: 59.2, centerX: 50.0 } },
    int: { src: doubleInt, aspect: 768 / 1376, door: { bottom: 14.2, height: 61.0, centerX: 49.5 } },
  },
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
    <div className="absolute inset-0 overflow-hidden">
      {/* fixed-aspect scene box scaled to cover the whole area */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(w.aspect), minWidth: "100%", minHeight: "100%" }}
      >
        <img src={w.src} alt="" aria-hidden className="absolute inset-0 h-full w-full" draggable={false} />
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
    </div>
  );
};

export default WallScene;

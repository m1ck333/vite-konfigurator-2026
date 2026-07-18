import React from "react";
import wallRecess from "../../assets/walls/wall-facade-2026.webp"; // door-shaped recess (narrow configs)
import wallWide from "../../assets/walls/wall-facade-wide.webp"; // wide entrance (wide configs)
import wallFacadeInt from "../../assets/walls/wall-facade-int.webp";
import Loading from "../ui/Loading";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
  isInitialLoad?: boolean;
}

/**
 * The configured door in a real house facade (exterior) or on the interior wall.
 *
 * Exterior uses TWO scenes so every config looks right (a wide double-door can't fit a single-door
 * recess): narrow configs (single leaf ± transom) drop into a door-shaped RECESS and fill it; wide
 * configs (side panels / double leaf) use a WIDE entrance and are fitted (contain) into it. All the
 * placement numbers below are single-value tunes.
 */
const isWideType = (t: string | null) => !!t && (t.includes("side-panel") || t.includes("double-leaf"));

// door-shaped recess: door sized by height to fill it, stands on the step, centred on the opening
const RECESS = { cx: 49.8, bottom: 21.5, height: 60 };
// wide entrance: door fitted (contain, bottom) into this box
const WIDE = { cx: 48, bottom: 16, width: 34, height: 54 };
// interior wall
const INTR = { cx: 50, bottom: 8.4, height: 68 };

const ASPECT = 1376 / 768;

const WallScene: React.FC<WallSceneProps> = ({ doorImage, doorType, interior, isUpdating, isInitialLoad }) => {
  const wide = !interior && isWideType(doorType);
  const src = interior ? wallFacadeInt : wide ? wallWide : wallRecess;
  const bg = interior ? "#d8d4ce" : "#ded7c9";
  const loading = !!isUpdating || !!isInitialLoad;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bg }}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(ASPECT), minWidth: "100%", minHeight: "100%" }}
      >
        <img src={src} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />

        {doorImage && wide && (
          // wide configs: fit (contain, bottom) into the wide entrance box
          <div
            className="absolute -translate-x-1/2"
            style={{ left: `${WIDE.cx}%`, bottom: `${WIDE.bottom}%`, width: `${WIDE.width}%`, height: `${WIDE.height}%` }}
          >
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className="door-image h-full w-full"
              style={{ objectFit: "contain", objectPosition: "center bottom", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.28))" }}
            />
          </div>
        )}

        {doorImage && !wide && (
          // narrow configs (or interior): sized by height, centred, standing on the step
          <div
            className="absolute -translate-x-1/2"
            style={{
              left: `${(interior ? INTR : RECESS).cx}%`,
              bottom: `${(interior ? INTR : RECESS).bottom}%`,
              height: `${(interior ? INTR : RECESS).height}%`,
            }}
          >
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className="door-image block h-full w-auto"
              style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.28))" }}
            />
            {!interior && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0"
                style={{ height: "6%", background: "linear-gradient(to bottom, rgba(0,0,0,0.26), rgba(0,0,0,0))" }}
              />
            )}
          </div>
        )}

        {loading && (
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
            <span role="status" aria-label="Loading" className="inline-flex items-center justify-center rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm">
              <Loading size="md" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WallScene;

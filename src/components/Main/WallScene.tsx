import React from "react";
import wallFacade from "../../assets/walls/wall-facade-2026.webp";
import wallFacadeInt from "../../assets/walls/wall-facade-int.webp";
import revealFrame from "../../assets/walls/reveal-frame.webp";
import Loading from "../ui/Loading";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
  isInitialLoad?: boolean;
}

/**
 * The configured door recessed into a solid travertine facade (exterior) or on the interior wall.
 *
 * The recess "dent" is a real travertine reveal frame applied as a CSS border-image (nine-slice) on
 * the door: the mitered corners stay fixed and only the edges stretch, so the recess hugs the door
 * cleanly at ANY width (single leaf → double + side panels + transom) with no broken corners. Reveal
 * on top + sides only; the door stands on the step. Tune with DOOR (single numbers).
 */
const ASPECT = 1376 / 768;
const DOOR = { cx: 50, bottom: 13, height: 62 };
const INT_DOOR = { cx: 50, bottom: 8.4, height: 68 };
const DEP = 20; // reveal depth (px)

const WallScene: React.FC<WallSceneProps> = ({ doorImage, interior, isUpdating, isInitialLoad }) => {
  const src = interior ? wallFacadeInt : wallFacade;
  const bg = interior ? "#d8d4ce" : "#ded7c9";
  const d = interior ? INT_DOOR : DOOR;
  const loading = !!isUpdating || !!isInitialLoad;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bg }}>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(ASPECT), minWidth: "100%", minHeight: "100%" }}
      >
        <img src={src} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />

        {doorImage && (
          <div
            className="absolute -translate-x-1/2"
            style={{
              left: `${d.cx}%`,
              bottom: `${d.bottom}%`,
              height: `${d.height}%`,
              boxSizing: "content-box",
              borderStyle: "solid",
              borderColor: "transparent",
              borderWidth: interior ? "0" : `${DEP}px ${DEP}px 0 ${DEP}px`,
              borderImageSource: interior ? "none" : `url(${revealFrame})`,
              borderImageSlice: "44 64",
              borderImageWidth: `${DEP}px ${DEP}px 0 ${DEP}px`,
              borderImageRepeat: "stretch",
              filter: "drop-shadow(0 5px 10px rgba(0,0,0,0.30))",
            }}
          >
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className="door-image block h-full w-auto"
            />
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

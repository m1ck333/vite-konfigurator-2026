import React from "react";
import wallFacade from "../../assets/walls/wall-facade.webp";
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
 * The configured door standing on a real house facade — exterior or interior.
 *
 * Each source wall was light-normalised (uniform tone, texture kept) and its opening PAINTED OVER
 * with the same uniform wall tone — which blends invisibly because the wall is uniform. That yields
 * a clean flat facade keeping the real lamps / plants / cornice / floor (exterior) or lamps /
 * console / wood floor (interior). The door then simply stands centered on the floor, so it looks
 * right at ANY width with zero decomposition, zero seams, zero per-family walls.
 *
 *  - exterior: landscape facade, scaled to COVER the preview.
 *  - interior: portrait hallway, fit to HEIGHT and centered; the wall-colour background fills the
 *    sides (blends into the uniform wall).
 *
 * While a door (re)loads we keep the current door sharp and show a small spinner over it — no blur.
 */
type Cfg = {
  src: string;
  aspect: number;
  cover: boolean; // true → cover (exterior); false → fit-height + centered (interior)
  bg: string;
  door: { bottom: number; height: number }; // % of the scene
};
const EXT: Cfg = { src: wallFacade, aspect: 1408 / 768, cover: true, bg: "#ebebeb", door: { bottom: 10.4, height: 67.7 } };
const INT: Cfg = { src: wallFacadeInt, aspect: 768 / 1376, cover: false, bg: "#e6e6e6", door: { bottom: 15, height: 48 } };

const WallScene: React.FC<WallSceneProps> = ({ doorImage, interior, isUpdating, isInitialLoad }) => {
  const cfg = interior ? INT : EXT;
  const loading = !!isUpdating || !!isInitialLoad;
  const sceneSize: React.CSSProperties = cfg.cover
    ? { minWidth: "100%", minHeight: "100%" }
    : { height: "100%" };

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: cfg.bg }}>
      {/* fixed-aspect facade, centered; cover (exterior) or fit-height (interior) */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(cfg.aspect), ...sceneSize }}
      >
        <img src={cfg.src} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />

        {doorImage && (
          <>
            {/* soft ground contact shadow */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: `${cfg.door.bottom - 1.2}%`,
                width: "19%",
                height: "2%",
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.20), rgba(0,0,0,0) 72%)",
                filter: "blur(4px)",
              }}
            />
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className="door-image absolute left-1/2 -translate-x-1/2"
              style={{ height: `${cfg.door.height}%`, width: "auto", bottom: `${cfg.door.bottom}%` }}
            />
          </>
        )}

        {loading && (
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
            <span
              role="status"
              aria-label="Loading"
              className="inline-flex items-center justify-center rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm"
            >
              <Loading size="md" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WallScene;

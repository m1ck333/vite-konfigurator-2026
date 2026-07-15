import React from "react";
import wallFacade from "../../assets/walls/wall-facade.webp";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

/**
 * The configured door standing on a real house facade.
 *
 * The source "22" wall was light-normalised (uniform tone, texture kept) and its wide portico
 * recess PAINTED OVER with the same uniform wall tone — which blends invisibly precisely because
 * the wall is uniform. That turns it into a clean flat facade that keeps the real lamps, plants,
 * cornice and paving. The door then simply stands centered on the paving, so it looks right at ANY
 * width (single / side / double) with zero decomposition, zero seams, zero per-family walls.
 *
 * The facade fills a fixed-aspect scene scaled to COVER the preview; the door is placed in scene-%.
 */
const SCENE_ASPECT = 1408 / 768;
const DOOR_H_PCT = 67.7; // door display height (constant)
const DOOR_BOTTOM_PCT = (768 - 688) / 768 * 100; // stands on the paving line → 10.4%

const WallScene: React.FC<WallSceneProps> = ({ doorImage, isUpdating }) => {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "#ebebeb" }}>
      {/* fixed-aspect facade scaled to cover the whole preview */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(SCENE_ASPECT), minWidth: "100%", minHeight: "100%" }}
      >
        <img src={wallFacade} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />

        {doorImage && (
          <>
            {/* soft ground contact shadow */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: `${DOOR_BOTTOM_PCT - 1.2}%`,
                width: "19%",
                height: "2.4%",
                background: "radial-gradient(ellipse at center, rgba(0,0,0,0.22), rgba(0,0,0,0) 72%)",
                filter: "blur(4px)",
              }}
            />
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className={`door-image absolute left-1/2 -translate-x-1/2 transition-[filter,opacity] duration-200 ${
                isUpdating ? "blur-[2px] opacity-85" : ""
              }`}
              style={{ height: `${DOOR_H_PCT}%`, width: "auto", bottom: `${DOOR_BOTTOM_PCT}%` }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WallScene;

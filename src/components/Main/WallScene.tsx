import React, { useState } from "react";
import wallLeft from "../../assets/walls/wall22-left.webp";
import wallRight from "../../assets/walls/wall22-right.webp";
import wallFloor from "../../assets/walls/wall22-floor.webp";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

/**
 * ONE wall fits ANY door width — the "slide engine".
 *
 * The wall photo is decomposed into three pieces (cut from the source at the opening jambs):
 *   center  = the opening interior (recess + header + threshold)  → sits BEHIND the door
 *   left    = left wall + lamp + plant + left jamb/reveal
 *   right   = right wall + lamp + plant + right jamb/reveal
 *
 * The door is rendered by the backend at a CONSTANT display height; its width comes from the
 * image's own aspect ratio (onLoad). The two side panels then SLIDE so their inner edge (the
 * reveal) is pinned to the door's edges — widen the door and the panels (lamps/plants) move
 * apart, narrow it and they close in. The reveal therefore hugs every door: single, side-panel
 * or double, from a single wall. The scene fills the preview (wall colour behind blends the
 * seams) and the floor is a full-width strip so the bottom never mismatches.
 *
 * Coordinates below are in the source wall's pixel space (1408×768) expressed as % of the scene.
 */
const SCENE_W = 1408;
const SCENE_H = 768;
const ASPECT = SCENE_W / SCENE_H;

// opening / door geometry (source px → %). The door fills the WHOLE opening front-face
// (top y155 → threshold y680) so no recess ceiling/floor peeks above or below it.
const DOOR_H_PCT = (680 - 155) / SCENE_H * 100; // 68.36%
const DOOR_BOTTOM_PCT = (SCENE_H - 680) / SCENE_H * 100; // threshold → 11.46%
const LEFT_W_PCT = 340 / SCENE_W * 100; // 24.15%
const RIGHT_W_PCT = 333 / SCENE_W * 100; // 23.65%
const FLOOR_TOP_PCT = 660 / SCENE_H * 100; // real paving strip starts here → 85.94%
const WALL_WHITE = "#E7E7E5"; // matches the lit plaster near the opening (stopgap for the 22 wall)

// NOTE: `interior`/`doorType` are accepted (door face flips via the render) but the slide engine
// currently uses one decomposed wall for every family; dedicated interior pieces slot in later.
const WallScene: React.FC<WallSceneProps> = ({ doorImage, isUpdating }) => {
  // door aspect (width / height) from the rendered image; drives the slide.
  const [aspect, setAspect] = useState(227 / 455); // sensible default (single door)

  // door width as % of scene width = aspect × (door height in scene px) / scene width.
  // DOOR_H_PCT is already a %, and SCENE_H/SCENE_W converts the height-% into a width-%.
  const doorWpct = aspect * DOOR_H_PCT * SCENE_H / SCENE_W;
  const doorLeft = 50 - doorWpct / 2;
  const doorRight = 50 + doorWpct / 2;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: WALL_WHITE }}>
      {/* fixed-aspect scene, scaled to COVER the whole preview */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ aspectRatio: String(ASPECT), minWidth: "100%", minHeight: "100%", backgroundColor: WALL_WHITE }}
      >
        {/* full-width real paving (the ground plane) so the bottom edges never mismatch */}
        <img
          src={wallFloor}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-x-0 bottom-0 w-full"
          style={{ top: `${FLOOR_TOP_PCT}%` }}
        />

        {/* the configured door — fills the whole opening; its own frame is the opening edge */}
        {doorImage && (
          <img
            src={doorImage}
            alt="Configured door"
            draggable={false}
            onLoad={(e) => {
              const el = e.currentTarget;
              if (el.naturalWidth && el.naturalHeight) setAspect(el.naturalWidth / el.naturalHeight);
            }}
            className={`door-image absolute transition-[filter,opacity] duration-200 ${
              isUpdating ? "blur-[2px] opacity-85" : ""
            }`}
            style={{
              height: `${DOOR_H_PCT}%`,
              width: "auto",
              bottom: `${DOOR_BOTTOM_PCT}%`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        )}

        {/* left panel: slides so its reveal (right edge) hugs the door's left edge */}
        <img
          src={wallLeft}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute top-0 h-full"
          style={{ left: `${doorLeft - LEFT_W_PCT}%`, width: `${LEFT_W_PCT}%` }}
        />
        {/* right panel: reveal (left edge) hugs the door's right edge */}
        <img
          src={wallRight}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute top-0 h-full"
          style={{ left: `${doorRight}%`, width: `${RIGHT_W_PCT}%` }}
        />
      </div>
    </div>
  );
};

export default WallScene;

import React, { useState } from "react";
import wallLeft from "../../assets/walls/wall22-left.webp";
import wallRight from "../../assets/walls/wall22-right.webp";
import wallFloor from "../../assets/walls/wall22-floor.webp";
import wallCornice from "../../assets/walls/wall22-cornice.webp";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

/**
 * ONE wall fits ANY door width — the "slide engine".
 *
 * The source wall photo is light-normalised (its uneven lamp lighting divided out so the plaster
 * is one uniform tone WITH its texture kept) and cut into four layers:
 *   cornice = the top moulding — a FIXED full-width band (so it never splits above the door)
 *   floor   = the paving — a FIXED full-width band (the ground plane)
 *   left    = left wall + lamp + plant + left jamb/reveal   ┐ these two SLIDE
 *   right   = right wall + lamp + plant + right jamb/reveal  ┘
 *
 * The door renders at a CONSTANT display height; its width comes from the image's own aspect
 * (onLoad). The side panels then slide so their inner edge (the reveal) pins to the door's edges —
 * widen the door and the panels (lamps/plants) move apart, narrow it and they close in. The reveal
 * hugs every door (single/side/double) from a single wall. The uniform wall tone means the flat
 * fill behind the panels is seamless. The door fills the whole opening front-face (top→threshold),
 * so no recess peeks above/below it (the mottled recess interior is fully covered).
 *
 * Coordinates are in the source wall's pixel space (1408×768) expressed as % of the scene.
 */
const SCENE_W = 1408;
const SCENE_H = 768;
const ASPECT = SCENE_W / SCENE_H;

const DOOR_H_PCT = (680 - 155) / SCENE_H * 100; // door fills opening front-face → 68.36%
const DOOR_BOTTOM_PCT = (SCENE_H - 680) / SCENE_H * 100; // threshold → 11.46%
const LEFT_W_PCT = 340 / SCENE_W * 100; // 24.15%
const RIGHT_W_PCT = 333 / SCENE_W * 100; // 23.65%
const CORNICE_PCT = 96 / SCENE_H * 100; // fixed top band → 12.5%
const PANEL_TOP_PCT = CORNICE_PCT; // panels start just below the cornice
const PANEL_H_PCT = 100 - CORNICE_PCT; // 87.5%
const FLOOR_TOP_PCT = 684 / SCENE_H * 100; // fixed paving starts at the wall-floor junction → 89.06%
const WALL_WHITE = "#EBEBEB"; // the normalised wall tone → seamless behind the panels

// NOTE: `interior`/`doorType` are accepted (door face flips via the render) but the slide engine
// currently uses one normalised wall for every family; dedicated interior layers slot in later.
const WallScene: React.FC<WallSceneProps> = ({ doorImage, isUpdating }) => {
  // door aspect (width / height) from the rendered image; drives the slide.
  const [aspect, setAspect] = useState(227 / 455); // sensible default (single door)

  // door width as % of scene width = aspect × (door height in scene px) / scene width.
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
        {/* fixed full-width floor (ground plane) */}
        <img
          src={wallFloor}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-x-0 bottom-0 w-full"
          style={{ top: `${FLOOR_TOP_PCT}%` }}
        />

        {/* left panel: slides so its reveal (right edge) hugs the door's left edge */}
        <img
          src={wallLeft}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute"
          style={{ top: `${PANEL_TOP_PCT}%`, height: `${PANEL_H_PCT}%`, left: `${doorLeft - LEFT_W_PCT}%`, width: `${LEFT_W_PCT}%` }}
        />
        {/* right panel: reveal (left edge) hugs the door's right edge */}
        <img
          src={wallRight}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute"
          style={{ top: `${PANEL_TOP_PCT}%`, height: `${PANEL_H_PCT}%`, left: `${doorRight}%`, width: `${RIGHT_W_PCT}%` }}
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

        {/* fixed full-width cornice on top — one continuous band, never splits */}
        <img
          src={wallCornice}
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: `${CORNICE_PCT}%` }}
        />
      </div>
    </div>
  );
};

export default WallScene;

import React from "react";
import exteriorWall from "../../assets/walls/exterior.webp";
import interiorWall from "../../assets/walls/interior.webp";

interface WallSceneProps {
  doorImage: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

// Per-wall config. The door is sized by HEIGHT (fills the opening's height) with its NATURAL
// width, centered on centerX and resting on the threshold (bottom). So a thin door is tall+narrow,
// a double is tall+wide — the dark opening behind absorbs the rest. All values are % of the wall.
const WALLS = {
  // wide landscape entrance with a big dark opening (fits double + side panels + transom)
  exterior: { src: exteriorWall, aspect: 1408 / 768, door: { bottom: 10.2, height: 59.2, centerX: 50 } },
  // portrait interior placeholder (pending a matching wide landscape interior)
  interior: { src: interiorWall, aspect: 768 / 1376, door: { bottom: 14.2, height: 61.0, centerX: 49.5 } },
};

const WallScene: React.FC<WallSceneProps> = ({ doorImage, interior, isUpdating }) => {
  const w = interior ? WALLS.interior : WALLS.exterior;
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

import React from "react";
import exteriorWall from "../../assets/walls/exterior.webp";
import interiorWall from "../../assets/walls/interior.webp";

interface WallSceneProps {
  doorImage: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

// Door-opening rectangle within each wall image, as % of the wall (left, top, width, height).
// The configured door is placed object-contain + bottom-anchored inside this box so it always
// fits and sits on the threshold. Tune these if a wall image is swapped.
const OPENINGS = {
  exterior: { left: 28.4, top: 35.6, width: 42.6, height: 41.5 },
  interior: { left: 27.7, top: 26.0, width: 43.6, height: 59.0 },
};

const WallScene: React.FC<WallSceneProps> = ({ doorImage, interior, isUpdating }) => {
  const wall = interior ? interiorWall : exteriorWall;
  const o = interior ? OPENINGS.interior : OPENINGS.exterior;
  return (
    <div className="relative h-[92vh] max-h-[1000px] aspect-[768/1376] rounded-2xl overflow-hidden shadow-2xl bg-black/5">
      <img src={wall} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      {doorImage && (
        <img
          src={doorImage}
          alt="Configured door"
          draggable={false}
          className={`door-image absolute object-contain object-bottom transition-[filter,opacity] duration-200 ${
            isUpdating ? "blur-[2px] opacity-85" : ""
          }`}
          style={{ left: `${o.left}%`, top: `${o.top}%`, width: `${o.width}%`, height: `${o.height}%` }}
        />
      )}
    </div>
  );
};

export default WallScene;

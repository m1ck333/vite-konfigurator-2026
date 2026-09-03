import React from "react";
import { Rnd } from "react-rnd";
import { NAVBAR_HEIGHT } from "../../constants";

// Small round grips, hidden until you hover the door (revealed via .door-image-container in
// index.css) so they never show in the exported screenshot. NO dashed frame/outline — that box
// was the confusing part (Mile's feedback); resizing itself stays.
const resizeHandleClass =
  "door-resize-handle rounded-full absolute bg-white border border-primary-green shadow-md opacity-0 transition-opacity duration-200";
// Explicit size overrides react-rnd's inline default (edge handles otherwise span the full side).
const HANDLE_SIZE = { width: "11px", height: "11px" };

interface RndDoorImageProps {
  imageUrl: string | null;
}

const RndDoorImage: React.FC<RndDoorImageProps> = ({ imageUrl }) => {
  const defaultPosition = {
    x: (window.innerWidth - 200) / 2,
    y: (window.innerHeight - NAVBAR_HEIGHT - 320) / 2,
  };

  return (
    <Rnd
      default={{
        ...defaultPosition,
        width: 150,
        height: 320,
      }}
      className="door-image-container"
      resizeHandleStyles={{
        // Force each handle to a small dot — react-rnd's default edge handles span the whole
        // side (width/height 100%), which painted a continuous "bold border". Fixed size = 4 corner
        // + 4 mid-edge dots only.
        top: { ...HANDLE_SIZE, top: "-6px", left: "50%", transform: "translateX(-50%)" },
        right: { ...HANDLE_SIZE, right: "-6px", top: "50%", transform: "translateY(-50%)" },
        bottom: { ...HANDLE_SIZE, bottom: "-6px", left: "50%", transform: "translateX(-50%)" },
        left: { ...HANDLE_SIZE, left: "-6px", top: "50%", transform: "translateY(-50%)" },
        topRight: { ...HANDLE_SIZE, right: "-6px", top: "-6px" },
        topLeft: { ...HANDLE_SIZE, left: "-6px", top: "-6px" },
        bottomRight: { ...HANDLE_SIZE, right: "-6px", bottom: "-6px" },
        bottomLeft: { ...HANDLE_SIZE, left: "-6px", bottom: "-6px" },
      }}
      resizeHandleClasses={{
        top: resizeHandleClass,
        right: resizeHandleClass,
        bottom: resizeHandleClass,
        left: resizeHandleClass,
        topRight: resizeHandleClass,
        topLeft: resizeHandleClass,
        bottomRight: resizeHandleClass,
        bottomLeft: resizeHandleClass,
      }}
    >
      <img
        className="w-full h-full pointer-events-none door-image"
        draggable={false}
        src={imageUrl || ""}
        alt="Displayed Door"
        crossOrigin="anonymous"
      />
    </Rnd>
  );
};

export default RndDoorImage;

import React from "react";
import { Rnd } from "react-rnd";
import { NAVBAR_HEIGHT } from "../../constants";

// Handles are hidden by default and revealed on hover (via .door-image-container
// in index.css) so they never appear in the exported screenshot.
const resizeHandleClass =
  "door-resize-handle w-3 h-3 rounded-full absolute bg-white border-2 border-primary-green shadow-md opacity-0 transition-opacity duration-200";

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
        top: {
          top: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
        },
        right: {
          right: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
        },
        bottom: {
          bottom: "-5px",
          left: "50%",
          transform: "translateX(-50%)",
        },
        left: {
          left: "-5px",
          top: "50%",
          transform: "translateY(-50%)",
        },
        topRight: { right: "-5px", top: "-5px" },
        topLeft: { left: "-5px", top: "-5px" },
        bottomRight: { right: "-5px", bottom: "-5px" },
        bottomLeft: { left: "-5px", bottom: "-5px" },
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

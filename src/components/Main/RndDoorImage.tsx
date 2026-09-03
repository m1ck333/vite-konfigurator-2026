import React from "react";
import { Rnd } from "react-rnd";
import { NAVBAR_HEIGHT } from "../../constants";

interface RndDoorImageProps {
  imageUrl: string | null;
}

// The door can be dragged to position it on the house photo, but shows NO frame or resize handles —
// the dashed outline + corner handles read as a broken/selection box to customers (Mile's feedback).
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
      enableResizing={false}
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

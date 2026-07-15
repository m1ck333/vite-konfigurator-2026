import React from "react";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
}

/**
 * Clean neutral studio backdrop for the configured door.
 *
 * Interim presentation: a soft wall→floor gradient with a subtle contact shadow — zero artifacts,
 * works for any door width. The real per-family house walls (single / side / double, each with a
 * door-shaped opening the door fills edge-to-edge) get wired in here as their images arrive.
 */
const WallScene: React.FC<WallSceneProps> = ({ doorImage, isUpdating }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* soft studio wall → floor */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #f7f8f9 0%, #f2f3f5 52%, #ebedf0 76%, #e4e6e9 100%)",
        }}
      />
      {/* faint floor line */}
      <div className="absolute inset-x-0" style={{ top: "82%", height: "1px", background: "rgba(0,0,0,0.05)" }} />

      {doorImage && (
        <>
          {/* soft ground contact shadow */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "16.5%",
              width: "min(34vh, 40%)",
              height: "18px",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.20), rgba(0,0,0,0) 72%)",
              filter: "blur(5px)",
            }}
          />
          <img
            src={doorImage}
            alt="Configured door"
            draggable={false}
            className={`door-image absolute left-1/2 -translate-x-1/2 transition-[filter,opacity] duration-200 ${
              isUpdating ? "blur-[2px] opacity-85" : ""
            }`}
            style={{ bottom: "17%", height: "72vh", width: "auto", display: "block" }}
          />
        </>
      )}
    </div>
  );
};

export default WallScene;

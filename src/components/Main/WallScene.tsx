import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import wallFlat from "../../assets/walls/wall-flat-2026.webp";
import wallFacadeInt from "../../assets/walls/wall-facade-int.webp";
import decoTree from "../../assets/walls/deco-tree.webp";
import decoWindow from "../../assets/walls/deco-window.webp";
import decoLamp from "../../assets/walls/deco-lamp.webp";
import decoMat from "../../assets/walls/deco-mat.webp";
import decoPlant from "../../assets/walls/deco-plant.webp";
import decoArt from "../../assets/walls/deco-art.webp";
import Loading from "../ui/Loading";

interface WallSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
  isInitialLoad?: boolean;
}

/**
 * The configured door recessed into a FLAT travertine wall (exterior) or on the interior wall.
 *
 * Modular composite: the base is a plain flat wall (dark roof band on top, concrete path at the bottom,
 * nothing else). The door renders at a CONSTANT height that fills the wall between roof and path — the
 * top+bottom dent are counted into that span — while its width follows the config. A 4-sided travertine
 * "dent" (CSS border-image reveal) frames the door on all sides. Because the wall is flat, the door can
 * be any width without ever cutting anything; the decorations (potted olive trees + windows) are
 * SEPARATE layers anchored just outside the door's live edges, so they slide outward as the door widens.
 *
 * Tune with the DOOR / TREE / GAP / DEP constants (single numbers, scene %).
 */
const ASPECT = 1376 / 768;
// Door fills the wall: roof bottom ≈ 29%, path top ≈ 87% (scene y). `height` is the constant door
// height; with the ±DEP dent it spans that wall band. Width follows the door image aspect (w-auto).
const DOOR = { cx: 50, bottom: 17.3, height: 51 };
const INT_DOOR = { cx: 50, bottom: 17.8, height: 64 };
const TREE = { height: 42, bottom: 9 }; // % of scene; pot stands on the walkway beside the door
const WINDOW = { height: 51, bottom: 17.3, aspect: 246 / 685 }; // slim curtained sidelight, aligned to the door
const LAMP = { height: 8, bottom: 48, aspect: 151 / 450 }; // up/down wall sconce between door and window
const GAP = 6; // px gap between the door dent and a flanking decoration
const LAMP_OFF = 46; // px from the door edge to the lamp centre
const MAT = { top: 83.0, widthFactor: 0.5, height: 6, rotate: 74 }; // doormat laid flat at the threshold; height is CONSTANT (scene %), only width tracks the door
const PLANT = { height: 40, bottom: 8, aspect: 311 / 699 }; // interior fiddle-leaf figs flanking the door
const RUG = { top: 82.5, widthFactor: 0.62, height: 12, rotate: 72 }; // interior runner rug in front of the door
const ART = { top: 22, height: 26, aspect: 473 / 677 }; // interior framed art on the wall above each plant
const PLANT_GAP = 34; // px from the door edge to the plant
const DEP = 19; // recess "hall" reveal depth on every side (px)

// Door image aspect (w/h) computed EXACTLY as the BE composes it (doorbuilder RATIO/FRAME_WIDTH), so the
// door width + the whole decoration layout are known from the config alone — no waiting on the image to
// load, no measuring the DOM. This lets us FREEZE the layout while a new door loads (no jumpy reflow).
const RATIO = 3.5;
const FW = 22;
const sc = (v: number) => Math.trunc(v / RATIO);
interface AspectInput {
  type: string | null;
  width: number; halfPanelWidth: number; height: number;
  leftSideWidth: number; rightSideWidth: number; upperGlassHeight: number;
  leftNum: number; rightNum: number;
}
const doorAspect = (p: AspectInput): number => {
  const t = p.type ?? "single-leaf-door";
  const isDouble = t.startsWith("double-leaf-door");
  const both = t.includes("both-side-panels");
  const left = !both && t.includes("left-side-panel");
  const right = !both && t.includes("right-side-panel");
  const transom = t.includes("transom");
  const H = sc(p.height);
  let W = isDouble ? sc(p.width) + sc(p.halfPanelWidth) + FW : sc(p.width);
  W += (both || left ? sc(p.leftSideWidth) * (p.leftNum || 1) : 0)
     + (both || right ? sc(p.rightSideWidth) * (p.rightNum || 1) : 0);
  const totalH = H + (transom ? sc(p.upperGlassHeight) + FW : 0);
  return totalH > 0 ? W / totalH : 0.5;
};

// The recess "little hall": four trapezoid reveal faces funnelling inward from the wall opening (outer,
// = door + DEP) to the door (inner), corners mitered 45°. Directional lighting for depth: dark soffit
// on top, lit sill at the bottom, shaded jambs on the sides. Rendered just OUTSIDE the door box.
const D = `${DEP}px`;
const makeReveals = (wall: string, top: string, bot: string, lft: string, rgt: string): { k: string; s: React.CSSProperties }[] => [
  { k: "top", s: { position: "absolute", top: `-${DEP}px`, left: `-${DEP}px`, right: `-${DEP}px`, height: D,
      clipPath: `polygon(0 0, 100% 0, calc(100% - ${DEP}px) 100%, ${DEP}px 100%)`, background: `linear-gradient(to bottom, ${wall}, ${top})` } },
  { k: "bottom", s: { position: "absolute", bottom: `-${DEP}px`, left: `-${DEP}px`, right: `-${DEP}px`, height: D,
      clipPath: `polygon(${DEP}px 0, calc(100% - ${DEP}px) 0, 100% 100%, 0 100%)`, background: `linear-gradient(to top, ${wall}, ${bot})` } },
  { k: "left", s: { position: "absolute", left: `-${DEP}px`, top: `-${DEP}px`, bottom: `-${DEP}px`, width: D,
      clipPath: `polygon(0 0, 100% ${DEP}px, 100% calc(100% - ${DEP}px), 0 100%)`, background: `linear-gradient(to right, ${wall}, ${lft})` } },
  { k: "right", s: { position: "absolute", right: `-${DEP}px`, top: `-${DEP}px`, bottom: `-${DEP}px`, width: D,
      clipPath: `polygon(100% 0, 100% 100%, 0 calc(100% - ${DEP}px), 0 ${DEP}px)`, background: `linear-gradient(to left, ${wall}, ${rgt})` } },
];
const REVEALS = makeReveals("#bea68d", "#2e2820", "#e2d6bc", "#5f5443", "#a2926f"); // exterior travertine
// (interior is FLUSH — a door seen from inside sits against the wall, not recessed into it.)

const WallScene: React.FC<WallSceneProps> = ({ doorImage, doorType, interior, isUpdating, isInitialLoad }) => {
  const loading = !!isUpdating || !!isInitialLoad;

  const cfg = useSelector((s: RootState) => s.configuration);
  const targetAspect = doorAspect({
    type: doorType,
    width: cfg.width, halfPanelWidth: cfg.halfPanelWidth, height: cfg.height,
    leftSideWidth: cfg.leftSideWidth, rightSideWidth: cfg.rightSideWidth, upperGlassHeight: cfg.upperGlassHeight,
    leftNum: cfg["left-side-glass-number"], rightNum: cfg["right-side-glass-number"],
  });
  // Freeze the door width, the exterior/interior VIEW (wallpaper), and the decoration layout while a new
  // door is loading: all of it is committed only when the new door IMAGE actually swaps in (keyed on
  // doorImage). So toggling Spolja/Unutra keeps the old wallpaper+door until the new door is ready, then
  // the wallpaper, door and decorations switch together in one frame — no instant-wallpaper flash.
  const [committedAspect, setCommittedAspect] = useState(targetAspect);
  const [committedInterior, setCommittedInterior] = useState(interior);
  useLayoutEffect(() => {
    setCommittedAspect(targetAspect);
    setCommittedInterior(interior);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doorImage]);

  const iv = committedInterior; // the view that matches the currently-displayed door
  const src = iv ? wallFacadeInt : wallFlat;
  const bg = iv ? "#d8d4ce" : "#cdbfa4";
  const d = iv ? INT_DOOR : DOOR;

  // Measure the preview box (parent). Stable — only changes on window/panel resize, never on door load.
  const sceneRef = useRef<HTMLDivElement>(null);
  // w/h = preview pane; vw = actual window width (a phone vs a desktop with a wide sidebar both give a
  // narrow PANE, but only a phone has a narrow WINDOW — that's what decides phone-framing vs contain).
  const [box, setBox] = useState({ w: 0, h: 0, vw: 0 });
  useLayoutEffect(() => {
    const p = sceneRef.current?.parentElement;
    if (!p) return;
    const m = () => setBox({ w: p.clientWidth, h: p.clientHeight, vw: window.innerWidth });
    m();
    const ro = new ResizeObserver(m);
    ro.observe(p);
    window.addEventListener("resize", m);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", m);
    };
  }, []);

  // Door width (scene %) derived from the committed aspect — matches the door image exactly.
  const doorWidthPct = (d.height * committedAspect) / ASPECT;

  // Scene size (px). A WIDE preview COVERS it (immersive). But when the preview is portrait-ish (a phone,
  // or a narrow/tall desktop pane with the sidebar open) COVER would crop the sides and zoom the door in
  // hugely — so instead we FRAME the door: scale the scene so the door fits with margin, centred. Phones
  // fill more (whole door big); larger portrait panes leave more context (windows/plants visible).
  const mobile = box.vw > 0 && box.vw < 768; // actual phone-sized WINDOW
  const narrowDesktop = box.vw >= 768 && box.w > 0 && box.w / box.h < 1.0; // desktop, but PORTRAIT pane
  const doorCenterPct = 100 - d.bottom - d.height / 2; // door centre, scene % from top
  let sceneW = 0;
  let sceneTransform = "translate(-50%, -50%)";
  if (box.w > 0) {
    if (mobile) {
      // phone: FRAME the door big — the whole door fills the screen (not the whole room)
      const byW = (0.94 * box.w) / (doorWidthPct / 100);
      const byH = (0.9 * box.h * ASPECT) / (d.height / 100);
      sceneW = Math.min(byW, byH);
      const offsetY = (doorCenterPct / 100 - 0.5) * (sceneW / ASPECT);
      sceneTransform = `translate(-50%, calc(-50% - ${offsetY}px))`;
    } else if (narrowDesktop) {
      // narrow/tall desktop pane (sidebar open): FRAME the door at a comfortable size (~62% of the pane
      // height) and centre it — big enough to read, windows still in view, only excess sky/path cropped.
      // Not COVER (would crop the windows) and not CONTAIN (would shrink the door with big letterbox).
      const byW = (0.86 * box.w) / (doorWidthPct / 100);
      const byH = (0.62 * box.h * ASPECT) / (d.height / 100);
      sceneW = Math.min(byW, byH);
      const offsetY = (doorCenterPct / 100 - 0.5) * (sceneW / ASPECT);
      sceneTransform = `translate(-50%, calc(-50% - ${offsetY}px))`;
    } else {
      sceneW = Math.max(box.w, box.h * ASPECT); // wide/fullscreen: COVER (immersive)
    }
  }
  const haveDoor = !!doorImage && sceneW > 0;
  const showDeco = !iv && haveDoor; // exterior decorations (windows, lamps, trees, mat)
  const showIntDeco = iv && haveDoor; // interior decorations (plants, runner, art)
  const doorWidthPx = (doorWidthPct / 100) * sceneW;
  const edges = haveDoor
    ? { left: sceneW / 2 - doorWidthPx / 2, right: sceneW / 2 + doorWidthPx / 2, w: sceneW }
    : null;

  // heights → px widths (all layers are height-based) so we can chain them outward from the door:
  // door | lamp | window | tree
  const sceneHpx = sceneW / ASPECT;
  const winWpx = (WINDOW.height / 100) * sceneHpx * WINDOW.aspect;
  const lampWpx = (LAMP.height / 100) * sceneHpx * LAMP.aspect;
  const winInner = LAMP_OFF + lampWpx / 2 + 16; // door edge → window inner edge (past the lamp)
  const treeInner = winInner + winWpx + GAP; // door edge → tree inner edge (past the window)
  const matWpx = edges ? (edges.right - edges.left) * MAT.widthFactor : 0;
  const matHpx = (MAT.height / 100) * sceneHpx; // constant mat height regardless of door width
  const rugWpx = edges ? (edges.right - edges.left) * RUG.widthFactor : 0;
  const rugHpx = (RUG.height / 100) * sceneHpx;
  const plantWpx = (PLANT.height / 100) * sceneHpx * PLANT.aspect;
  const artWpx = (ART.height / 100) * sceneHpx * ART.aspect;
  // plant centre (px from scene left) on each side, so the framed art can hang centred above it
  const plantCenterL = edges ? edges.left - PLANT_GAP - plantWpx / 2 : 0;
  const plantCenterR = edges ? edges.right + PLANT_GAP + plantWpx / 2 : 0;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: bg }}>
      {/* desktop covers the preview; mobile frames the door (see sceneW/sceneTransform above) */}
      <div
        ref={sceneRef}
        className="absolute left-1/2 top-1/2"
        style={{ width: `${sceneW}px`, height: `${sceneW / ASPECT}px`, transform: sceneTransform }}
      >
        <img src={src} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />

        {showDeco && edges && (
          <>
            {/* windows on the wall, past the lamps, sliding out with the door's width */}
            <img
              src={decoWindow}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${WINDOW.bottom}%`,
                height: `${WINDOW.height}%`,
                right: `${Math.max(0, edges.w - (edges.left - winInner))}px`,
              }}
            />
            <img
              src={decoWindow}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${WINDOW.bottom}%`,
                height: `${WINDOW.height}%`,
                left: `${Math.min(edges.w, edges.right + winInner)}px`,
              }}
            />
            {/* wall sconces between the door and each window (centred at LAMP_OFF from the door edge) */}
            <img
              src={decoLamp}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${LAMP.bottom}%`,
                height: `${LAMP.height}%`,
                right: `${edges.w - (edges.left - LAMP_OFF + lampWpx / 2)}px`,
              }}
            />
            <img
              src={decoLamp}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${LAMP.bottom}%`,
                height: `${LAMP.height}%`,
                left: `${edges.right + LAMP_OFF - lampWpx / 2}px`,
              }}
            />
          </>
        )}

        {doorImage && (
          <div
            className="absolute -translate-x-1/2"
            style={{
              left: `${d.cx}%`,
              bottom: `${d.bottom}%`,
              height: `${d.height}%`,
              width: `${doorWidthPct}%`,
              filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.26))",
            }}
          >
            {!iv && REVEALS.map((r) => <span key={r.k} aria-hidden style={r.s} />)}
            <img
              src={doorImage}
              alt="Configured door"
              draggable={false}
              className="door-image relative block h-full w-full"
            />
          </div>
        )}

        {showDeco && edges && (
          <div
            className="pointer-events-none absolute left-1/2"
            style={{ top: `${MAT.top}%`, width: `${matWpx}px`, transform: "translateX(-50%)", perspective: "700px" }}
          >
            <img
              src={decoMat}
              alt=""
              aria-hidden
              draggable={false}
              className="block w-full"
              style={{ height: `${matHpx}px`, transform: `rotateX(${MAT.rotate}deg)`, transformOrigin: "center top", filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.4))" }}
            />
          </div>
        )}

        {showDeco && edges && (
          <>
            {/* left tree — on the walkway, just BEYOND the flanking window; slides out with the door */}
            <img
              src={decoTree}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${TREE.bottom}%`,
                height: `${TREE.height}%`,
                right: `${Math.max(0, edges.w - (edges.left - treeInner))}px`,
                filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.28))",
              }}
            />
            {/* right tree — mirrored */}
            <img
              src={decoTree}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${TREE.bottom}%`,
                height: `${TREE.height}%`,
                left: `${Math.min(edges.w, edges.right + treeInner)}px`,
                transform: "scaleX(-1)",
                filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.28))",
              }}
            />
          </>
        )}

        {showIntDeco && edges && (
          <>
            {/* framed art on the wall, centred above each flanking plant */}
            <img
              src={decoArt}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{ top: `${ART.top}%`, height: `${ART.height}%`, left: `${plantCenterL - artWpx / 2}px`, filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.18))" }}
            />
            <img
              src={decoArt}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{ top: `${ART.top}%`, height: `${ART.height}%`, left: `${plantCenterR - artWpx / 2}px`, transform: "scaleX(-1)", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.18))" }}
            />
            {/* runner rug on the floor in front of the door */}
            <div
              className="pointer-events-none absolute left-1/2"
              style={{ top: `${RUG.top}%`, width: `${rugWpx}px`, transform: "translateX(-50%)", perspective: "700px" }}
            >
              <img
                src={decoMat}
                alt=""
                aria-hidden
                draggable={false}
                className="block w-full"
                style={{ height: `${rugHpx}px`, transform: `rotateX(${RUG.rotate}deg)`, transformOrigin: "center top", filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.35))" }}
              />
            </div>
            {/* fiddle-leaf figs flanking the door on the floor; slide out with the door width */}
            <img
              src={decoPlant}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${PLANT.bottom}%`,
                height: `${PLANT.height}%`,
                right: `${Math.max(0, edges.w - (edges.left - PLANT_GAP))}px`,
                filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.22))",
              }}
            />
            <img
              src={decoPlant}
              alt=""
              aria-hidden
              draggable={false}
              className="pointer-events-none absolute w-auto"
              style={{
                bottom: `${PLANT.bottom}%`,
                height: `${PLANT.height}%`,
                left: `${Math.min(edges.w, edges.right + PLANT_GAP)}px`,
                transform: "scaleX(-1)",
                filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.22))",
              }}
            />
          </>
        )}

        {loading && (
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
            <span role="status" aria-label="Loading" className="inline-flex items-center justify-center rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm">
              <Loading size="md" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WallScene;

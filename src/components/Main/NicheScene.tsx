import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import extFlat from "../../assets/walls/niche/ext-flat.webp";
import intFlat from "../../assets/walls/niche/int-flat.webp";
import Loading from "../ui/Loading";

interface NicheSceneProps {
  doorImage: string | null;
  doorType: string | null;
  interior: boolean;
  isUpdating?: boolean;
  isInitialLoad?: boolean;
}

/**
 * The configured door composited into a PHOTOREAL scene. Two rendering modes:
 *
 * • FLAT mode (`flatBg` set) — the photo is ONE front-on image with a flat, uniform door wall. The
 *   door just sits on the wall (centred at `cx`, between the soffit `bandTop` and the step `bandBot`);
 *   a wider door fills more wall, a narrower one shows more wall. Nothing is stretched → ZERO
 *   distortion at any width. Used for the new wide (3:1) exteriors.
 *
 * • RECESS/SLIDE mode (`left`/`right`/`center` set) — the photo is cut into two column/room sprites +
 *   a back-wall strip; the columns SLIDE and the back wall STRETCHES so the recess opening tracks the
 *   door width. Photoreal recessed look, but stretching a textured/angled surface can smear — so this
 *   is for head-on, smooth-surfaced recesses only (the interior).
 *
 * Geometry is per scene (measured in the source photo → %). Wide desktop uses COVER.
 */
interface SceneGeom {
  aspect: number;    // source photo aspect (w/h) — the scene box aspect
  cx: number;        // door centre, % of scene width
  bandTop: number;   // door band top (soffit), % of scene height
  bandBot: number;   // door band bottom (step/sill), % of scene height
  bg: string;
  flatBg?: string;   // full front-on photo: pure FLAT mode, or the background fill under CROP mode
  // SLIDE mode (has left/right/center): the dent's sides slide to hug the door.
  left?: string; right?: string; center?: string;
  leftW?: number;    // left sprite width, % of scene width
  rightW?: number;   // right sprite width, % of scene width
  centerW?: number;  // center strip natural width, % of scene width (needed for CROP)
  margin?: number;   // side wall sits margin·doorHeight of beige reveal from the door edge
  cropCenter?: boolean; // CROP the uniform center to the gap (cut-middle) instead of STRETCH it
  fixedDent?: number;   // FIXED dent width — door aspect (w/h) of the WIDEST door. Set → the dent stops
                        // tracking the door and stays locked at this wide size (door sits inside it).
}
// EXTERIOR — Gemini's wide 3:1 front-on façade (newone, 1792×592). FLAT mode: the door sits on the
// real photo, nothing cut/stretched → fully NATURAL, no seams/ghosting/distortion, robust on every
// viewport. CUT-MIDDLE was tried at length but always needed a flattened/feathered patch that read as
// "bad photoshop" — a photoreal wall can't be cut naturally. A single door just shows more wall (real).
const EXT: SceneGeom = {
  flatBg: extFlat,
  aspect: 1792 / 592,
  cx: 51.2, bandTop: 36, bandBot: 76,
  bg: "#b8b2a7",
};
// INTERIOR — Mina's wide 3:1 recessed-niche render (new img, 1792×592). FLAT mode, identical to the
// exterior: the door sits in the fixed wide recess (opening x 35.7–63.6%, soffit ~18.6%, step ~83.6%);
// the widest door fills it, narrower ones show recess wall. No cutting/sliding → natural, robust.
const INT: SceneGeom = {
  flatBg: intFlat,
  aspect: 1792 / 592,
  cx: 49.67, bandTop: 30, bandBot: 78,
  bg: "#cabfb0",
};

// Door aspect (w/h) computed EXACTLY as the BE composes it (doorbuilder RATIO/FRAME_WIDTH), so the
// door width is known from the config alone — no waiting on the image, no DOM measuring. Mirrors WallScene.
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
  // applyFrame wraps the whole assembly in a FRAME_WIDTH border on every side, so the REAL rendered
  // door image is 2·FW wider and taller than the raw leaf assembly. Include it or the door box aspect
  // is off (the door gets squished) and the width is under-counted.
  const fw = W + 2 * FW;
  const fh = totalH + 2 * FW;
  return fh > 0 ? fw / fh : 0.5;
};

const NicheScene: React.FC<NicheSceneProps> = ({ doorImage, doorType, interior, isUpdating, isInitialLoad }) => {
  const loading = !!isUpdating || !!isInitialLoad;

  const cfg = useSelector((s: RootState) => s.configuration);
  const targetAspect = doorAspect({
    type: doorType,
    width: cfg.width, halfPanelWidth: cfg.halfPanelWidth, height: cfg.height,
    leftSideWidth: cfg.leftSideWidth, rightSideWidth: cfg.rightSideWidth, upperGlassHeight: cfg.upperGlassHeight,
    leftNum: cfg["left-side-glass-number"], rightNum: cfg["right-side-glass-number"],
  });
  // Commit the door width + view only when the new door IMAGE swaps in (keyed on doorImage) so
  // toggling Spolja/Unutra keeps the old scene+door until the new door is ready — no flash.
  const [committedAspect, setCommittedAspect] = useState(targetAspect);
  const [committedInterior, setCommittedInterior] = useState(interior);
  useLayoutEffect(() => {
    setCommittedAspect(targetAspect);
    setCommittedInterior(interior);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doorImage]);

  const g = committedInterior ? INT : EXT;
  const slide = !!g.left;    // has sprites → dent sides slide to hug the door
  const flat = !slide;       // pure flat-wall scene (door just sits on the wall)
  const ASPECT = g.aspect;   // this scene's photo aspect (w/h)
  const MARGIN = g.margin ?? 0; // this scene's column reveal margin (recess mode only)
  const bandH = g.bandBot - g.bandTop; // door height, % of scene height

  // Measure the preview box (parent). Stable — only changes on window/panel resize.
  const sceneRef = useRef<HTMLDivElement>(null);
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

  // Door width + column positions, all in scene % (width→%W, height→%H). marginPct is expressed in
  // %W but derived from door HEIGHT so the framing gap is proportional to the door, not the scene.
  const doorWidthPct = (bandH * committedAspect) / ASPECT; // %W — the ACTUAL door width
  // dent width: FIXED to the widest door if fixedDent is set (dent stays wide, door sits inside it),
  // otherwise it tracks the current door (sliding hugs it).
  const dentWidthPct = (bandH * (g.fixedDent ?? committedAspect)) / ASPECT;
  const marginPct = flat ? 0 : (MARGIN * bandH) / ASPECT;  // %W (recess mode only)
  const leftInner = g.cx - dentWidthPct / 2 - marginPct;   // the dent's left inner edge
  const rightInner = g.cx + dentWidthPct / 2 + marginPct;
  const gapPct = rightInner - leftInner;
  // width to frame on mobile/narrow panes: the recess gap, or (flat) the door + wall context
  const frameW = flat ? doorWidthPct / 0.45 : gapPct;

  // Scene size (px). Wide preview COVERS it; portrait-ish previews (phone / narrow desktop pane) FRAME
  // the door so it isn't cropped or zoomed weirdly. Mirrors WallScene so both scenes behave alike.
  const mobile = box.vw > 0 && box.vw < 768;
  const narrowDesktop = box.vw >= 768 && box.w > 0 && box.w / box.h < 1.0;
  const doorCenterPct = g.bandTop + bandH / 2;
  let sceneW = 0;
  let sceneTransform = "translate(-50%, -50%)";
  if (box.w > 0) {
    if (mobile) {
      const byW = (0.9 * box.w) / (frameW / 100);
      const byH = (0.92 * box.h * ASPECT) / (bandH / 100);
      sceneW = Math.min(byW, byH);
      const offsetY = (doorCenterPct / 100 - 0.5) * (sceneW / ASPECT);
      sceneTransform = `translate(-50%, calc(-50% - ${offsetY}px))`;
    } else if (narrowDesktop) {
      const byW = (0.82 * box.w) / (frameW / 100);
      const byH = (0.66 * box.h * ASPECT) / (bandH / 100);
      sceneW = Math.min(byW, byH);
      const offsetY = (doorCenterPct / 100 - 0.5) * (sceneW / ASPECT);
      sceneTransform = `translate(-50%, calc(-50% - ${offsetY}px))`;
    } else {
      // wide desktop: COVER — fill the whole viewport, cropping the excess (sides on a narrow screen,
      // a little top/bottom on an ultra-wide). With the 16:9 interior photo the crop is small and the
      // ceiling stays visible; a WIDER master (from Monika) makes the crop vanish on ultra-wide too.
      sceneW = Math.max(box.w, box.h * ASPECT);
      sceneTransform = "translate(-50%, -50%)";
    }
  }
  const haveDoor = !!doorImage && sceneW > 0;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: g.bg }}>
      <div
        ref={sceneRef}
        className="absolute left-1/2 top-1/2"
        style={{ width: `${sceneW}px`, height: `${sceneW / ASPECT}px`, transform: sceneTransform }}
      >
        {/* base: the full front-on photo fills the scene. In CROP mode it also backs the pieces so the
           feathered sprite edges fade into the real photo (not bare bg) — the small slide keeps it aligned. */}
        {g.flatBg && (
          <img src={g.flatBg} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />
        )}

        {/* SLIDE mode centre: CROP a gap-wide window of the uniform beige (cut-middle, no stretch), or
           (older recesses) STRETCH the strip to the gap. */}
        {slide && (
          g.cropCenter ? (
            <div className="absolute top-0 h-full overflow-hidden" style={{ left: `${leftInner}%`, width: `${gapPct}%` }}>
              <img src={g.center} alt="" aria-hidden draggable={false} className="absolute top-0 left-1/2 h-full max-w-none -translate-x-1/2"
                style={{ width: `${((g.centerW ?? 100) / gapPct) * 100}%` }} />
            </div>
          ) : (
            <img src={g.center} alt="" aria-hidden draggable={false} className="absolute inset-0 h-full w-full" />
          )
        )}

        {/* the door: filling the band in height, centred at cx; width follows the config */}
        {haveDoor && (
          <div
            className="absolute -translate-x-1/2"
            style={{
              left: `${g.cx}%`,
              top: `${g.bandTop}%`,
              height: `${bandH}%`,
              width: `${doorWidthPct}%`,
              filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.30))",
            }}
          >
            <img src={doorImage!} alt="Configured door" draggable={false} className="door-image block h-full w-full" />
          </div>
        )}

        {/* RECESS mode only: sliding column/room sprites (left anchored by its RIGHT edge, right by LEFT) */}
        {!flat && (
          <>
            <img src={g.left} alt="" aria-hidden draggable={false} className="pointer-events-none absolute top-0 h-full"
              style={{ left: `${leftInner - (g.leftW ?? 0)}%`, width: `${g.leftW}%` }} />
            <img src={g.right} alt="" aria-hidden draggable={false} className="pointer-events-none absolute top-0 h-full"
              style={{ left: `${rightInner}%`, width: `${g.rightW}%` }} />
          </>
        )}

        {loading && (
          <div className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2">
            <span role="status" aria-label="Loading" className="inline-flex items-center justify-center rounded-full bg-white/70 p-2 shadow-sm backdrop-blur-sm">
              <Loading size="md" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NicheScene;

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import ViewToggle from "../components/Main/ViewToggle";

interface AppLayoutProps {
  appRef: React.RefObject<HTMLDivElement>;
  backgroundImage: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  appRef,
  backgroundImage,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const noop = () => {};

  return (
    <div
      ref={appRef}
      id="app-content"
      className="flex h-screen flex-col overflow-hidden bg-white"
    >
      <TopBar />

      <div className="relative flex min-h-0 flex-1">
        {/* mobile: tap the dimmed preview to close the overlaying sidebar */}
        {isSidebarOpen && (
          <div
            className="absolute inset-0 z-[35] bg-black/40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
          />
        )}
        {/* Mobile: full-width overlay that slides in over the preview.
            Desktop (md+): docked column with animated width. */}
        <div
          className={`absolute inset-y-0 left-0 z-40 h-full w-full max-w-[584px] overflow-hidden transition-transform duration-300 ease-in-out md:relative md:z-auto md:max-w-none md:shrink-0 md:transition-[width] ${
            isSidebarOpen ? "translate-x-0 md:w-[584px]" : "-translate-x-full md:w-0"
          }`}
        >
          {/* mobile-only close button (on a phone the sidebar covers the full width, so there's no
              dimmed preview to tap) */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
            className="absolute right-3 top-3 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-md md:hidden"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <Sidebar />
        </div>

        {/* preview column — the wallpaper/door render lives here (its own next round) */}
        <div
          className="relative min-w-0 flex-1 bg-cover bg-center"
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          }}
        >
          {/* collapse / expand the sidebar (tab glued to the preview's left edge) */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen((v) => !v)}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
            className="absolute left-0 top-1/2 z-30 flex h-14 w-5 -translate-y-1/2 items-center justify-center rounded-r-lg bg-[#0d0d0d] text-white/70 shadow-md transition-colors hover:text-white"
          >
            <FontAwesomeIcon
              icon={isSidebarOpen ? faChevronLeft : faChevronRight}
              className="text-xs"
            />
          </button>

          <ViewToggle />
          <Main isSidebarOpen={isSidebarOpen} hideSidebar={noop} />
        </div>
      </div>
    </div>
  );
};

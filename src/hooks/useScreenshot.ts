import { useState } from "react";
import { screenshotService } from "../services/screenshotService";

interface UseScreenshotOptions {
  onBeforeCapture?: () => Promise<void> | void;
  onAfterCapture?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for capturing screenshots
 */
export const useScreenshot = (options: UseScreenshotOptions = {}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Captures a screenshot of the house with the door
   */
  const captureHouseWithDoor = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      // Run any pre-capture actions (like closing sidebars)
      if (options.onBeforeCapture) {
        await options.onBeforeCapture();
      }

      // Wait a bit for UI to update if needed
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Capture the screenshot
      await screenshotService.captureHouseWithDoor();

      // Run any post-capture actions
      if (options.onAfterCapture) {
        options.onAfterCapture();
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to capture screenshot");
      setError(error);

      if (options.onError) {
        options.onError(error);
      } else {
        console.error("Screenshot capture failed:", error);
        alert(`Could not save screenshot: ${error.message}`);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  return {
    captureHouseWithDoor,
    isCapturing,
    error,
  };
};

interface ScreenshotOptions {
  filename?: string;
  scale?: number;
  backgroundColor?: string | null;
}

/**
 * Service for capturing screenshots of the application
 */
export const screenshotService = {
  /**
   * Captures a screenshot of the house background with the door
   * @returns Promise that resolves when the screenshot is saved
   */
  captureHouseWithDoor: async (
    options: ScreenshotOptions = {}
  ): Promise<void> => {
    const {
      filename = "algreen-screenshot.png",
      scale = window.devicePixelRatio,
      backgroundColor = null,
    } = options;

    // Find the main content area and the door image
    const mainContent = document.getElementById("app-content");
    const doorImageContainer = document.querySelector(".door-image-container");

    if (!mainContent || !doorImageContainer) {
      throw new Error("Could not find main content or door image");
    }

    // Find the actual door image inside the container
    const doorImg = doorImageContainer.querySelector(
      ".door-image"
    ) as HTMLImageElement;
    if (!doorImg) {
      throw new Error("Could not find door image element");
    }

    // Create a temporary div for our screenshot
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.top = "-9999px";
    tempDiv.style.width = `${mainContent.offsetWidth}px`;
    tempDiv.style.height = `${mainContent.offsetHeight}px`;
    document.body.appendChild(tempDiv);

    try {
      // Create a simplified clone with just what we need
      const clone = document.createElement("div");
      clone.style.width = "100%";
      clone.style.height = "100%";
      clone.style.position = "relative";

      // Copy the background image from the main content
      const computedStyle = window.getComputedStyle(mainContent);
      clone.style.backgroundImage = computedStyle.backgroundImage;
      clone.style.backgroundSize = computedStyle.backgroundSize;
      clone.style.backgroundPosition = computedStyle.backgroundPosition;
      clone.style.backgroundRepeat = computedStyle.backgroundRepeat;

      // Create a new image element for the door
      const doorClone = document.createElement("img");
      doorClone.src = doorImg.src;
      doorClone.crossOrigin = "anonymous";

      // Get the position and size of the door container
      const doorRect = doorImageContainer.getBoundingClientRect();
      const mainRect = mainContent.getBoundingClientRect();

      // Position the door relative to the main content
      doorClone.style.position = "absolute";
      doorClone.style.left = `${doorRect.left - mainRect.left}px`;
      doorClone.style.top = `${doorRect.top - mainRect.top}px`;
      doorClone.style.width = `${doorRect.width}px`;
      doorClone.style.height = `${doorRect.height}px`;
      doorClone.style.objectFit = "contain";

      // Add the door to our clone
      clone.appendChild(doorClone);
      tempDiv.appendChild(clone);

      // Wait for the door image to load
      await new Promise<void>((resolve, reject) => {
        doorClone.onload = () => resolve();
        doorClone.onerror = () =>
          reject(new Error("Failed to load door image"));

        // Force load the image
        const currentSrc = doorClone.src;
        doorClone.src =
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        doorClone.src = currentSrc;
      });

      // Lazy-load html2canvas only when a screenshot is actually taken
      const { default: html2canvas } = await import("html2canvas");

      // Capture the simplified clone
      const canvas = await html2canvas(clone, {
        useCORS: true,
        allowTaint: true,
        backgroundColor,
        scale,
        logging: false,
      });

      // Create download link
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = filename;
      link.click();
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  },
};

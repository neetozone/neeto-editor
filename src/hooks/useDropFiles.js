import { useEffect } from "react";

const useDropFiles = ({ dropTargetRef, onDrop }) => {
  useEffect(() => {
    const dropZone = dropTargetRef?.current;
    let timeout,
      isGlobalDragActive = false;

    // Find the smallest drop zone at the given coordinates to handle overlapping zones
    const findSmallestDropZoneAtPoint = (x, y) => {
      const allDropZones = Array.from(
        document.querySelectorAll("[data-drop-zone]")
      );
      let smallestZone = null;
      let smallestArea = Infinity;

      allDropZones.forEach(zone => {
        const rect = zone.getBoundingClientRect();

        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          const area = rect.width * rect.height;
          if (area < smallestArea) {
            smallestArea = area;
            smallestZone = zone;
          }
        }
      });

      return smallestZone;
    };

    // Update visual states of all drop zones based on cursor position
    const updateDropZoneStates = (x, y) => {
      if (!isGlobalDragActive) return;

      const activeZone = findSmallestDropZoneAtPoint(x, y);

      // Clear all drop zone states first
      document.querySelectorAll("[data-drop-zone]").forEach(zone => {
        zone.classList.remove("is-dragging-over-files");
      });

      // Highlight only the active zone
      if (activeZone) {
        activeZone.classList.add("is-dragging-over-files");
      }
    };

    const handleDragOver = event => {
      event.preventDefault();
      clearTimeout(timeout);
      updateDropZoneStates(event.clientX, event.clientY);
    };

    const handleDragEnter = event => {
      event.preventDefault();
      clearTimeout(timeout);

      if (!isGlobalDragActive) {
        isGlobalDragActive = true;
      }

      updateDropZoneStates(event.clientX, event.clientY);
    };

    const handleDragLeave = event => {
      event.preventDefault();

      const relatedTarget = event.relatedTarget;
      const leavingDropZone =
        !relatedTarget || !dropZone.contains(relatedTarget);

      if (leavingDropZone) {
        timeout = setTimeout(() => {
          const allDropZones = Array.from(
            document.querySelectorAll("[data-drop-zone]")
          );

          const stillOverAnyZone = allDropZones.some(
            zone => relatedTarget && zone.contains(relatedTarget)
          );

          // Reset global drag state if not over any drop zone
          if (!stillOverAnyZone) {
            isGlobalDragActive = false;
            document.querySelectorAll("[data-drop-zone]").forEach(zone => {
              zone.classList.remove("is-dragging-over-files");
            });
          }
        }, 50);
      }
    };

    const handleDrop = event => {
      event.preventDefault();
      event.stopPropagation();
      clearTimeout(timeout);

      // Only handle drop if this is the active zone at drop coordinates
      const activeZone = findSmallestDropZoneAtPoint(
        event.clientX,
        event.clientY
      );

      if (activeZone === dropZone) {
        const files = Array.from(event.dataTransfer.files);
        onDrop(files);
      }

      // Reset all states after drop
      isGlobalDragActive = false;
      document.querySelectorAll("[data-drop-zone]").forEach(zone => {
        zone.classList.remove("is-dragging-over-files");
      });
    };

    if (dropZone) {
      dropZone.setAttribute("data-drop-zone", "true");
      dropZone.addEventListener("dragenter", handleDragEnter);
      dropZone.addEventListener("dragleave", handleDragLeave);
      dropZone.addEventListener("dragover", handleDragOver);
      dropZone.addEventListener("drop", handleDrop);
    }

    return () => {
      if (!dropZone) return;
      clearTimeout(timeout);
      dropZone.removeAttribute("data-drop-zone");
      dropZone.removeEventListener("dragenter", handleDragEnter);
      dropZone.removeEventListener("dragover", handleDragOver);
      dropZone.removeEventListener("dragleave", handleDragLeave);
      dropZone.removeEventListener("drop", handleDrop);
    };
  }, [dropTargetRef, onDrop]);
};

export default useDropFiles;

import { isTutorialShown, setTutorialShown } from "./SaveManager.js";

export function showTutorialIfNeeded() {
  const modal = document.getElementById("tutorial-modal");
  if (!modal) return;

  if (isTutorialShown()) {
    modal.classList.add("hidden");
    return;
  }

  modal.classList.remove("hidden");

  const closeBtn = document.getElementById("tutorial-close");
  const checkbox = document.getElementById("tutorial-dont-show");

  function cleanup() {
    closeBtn.removeEventListener("click", onClose);
    modal.removeEventListener("click", onOutsideClick);
    window.removeEventListener("keydown", onKeyDown);
  }

  function onClose() {
    if (checkbox && checkbox.checked) {
      setTutorialShown(true);
    }
    modal.classList.add("hidden");
    cleanup();
  }

  function onOutsideClick(e) {
    if (e.target === modal) {
      onClose();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  closeBtn.addEventListener("click", onClose);
  modal.addEventListener("click", onOutsideClick);
  window.addEventListener("keydown", onKeyDown);
}

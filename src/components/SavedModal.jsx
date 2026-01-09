import SavedPage from "../pages/SavedPage";
import "../styles/SavedPage.css";

export default function SavedModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="saved-modal-overlay" onClick={onClose}>
      <div
        className="saved-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="saved-modal-close" onClick={onClose}>
          ×
        </button>

        <SavedPage />
      </div>
    </div>
  );
}

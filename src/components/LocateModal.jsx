import "../styles/LocateModal.css";

export default function LocateModal({ open, study, onClose }) {
  if (!open || !study) return null;

  return (
    <div className="locate-overlay" onClick={onClose}>
      <div
        className="locate-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close X button */}
        <button className="locate-close-x" onClick={onClose}>
          ×
        </button>

        <h2>Locate Study</h2>

        <div className="locate-info">
          <p>
            <strong>Control Number:</strong> {study.controlNumber}
          </p>

          <p>
            <strong>Title:</strong> {study.title}
          </p>

          <p>
            <strong>Author(s):</strong> {study.authors}
          </p>

          <p>
            <strong>Year:</strong> {study.year}
          </p>

          <p>
            <strong>Location:</strong> {study.location}
          </p>
        </div>
      </div>
    </div>
  );
}
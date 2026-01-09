import "../styles/StudyModal.css";

export default function StudyModal({
  open,
  study,
  onClose,
  onCite,
  onToggleSave,
  isSaved
}) {
  if (!open || !study) return null;

  const abstractText =
    study.abstractFull ||
    study.abstractShort ||
    study.abstract ||
    "No abstract is available for this study.";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}
        <header className="modal-header">
          <h2>{study.title}</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>

        {/* ================= META ================= */}
        <div className="modal-meta">
          <span>{study.authors}</span>
          <span>{study.year}</span>
          <span>{study.field}</span>
          <span>{study.type}</span>
        </div>

        {/* ================= ABSTRACT ================= */}
        <section className="modal-abstract">
          <h4>Abstract</h4>
          <p>{abstractText}</p>
        </section>

        {/* ================= ACTIONS ================= */}
        <footer className="modal-actions">
          {study.pdf ? (
            <a
              href={study.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              View
            </a>
          ) : (
            <button className="btn-outline" disabled>
              PDF Unavailable
            </button>
          )}

          <button
            className="btn-outline"
            onClick={() => onToggleSave(study.id)}
          >
            {isSaved(study.id) ? "Saved" : "Save"}
          </button>

          <button
            className="btn-primary"
            onClick={() => onCite(study)}
          >
            Cite
          </button>
        </footer>
      </div>
    </div>
  );
}

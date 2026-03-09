import "../styles/RelatedStudiesModal.css";

export default function RelatedStudiesModal({ open, relatedStudies, onClose, onSelectStudy }) {
  if (!open || !relatedStudies) return null;

  return (
    <div className="related-overlay" onClick={onClose}>
      <div
        className="related-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="related-close-x"
          onClick={onClose}
          aria-label="Close Related Studies Modal"
        >
          ×
        </button>
        <h2>Related Studies</h2>

        <div className="related-list">
          {relatedStudies.length > 0 ? (
            <ul>
              {relatedStudies.map((study, idx) => (
                <li
                  key={idx}
                  className="related-item"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onClose();             // close current modal
                    onSelectStudy(study);  // open clicked study
                  }}
                >
                  {study.apaCitation}{" "}
                  {study.link && (
                    <a
                      href={study.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // allow link to work without triggering modal open
                    >
                      [Link]
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No related studies available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
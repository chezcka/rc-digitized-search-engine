import { useEffect } from "react";
import "../styles/RelatedStudiesModal.css";

export default function RelatedStudiesModal({
  open,
  relatedStudies,
  onClose,
  onSelectStudy
}) {
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open || !Array.isArray(relatedStudies)) return null;

  return (
    <div className="related-overlay" onClick={onClose}>
      <div
        className="related-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="related-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="related-close-x"
          onClick={onClose}
          aria-label="Close Related Studies Modal"
        >
          ×
        </button>

        <h2 id="related-title">Related Studies</h2>

        <div className="related-list">
          {relatedStudies.length > 0 ? (
            <ul>
              {relatedStudies.map((study) => (
                <li
                  key={study.id}
                  className="related-item"
                  style={{ cursor: "pointer", marginBottom: "16px" }}
                  onClick={() => {
                    onClose();
                    onSelectStudy(study);
                  }}
                >
                  <strong>{study.title}</strong>
                  <br />
                  {study.authors}
                  <br />
                  {study.year}
                  <br />
                  {study.source}
                  {study.link && (
                    <>
                      <br />
                      <a
                        href={study.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {study.link}
                      </a>
                    </>
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
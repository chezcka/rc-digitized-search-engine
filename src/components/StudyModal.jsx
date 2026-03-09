import { useState, useEffect } from "react";
import "../styles/StudyModal.css";

export default function StudyModal({
  open,
  study,
  onClose,
  onCite,
  onToggleSave,
  isSaved,
  onLocate,
  onShowRelated
}) {
  if (!open || !study) return null;

  const abstractText =
    study.abstractFull ||
    study.abstractShort ||
    study.abstract ||
    "No abstract is available for this study.";

  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedAbstract, setHighlightedAbstract] = useState(abstractText);
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    setSearchTerm("");
  }, [study]);

  useEffect(() => {

    if (!searchTerm) {
      setHighlightedAbstract(abstractText);
      setResults([]);
      setActiveIndex(null);
      return;
    }

    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");

    const matches = [];
    let match;

    while ((match = regex.exec(abstractText)) !== null) {

      const start = Math.max(match.index - 30, 0);
      const end = Math.min(match.index + 30, abstractText.length);

      matches.push({
        index: match.index,
        context: abstractText.substring(start, end)
      });

    }

    setResults(matches);

    // Only show ALL highlights if user hasn't selected one yet
    if (activeIndex === null) {

      const highlighted = abstractText.replace(
        regex,
        '<mark class="highlight">$1</mark>'
      );

      setHighlightedAbstract(highlighted);

    }

  }, [searchTerm, abstractText, activeIndex]);

  const scrollToMatch = (index) => {

    setActiveIndex(index);

    const match = results[index];

    if (!match) return;

    const start = match.index;
    const end = start + searchTerm.length;

    const before = abstractText.slice(0, start);
    const word = abstractText.slice(start, end);
    const after = abstractText.slice(end);

    const highlighted =
      before +
      `<mark class="highlight">${word}</mark>` +
      after;

    setHighlightedAbstract(highlighted);

    setTimeout(() => {
      const mark = document.querySelector(".abstract-panel .highlight");

      if (mark) {
        mark.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
    }, 0);

  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >

        <section className="modal-body">

          {/* LEFT PANEL — SEARCH ONLY */}
          <div className="search-panel">

            <input
              type="text"
              placeholder="Search within abstract..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="abstract-search"
            />

            <div className="search-results">

              {results.length === 0 && searchTerm && (
                <p className="no-results">No matches</p>
              )}

              {results.map((item, index) => (
                <div
                  key={index}
                  className={`result-item ${activeIndex === index ? "active" : ""}`}
                  onClick={() => scrollToMatch(index)}
                >
                  ...{item.context}...
                </div>
              ))}

            </div>

          </div>

          {/* RIGHT PANEL — STUDY CONTENT */}
          <div className="abstract-panel">

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

            <div className="modal-meta">
              <div className="meta-authors">{study.authors}</div>

              <div className="meta-info">
                <span>{study.year}</span>
                <span>{study.field}</span>
                <span>{study.type}</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="modal-study-actions">

              <button
                className="icon-action"
                onClick={() => onToggleSave(study.id)}
              >
                <svg viewBox="0 0 640 640">
                  <path
                    d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128z"
                    fill={isSaved(study.id) ? "#2563eb" : "currentColor"}
                  />
                </svg>
                <span>{isSaved(study.id) ? "Saved" : "Save"}</span>
              </button>

              <button
                className="icon-action"
                onClick={() => onCite(study)}
              >
                <svg viewBox="0 0 640 640">
                  <path d="M96 280C96 213.7 149.7 160 216 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L216 224C185.1 224 160 249.1 160 280L160 288L224 288C259.3 288 288 316.7 288 352L288 416C288 451.3 259.3 480 224 480L160 480C124.7 480 96 451.3 96 416L96 280zM352 280C352 213.7 405.7 160 472 160L480 160C497.7 160 512 174.3 512 192C512 209.7 497.7 224 480 224L472 224C441.1 224 416 249.1 416 280L416 288L480 288C515.3 288 544 316.7 544 352L544 416C544 451.3 515.3 480 480 480L416 480C380.7 480 352 451.3 352 416L352 280z"/>
                </svg>
                <span>Cite</span>
              </button>

              <button
                className="icon-action"
                onClick={() => onLocate(study)}
              >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                  >
                    <path
                      fill="#2563eb"
                      d="M288-16c17.7 0 32 14.3 32 32l0 18.3c98.1 14 175.7 91.6 189.7 189.7l18.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-18.3 0c-14 98.1-91.6 175.7-189.7 189.7l0 18.3c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-18.3C157.9 463.7 80.3 386.1 66.3 288L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l18.3 0C80.3 125.9 157.9 48.3 256 34.3L256 16c0-17.7 14.3-32 32-32zM128 256a160 160 0 1 0 320 0 160 160 0 1 0 -320 0zm160-96a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"
                    />
                  </svg>
                <span>Locate</span>
              </button>

              <button
                className="icon-action"
                onClick={() => {
                  onClose();
                  onShowRelated(study);
                }}
              >
                    <svg viewBox="0 0 640 512">
                      <path fill="#2362eb" 
                      d="M384 512L96 512c-53 0-96-43-96-96L0 96C0 43 43 0 96 0L400 0c26.5 0 48 21.5 48 48l0 288c0 20.9-13.4 38.7-32 45.3l0 66.7c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32 0zM96 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0-64-256 0zm32-232c0 13.3 10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0c-13.3 0-24 10.7-24 24zm24 72c-13.3 0-24 10.7-24 24s10.7 24 24 24l176 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-176 0z"
                      />
                    </svg>
                <span>Related Studies</span>
              </button>

            </div>

            <h4>Abstract</h4>

            <p
              dangerouslySetInnerHTML={{ __html: highlightedAbstract }}
            />

          </div>

        </section>

        <footer className="modal-actions">

          {study.pdf ? (
            <a
              href={study.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Open PDF
            </a>
          ) : (
            <button className="btn-outline" disabled>
              PDF Unavailable
            </button>
          )}

        </footer>

      </div>
    </div>
  );
}
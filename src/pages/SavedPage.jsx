import useBookmarks from "../hooks/useBookmarks";
import sampleStudies from "../data/sampleStudies";
import "../styles/SavedPage.css";

export default function SavedPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();

  const savedStudies = sampleStudies.filter((study) =>
    bookmarks.includes(study.id)
  );

  return (
    <div className="saved-page">
      {/* HEADER */}
      <div className="saved-header">
        <svg
          className="saved-header-icon"
          viewBox="0 0 640 640"
          aria-hidden="true"
        >
          <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" />
        </svg>

        <h2 className="saved-title">Saved Research</h2>
      </div>

      {savedStudies.length === 0 ? (
        <p className="saved-empty">
          You haven’t saved any research yet.
        </p>
      ) : (
        <div className="saved-list">
          {savedStudies.map((study) => (
            <div key={study.id} className="saved-card">
              <div className="saved-card-header">
                <h3>{study.title}</h3>
                <button
                  className="remove-btn"
                  onClick={() => toggleBookmark(study.id)}
                >
                  Remove
                </button>
              </div>

              <p className="saved-meta">
                {study.authors} • {study.year}
              </p>

              <p className="saved-abstract">
                {study.abstract}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

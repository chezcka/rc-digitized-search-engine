import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

import sampleStudies from "../data/sampleStudies";
import useBookmarks from "../hooks/useBookmarks";
import SavedModal from "../components/SavedModal";
import CitationModal from "../components/CitationModal";
import StudyModal from "../components/StudyModal";
import Profile from "../pages/Profile";

import logo from "../assets/rc-logo.png";

import "../styles/SearchPage.css";

export default function SearchPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [studies, setStudies] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);

  const [typeFilter, setTypeFilter] = useState([]);
  const [fieldFilter, setFieldFilter] = useState([]);
  const [otherField, setOtherField] = useState("");

  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const { bookmarks, toggleBookmark, count } = useBookmarks();
  const [citeStudy, setCiteStudy] = useState(null);
  const [activeStudy, setActiveStudy] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  /* =========================
     PAGINATION
  ========================= */
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const getMaxVisiblePages = () => {
  return window.innerWidth <= 900 ? 5 : 10;
  };

  const [maxVisiblePages, setMaxVisiblePages] = useState(
    getMaxVisiblePages()
  );

  useEffect(() => {
  const handlePageShow = (e) => {
    if (e.persisted) {
      setTypeFilter([]);
      setFieldFilter([]);
      setOtherField("");
      setYearFrom("");
      setYearTo("");
    }
  };

  window.addEventListener("pageshow", handlePageShow);
  return () => window.removeEventListener("pageshow", handlePageShow);
}, []);

  useEffect(() => {
    const handleResize = () => {
      setMaxVisiblePages(getMaxVisiblePages());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* =========================
     AUTH GUARD
  ========================= */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
    });
    return () => unsubscribe();
  }, [navigate]);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    setStudies(sampleStudies);
  }, []);

  /* =========================
     RESET PAGE ON FILTER CHANGE
  ========================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, fieldFilter, yearFrom, yearTo, otherField]);

  const toggleFilter = (value, state, setState) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };

  /* =========================
     ABSTRACT HELPER (ADDED)
  ========================= */
  const getAbstractPreview = (study) => {
    return study.abstractShort || study.abstract || "";
  };

  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      study.title.toLowerCase().includes(search.toLowerCase()) ||
      study.abstract?.toLowerCase().includes(search.toLowerCase()) ||
      study.abstractShort?.toLowerCase().includes(search.toLowerCase()) ||
      study.abstractFull?.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      typeFilter.length === 0 || typeFilter.includes(study.type);

    const matchesField =
      fieldFilter.length === 0 ||
      fieldFilter.includes(study.field) ||
      (fieldFilter.includes("Others") &&
        otherField &&
        study.field.toLowerCase().includes(otherField.toLowerCase()));

    const matchesYear =
      (!yearFrom || study.year >= yearFrom) &&
      (!yearTo || study.year <= yearTo);

    return matchesSearch && matchesType && matchesField && matchesYear;
  });

const totalPages = Math.ceil(
    filteredStudies.length / ITEMS_PER_PAGE
  );

  const paginatedStudies = filteredStudies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* =========================
     WINDOWED PAGINATION (KEY FIX)
  ========================= */
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(
      currentPage - Math.floor(maxVisiblePages / 2),
      1
    );
    let end = start + maxVisiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = end - maxVisiblePages + 1;
    }

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  };

  const visiblePages = getVisiblePages();

  async function handleLogout() {
    await signOut(auth);
    navigate("/login");
  }

  const filterKey = JSON.stringify({
    search,
    typeFilter,
    fieldFilter,
    yearFrom,
    yearTo,
    otherField
  });


  return (
    <div className="search-page">
      {/* ================= TOP BAR ================= */}
      <header className="top-bar">
        {/* LOGO */}
        <div className="top-left">
          <img src={logo} alt="RC Logo" />
          <span>RC Digitized Research Catalog</span>
        </div>

        {/* SEARCH (DESKTOP CENTER / MOBILE ROW) */}
        <div className="top-search">
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>

          <input
            type="text"
            placeholder="Search title, keywords, or phrases"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ICONS */}
        <div className="top-right">
          <button
            className="icon-btn"
            title="Bookmarks"
            onClick={() => setShowSavedModal(true)}
            style={{ position: "relative" }}
          >
            <svg viewBox="0 0 640 640">
              <path d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z" />
            </svg>
            {count > 0 && <span className="bookmark-badge">{count}</span>}
          </button>

          <button
            className="icon-btn"
            title="Profile"
            onClick={() => setShowProfile(true)}
          >
            <svg viewBox="0 0 640 640">
              <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
            </svg>
          </button>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      <div className={`mobile-menu-overlay ${menuOpen ? "open" : ""}`}>
        <div
          className="mobile-menu"
          key="mobile-menu-clean"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="mobile-menu-header">
            {/* CLOSE BUTTON ON TOP */}
            <button
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>

            {/* USER INFO BELOW */}
            <div className="mobile-user">
              <strong>
                {auth.currentUser?.displayName || auth.currentUser?.email || "User"}
              </strong>

              <button
                className="edit-profile-btn"
                onClick={() => {
                  setShowProfile(true);
                  setMenuOpen(false);
                }}
              >
                Edit profile
              </button>
            </div>
          </div>

          <button
            className="mobile-link bookmarked-link"
            onClick={() => {
              setShowSavedModal(true);
              setMenuOpen(false);
            }}
          >
            <svg viewBox="0 0 640 640" className="bookmark-icon">
              <path
                d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128z"
                fill="currentColor"
              />
            </svg>

            <span>Bookmarked ({count})</span>
          </button>

          <div className="filter-section">
            <h4>Year</h4>
            <div className="year-inputs">
              <input
                type="number"
                placeholder="From"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
              <input
                type="number"
                placeholder="To"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Type of Research</h4>
            {["Qualitative", "Quantitative", "Capstone"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={typeFilter.includes(type)}
                  onChange={() =>
                    toggleFilter(type, typeFilter, setTypeFilter)
                  }
                />
                {type}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Field</h4>
            {[
              "Science",
              "Mathematics",
              "English",
              "Technology",
              "Engineering",
              "Medical",
              "Others"
            ].map((field) => (
              <label key={field}>
                <input
                  type="checkbox"
                  checked={fieldFilter.includes(field)}
                  onChange={() =>
                    toggleFilter(field, fieldFilter, setFieldFilter)
                  }
                />
                {field}
              </label>
            ))}

            {fieldFilter.includes("Others") && (
              <input
                type="text"
                placeholder="Enter custom field"
                value={otherField}
                onChange={(e) => setOtherField(e.target.value)}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #334155",
                  borderRadius: "6px",
                  background: "#020617",
                  color: "#ffffff"
                }}
              />
            )}
          </div>

          <button className="logout-btn mobile-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="search-body">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="filter-section">
            <h4>Year</h4>
            <div className="year-inputs">
              <input
                type="number"
                placeholder="From"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
              <input
                type="number"
                placeholder="To"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-section">
            <h4>Type of Research</h4>
            {["Qualitative", "Quantitative", "Capstone"].map((type) => (
              <label key={type}>
                <input
                  type="checkbox"
                  checked={typeFilter.includes(type)}
                  onChange={() =>
                    toggleFilter(type, typeFilter, setTypeFilter)
                  }
                />
                {type} Research
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Field</h4>
            {[
              "Science",
              "Mathematics",
              "English",
              "Technology",
              "Engineering",
              "Medical",
              "Others"
            ].map((field) => (
              <label key={field}>
                <input
                  type="checkbox"
                  checked={fieldFilter.includes(field)}
                  onChange={() =>
                    toggleFilter(field, fieldFilter, setFieldFilter)
                  }
                />
                {field}
              </label>
            ))}

            {fieldFilter.includes("Others") && (
              <input
                type="text"
                placeholder="Enter custom field"
                value={otherField}
                onChange={(e) => setOtherField(e.target.value)}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px"
                }}
              />
            )}
          </div>

          <div style={{ marginTop: "auto", paddingTop: "16px" }}>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        {/* RESULTS */}
        <main className="results" key={filterKey}>
          {paginatedStudies.map((study) => (
            <div
              className="research-card"
              key={study.id}
              onClick={() => setActiveStudy(study)}
            >
              <h2>{study.title}</h2>

              <p className="meta">{study.authors}</p>

              <p className="abstract">{getAbstractPreview(study)}</p>

              <div className="actions">
                <button
                  className="icon-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(study.id);
                  }}
                >
                  <svg viewBox="0 0 640 640">
                    <path
                      d="M128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 545.1C512 570.7 483.5 585.9 462.2 571.7L320 476.8L177.8 571.7C156.5 585.9 128 570.6 128 545.1L128 128z"
                      fill={
                        bookmarks.includes(study.id)
                          ? "#2563eb"
                          : "currentColor"
                      }
                    />
                  </svg>
                  <span>
                    {bookmarks.includes(study.id) ? "Saved" : "Save"}
                  </span>
                </button>

                <button
                  className="icon-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCiteStudy(study);
                  }}
                >
                  <svg viewBox="0 0 640 640">
                    <path d="M96 280C96 213.7 149.7 160 216 160L224 160C241.7 160 256 174.3 256 192C256 209.7 241.7 224 224 224L216 224C185.1 224 160 249.1 160 280L160 288L224 288C259.3 288 288 316.7 288 352L288 416C288 451.3 259.3 480 224 480L160 480C124.7 480 96 451.3 96 416L96 280zM352 280C352 213.7 405.7 160 472 160L480 160C497.7 160 512 174.3 512 192C512 209.7 497.7 224 480 224L472 224C441.1 224 416 249.1 416 280L416 288L480 288C515.3 288 544 316.7 544 352L544 416C544 451.3 515.3 480 480 480L416 480C380.7 480 352 451.3 352 416L352 280z" />
                  </svg>
                  <span>Cite</span>
                </button>

                <span className="cite-year">{study.year}</span>
              </div>
            </div>
          ))}

          {filteredStudies.length === 0 && (
            <p className="no-results">No studies found.</p>
          )}

          {filteredStudies.length > 0 && totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-arrow"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
            >
              ‹
            </button>

            <div className="page-numbers">
              {visiblePages.map((num) => (
                <button
                  key={num}
                  className={`page-number ${
                    currentPage === num ? "active" : ""
                  }`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              className="page-arrow"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
            >
              ›
            </button>
          </div>
          )}

          <SavedModal
            open={showSavedModal}
            onClose={() => setShowSavedModal(false)}
          />

          <CitationModal
            open={!!citeStudy}
            study={citeStudy}
            onClose={() => setCiteStudy(null)}
          />

          <StudyModal
            open={!!activeStudy}
            study={activeStudy}
            onClose={() => setActiveStudy(null)}
            onCite={(study) => {
              setActiveStudy(null);
              setCiteStudy(study);
            }}
            onToggleSave={(id) => toggleBookmark(id)}
            isSaved={(id) => bookmarks.includes(id)}
          />

          <Profile
            open={showProfile}
            onClose={() => setShowProfile(false)}
          />

          <div className="pagination-spacer" />

        </main>
      </div>
    </div>
  );
}

import { useState } from "react";
import { generateCitation, downloadCitation } from "../utils/citationUtils";
import "../styles/CitationModal.css";

export default function CitationModal({ open, onClose, study }) {
  const [format, setFormat] = useState("APA");

  if (!open || !study) return null;

  const citation = generateCitation(study, format);

  function handleDownload() {
    const ext = format === "BibTeX" ? "bib" : "txt";
    downloadCitation(citation, `citation-${study.id}.${ext}`);
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Cite Research</h2>

        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
        >
          <option value="APA">APA</option>
          <option value="MLA">MLA</option>
          <option value="Chicago">Chicago</option>
          <option value="BibTeX">BibTeX</option>
        </select>

        <pre className="citation-preview">{citation}</pre>

        <button className="download-btn" onClick={handleDownload}>
          Download Citation
        </button>
      </div>
    </div>
  );
}

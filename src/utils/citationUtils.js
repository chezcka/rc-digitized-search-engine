export function generateCitation(study, format = "APA") {
  const authors = study.authors;
  const year = study.year;
  const title = study.title;

  switch (format) {
    case "MLA":
      return `${authors}. "${title}." (${year}).`;

    case "Chicago":
      return `${authors}. ${year}. "${title}."`;

    case "BibTeX":
      return `@article{${study.id},
  title={${title}},
  author={${authors}},
  year={${year}}
}`;

    case "APA":
    default:
      return `${authors} (${year}). ${title}.`;
  }
}

export function downloadCitation(text, filename = "citation.txt") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

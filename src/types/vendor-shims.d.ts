// Minimal type shims to avoid pulling large dependency type graphs into the typechecker.
// These libraries are used only at runtime for PDF export.

declare module 'jspdf' {
  const jsPDF: any;
  export default jsPDF;
}

declare module 'html2canvas' {
  const html2canvas: any;
  export default html2canvas;
}

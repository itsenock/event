// src/types/jspdf-autotable.d.ts

declare module "jspdf-autotable";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
  }

  interface AutoTableOptions {
    head?: Array<Array<string>>;
    body?: Array<Array<string | number>>;
    startY?: number;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
    styles?: {
      fontSize?: number;
      cellPadding?: number;
      halign?: "left" | "center" | "right";
      valign?: "top" | "middle" | "bottom";
      textColor?: number | [number, number, number];
      fillColor?: [number, number, number];
    };
    headStyles?: {
      fillColor?: [number, number, number];
      textColor?: number | [number, number, number];
      fontStyle?: "normal" | "bold" | "italic";
    };
    alternateRowStyles?: {
      fillColor?: [number, number, number];
    };
    theme?: "striped" | "grid" | "plain";
    tableWidth?: "auto" | "wrap" | number;
    showHead?: "everyPage" | "firstPage" | "never";
    didDrawPage?: (data: { pageNumber: number }) => void;
  }
}

export interface InspectionReading {
  cmlPoint: string;
  locationDescription: string;
  nominalThicknessMm: number;
  measuredThicknessMm: number;
  mawtMm: number; // Minimum Allowable Wall Thickness (API 570)
  corrosionRateMmYear: number;
  remainingLifeYears: number;
  status: "CRITICAL" | "WARNING" | "NORMAL";
}

export const mockHydrocrackerInspectionReadings: InspectionReading[] = [
  {
    cmlPoint: "CML-HC-101A",
    locationDescription: "Reactor Overhead Vapor Line (90° Elbow)",
    nominalThicknessMm: 14.2,
    measuredThicknessMm: 7.8,
    mawtMm: 6.5,
    corrosionRateMmYear: 0.82,
    remainingLifeYears: 1.58,
    status: "CRITICAL",
  },
  {
    cmlPoint: "CML-HC-101B",
    locationDescription: "Reactor Effluent Separator Inlet Nozzle",
    nominalThicknessMm: 16.0,
    measuredThicknessMm: 11.4,
    mawtMm: 8.0,
    corrosionRateMmYear: 0.45,
    remainingLifeYears: 7.55,
    status: "WARNING",
  },
  {
    cmlPoint: "CML-HC-102A",
    locationDescription: "High-Pressure Hydrogen Recycle Loop Spool",
    nominalThicknessMm: 18.5,
    measuredThicknessMm: 16.9,
    mawtMm: 9.2,
    corrosionRateMmYear: 0.18,
    remainingLifeYears: 42.7,
    status: "NORMAL",
  },
  {
    cmlPoint: "CML-HC-103C",
    locationDescription: "Sour Gas Depropanizer Reboiler Bottoms",
    nominalThicknessMm: 12.7,
    measuredThicknessMm: 8.1,
    mawtMm: 7.0,
    corrosionRateMmYear: 0.58,
    remainingLifeYears: 1.89,
    status: "CRITICAL",
  },
];

export const mockCorrosionDegradationCurve = [
  { year: "2018 (Baseline)", thickness: 14.2, mawt: 6.5 },
  { year: "2020 (Turnaround)", thickness: 12.8, mawt: 6.5 },
  { year: "2022 (Routine UT)", thickness: 11.1, mawt: 6.5 },
  { year: "2024 (Intermediate)", thickness: 9.3, mawt: 6.5 },
  { year: "2026 (Current)", thickness: 7.8, mawt: 6.5 },
  { year: "2027 (Projected)", thickness: 6.98, mawt: 6.5 },
  { year: "2028 (MAWT Breach)", thickness: 6.16, mawt: 6.5 },
];

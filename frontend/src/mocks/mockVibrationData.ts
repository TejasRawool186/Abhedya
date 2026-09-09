export interface VibrationDataPoint {
  frequencyHz: number;
  amplitudeMmS: number;
  thresholdMmS: number;
  defectLabel?: string;
}

export const mockPumpVibrationFFTSpectrum: VibrationDataPoint[] = [
  { frequencyHz: 10, amplitudeMmS: 0.4, thresholdMmS: 2.8 },
  { frequencyHz: 25, amplitudeMmS: 0.8, thresholdMmS: 2.8 },
  { frequencyHz: 29.8, amplitudeMmS: 4.85, thresholdMmS: 2.8, defectLabel: "1X Unbalance Spike" },
  { frequencyHz: 40, amplitudeMmS: 0.9, thresholdMmS: 2.8 },
  { frequencyHz: 59.6, amplitudeMmS: 3.42, thresholdMmS: 2.8, defectLabel: "2X Misalignment Harmonic" },
  { frequencyHz: 80, amplitudeMmS: 0.5, thresholdMmS: 2.8 },
  { frequencyHz: 100, amplitudeMmS: 0.6, thresholdMmS: 2.8 },
  { frequencyHz: 120, amplitudeMmS: 0.7, thresholdMmS: 2.8 },
  { frequencyHz: 148.5, amplitudeMmS: 5.12, thresholdMmS: 2.8, defectLabel: "BPFO Bearing Outer Race" },
  { frequencyHz: 180, amplitudeMmS: 0.8, thresholdMmS: 2.8 },
  { frequencyHz: 220, amplitudeMmS: 0.4, thresholdMmS: 2.8 },
  { frequencyHz: 260, amplitudeMmS: 0.5, thresholdMmS: 2.8 },
  { frequencyHz: 300, amplitudeMmS: 0.3, thresholdMmS: 2.8 },
  { frequencyHz: 350, amplitudeMmS: 0.2, thresholdMmS: 2.8 },
  { frequencyHz: 400, amplitudeMmS: 0.3, thresholdMmS: 2.8 },
  { frequencyHz: 450, amplitudeMmS: 0.2, thresholdMmS: 2.8 },
  { frequencyHz: 500, amplitudeMmS: 0.1, thresholdMmS: 2.8 },
];

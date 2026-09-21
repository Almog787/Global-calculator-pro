/**
 * Geometry & Trigonometry Math Utilities
 * Covers:
 * 1. Triangle Solver (SSS, SAS, ASA, AAS, Heron's formula, Inradius, Circumradius)
 * 2. Circle Sector & Arc Length (Arc length, Sector Area, Chord length, Segment area)
 */

export interface TriangleResult {
  sideA: number;
  sideB: number;
  sideC: number;
  angleA: number; // degrees
  angleB: number; // degrees
  angleC: number; // degrees
  area: number;
  perimeter: number;
  semiPerimeter: number;
  inradius: number; // r = Area / s
  circumradius: number; // R = (abc) / (4*Area)
  triangleType: {
    bySides: 'equilateral' | 'isosceles' | 'scalene';
    byAngles: 'acute' | 'right' | 'obtuse';
  };
  heightA: number; // Altitude to side a
  heightB: number; // Altitude to side b
  heightC: number; // Altitude to side c
  steps: string[];
}

const radToDeg = (rad: number) => (rad * 180) / Math.PI;
const degToRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Solves triangle given 3 sides (SSS)
 */
export function solveTriangleSSS(a: number, b: number, c: number): TriangleResult | null {
  if (a <= 0 || b <= 0 || c <= 0) return null;
  // Triangle inequality theorem: sum of any 2 sides must be greater than the 3rd
  if (a + b <= c || a + c <= b || b + c <= a) return null;

  // Law of Cosines: cos(C) = (a² + b² - c²) / (2ab)
  const cosC = (a * a + b * b - c * c) / (2 * a * b);
  const cosB = (a * a + c * c - b * b) / (2 * a * c);
  const cosA = (b * b + c * c - a * a) / (2 * b * c);

  const angleC_rad = Math.acos(Math.max(-1, Math.min(1, cosC)));
  const angleB_rad = Math.acos(Math.max(-1, Math.min(1, cosB)));
  const angleA_rad = Math.acos(Math.max(-1, Math.min(1, cosA)));

  const angleA = radToDeg(angleA_rad);
  const angleB = radToDeg(angleB_rad);
  const angleC = radToDeg(angleC_rad);

  // Perimeter & Heron's formula for area
  const perimeter = a + b + c;
  const s = perimeter / 2;
  const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));

  const inradius = area / s;
  const circumradius = (a * b * c) / (4 * area);

  // Altitudes
  const heightA = (2 * area) / a;
  const heightB = (2 * area) / b;
  const heightC = (2 * area) / c;

  // Classification by sides
  let bySides: 'equilateral' | 'isosceles' | 'scalene' = 'scalene';
  const eps = 1e-4;
  if (Math.abs(a - b) < eps && Math.abs(b - c) < eps) {
    bySides = 'equilateral';
  } else if (Math.abs(a - b) < eps || Math.abs(a - c) < eps || Math.abs(b - c) < eps) {
    bySides = 'isosceles';
  }

  // Classification by angles
  const maxAngle = Math.max(angleA, angleB, angleC);
  let byAngles: 'acute' | 'right' | 'obtuse' = 'acute';
  if (Math.abs(maxAngle - 90) < 0.01) {
    byAngles = 'right';
  } else if (maxAngle > 90) {
    byAngles = 'obtuse';
  }

  const steps = [
    `Valid Triangle confirmed: a + b > c (${a} + ${b} > ${c})`,
    `Semi-perimeter s = (a + b + c) / 2 = ${s.toFixed(4)}`,
    `Area (Heron's Formula): A = √(s(s-a)(s-b)(s-c)) = ${area.toFixed(4)}`,
    `Law of Cosines Angle A: cos(A) = (b² + c² - a²) / 2bc ➔ A = ${angleA.toFixed(2)}°`,
    `Law of Cosines Angle B: cos(B) = (a² + c² - b²) / 2ac ➔ B = ${angleB.toFixed(2)}°`,
    `Angle C = 180° - A - B = ${angleC.toFixed(2)}°`,
    `Inscribed Circle Radius (Inradius): r = A / s = ${inradius.toFixed(4)}`,
    `Circumscribed Circle Radius (Circumradius): R = abc / 4A = ${circumradius.toFixed(4)}`
  ];

  return {
    sideA: Number(a.toFixed(4)),
    sideB: Number(b.toFixed(4)),
    sideC: Number(c.toFixed(4)),
    angleA: Number(angleA.toFixed(2)),
    angleB: Number(angleB.toFixed(2)),
    angleC: Number(angleC.toFixed(2)),
    area: Number(area.toFixed(4)),
    perimeter: Number(perimeter.toFixed(4)),
    semiPerimeter: Number(s.toFixed(4)),
    inradius: Number(inradius.toFixed(4)),
    circumradius: Number(circumradius.toFixed(4)),
    triangleType: { bySides, byAngles },
    heightA: Number(heightA.toFixed(4)),
    heightB: Number(heightB.toFixed(4)),
    heightC: Number(heightC.toFixed(4)),
    steps
  };
}

/**
 * Solves triangle given 2 sides and included angle (SAS)
 */
export function solveTriangleSAS(a: number, b: number, angleC_deg: number): TriangleResult | null {
  if (a <= 0 || b <= 0 || angleC_deg <= 0 || angleC_deg >= 180) return null;

  const angleC_rad = degToRad(angleC_deg);
  // c² = a² + b² - 2ab * cos(C)
  const cSquared = a * a + b * b - 2 * a * b * Math.cos(angleC_rad);
  if (cSquared <= 0) return null;
  const c = Math.sqrt(cSquared);

  return solveTriangleSSS(a, b, c);
}

export interface CircleSectorResult {
  radius: number;
  centralAngleDeg: number;
  centralAngleRad: number;
  arcLength: number; // s = r * θ
  sectorArea: number; // A = 0.5 * r² * θ
  chordLength: number; // c = 2 * r * sin(θ / 2)
  segmentArea: number; // Area of circular segment = Sector - Triangle
  perimeter: number; // Arc length + 2 * r
  steps: string[];
}

export function calculateCircleSector(radius: number, angleDeg: number): CircleSectorResult | null {
  if (radius <= 0 || angleDeg <= 0 || angleDeg > 360) return null;

  const angleRad = degToRad(angleDeg);
  const arcLength = radius * angleRad;
  const sectorArea = 0.5 * radius * radius * angleRad;
  const chordLength = 2 * radius * Math.sin(angleRad / 2);
  const triangleArea = 0.5 * radius * radius * Math.sin(angleRad);
  const segmentArea = sectorArea - triangleArea;
  const perimeter = arcLength + 2 * radius;

  const steps = [
    `Convert angle to radians: θ(rad) = ${angleDeg}° × (π / 180) = ${angleRad.toFixed(4)} rad`,
    `Arc Length: s = r × θ = ${radius} × ${angleRad.toFixed(4)} = ${arcLength.toFixed(4)}`,
    `Sector Area: A = ½ × r² × θ = ½ × ${radius}² × ${angleRad.toFixed(4)} = ${sectorArea.toFixed(4)}`,
    `Chord Length: c = 2r × sin(θ/2) = 2(${radius}) × sin(${(angleDeg / 2).toFixed(1)}°) = ${chordLength.toFixed(4)}`,
    `Segment Area: A_sector - A_triangle = ${sectorArea.toFixed(4)} - ${triangleArea.toFixed(4)} = ${segmentArea.toFixed(4)}`
  ];

  return {
    radius: Number(radius.toFixed(4)),
    centralAngleDeg: Number(angleDeg.toFixed(2)),
    centralAngleRad: Number(angleRad.toFixed(4)),
    arcLength: Number(arcLength.toFixed(4)),
    sectorArea: Number(sectorArea.toFixed(4)),
    chordLength: Number(chordLength.toFixed(4)),
    segmentArea: Number(segmentArea.toFixed(4)),
    perimeter: Number(perimeter.toFixed(4)),
    steps
  };
}

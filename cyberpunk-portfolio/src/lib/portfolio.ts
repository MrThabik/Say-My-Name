// src/lib/portfolio.ts
// Real data extracted from Thaseen Shabik N's résumé.

export const profile = {
  name: "THASEEN SHABIK N",
  role: "Electrical & Electronics Diploma Engineer",
  tagline: "FANUC robotics · VMC machining · high-pressure die casting — process-focused engineering from the shop floor.",
  location: "Dindigul, Tamil Nadu, India",
  email: "shabikthaseen514@gmail.com",
  phone: "+91 9095033435",
  bio: "Committed and process-focused Electrical & Electronics Diploma Engineer with practical shop-floor manufacturing experience at TVS Sundaram-Clayton. Proficient in shift operations management, programming and adjusting industrial FANUC robotic cells, and running high-precision Vertical Machining Centers (VMC). Complements core mechanical-electrical expertise with deep training in workplace 5S, safety management, modern digital tools, and generative AI workflow integration.",
  stats: [
    { value: "6-Axis", label: "FANUC Robots" },
    { value: "HPDC", label: "Die Casting Division" },
    { value: "78%", label: "DEEE — Distinction" },
  ],
};

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  stack: string[];
}

export const experience: Experience[] = [
  {
    company: "TVS Sundaram-Clayton Limited",
    role: "Shift In-Charge (OPED), Production Engineering Dept.",
    period: "May 30, 2025 — August 31, 2026",
    location: "Oragadam Plant, Chennai",
    bullets: [
      "Led day-to-day shift operations within the High-Pressure Die Casting (HPDC) division, meeting production targets while maintaining strict quality metrics.",
      "Conducted teach pendant operation, program optimization, and fine touch-up adjustments on 6-axis FANUC industrial robots.",
      "Supported Vertical Machining Center (VMC) operations, executing high-precision cutting, milling, and boring with tool offset adjustments.",
      "Resolved on-floor mechanical and setup stoppages in coordination with technicians, reducing line breakdown time.",
      "Enforced strict safety protocols, conducted daily shift toolbox talks, and maintained 5S discipline across the workspace.",
    ],
    stack: ["FANUC Robotics", "VMC / CNC", "HPDC", "5S", "Root Cause Analysis"],
  },
];

export interface Education {
  title: string;
  school: string;
  period: string;
  result: string;
}

export const education: Education[] = [
  {
    title: "Diploma in Electrical and Electronics Engineering (DEEE)",
    school: "Government Polytechnic College, Usilampatti, Madurai",
    period: "2022 — 2025",
    result: "78% — First Class with Distinction",
  },
  {
    title: "Secondary School Leaving Certificate (SSLC)",
    school: "Church of South India (CSI) Higher Secondary School",
    period: "2021 — 2022",
    result: "60%",
  },
];

export const skillGroups = [
  {
    group: "Robotics & Industrial Automation",
    items: ["FANUC Robot Operation", "Program Editing", "Teach Pendant Handling", "Touch-ups & Calibration"],
  },
  {
    group: "Machining & CNC",
    items: ["VMC Operation & Programming", "G-Code & M-Code Editing", "Tool Offset Corrections", "Boring · Milling · Cutting"],
  },
  {
    group: "Electrical & Design",
    items: ["SEE Electrical CAD", "Control Schematic Blueprints", "Single-Line Diagrams (SLD)", "Engineering Drawings"],
  },
  {
    group: "Shop-Floor Management",
    items: ["High-Pressure Die Casting (HPDC)", "5S Methodology", "Root Cause Analysis", "Cycle Time Reduction"],
  },
  {
    group: "Software & Collaboration",
    items: ["MS Excel / Word / PowerPoint", "MS Teams", "OneDrive", "SharePoint", "Generative AI (ChatGPT)"],
  },
];

export interface Project {
  title: string;
  summary: string;
  tech: string[];
}

export const projects: Project[] = [
  {
    title: "Hybrid Power System with Renewable Energy Resources",
    summary: "Designed and implemented a renewable energy demonstration model integrating solar PV panels and wind turbines. Focused on dual-source battery charging efficiency, inverter stabilization, and clean auxiliary load distribution.",
    tech: ["Solar PV", "Wind Turbines", "Battery Charging", "Inverter Stabilization"],
  },
];

export const languages = ["Tamil", "English"];

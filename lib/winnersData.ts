export interface Winner {
  rank: number;
  certId: string;
  name: string;
  school: string;
  title: string;
  track: string;
  medal: "Gold" | "Silver" | "Bronze" | "Finalist";
  summary?: string;
  pdfFilename: string;
  htmlFilename: string;
}

export const WINNERS_DATA: Winner[] = [
  {
    rank: 1,
    certId: "YPWC-2026-01",
    name: "Abdullah Shaker Abdullah",
    school: "STEM 6-October for Boys",
    title: "The Arrow in the Coffee Cup: How Entropy Gives Time Its Direction",
    track: "Thermodynamics",
    medal: "Gold",
    summary:
      "Explores Boltzmann's counting of microstates and the second law of thermodynamics to demonstrate how entropy dictates the irreversible arrow of time.",
    pdfFilename: "certificate_rank_01_Abdullah_Shaker_Abdullah.pdf",
    htmlFilename: "certificate_rank_01_Abdullah_Shaker_Abdullah.html",
  },
  {
    rank: 2,
    certId: "YPWC-2026-02",
    name: "Adham Mohamed Khairy",
    school: "STEM High School for Boys - 6th of October",
    title: "From Ketchup to Oobleck: Non-Newtonian Fluids and Their Behavior",
    track: "Fluid Mechanics",
    medal: "Silver",
    summary:
      "A deep dive into shear-thickening and shear-thinning fluids, demystifying fluid mechanics through everyday kitchen phenomena.",
    pdfFilename: "certificate_rank_02_Adham_Mohamed_Khairy.pdf",
    htmlFilename: "certificate_rank_02_Adham_Mohamed_Khairy.html",
  },
  {
    rank: 3,
    certId: "YPWC-2026-03",
    name: "Kenzy Raafat Eltablawy",
    school: "Menofia STEM School",
    title: "GPS & Relativity",
    track: "Physics in Daily Life",
    medal: "Bronze",
    summary:
      "Connecting Einstein's special and general relativity to modern satellite navigation and daily positioning accuracy.",
    pdfFilename: "certificate_rank_03_Kenzy_Raafat_Eltablawy.pdf",
    htmlFilename: "certificate_rank_03_Kenzy_Raafat_Eltablawy.html",
  },
  {
    rank: 4,
    certId: "YPWC-2026-04",
    name: "Somaya Yasser ElSawaf",
    school: "STEM Gharbiya",
    title: "The Physics of Microwaves: Why Metal Sparks and Water Dances Inside Your Kitchen",
    track: "Physics in Daily Life",
    medal: "Finalist",
    summary:
      "An intuitive breakdown of dielectric heating, electromagnetic waves, and molecular friction in kitchen microwave ovens.",
    pdfFilename: "certificate_rank_04_Somaya_Yasser_ElSawaf.pdf",
    htmlFilename: "certificate_rank_04_Somaya_Yasser_ElSawaf.html",
  },
  {
    rank: 5,
    certId: "YPWC-2026-05",
    name: "Malak",
    school: "Alexandria STEM School",
    title: "Can Sound Become Electricity? Turning Everyday Vibrations into Energy",
    track: "Waves and Sound",
    medal: "Finalist",
    summary:
      "Investigating piezoelectricity and acoustic energy harvesting to turn ambient ambient vibrations into electrical power.",
    pdfFilename: "certificate_rank_05_Malak.pdf",
    htmlFilename: "certificate_rank_05_Malak.html",
  },
  {
    rank: 6,
    certId: "YPWC-2026-06",
    name: "Abdelrahman Ehab Abdelrahman",
    school: "STEM October High-School for Boys",
    title: "Entropy and time reverse",
    track: "Thermodynamics",
    medal: "Finalist",
    summary:
      "Examines time-reversal symmetry in fundamental physical laws and contrasts it with thermodynamic entropy.",
    pdfFilename: "certificate_rank_06_Abdelrahman_Ehab_Abdelrahman.pdf",
    htmlFilename: "certificate_rank_06_Abdelrahman_Ehab_Abdelrahman.html",
  },
  {
    rank: 7,
    certId: "YPWC-2026-07",
    name: "Lina Eslam Reda Elanbary",
    school: "Ismailia STEM High School",
    title: "Heatwaves and urban heat island",
    track: "Thermodynamics",
    medal: "Finalist",
    summary:
      "Thermodynamic modeling of urban heat islands and radiation absorption in modern metropolitan environments.",
    pdfFilename: "certificate_rank_07_Lina_Eslam_Reda_Elanbary.pdf",
    htmlFilename: "certificate_rank_07_Lina_Eslam_Reda_Elanbary.html",
  },
  {
    rank: 8,
    certId: "YPWC-2026-08",
    name: "Saber Hussein Zahran",
    school: "STEM Alex",
    title: "Why Does Sound Travel Differently Through Different Materials?",
    track: "Waves and Sound",
    medal: "Finalist",
    summary:
      "Exploring density, elasticity, and stiffness across solid, liquid, and gas media to explain mechanical wave propagation.",
    pdfFilename: "certificate_rank_08_Saber_Hussein_Zahran.pdf",
    htmlFilename: "certificate_rank_08_Saber_Hussein_Zahran.html",
  },
  {
    rank: 9,
    certId: "YPWC-2026-09",
    name: "Omnia Emad",
    school: "Temai Elamdid Language School",
    title: "How can MRI and Magnet see inside the body And the physics behind MRI?",
    track: "Electricity and Magnetism",
    medal: "Finalist",
    summary:
      "The physics of nuclear magnetic resonance (NMR), superconducting magnets, and radiofrequency pulses in noninvasive medical imaging.",
    pdfFilename: "certificate_rank_09_Omnia_Emad.pdf",
    htmlFilename: "certificate_rank_09_Omnia_Emad.html",
  },
  {
    rank: 10,
    certId: "YPWC-2026-10",
    name: "Hager Yahia Zakaria Elsayed",
    school: "الرسمية المتميزة بالعاصمة الإدارية",
    title: "The concept of relative velocity",
    track: "Mechanics",
    medal: "Finalist",
    summary:
      "Distinguishing speed, velocity, and reference frames in classical mechanics through real-world motion scenarios.",
    pdfFilename: "certificate_rank_10_Hager_Yahia_Zakaria_Elsayed.pdf",
    htmlFilename: "certificate_rank_10_Hager_Yahia_Zakaria_Elsayed.html",
  },
];

export function findWinnerByIdOrRank(query: string | null | undefined): Winner | null {
  if (!query) return null;
  const clean = query.trim().toUpperCase();

  // Match by exact certId e.g. "YPWC-2026-01"
  const byCertId = WINNERS_DATA.find((w) => w.certId.toUpperCase() === clean);
  if (byCertId) return byCertId;

  // Match by partial e.g. "01", "1", "YPWC-01"
  const num = parseInt(clean.replace(/[^0-9]/g, ""), 10);
  if (!isNaN(num) && num >= 1 && num <= 10) {
    return WINNERS_DATA.find((w) => w.rank === num) || null;
  }

  // Match by name
  const byName = WINNERS_DATA.find((w) =>
    w.name.toLowerCase().includes(query.trim().toLowerCase())
  );
  if (byName) return byName;

  return null;
}

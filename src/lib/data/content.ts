import type { Chapter, Question, Subject, Topic } from "@/lib/types";

/* SAMPLE CONTENT. Chapter list follows the designs (MBOSE Class 10, NCERT Meghalaya edition) — confirm against the
   2026 MBOSE syllabus. Only "Ohm's law and resistance" has full sample content; every other topic uses placeholders
   ("[Your video]", "[Your notes]") until real videos, notes and questions are loaded. */

export const subjects: Subject[] = [
  { id: "maths", name: "Mathematics", short: "Maths", marksNote: "Maths is its own 80-mark paper. Geometry and mensuration carry 29 marks, algebra 27." },
  { id: "physics", name: "Physics", short: "Physics", marksNote: "Physics carries about 26 of the 80 theory marks in the Science paper." },
  { id: "chemistry", name: "Chemistry", short: "Chemistry", marksNote: "Chemistry carries about 26 of the 80 theory marks in the Science paper." },
];

type ChapterSeed = [id: string, title: string, bookNumber: number, topics: string[]];

const MATHS: ChapterSeed[] = [
  ["mat-real-numbers", "Real Numbers", 1, ["Real numbers: Euclid's division lemma", "The fundamental theorem of arithmetic", "Irrational numbers"]],
  ["mat-polynomials", "Polynomials", 2, ["Zeroes of a polynomial", "Zeroes and coefficients"]],
  ["mat-linear-equations", "Pair of Linear Equations in Two Variables", 3, ["Graphical method", "Substitution method", "Elimination method", "Word problems"]],
  ["mat-quadratic", "Quadratic Equations", 4, ["Standard form", "Solving by factorisation", "The quadratic formula", "Nature of roots: the discriminant", "Word problems"]],
  ["mat-ap", "Arithmetic Progressions", 5, ["What an AP is", "The nth term", "Sum of the first n terms"]],
  ["mat-triangles", "Triangles", 6, ["Similar figures", "Criteria for similarity", "Basic proportionality theorem"]],
  ["mat-coordinate", "Coordinate Geometry", 7, ["Distance formula", "Section formula"]],
  ["mat-trig-intro", "Introduction to Trigonometry", 8, ["Trigonometric ratios", "Ratios of specific angles", "Trigonometric identities"]],
  ["mat-trig-apps", "Some Applications of Trigonometry", 9, ["Angles of elevation and depression", "Heights and distances"]],
  ["mat-circles", "Circles", 10, ["Tangent to a circle", "Number of tangents from a point"]],
  ["mat-areas-circles", "Areas Related to Circles", 11, ["Sectors and segments", "Combinations of figures"]],
  ["mat-surface-volume", "Surface Areas and Volumes", 12, ["Surface area of combined solids", "Volume of combined solids", "Conversion of solids"]],
  ["mat-statistics", "Statistics", 13, ["Mean of grouped data", "Mode of grouped data", "Median of grouped data"]],
  ["mat-probability", "Probability", 14, ["Theoretical probability"]],
];

const PHYSICS: ChapterSeed[] = [
  ["phy-light", "Light: Reflection and Refraction", 9, ["Reflection by spherical mirrors", "Mirror formula and magnification", "Refraction of light", "Lenses and the lens formula"]],
  ["phy-human-eye", "The Human Eye and the Colourful World", 10, ["The human eye and its defects", "Refraction through a prism", "Scattering of light"]],
  ["phy-electricity", "Electricity", 11, ["Electric current and circuits", "Potential difference", "Ohm's law and resistance", "Resistors in series and parallel", "Heating effect and electric power"]],
  ["phy-magnetic", "Magnetic Effects of Electric Current", 12, ["Magnetic field and field lines", "Field due to a current-carrying conductor", "Force on a current-carrying conductor", "Domestic electric circuits"]],
];

const CHEMISTRY: ChapterSeed[] = [
  ["che-reactions", "Chemical Reactions and Equations", 1, ["Types of chemical reactions", "Balancing chemical equations", "Oxidation and reduction"]],
  ["che-acids", "Acids, Bases and Salts", 2, ["Properties of acids and bases", "The pH scale", "Salts in everyday life"]],
  ["che-metals", "Metals and Non-metals", 3, ["Physical properties", "Chemical properties of metals", "The reactivity series", "Ionic compounds"]],
  ["che-carbon", "Carbon and its Compounds", 4, ["Bonding in carbon", "Homologous series", "Chemical properties of carbon compounds", "Ethanol and ethanoic acid"]],
];

const SEEDS: Record<string, ChapterSeed[]> = { maths: MATHS, physics: PHYSICS, chemistry: CHEMISTRY };

export const chapters: Chapter[] = Object.entries(SEEDS).flatMap(([subjectId, list]) =>
  list.map(([id, title, bookNumber], i) => ({ id, subjectId: subjectId as Chapter["subjectId"], classLevel: 10 as const, order: i + 1, bookNumber, title }))
);

function slug(s: string) {
  return s.toLowerCase().replace(/['’:]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ---------- Full sample: Ohm's law and resistance ---------- */
const ohmQuiz: Question[] = [
  { id: "q1", type: "mcq", prompt: "Which instrument measures the current in a circuit?", options: ["Voltmeter", "Ammeter", "Galvanometer", "Rheostat"], answer: 1, marks: 1, reason: "An ammeter measures current. It is connected in series with the component.", links: [{ label: "Rewatch 0:00", href: "?step=watch", icon: "play" }] },
  { id: "q2", type: "mcq", prompt: "Ohm's law holds when which of these stays constant?", options: ["Current", "Voltage", "Temperature", "Length of the circuit"], answer: 2, marks: 1, reason: "Ohm's law applies at a constant temperature. Heating changes the resistance.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "q3", type: "mcq", prompt: "If the length of a wire is doubled, its resistance", options: ["halves", "doubles", "stays the same", "becomes four times"], answer: 1, marks: 1, reason: "Resistance is directly proportional to length, so doubling the length doubles R.", links: [{ label: "Rewatch 1:20", href: "?step=watch", icon: "play" }, { label: "Notes, section 3", href: "?step=read", icon: "notes" }] },
  { id: "q4", type: "mcq", prompt: "A 6 Ω resistor is connected across a 12 V battery. How much current flows through it?", options: ["0.5 A", "2 A", "6 A", "72 A"], answer: 1, marks: 1, hint: "Rearrange V = IR to find I.", reason: "Use I = V ÷ R. Here I = 12 V ÷ 6 Ω = 2 A.", links: [{ label: "Rewatch 4:35", href: "?step=watch", icon: "play" }, { label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "q5", type: "numeric", prompt: "A bulb draws 0.5 A from a 220 V supply. What is its resistance?", answer: 440, unit: "Ω", tolerance: 0, marks: 1, hint: "R = V ÷ I.", reason: "R = V ÷ I = 220 V ÷ 0.5 A = 440 Ω.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "q6", type: "mcq", prompt: "The slope of a V–I graph for a resistor gives its", options: ["current", "power", "resistance", "charge"], answer: 2, marks: 1, reason: "V = IR, so on a V–I graph the slope V ÷ I is the resistance.", links: [{ label: "Rewatch 7:05", href: "?step=watch", icon: "play" }] },
  { id: "q7", type: "mcq", prompt: "The SI unit of resistivity is", options: ["Ω", "Ω m", "Ω / m", "V A"], answer: 1, marks: 1, reason: "ρ = R A ÷ L, so its unit is Ω × m² ÷ m = Ω m.", links: [{ label: "Notes, section 4", href: "?step=read", icon: "notes" }] },
  { id: "q8", type: "numeric", prompt: "The potential difference across a 10 Ω resistor is 5 V. What current flows?", answer: 0.5, unit: "A", tolerance: 0.001, marks: 1, reason: "I = V ÷ R = 5 V ÷ 10 Ω = 0.5 A.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "q9", type: "mcq", prompt: "Which wire has the least resistance? All are copper.", options: ["Long and thin", "Long and thick", "Short and thin", "Short and thick"], answer: 3, marks: 1, reason: "Resistance rises with length and falls with area of cross-section.", links: [{ label: "Notes, section 3", href: "?step=read", icon: "notes" }] },
  { id: "q10", type: "short", prompt: "State Ohm's law. Name the quantity that stays constant.", model: "At a constant temperature, the current through a conductor is directly proportional to the potential difference across its ends (V = IR).", points: ["Current is directly proportional to potential difference", "Temperature stays constant", "Writes V = IR, or V ÷ I = constant"], marks: 2, reason: "Board answers need both the proportionality and the condition.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
];

const ohmsLaw: Omit<Topic, "id" | "chapterId" | "order"> = {
  title: "Ohm's law and resistance",
  minutes: 35,
  xp: 35,
  videos: [
    { id: "v1", title: "Resistance in daily life", duration: "6:10", sizeMB240: 13, moments: [{ t: "0:00", label: "Why wires get warm" }, { t: "3:20", label: "Good and poor conductors" }] },
    { id: "v2", title: "Ohm's law and the V–I graph", duration: "8:40", sizeMB240: 18, moments: [{ t: "0:00", label: "Recap: current and voltage" }, { t: "2:10", label: "What is resistance?" }, { t: "4:35", label: "Ohm's law, V = IR" }, { t: "7:05", label: "Reading a V–I graph" }] },
    { id: "v3", title: "Factors affecting resistance", duration: "7:25", sizeMB240: 15, moments: [{ t: "1:20", label: "Length of the wire" }, { t: "3:40", label: "Area of cross-section" }, { t: "5:30", label: "Material and resistivity" }] },
  ],
  notes: {
    pdfSizeMB: 1.2,
    formula: { name: "Key formula", tex: "V = I \\times R", fallback: "V = I × R", legend: [{ symbol: "V", meaning: "potential difference", unit: "volts" }, { symbol: "I", meaning: "current", unit: "amperes" }, { symbol: "R", meaning: "resistance", unit: "ohms, Ω" }] },
    sections: [
      { id: "s1", title: "Resistance", paragraphs: ["[Your notes, shown as text.] Resistance is the property of a conductor that opposes the flow of current through it.", "Its SI unit is the ohm (Ω). One ohm is the resistance of a conductor that lets 1 A flow when 1 V is applied across it."] },
      { id: "s2", title: "Ohm's law", paragraphs: ["At a constant temperature, the current through a conductor is directly proportional to the potential difference across its ends.", "So if the voltage doubles, the current doubles too. The constant of proportionality is the resistance, R."] },
      { id: "s3", title: "Factors affecting resistance", paragraphs: ["Resistance depends on the length of the wire, its area of cross-section, and the material it is made of.", "A longer wire has more resistance. A thicker wire has less."] },
      { id: "s4", title: "Resistivity", paragraphs: ["R = ρ L ÷ A, where ρ (rho) is the resistivity of the material.", "Resistivity is measured in ohm metres (Ω m). Metals have low resistivity; insulators like glass have very high resistivity."] },
    ],
  },
  simulation: { phetId: "ohms-law", title: "Ohm's Law simulation", sizeMB: 6, url: "https://phet.colorado.edu/sims/html/ohms-law/latest/ohms-law_en.html", tasks: ["Set the resistance to 500 Ω. Move the voltage slider. What happens to the current?", "Keep the resistance fixed and double the voltage. What happens to the current?", "Now keep the voltage fixed and increase the resistance. What happens to the current?"] },
  flashcards: [
    { id: "f1", front: "What does Ohm's law say?", back: "V = I × R", backNote: "At constant temperature, current is proportional to voltage" },
    { id: "f2", front: "What instrument measures current?", back: "An ammeter", backNote: "Connected in series" },
    { id: "f3", front: "What is the SI unit of resistance?", back: "The ohm (Ω)", backNote: "1 Ω = 1 volt per ampere" },
    { id: "f4", front: "What is the slope of a V–I graph?", back: "Resistance" },
    { id: "f5", front: "Doubling a wire's length does what to R?", back: "Doubles it" },
    { id: "f6", front: "Doubling a wire's area does what to R?", back: "Halves it" },
    { id: "f7", front: "Unit of resistivity?", back: "Ohm metre (Ω m)" },
    { id: "f8", front: "Formula for resistance from resistivity", back: "R = ρ L ÷ A" },
  ],
  quiz: ohmQuiz,
};


/* ---------- Sample quiz for the day-one topic: Euclid's division lemma ---------- */
const euclidQuiz: Question[] = [
  { id: "e1", type: "mcq", prompt: "Euclid's division lemma says that for positive integers a and b there are unique integers q and r with", options: ["a = bq + r, 0 ≤ r < b", "a = bq + r, 0 < r ≤ b", "a = bq − r, 0 ≤ r < b", "b = aq + r, 0 ≤ r < a"], answer: 0, marks: 1, reason: "The remainder r is at least 0 and always less than the divisor b.", links: [{ label: "Notes, section 1", href: "?step=read", icon: "notes" }] },
  { id: "e2", type: "numeric", prompt: "Divide 455 by 42 using the lemma. What is the remainder r?", answer: 35, tolerance: 0, marks: 1, hint: "Find the largest multiple of 42 that is not more than 455.", reason: "455 = 42 × 10 + 35, so r = 35.", links: [{ label: "Notes, section 1", href: "?step=read", icon: "notes" }] },
  { id: "e3", type: "mcq", prompt: "Using Euclid's algorithm, the HCF of 135 and 225 is", options: ["15", "45", "75", "90"], answer: 1, marks: 1, reason: "225 = 135 × 1 + 90, 135 = 90 × 1 + 45, 90 = 45 × 2 + 0. The last divisor is 45.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "e4", type: "numeric", prompt: "Find the HCF of 196 and 38220.", answer: 196, tolerance: 0, marks: 1, reason: "38220 = 196 × 195 + 0, so the remainder is 0 at the first step and the HCF is 196.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "e5", type: "mcq", prompt: "In a = bq + r, the remainder r can be", options: ["any integer", "any integer from 0 to b − 1", "any integer from 1 to b", "only 0 or 1"], answer: 1, marks: 1, reason: "0 ≤ r < b, so r is one of 0, 1, …, b − 1.", links: [{ label: "Notes, section 1", href: "?step=read", icon: "notes" }] },
  { id: "e6", type: "mcq", prompt: "Every positive odd integer can be written in the form", options: ["2q", "2q + 1", "3q", "4q"], answer: 1, marks: 1, reason: "Divide by 2: the remainder is 0 or 1. Odd numbers leave remainder 1, so they are 2q + 1.", links: [{ label: "Notes, section 3", href: "?step=read", icon: "notes" }] },
  { id: "e7", type: "numeric", prompt: "Find the HCF of 867 and 255.", answer: 51, tolerance: 0, marks: 1, hint: "Start with 867 = 255 × 3 + r.", reason: "867 = 255 × 3 + 102, 255 = 102 × 2 + 51, 102 = 51 × 2 + 0. The HCF is 51.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "e8", type: "mcq", prompt: "Euclid's division algorithm is used to find the", options: ["LCM of two numbers", "HCF of two positive integers", "square root of a number", "prime factors of a number"], answer: 1, marks: 1, reason: "Repeating the lemma until the remainder is 0 gives the HCF.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "e9", type: "mcq", prompt: "The HCF of 65 and 117 can be written as 65m − 117. What is m?", options: ["1", "2", "3", "4"], answer: 1, marks: 1, reason: "HCF(65, 117) = 13. So 65m − 117 = 13, 65m = 130 and m = 2.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
  { id: "e10", type: "short", prompt: "Use Euclid's division algorithm to find the HCF of 56 and 88. Show each step.", model: "88 = 56 × 1 + 32; 56 = 32 × 1 + 24; 32 = 24 × 1 + 8; 24 = 8 × 3 + 0. The remainder is 0, so the HCF is 8.", points: ["Each step written as a = bq + r", "Stops when the remainder is 0", "States the HCF is 8"], marks: 2, reason: "Board answers need every division step, not just the final number.", links: [{ label: "Notes, section 2", href: "?step=read", icon: "notes" }] },
];

/* Topic minutes from the designs where given; otherwise a sensible default. */
const MINUTES: Record<string, number> = { "Resistors in series and parallel": 40, "Heating effect and electric power": 35, "Real numbers: Euclid's division lemma": 10, "Types of chemical reactions": 12 };

function placeholderTopic(title: string): Omit<Topic, "id" | "chapterId" | "order"> {
  const minutes = MINUTES[title] ?? 30;
  return {
    title,
    minutes,
    xp: 35,
    videos: [{ id: "v1", title: `[Your video] ${title}`, duration: "8:00", sizeMB240: 17, moments: [{ t: "0:00", label: "Introduction" }] }],
    notes: { pdfSizeMB: 1, sections: [{ id: "s1", title, paragraphs: ["[Your notes, shown as text.] Notes for this topic appear here once they are added."] }] },
    simulation: undefined,
    flashcards: [{ id: "f1", front: `[Flashcard] ${title}`, back: "[Answer]" }],
    quiz: ohmQuiz.slice(0, 0),
  };
}

export const topics: Topic[] = Object.values(SEEDS).flatMap((list) =>
  list.flatMap(([chapterId, , , names]) =>
    names.map((title, i) => {
      const base = title === "Ohm's law and resistance" ? ohmsLaw : placeholderTopic(title);
      if (title === "Real numbers: Euclid's division lemma")
        Object.assign(base, {
          quiz: euclidQuiz,
          notes: { pdfSizeMB: 0.8, sections: [
            { id: "s1", title: "Euclid's division lemma", paragraphs: ["[Your notes, shown as text.] For positive integers a and b, there are unique integers q and r with a = bq + r and 0 ≤ r < b."] },
            { id: "s2", title: "Euclid's division algorithm", paragraphs: ["To find the HCF of c and d (c > d), divide c by d. Then divide d by the remainder, and keep going until the remainder is 0. The last divisor is the HCF."] },
            { id: "s3", title: "Using the lemma", paragraphs: ["Dividing by 2 shows every integer is 2q or 2q + 1, so odd numbers have the form 2q + 1."] },
          ] },
          flashcards: [
            { id: "f1", front: "State Euclid's division lemma", back: "a = bq + r, 0 ≤ r < b" },
            { id: "f2", front: "When does Euclid's algorithm stop?", back: "When the remainder is 0", backNote: "The last divisor is the HCF" },
          ],
        });
      return { ...base, id: `${chapterId}--${slug(title)}`, chapterId, order: i + 1 };
    })
  )
);

export const OHM_TOPIC_ID = "phy-electricity--ohms-law-and-resistance";
export const FIRST_TOPIC_ID = "mat-real-numbers--real-numbers-euclids-division-lemma";
export const DEMO_TOPIC_ID = OHM_TOPIC_ID;

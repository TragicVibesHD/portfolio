/** Professional experience, newest first. */

export interface Experience {
  role: string;
  organisation: string;
  location: string;
  dates: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

export const experience: Experience[] = [
  {
    role: 'Corporate Strategy Intern',
    organisation: 'Avasant',
    location: 'Remote',
    dates: '2025 · 3 months',
    summary:
      'Supported website content, digital media and case-study material for a global management consulting firm.',
    highlights: [
      'Maintained and updated website content using WordPress and Elementor Pro',
      'Edited video content with Adobe Premiere Pro for internal and client-facing use',
      'Assisted with case-study support, website asset recovery and presentation storylines',
      'Produced digital content supporting the corporate strategy team',
    ],
    tech: ['WordPress', 'Elementor Pro', 'Adobe Premiere Pro'],
  },
  {
    role: 'Intern',
    organisation: 'Ministry of Digital Transformation',
    location: 'Port of Spain, Trinidad and Tobago',
    dates: 'June 2024 – September 2024',
    summary:
      'Supported digital government services across web development, networking and service-design work.',
    highlights: [
      'Assisted with PHP and WordPress-based digital government systems',
      'Contributed to an Nginx reverse-proxy implementation',
      'Assisted with a virtual kiosk concept — Figma wireframes and Android Studio prototyping',
      'Worked with a mathematical model of facial-recognition false positives and negatives',
      'Helped set up temporary event networking: Ethernet cabling, crimping and router configuration',
      'Contributed to technical documentation',
    ],
    tech: ['PHP', 'WordPress', 'Nginx', 'Figma', 'Android Studio', 'Networking'],
  },
];

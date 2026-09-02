/**
 * Skills, grouped. No proficiency percentages — they are unverifiable
 * and experienced reviewers discount them.
 */

export interface SkillGroup {
  title: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Programming Languages',
    skills: ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'PHP', 'HTML', 'CSS'],
  },
  {
    title: 'Frameworks & Development Tools',
    skills: [
      'Flask',
      'FastAPI',
      'SQLAlchemy',
      'REST APIs',
      'Git',
      'GitHub',
      'WordPress',
      'Elementor',
      'Android Studio',
      'Figma',
      'Visual Studio Code',
    ],
  },
  {
    title: 'Data & Machine Learning',
    skills: [
      'pandas',
      'scikit-learn',
      'Data preprocessing',
      'Random Forest',
      'Model evaluation',
      'Data visualization',
      'Excel',
    ],
  },
  {
    title: 'Systems, Networking & Infrastructure',
    skills: [
      'Linux',
      'Ubuntu',
      'Nginx',
      'Reverse proxies',
      'Docker',
      'VirtualBox',
      'Wireshark',
      'Cisco Packet Tracer',
      'Ethernet cabling & crimping',
      'Router & network setup',
    ],
  },
  {
    title: 'Databases',
    skills: [
      'SQL',
      'Relational database design',
      'Database-driven applications',
      'Enterprise database concepts',
    ],
  },
  {
    title: 'Other Tools',
    skills: ['Adobe Premiere Pro', 'CapCut', 'Microsoft Office'],
  },
];

/** Clearly marked as in progress, never as completed. */
export const currentlyLearning: string[] = [
  'CompTIA A+ certification (in progress)',
  'Cloud platforms',
  'Backend development practices',
  'Deployment & containerization',
];

/** Compact career timeline — milestones only. Detail lives in Experience/Projects. */

export interface Milestone {
  date: string;
  title: string;
  description: string;
}

export const timeline: Milestone[] = [
  {
    date: '2022',
    title: 'Started BSc Computer Science',
    description: 'The University of the West Indies, St. Augustine Campus.',
  },
  {
    date: 'Jun – Sep 2024',
    title: 'Ministry of Digital Transformation internship',
    description:
      'Web systems, networking and a virtual kiosk concept for digital government services.',
  },
  {
    date: '2024 – 2025',
    title: 'Major academic projects',
    description:
      'Course Assessment Scheduler, Stroke Prediction Model, Internship Management Platform.',
  },
  {
    date: '2025',
    title: 'Avasant corporate strategy internship',
    description: 'Website content, digital media and case-study support over three months.',
  },
  {
    date: '2026',
    title: 'Completed required coursework',
    description: 'Finished all required courses for the BSc in Computer Science.',
  },
  {
    date: 'October 2026',
    title: 'Expected graduation',
    description: 'BSc Computer Science, The University of the West Indies.',
  },
  {
    date: 'Now',
    title: 'Seeking entry-level opportunities',
    description: 'Junior developer, graduate programme and internship-to-hire roles.',
  },
];

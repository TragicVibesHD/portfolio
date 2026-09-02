/** Education. GPA/honours intentionally omitted. */

export interface Education {
  institution: string;
  qualification: string;
  status: string;
  expectedGraduation: string;
  location: string;
  coursework: string[];
}

export const education: Education = {
  institution: 'The University of the West Indies, St. Augustine Campus',
  qualification: 'Bachelor of Science in Computer Science',
  status: 'All required coursework completed',
  expectedGraduation: 'October 2026',
  location: 'Trinidad and Tobago',
  coursework: [
    'Data Structures & Algorithms',
    'Software Engineering',
    'Database Systems',
    'Enterprise Database Systems',
    'Operating Systems',
    'Computer Networks',
    'Cloud Computing',
    'Data Analytics',
    'Big Data',
    'Mobile Development',
    'Web Development',
    'Computer Architecture',
  ],
};

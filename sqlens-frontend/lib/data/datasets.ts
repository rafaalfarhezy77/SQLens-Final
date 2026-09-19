export interface StudentRecord {
  id: number;
  name: string;
  major: string;
}

export interface ScoreRecord {
  id: number;
  student_id: number;
  course: string;
  score: number;
  grade: string;
}

export const MOCK_STUDENTS: StudentRecord[] = [
  { id: 1, name: "Andi Pratama", major: "Informatika" },
  { id: 2, name: "Budi Santoso", major: "Sistem Informasi" },
  { id: 3, name: "Citra Dewi", major: "Informatika" },
  { id: 4, name: "Dian Anggraini", major: "Teknik Komputer" },
];

export const MOCK_SCORES: ScoreRecord[] = [
  { id: 101, student_id: 1, course: "Basis Data", score: 90, grade: "A" },
  { id: 102, student_id: 2, course: "Basis Data", score: 85, grade: "A" },
  { id: 103, student_id: 3, course: "Basis Data", score: 70, grade: "B" },
  { id: 104, student_id: 4, course: "Basis Data", score: 65, grade: "C" },
];

export interface Patient {
  id: string;
  name: string;
  age: number;
  diagnoses: string[];
}

export const mockPatients: Patient[] = [
  { id: 'P001', name: 'Alice Tan', age: 32, diagnoses: ['Flu'] },
  { id: 'P002', name: 'Ben Lim', age: 45, diagnoses: ['Hypertension'] },
  { id: 'P003', name: 'Cheryl Ong', age: 29, diagnoses: [] },
];

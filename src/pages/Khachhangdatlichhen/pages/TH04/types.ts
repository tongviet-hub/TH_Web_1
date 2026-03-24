export type FieldType = 'String' | 'Number' | 'Date';

export interface BookItem {
  id: number;
  year: number;
  title: string;
  lastIndex: number;
}

export interface FieldItem {
  id: number;
  name: string;
  type: FieldType;
}

export interface DecisionItem {
  id: number;
  decisionNumber: string;
  issuedDate: string;
  excerpt: string;
  bookId: number;
  lookupCount: number;
}

export type DynamicFieldValue = string | number | null;

export interface DiplomaItem {
  id: number;
  bookId: number;
  decisionId: number;
  bookNumber: string;
  serialNumber: string;
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  dynamicData: Record<string, DynamicFieldValue>;
}

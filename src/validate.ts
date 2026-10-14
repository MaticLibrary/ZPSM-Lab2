import type { Subject, User } from './data.js';

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

function requireString(record: Record<string, unknown>, field: string, label = field): string {
  const value = record[field];
  if (typeof value !== 'string') {
    throw new TypeError(`${label} must be a string.`);
  }
  return value;
}

function requireFiniteNumber(record: Record<string, unknown>, field: string, label = field): number {
  const value = record[field];
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number.`);
  }
  return value;
}

function toSubject(input: unknown, index: number): Subject {
  if (!isRecord(input)) {
    throw new TypeError(`subjects[${index}] must be an object.`);
  }

  return {
    name: requireString(input, 'name', `subjects[${index}].name`),
    grade: requireFiniteNumber(input, 'grade', `subjects[${index}].grade`),
    weight: requireFiniteNumber(input, 'weight', `subjects[${index}].weight`),
  };
}

export function toUser(input: unknown): User {
  if (!isRecord(input)) {
    throw new TypeError('User data must be an object.');
  }

  const subjectsInput = input.subjects;
  if (!Array.isArray(subjectsInput)) {
    throw new TypeError('subjects must be an array.');
  }

  return {
    firstName: requireString(input, 'firstName'),
    lastName: requireString(input, 'lastName'),
    subjects: subjectsInput.map((subject: unknown, index: number) => toSubject(subject, index)),
  };
}

export function toUsers(input: unknown): User[] {
  if (!Array.isArray(input)) {
    throw new TypeError('Student data must be an array.');
  }

  return input.map((user: unknown, index: number) => {
    try {
      return toUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new TypeError(`students[${index}]: ${error.message}`, { cause: error });
      }
      throw error;
    }
  });
}

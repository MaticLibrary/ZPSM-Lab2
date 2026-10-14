import { readFileSync, writeFileSync } from 'node:fs';
import type { User } from './data.js';

export function save(data: User | User[], file: string): void {
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

export function load(file: string): unknown {
  const contents = readFileSync(file, 'utf8');
  try {
    return JSON.parse(contents);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new SyntaxError(`Invalid JSON in "${file}": ${error.message}`, { cause: error });
    }
    throw error;
  }
}

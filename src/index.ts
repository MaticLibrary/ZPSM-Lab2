import { fileURLToPath } from 'node:url';
import _ from 'lodash';
import { users } from './data.js';
import type { Subject } from './data.js';
import type { User } from './data.js';
import { getMails } from './mails.js';
import { load, save } from './storage.js';
import { toUsers } from './validate.js';

export function weightedAverage(user: User): number {
  const { subjects } = user;
  const { weighted, weights } = subjects.reduce(
    (totals, { grade, weight }) => ({
      weighted: totals.weighted + grade * weight,
      weights: totals.weights + weight,
    }),
    { weighted: 0, weights: 0 },
  );

  if (weights === 0) {
    throw new RangeError('Cannot calculate a weighted average when the total weight is zero.');
  }

  return weighted / weights;
}

export function printSummary(user: User): void {
  const { firstName, lastName, subjects } = user;
  const average = weightedAverage(user);
  console.log(`${firstName} ${lastName} - weighted average: ${average.toFixed(2)}`);
}

function printSubjectSearch(label: string, weight: number, subject: Subject | undefined): void {
  const result = subject?.name ?? `No subject found with weight ${weight}.`;
  console.log(`${label} (weight ${weight}): ${result}`);
}

printSummary(users[0]);

const nativeMatch = users[0].subjects.find((subject) => subject.weight === 1);
printSubjectSearch('Array.find', 1, nativeMatch);
const lodashMatch = _.find(users[0].subjects, (subject) => subject.weight === 1);
printSubjectSearch('Lodash _.find', 1, lodashMatch);

const missingNativeMatch = users[0].subjects.find((subject) => subject.weight === 7);
printSubjectSearch('Array.find', 7, missingNativeMatch);
const missingLodashMatch = _.find(users[0].subjects, (subject) => subject.weight === 7);
printSubjectSearch('Lodash _.find', 7, missingLodashMatch);

const collections: unknown[] = [
  {},
  15,
  'hello@test.pl',
  null,
  ['aaa', 'bbb', 5],
  'admin@gmail.com',
  undefined,
  'a34@yahoo.com',
  '321@a',
  '321.pl',
];
const originalCollections = [...collections];
const sortedMails = getMails(collections);
console.log('Sorted email addresses:', sortedMails);
console.log('Collections unchanged:', JSON.stringify(collections) === JSON.stringify(originalCollections));

const dataFile = fileURLToPath(new URL('../data.json', import.meta.url));
save(users, dataFile);
const loadedData = load(dataFile);
console.log('Loaded JSON data:', loadedData);
const validatedUsers = toUsers(loadedData);
const rankedUsers = [...validatedUsers].sort((left, right) => weightedAverage(right) - weightedAverage(left));
console.log('Students ranked by weighted average (descending):');
for (const rankedUser of rankedUsers) {
  printSummary(rankedUser);
}

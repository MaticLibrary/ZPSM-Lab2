import { z } from 'zod';
import type { ZodError } from 'zod';
import type { User } from './data.js';

const subjectSchema = z.object({
  name: z.string(),
  grade: z.number().finite(),
  weight: z.number().finite(),
});

const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  subjects: z.array(subjectSchema),
});

function validationError(error: ZodError, root = ''): TypeError {
  const message = error.issues
    .map(({ path, message }) => {
      const field = path.reduce<string>(
        (result, part) =>
          typeof part === 'number'
            ? `${result}[${String(part)}]`
            : result
              ? `${result}.${String(part)}`
              : String(part),
        root,
      );
      return `${field || 'data'}: ${message}`;
    })
    .join('; ');
  return new TypeError(message, { cause: error });
}

export function toUser(input: unknown): User {
  const result = userSchema.safeParse(input);
  if (!result.success) {
    throw validationError(result.error);
  }
  return result.data;
}

export function toUsers(input: unknown): User[] {
  const result = z.array(userSchema).safeParse(input);
  if (!result.success) {
    throw validationError(result.error, 'students');
  }
  return result.data;
}

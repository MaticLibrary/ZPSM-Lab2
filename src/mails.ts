const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function getMails(collections: unknown[]): string[] {
  const strings: string[] = [];
  for (const item of collections) {
    if (typeof item === 'string') {
      strings.push(item);
    }
  }
  console.log('Strings:', strings);

  const matchedMails = strings.filter((item) => emailPattern.test(item));
  console.log('Matching email addresses:', matchedMails);

  return [...matchedMails].sort();
}

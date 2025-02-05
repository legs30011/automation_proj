export function generateRandomName(): string {
  const names = ['test-1', 'test-2', 'test-3', 'test-33', 'test-5', 'test-8', 'test-6', 'test-7'];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex] + Math.floor(Math.random() * 1000);
}
export function generateRandomProjectNumber() {
  return Math.floor(Math.random() * 100);
}

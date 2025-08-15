/**
 * Simple tests without mocks
 */

describe('Simple Tests', () => {
  test('Basic arithmetic works', () => {
    expect(2 + 2).toBe(4);
    expect(10 - 5).toBe(5);
    expect(3 * 4).toBe(12);
    expect(15 / 3).toBe(5);
  });

  test('String operations work', () => {
    expect('Hello' + ' ' + 'World').toBe('Hello World');
    expect('Test'.length).toBe(4);
    expect('Jest'.toUpperCase()).toBe('JEST');
  });

  test('Array operations work', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers.length).toBe(5);
    expect(numbers[0]).toBe(1);
    expect(numbers.slice(1, 3)).toEqual([2, 3]);
  });

  test('Object operations work', () => {
    const user = { name: 'John', age: 30 };
    expect(user.name).toBe('John');
    expect(user.age).toBe(30);
    expect(Object.keys(user)).toEqual(['name', 'age']);
  });

  test('Async operations work', async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const start = Date.now();
    await delay(10);
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(5);
  });
}); 
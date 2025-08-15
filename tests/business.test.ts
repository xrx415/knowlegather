/**
 * Business logic tests without mocks
 */

// Simple business functions for testing
function calculateTotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatCurrency(amount: number, currency: string = 'PLN'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

function findDuplicates<T>(array: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();
  
  for (const item of array) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

describe('Business Logic Tests', () => {
  describe('calculateTotal', () => {
    test('calculates total for single item', () => {
      const items = [{ price: 10, quantity: 2 }];
      expect(calculateTotal(items)).toBe(20);
    });

    test('calculates total for multiple items', () => {
      const items = [
        { price: 5, quantity: 3 },
        { price: 10, quantity: 2 },
        { price: 2.5, quantity: 4 }
      ];
      expect(calculateTotal(items)).toBe(15 + 20 + 10);
    });

    test('returns 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });
  });

  describe('validateEmail', () => {
    test('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('simple@test.org')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatCurrency', () => {
    test('formats currency with default PLN', () => {
      expect(formatCurrency(10.5)).toBe('10.50 PLN');
      expect(formatCurrency(0)).toBe('0.00 PLN');
      expect(formatCurrency(123.456)).toBe('123.46 PLN');
    });

    test('formats currency with custom currency', () => {
      expect(formatCurrency(25.99, 'USD')).toBe('25.99 USD');
      expect(formatCurrency(100, 'EUR')).toBe('100.00 EUR');
    });
  });

  describe('findDuplicates', () => {
    test('finds duplicates in array', () => {
      const numbers = [1, 2, 3, 2, 4, 1, 5];
      const duplicates = findDuplicates(numbers);
      expect(duplicates).toContain(1);
      expect(duplicates).toContain(2);
      expect(duplicates.length).toBe(2);
    });

    test('returns empty array for no duplicates', () => {
      const unique = [1, 2, 3, 4, 5];
      expect(findDuplicates(unique)).toEqual([]);
    });

    test('handles empty array', () => {
      expect(findDuplicates([])).toEqual([]);
    });

    test('works with strings', () => {
      const words = ['apple', 'banana', 'apple', 'cherry', 'banana'];
      expect(findDuplicates(words)).toEqual(['apple', 'banana']);
    });
  });
}); 
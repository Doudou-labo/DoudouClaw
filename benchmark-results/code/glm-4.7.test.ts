/**
 * Comprehensive test suite for IntervalTree implementation
 */

import { IntervalTree } from './glm-4.7.js';

// Simple test framework
class TestRunner {
  private passed: number = 0;
  private failed: number = 0;
  private tests: Array<{ name: string; passed: boolean; error?: string }> = [];

  test(name: string, fn: () => void | Promise<void>): void {
    try {
      fn();
      this.passed++;
      this.tests.push({ name, passed: true });
      console.log(`✓ ${name}`);
    } catch (error) {
      this.failed++;
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.tests.push({ name, passed: false, error: errorMsg });
      console.error(`✗ ${name}`);
      console.error(`  Error: ${errorMsg}`);
    }
  }

  assertEqual<T>(actual: T, expected: T, message?: string): void {
    if (typeof actual === 'bigint' && typeof expected === 'bigint') {
      if (actual !== expected) {
        throw new Error(
          message || `Expected ${expected}n but got ${actual}n`
        );
      }
      return;
    }
    if (Array.isArray(actual) && Array.isArray(expected)) {
      if (actual.length !== expected.length) {
        throw new Error(
          message || `Expected array of length ${expected.length} but got ${actual.length}`
        );
      }
      for (let i = 0; i < actual.length; i++) {
        this.assertEqual(actual[i], expected[i], message);
      }
      return;
    }
    const strActual = JSON.stringify(actual, (key, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value
    );
    const strExpected = JSON.stringify(expected, (key, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value
    );
    if (strActual !== strExpected) {
      throw new Error(
        message || `Expected ${strExpected} but got ${strActual}`
      );
    }
  }

  assertTrue(value: boolean, message?: string): void {
    if (!value) {
      throw new Error(message || 'Expected true but got false');
    }
  }

  assertFalse(value: boolean, message?: string): void {
    if (value) {
      throw new Error(message || 'Expected false but got true');
    }
  }

  assertThrows(fn: () => void, expectedMessage?: string): void {
    let thrown = false;
    let actualMessage = '';
    try {
      fn();
    } catch (error) {
      thrown = true;
      actualMessage = error instanceof Error ? error.message : String(error);
    }
    if (!thrown) {
      throw new Error('Expected function to throw an error');
    }
    if (expectedMessage && !actualMessage.includes(expectedMessage)) {
      throw new Error(
        `Expected error message to include "${expectedMessage}" but got "${actualMessage}"`
      );
    }
  }

  async run(): Promise<void> {
    console.log('\n=== Test Summary ===');
    console.log(`Passed: ${this.passed}`);
    console.log(`Failed: ${this.failed}`);
    console.log(`Total: ${this.passed + this.failed}`);

    if (this.failed > 0) {
      console.log('\nFailed tests:');
      this.tests
        .filter(t => !t.passed)
        .forEach(t => {
          console.log(`  - ${t.name}`);
          if (t.error) {
            console.log(`    ${t.error}`);
          }
        });
      process.exit(1);
    } else {
      console.log('\n✓ All tests passed!');
    }
  }
}

const runner = new TestRunner();

// Test 1: Basic insertion
runner.test('insert single interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  runner.assertEqual(tree.getSize(), 1);
  runner.assertFalse(tree.isEmpty());
});

// Test 2: Insert invalid interval (low > high)
runner.test('insert invalid interval throws error', () => {
  const tree = new IntervalTree<number>();
  runner.assertThrows(() => tree.insert(10, 5), 'low must be <= high');
});

// Test 3: Insert multiple intervals
runner.test('insert multiple intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(1, 3);
  runner.assertEqual(tree.getSize(), 3);
});

// Test 4: Search point in empty tree
runner.test('search empty tree returns empty array', () => {
  const tree = new IntervalTree<number>();
  const result = tree.search(7);
  runner.assertEqual(result.length, 0);
});

// Test 5: Search point in single interval
runner.test('search point in single interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  const result = tree.search(7);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 5);
  runner.assertEqual(result[0].high, 10);
});

// Test 6: Search point at interval boundary
runner.test('search point at interval boundaries', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  const resultLow = tree.search(5);
  const resultHigh = tree.search(10);
  runner.assertEqual(resultLow.length, 1);
  runner.assertEqual(resultHigh.length, 1);
});

// Test 7: Search point outside interval
runner.test('search point outside interval returns empty', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  const result = tree.search(15);
  runner.assertEqual(result.length, 0);
});

// Test 8: Search point with multiple overlapping intervals
runner.test('search point with multiple overlapping intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(7, 15);
  tree.insert(3, 8);
  const result = tree.search(7);
  runner.assertEqual(result.length, 3);
});

// Test 9: Search point with non-overlapping intervals
runner.test('search point with non-overlapping intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(1, 5);
  tree.insert(10, 15);
  tree.insert(20, 25);
  const result = tree.search(7);
  runner.assertEqual(result.length, 0);
});

// Test 10: Remove single interval
runner.test('remove single interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  const removed = tree.remove(5, 10);
  runner.assertTrue(removed);
  runner.assertEqual(tree.getSize(), 0);
  runner.assertTrue(tree.isEmpty());
});

// Test 11: Remove non-existent interval
runner.test('remove non-existent interval returns false', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  const removed = tree.remove(15, 20);
  runner.assertFalse(removed);
  runner.assertEqual(tree.getSize(), 1);
});

// Test 12: Remove one of multiple intervals
runner.test('remove one of multiple intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(25, 30);
  const removed = tree.remove(15, 20);
  runner.assertTrue(removed);
  runner.assertEqual(tree.getSize(), 2);
  const result = tree.search(17);
  runner.assertEqual(result.length, 0);
});

// Test 13: Clear all intervals
runner.test('clear all intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.clear();
  runner.assertEqual(tree.getSize(), 0);
  runner.assertTrue(tree.isEmpty());
});

// Test 14: Get all intervals
runner.test('get all intervals in order', () => {
  const tree = new IntervalTree<number>();
  tree.insert(15, 20);
  tree.insert(5, 10);
  tree.insert(25, 30);
  tree.insert(10, 15);
  const all = tree.getAll();
  runner.assertEqual(all.length, 4);
  runner.assertEqual(all[0].low, 5);
  runner.assertEqual(all[1].low, 10);
  runner.assertEqual(all[2].low, 15);
  runner.assertEqual(all[3].low, 25);
});

// Test 15: Search interval overlapping
runner.test('searchInterval finds overlapping intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(8, 12);
  const result = tree.searchInterval(7, 9);
  runner.assertEqual(result.length, 2); // [5,10] and [8,12]
});

// Test 16: Search exact interval
runner.test('searchInterval with exact match', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  const result = tree.searchInterval(5, 10);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 5);
  runner.assertEqual(result[0].high, 10);
});

// Test 17: Large number of insertions
runner.test('insert large number of intervals', () => {
  const tree = new IntervalTree<number>();
  const count = 1000;
  for (let i = 0; i < count; i++) {
    tree.insert(i, i + 10);
  }
  runner.assertEqual(tree.getSize(), count);
});

// Test 18: Search in large tree
runner.test('search in large tree', () => {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 1000; i++) {
    tree.insert(i, i + 10);
  }
  const result = tree.search(500);
  runner.assertTrue(result.length > 0);
  runner.assertTrue(result.length <= 11); // At most 11 intervals can contain point 500
});

// Test 19: Remove all intervals one by one
runner.test('remove all intervals one by one', () => {
  const tree = new IntervalTree<number>();
  const intervals: Array<[number, number]> = [];
  for (let i = 0; i < 100; i++) {
    const low = i * 2;
    const high = low + 1;
    intervals.push([low, high]);
    tree.insert(low, high);
  }
  for (const [low, high] of intervals) {
    runner.assertTrue(tree.remove(low, high));
  }
  runner.assertEqual(tree.getSize(), 0);
});

// Test 20: Negative intervals
runner.test('handle negative intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(-10, -5);
  tree.insert(-3, 0);
  tree.insert(2, 5);
  const result = tree.search(-4);
  // Point -4 is NOT in interval [-10, -5] because -4 > -5
  // Point -4 is NOT in interval [-3, 0] because -4 < -3
  // So result should be empty
  runner.assertEqual(result.length, 0);
});

// Test 21: Duplicate intervals
runner.test('handle duplicate intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(5, 10);
  tree.insert(5, 10);
  runner.assertEqual(tree.getSize(), 3);
  const result = tree.search(7);
  runner.assertEqual(result.length, 3);
});

// Test 22: Zero-length interval
runner.test('handle zero-length interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 5);
  const result = tree.search(5);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 5);
  runner.assertEqual(result[0].high, 5);
});

// Test 23: Very large intervals
runner.test('handle very large intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(-1000000, 1000000);
  tree.insert(1000001, 2000000);
  const result = tree.search(0);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, -1000000);
  runner.assertEqual(result[0].high, 1000000);
});

// Test 24: Remove and search
runner.test('remove interval and search', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(8, 12);
  tree.remove(8, 12);
  const result = tree.search(9);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 5);
});

// Test 25: Search after multiple removals
runner.test('search after multiple removals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(10, 15);
  tree.insert(15, 20);
  tree.insert(20, 25);
  tree.remove(10, 15);
  tree.remove(20, 25);
  const result = tree.search(12);
  runner.assertEqual(result.length, 0);
});

// Test 26: BigInt support
runner.test('handle BigInt intervals', () => {
  const tree = new IntervalTree<bigint>();
  tree.insert(5n, 10n);
  tree.insert(15n, 20n);
  const result = tree.search(7n);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 5n);
  runner.assertEqual(result[0].high, 10n);
});

// Test 27: Edge case: single point at zero
runner.test('search point at zero', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 0);
  tree.insert(-5, 5);
  const result = tree.search(0);
  runner.assertEqual(result.length, 2);
});

// Test 28: Overlapping at boundaries
runner.test('intervals touching at boundaries', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 5);
  tree.insert(5, 10);
  tree.insert(10, 15);
  const result = tree.search(5);
  runner.assertEqual(result.length, 2); // [0,5] and [5,10]
});

// Test 29: SearchInterval with no matches
runner.test('searchInterval with no overlapping intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(1, 5);
  tree.insert(10, 15);
  tree.insert(20, 25);
  const result = tree.searchInterval(6, 9);
  runner.assertEqual(result.length, 0);
});

// Test 30: SearchInterval fully contained
runner.test('searchInterval fully contained within tree interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 100);
  tree.insert(150, 200);
  const result = tree.searchInterval(25, 75);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, 0);
  runner.assertEqual(result[0].high, 100);
});

// Test 31: Stress test: many overlapping intervals
runner.test('many overlapping intervals', () => {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 100; i++) {
    tree.insert(i, i + 50);
  }
  const result = tree.search(75);
  // Point 75 is in intervals [25, 75] through [75, 125]
  // That's 51 intervals (25, 26, 27, ..., 75)
  runner.assertEqual(result.length, 51);
});

// Test 32: Remove middle interval
runner.test('remove middle interval from three', () => {
  const tree = new IntervalTree<number>();
  tree.insert(1, 5);
  tree.insert(10, 15);
  tree.insert(20, 25);
  const removed = tree.remove(10, 15);
  runner.assertTrue(removed);
  runner.assertEqual(tree.getSize(), 2);
  const all = tree.getAll();
  runner.assertEqual(all.length, 2);
  runner.assertEqual(all[0].low, 1);
  runner.assertEqual(all[1].low, 20);
});

// Test 33: Remove root
runner.test('remove root interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(10, 15);
  tree.insert(5, 10);
  tree.insert(15, 20);
  const removed = tree.remove(10, 15);
  runner.assertTrue(removed);
  runner.assertEqual(tree.getSize(), 2);
  const result = tree.search(12);
  runner.assertEqual(result.length, 0);
});

// Test 34: Insert and remove same interval multiple times
runner.test('insert and remove same interval repeatedly', () => {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 10; i++) {
    tree.insert(5, 10);
    runner.assertEqual(tree.getSize(), 1);
    runner.assertTrue(tree.remove(5, 10));
    runner.assertEqual(tree.getSize(), 0);
  }
});

// Test 35: Search point in all intervals
runner.test('search point returns all containing intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 100);
  tree.insert(10, 90);
  tree.insert(20, 80);
  tree.insert(30, 70);
  const result = tree.search(50);
  runner.assertEqual(result.length, 4);
});

// Test 36: Clear and reuse
runner.test('clear and reuse tree', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.clear();
  runner.assertEqual(tree.getSize(), 0);
  tree.insert(1, 5);
  tree.insert(10, 15);
  runner.assertEqual(tree.getSize(), 2);
  const result = tree.search(12);
  runner.assertEqual(result.length, 1);
});

// Test 37: Search with negative query
runner.test('search with negative point', () => {
  const tree = new IntervalTree<number>();
  tree.insert(-10, -5);
  tree.insert(-3, 0);
  const result = tree.search(-7);
  runner.assertEqual(result.length, 1);
  runner.assertEqual(result[0].low, -10);
});

// Test 38: Insert intervals in reverse order
runner.test('insert intervals in descending order', () => {
  const tree = new IntervalTree<number>();
  for (let i = 100; i >= 0; i--) {
    tree.insert(i, i + 5);
  }
  runner.assertEqual(tree.getSize(), 101);
  const result = tree.search(50);
  runner.assertTrue(result.length > 0);
});

// Test 39: SearchInterval adjacent intervals
runner.test('searchInterval finds adjacent intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 10);
  tree.insert(10, 20);
  const result = tree.searchInterval(5, 15);
  runner.assertEqual(result.length, 2);
});

// Test 40: Very narrow search interval
runner.test('searchInterval with narrow range', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 10);
  tree.insert(5, 15);
  tree.insert(10, 20);
  const result = tree.searchInterval(9.5, 10.5);
  runner.assertEqual(result.length, 3); // All three overlap with [9.5, 10.5]
});

// Test 41: Empty tree after all removals
runner.test('verify empty tree behavior', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.remove(5, 10);
  runner.assertTrue(tree.isEmpty());
  runner.assertEqual(tree.search(7).length, 0);
  runner.assertEqual(tree.searchInterval(0, 20).length, 0);
  runner.assertEqual(tree.getAll().length, 0);
});

// Test 42: Interval with floating point
runner.test('handle floating point intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(1.5, 2.5);
  tree.insert(2.0, 3.0);
  const result = tree.search(2.2);
  runner.assertEqual(result.length, 2);
});

// Test 43: Search after clear
runner.test('search returns empty after clear', () => {
  const tree = new IntervalTree<number>();
  tree.insert(1, 100);
  tree.insert(50, 150);
  tree.clear();
  runner.assertEqual(tree.search(75).length, 0);
  runner.assertEqual(tree.searchInterval(0, 200).length, 0);
});

// Test 44: Remove then insert same interval
runner.test('remove then insert same interval', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.remove(5, 10);
  runner.assertEqual(tree.getSize(), 0);
  tree.insert(5, 10);
  runner.assertEqual(tree.getSize(), 1);
  const result = tree.search(7);
  runner.assertEqual(result.length, 1);
});

// Test 45: Multiple removes
runner.test('multiple removes', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(25, 30);
  runner.assertTrue(tree.remove(5, 10));
  runner.assertFalse(tree.remove(5, 10)); // Already removed
  runner.assertTrue(tree.remove(25, 30));
  runner.assertEqual(tree.getSize(), 1);
});

// Test 46: Get all returns sorted intervals
runner.test('getAll returns intervals sorted by low', () => {
  const tree = new IntervalTree<number>();
  tree.insert(50, 60);
  tree.insert(10, 20);
  tree.insert(30, 40);
  tree.insert(70, 80);
  const all = tree.getAll();
  runner.assertEqual(all.length, 4);
  runner.assertTrue(all[0].low < all[1].low);
  runner.assertTrue(all[1].low < all[2].low);
  runner.assertTrue(all[2].low < all[3].low);
});

// Test 47: SearchInterval with query larger than all intervals
runner.test('searchInterval with query covering all intervals', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(15, 20);
  tree.insert(25, 30);
  const result = tree.searchInterval(0, 100);
  runner.assertEqual(result.length, 3);
});

// Test 48: Zero-length search interval
runner.test('searchInterval with zero-length range', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(8, 12);
  const result = tree.searchInterval(9, 9);
  runner.assertEqual(result.length, 2);
});

// Test 49: Intervals with same start
runner.test('handle intervals with same start point', () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10);
  tree.insert(5, 15);
  tree.insert(5, 20);
  const result = tree.search(7);
  runner.assertEqual(result.length, 3);
});

// Test 50: Intervals with same end
runner.test('handle intervals with same end point', () => {
  const tree = new IntervalTree<number>();
  tree.insert(0, 10);
  tree.insert(5, 10);
  tree.insert(8, 10);
  const result = tree.search(9);
  runner.assertEqual(result.length, 3);
});

// Run all tests
runner.run().catch(console.error);
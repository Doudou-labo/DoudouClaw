/**
 * Unit tests for IntervalTree implementation
 */

import assert from 'assert';
import IntervalTree, { Interval } from './glm-4.7-flash';

describe('IntervalTree', () => {
  let tree: IntervalTree<number>;

  beforeEach(() => {
    tree = new IntervalTree<number>();
  });

  describe('Basic Operations', () => {
    it('should insert and retrieve intervals', () => {
      tree.insert(1, 5, 10);
      tree.insert(10, 20, 30);
      tree.insert(15, 25, 40);

      const result = tree.search(18);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].value, 30);
    });

    it('should find intervals containing point', () => {
      tree.insert(1, 10, 1);
      tree.insert(5, 15, 2);
      tree.insert(12, 20, 3);
      tree.insert(25, 30, 4);

      // Point in multiple intervals
      const result = tree.search(7);
      assert.strictEqual(result.length, 2);
      const values = result.map(i => i.value).sort((a, b) => a - b);
      assert.deepStrictEqual(values, [1, 2]);

      // Point in single interval
      const result2 = tree.search(5);
      assert.strictEqual(result2.length, 1);
      assert.strictEqual(result2[0].value, 2);

      // Point in no interval
      const result3 = tree.search(50);
      assert.strictEqual(result3.length, 0);
    });

    it('should handle empty tree', () => {
      assert.strictEqual(tree.search(10).length, 0);
      assert.strictEqual(tree.findByStart(10), null);
      assert.strictEqual(tree.findByEnd(10), null);
    });
  });

  describe('Insert Operations', () => {
    it('should insert intervals with overlapping values', () => {
      tree.insert(1, 10, 100);
      tree.insert(1, 10, 200);
      tree.insert(1, 10, 300);

      assert.strictEqual(tree.size, 3);
      assert.strictEqual(tree.findByStart(1)?.value, 300);
    });

    it('should handle edge cases (zero-length intervals)', () => {
      tree.insert(5, 5, 1);
      assert.strictEqual(tree.search(5).length, 1);
      assert.strictEqual(tree.search(4).length, 0);
      assert.strictEqual(tree.search(6).length, 0);
    });

    it('should handle very large ranges', () => {
      tree.insert(0, Number.MAX_SAFE_INTEGER, 1);
      assert.strictEqual(tree.size, 1);
      const result = tree.search(Number.MAX_SAFE_INTEGER - 1);
      assert.strictEqual(result.length, 1);
    });

    it('should handle negative numbers', () => {
      tree.insert(-10, -5, 1);
      tree.insert(-20, -15, 2);
      assert.strictEqual(tree.search(-7).length, 1);
      assert.strictEqual(tree.search(-17).length, 1);
    });
  });

  describe('Remove Operations', () => {
    it('should remove an interval by value', () => {
      tree.insert(1, 10, 100);
      tree.insert(5, 15, 200);
      tree.insert(10, 20, 300);

      assert.strictEqual(tree.size, 3);
      assert.strictEqual(tree.remove(100), true);
      assert.strictEqual(tree.size, 2);
      assert.strictEqual(tree.remove(100), false);
      assert.strictEqual(tree.size, 2);
    });

    it('should handle removing from single interval tree', () => {
      tree.insert(1, 10, 100);
      assert.strictEqual(tree.remove(100), true);
      assert.strictEqual(tree.size, 0);
      assert.strictEqual(tree.search(5).length, 0);
    });

    it('should handle removing from empty tree', () => {
      assert.strictEqual(tree.remove(100), false);
      assert.strictEqual(tree.size, 0);
    });

    it('should remove specific interval even with overlaps', () => {
      tree.insert(1, 20, 10);
      tree.insert(5, 15, 20);
      tree.insert(8, 12, 30);

      assert.strictEqual(tree.size, 3);

      // Remove middle interval
      assert.strictEqual(tree.remove(20), true);
      assert.strictEqual(tree.size, 2);

      // Verify middle is gone
      assert.strictEqual(tree.search(10).length, 2); // 10 and 30
    });
  });

  describe('Find Operations', () => {
    it('should find interval by exact start', () => {
      tree.insert(10, 20, 100);
      tree.insert(20, 30, 200);
      tree.insert(30, 40, 300);

      assert.strictEqual(tree.findByStart(10)?.value, 100);
      assert.strictEqual(tree.findByStart(20)?.value, 200);
      assert.strictEqual(tree.findByStart(30)?.value, 300);
      assert.strictEqual(tree.findByStart(5), null);
    });

    it('should find interval by exact end', () => {
      tree.insert(10, 20, 100);
      tree.insert(20, 30, 200);
      tree.insert(30, 40, 300);

      assert.strictEqual(tree.findByEnd(20)?.value, 100);
      assert.strictEqual(tree.findByEnd(30)?.value, 200);
      assert.strictEqual(tree.findByEnd(40)?.value, 300);
      assert.strictEqual(tree.findByEnd(25), null);
    });

    it('should find by start even if point is within interval', () => {
      tree.insert(10, 20, 100);
      tree.insert(15, 25, 200);

      // ByStart finds exact start match only
      assert.strictEqual(tree.findByStart(10)?.value, 100);
      assert.strictEqual(tree.findByStart(15), null); // Different start

      // search finds intervals containing point
      assert.strictEqual(tree.search(18).length, 2);
    });
  });

  describe('has() method', () => {
    it('should check if value exists', () => {
      assert.strictEqual(tree.has(100), false);

      tree.insert(1, 10, 100);
      assert.strictEqual(tree.has(100), true);

      tree.remove(100);
      assert.strictEqual(tree.has(100), false);
    });

    it('should handle empty tree', () => {
      assert.strictEqual(tree.has(100), false);
    });
  });

  describe('getAll() method', () => {
    it('should return all intervals', () => {
      tree.insert(1, 5, 1);
      tree.insert(10, 20, 2);
      tree.insert(30, 40, 3);

      const all = tree.getAll();
      assert.strictEqual(all.length, 3);
      assert.deepStrictEqual(all.map(i => i.value).sort((a, b) => a - b), [1, 2, 3]);
    });

    it('should handle empty tree', () => {
      const all = tree.getAll();
      assert.strictEqual(all.length, 0);
    });
  });

  describe('size property', () => {
    it('should return correct size', () => {
      assert.strictEqual(tree.size, 0);

      tree.insert(1, 10, 1);
      assert.strictEqual(tree.size, 1);

      tree.insert(5, 15, 2);
      assert.strictEqual(tree.size, 2);

      tree.insert(10, 20, 3);
      assert.strictEqual(tree.size, 3);

      tree.remove(1);
      assert.strictEqual(tree.size, 2);
    });

    it('should reflect removals', () => {
      tree.insert(1, 10, 1);
      tree.insert(5, 15, 2);
      assert.strictEqual(tree.size, 2);

      tree.remove(2);
      assert.strictEqual(tree.size, 1);
    });
  });

  describe('clear() method', () => {
    it('should clear all intervals', () => {
      tree.insert(1, 10, 1);
      tree.insert(5, 15, 2);
      assert.strictEqual(tree.size, 2);

      tree.clear();
      assert.strictEqual(tree.size, 0);
      assert.deepStrictEqual(tree.getAll(), []);
      assert.strictEqual(tree.search(10).length, 0);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle intervals that completely contain others', () => {
      tree.insert(0, 100, 100);
      tree.insert(20, 30, 200);
      tree.insert(40, 60, 300);

      assert.strictEqual(tree.size, 3);

      const result = tree.search(25);
      assert.strictEqual(result.length, 2); // 100 and 200
    });

    it('should handle many overlapping intervals', () => {
      for (let i = 0; i < 100; i++) {
        tree.insert(i, i + 5, i);
      }

      assert.strictEqual(tree.size, 100);

      const result = tree.search(50);
      assert.strictEqual(result.length, 6); // All intervals containing point 50
    });

    it('should maintain balance after many operations', () => {
      for (let i = 1; i <= 50; i++) {
        tree.insert(i, i + 10, i);
      }
      assert.strictEqual(tree.size, 50);

      for (let i = 50; i >= 1; i--) {
        tree.remove(i);
      }
      assert.strictEqual(tree.size, 0);
    });

    it('should handle intervals in reverse order', () => {
      tree.insert(100, 110, 1);
      tree.insert(80, 90, 2);
      tree.insert(50, 70, 3);

      assert.strictEqual(tree.search(85).length, 2); // 2 and 3
    });

    it('should handle intervals with same start but different ends', () => {
      tree.insert(10, 20, 1);
      tree.insert(10, 15, 2);
      tree.insert(10, 25, 3);

      // Only the last inserted should be stored (by value)
      assert.strictEqual(tree.size, 3);
      assert.strictEqual(tree.findByStart(10)?.value, 3);

      // search should find all intervals containing the point
      assert.strictEqual(tree.search(12).length, 3);
    });
  });

  describe('Randomized Tests', () => {
    it('should handle random insert and search operations', () => {
      for (let i = 0; i < 100; i++) {
        const start = Math.floor(Math.random() * 100);
        const end = start + Math.floor(Math.random() * 20) + 1;
        tree.insert(start, end, i);
      }

      // Verify all inserts worked
      assert.strictEqual(tree.size, 100);

      // Test some random searches
      for (let i = 0; i < 50; i++) {
        const point = Math.floor(Math.random() * 150);
        const intervals = tree.search(point);
        intervals.forEach(interval => {
          assert.ok(interval.start <= point && interval.end >= point);
        });
      }

      // Test random removals
      for (let i = 0; i < 30; i++) {
        const randomValue = Math.floor(Math.random() * 100);
        tree.remove(randomValue);
      }

      assert.strictEqual(tree.size, 70);
    });
  });

  describe('Type Safety', () => {
    it('should work with different types', () => {
      const stringTree = new IntervalTree<string>();
      stringTree.insert(1, 10, 'test');
      const result = stringTree.search(5);
      assert.strictEqual(result[0].value, 'test');

      const objectTree = new IntervalTree<{ id: number }>();
      objectTree.insert(10, 20, { id: 1 });
      const objResult = objectTree.search(15);
      assert.strictEqual(objResult[0].value.id, 1);
    });
  });
});

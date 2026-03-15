/**
 * Comprehensive tests for IntervalTree
 * 
 * Test coverage:
 * - Basic operations (insert, getAll, clear)
 * - Point queries (search)
 * - Interval overlap queries (searchInterval)
 * - Deletion (single and multiple)
 * - AVL tree balancing
 * - Edge cases (empty tree, invalid intervals, duplicates)
 * - maxEnd augmentation correctness
 * - Performance characteristics
 */

import { IntervalTree, Interval } from './qwen25';

describe('IntervalTree', () => {
  let tree: IntervalTree<string>;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  describe('Basic Operations', () => {
    test('should create an empty tree', () => {
      expect(tree.isEmpty).toBe(true);
      expect(tree.size).toBe(0);
      expect(tree.getAll()).toEqual([]);
    });

    test('should insert a single interval', () => {
      tree.insert(1, 5, 'A');
      expect(tree.size).toBe(1);
      expect(tree.isEmpty).toBe(false);
      
      const all = tree.getAll();
      expect(all).toHaveLength(1);
      expect(all[0]).toEqual({ start: 1, end: 5, value: 'A' });
    });

    test('should insert multiple intervals', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      tree.insert(3, 7, 'C');
      
      expect(tree.size).toBe(3);
      expect(tree.getAll()).toHaveLength(3);
    });

    test('should clear all intervals', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      
      tree.clear();
      
      expect(tree.isEmpty).toBe(true);
      expect(tree.size).toBe(0);
      expect(tree.getAll()).toEqual([]);
    });

    test('should maintain sorted order in getAll', () => {
      tree.insert(5, 10, 'E');
      tree.insert(1, 3, 'A');
      tree.insert(3, 5, 'C');
      tree.insert(10, 15, 'J');
      
      const all = tree.getAll();
      const starts = all.map(i => i.start);
      expect(starts).toEqual([1, 3, 5, 10]);
    });

    test('should throw error for invalid interval (start >= end)', () => {
      expect(() => tree.insert(5, 5, 'A')).toThrow('Invalid interval');
      expect(() => tree.insert(10, 5, 'B')).toThrow('Invalid interval');
    });

    test('should handle negative numbers', () => {
      tree.insert(-10, -5, 'negative');
      tree.insert(-5, 0, 'zero-crossing');
      tree.insert(-20, -15, 'more-negative');
      
      expect(tree.size).toBe(3);
      const all = tree.getAll();
      expect(all.map(i => i.start)).toEqual([-20, -10, -5]);
    });

    test('should handle floating point numbers', () => {
      tree.insert(1.5, 2.5, 'A');
      tree.insert(2.3, 3.7, 'B');
      
      expect(tree.size).toBe(2);
      const results = tree.search(2.4);
      expect(results).toHaveLength(2);
    });

    test('should handle duplicate start values', () => {
      tree.insert(5, 10, 'A');
      tree.insert(5, 8, 'B');
      tree.insert(5, 12, 'C');
      
      expect(tree.size).toBe(3);
      const all = tree.getAll();
      expect(all).toHaveLength(3);
    });
  });

  describe('Point Queries (search)', () => {
    beforeEach(() => {
      // Create a balanced tree with various intervals
      tree.insert(15, 20, 'A');
      tree.insert(10, 30, 'B');  // overlaps with many
      tree.insert(17, 19, 'C');  // nested in A
      tree.insert(5, 20, 'D');   // large overlap
      tree.insert(12, 15, 'E');  // edge case: ends at 15
      tree.insert(20, 25, 'F');  // edge case: starts at 20
      tree.insert(30, 40, 'G');  // no overlap with early points
    });

    test('should find intervals containing a point', () => {
      const results = tree.search(18);
      const values = results.map(r => r.value).sort();
      expect(values).toEqual(['A', 'B', 'C', 'D']); // All contain 18
    });

    test('should find intervals at boundary (start inclusive)', () => {
      const results = tree.search(15);
      const values = results.map(r => r.value).sort();
      expect(values).toContain('A');
      expect(values).toContain('B');
      expect(values).toContain('D');
    });

    test('should find intervals at boundary (end exclusive)', () => {
      const results = tree.search(20);
      const values = results.map(r => r.value).sort();
      // F starts at 20, so it contains 20; A ends at 20, so it doesn't
      expect(values).toContain('F');
      expect(values).not.toContain('A');
    });

    test('should return empty array for point in no interval', () => {
      expect(tree.search(100)).toEqual([]);
      expect(tree.search(-10)).toEqual([]);
      expect(tree.search(25)).toEqual([]);
    });

    test('should handle point at exact start and end boundaries', () => {
      tree.insert(5, 10, 'exact');
      
      expect(tree.search(5)).toContainEqual(expect.objectContaining({ value: 'exact' }));
      expect(tree.search(10)).not.toContainEqual(expect.objectContaining({ value: 'exact' }));
    });

    test('should search in empty tree', () => {
      const emptyTree = new IntervalTree<string>();
      expect(emptyTree.search(5)).toEqual([]);
    });

    test('should handle single point query', () => {
      const singleTree = new IntervalTree<string>();
      singleTree.insert(0, 100, 'full');
      
      expect(singleTree.search(50)).toHaveLength(1);
      expect(singleTree.search(0)).toHaveLength(1);
      expect(singleTree.search(99)).toHaveLength(1);
      expect(singleTree.search(100)).toHaveLength(0);
    });
  });

  describe('Interval Overlap Queries (searchInterval)', () => {
    beforeEach(() => {
      tree.insert(10, 20, 'A');
      tree.insert(15, 25, 'B');  // overlaps A
      tree.insert(30, 40, 'C');  // no overlap with A/B
      tree.insert(5, 12, 'D');   // overlaps A
      tree.insert(18, 35, 'E');  // overlaps A, B, C
    });

    test('should find overlapping intervals', () => {
      const results = tree.searchInterval(16, 22);
      const values = results.map(r => r.value).sort();
      expect(values).toEqual(['A', 'B', 'D', 'E']); // All overlap [16, 22)
    });

    test('should find intervals overlapping at boundaries', () => {
      // [10, 20) and [20, 30) do NOT overlap
      tree.insert(20, 30, 'F');
      
      const results = tree.searchInterval(20, 25);
      expect(results.map(r => r.value)).toContain('B');
      expect(results.map(r => r.value)).toContain('E');
      expect(results.map(r => r.value)).toContain('F');
      expect(results.map(r => r.value)).not.toContain('A'); // ends at 20
    });

    test('should return empty array for non-overlapping query', () => {
      expect(tree.searchInterval(100, 200)).toEqual([]);
      expect(tree.searchInterval(-10, 0)).toEqual([]);
    });

    test('should handle query interval that contains all', () => {
      const results = tree.searchInterval(0, 50);
      expect(results).toHaveLength(5);
    });

    test('should handle query interval inside a single interval', () => {
      const results = tree.searchInterval(12, 15);
      expect(results.map(r => r.value)).toContain('A');
      expect(results.map(r => r.value)).toContain('D');
    });
  });

  describe('Deletion', () => {
    test('should delete a leaf node', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      
      const deleted = tree.delete(1, 5);
      
      expect(deleted).toBe(true);
      expect(tree.size).toBe(1);
      expect(tree.getAll().map(i => i.value)).toEqual(['B']);
    });

    test('should delete a node with one child', () => {
      tree.insert(10, 20, 'root');
      tree.insert(5, 15, 'left');
      tree.insert(15, 25, 'right');
      
      const deleted = tree.delete(10, 20);
      
      expect(deleted).toBe(true);
      expect(tree.size).toBe(2);
      expect(tree.getAll().map(i => i.value).sort()).toEqual(['left', 'right']);
    });

    test('should delete a node with two children', () => {
      tree.insert(10, 20, 'root');
      tree.insert(5, 15, 'left');
      tree.insert(15, 25, 'right');
      tree.insert(3, 8, 'left-left');
      tree.insert(7, 12, 'left-right');
      
      const deleted = tree.delete(5, 15);
      
      expect(deleted).toBe(true);
      expect(tree.size).toBe(3);
      expect(tree.getAll().map(i => i.value).sort()).toEqual(['left-left', 'left-right', 'right', 'root'].filter(v => v !== 'left').sort());
    });

    test('should delete by value when multiple intervals have same coordinates', () => {
      tree.insert(5, 10, 'A');
      tree.insert(5, 10, 'B');
      tree.insert(5, 10, 'C');
      
      const deleted = tree.delete(5, 10, 'B');
      
      expect(deleted).toBe(true);
      expect(tree.size).toBe(2);
      expect(tree.getAll().map(i => i.value).sort()).toEqual(['A', 'C']);
    });

    test('should return false when deleting non-existent interval', () => {
      tree.insert(1, 5, 'A');
      
      const deleted = tree.delete(100, 200);
      
      expect(deleted).toBe(false);
      expect(tree.size).toBe(1);
    });

    test('should handle deletion from empty tree', () => {
      expect(tree.delete(1, 5)).toBe(false);
    });

    test('should maintain tree structure after multiple deletions', () => {
      tree.insert(50, 60, 'root');
      tree.insert(30, 40, 'left');
      tree.insert(70, 80, 'right');
      tree.insert(20, 25, 'left-left');
      tree.insert(40, 45, 'left-right');
      tree.insert(60, 65, 'right-left');
      tree.insert(80, 85, 'right-right');
      
      tree.delete(50, 60); // delete root
      tree.delete(30, 40); // delete left
      
      expect(tree.size).toBe(4);
      expect(tree.getAll()).toHaveLength(4);
      
      // Verify search still works
      expect(tree.search(62).map(i => i.value)).toContain('right-left');
    });
  });

  describe('AVL Balancing', () => {
    test('should maintain balance after sequential insertions (LL rotation)', () => {
      tree.insert(30, 40, 'A');
      tree.insert(20, 30, 'B');
      tree.insert(10, 20, 'C'); // Triggers LL rotation
      
      expect(tree.getHeight()).toBeLessThanOrEqual(2);
      expect(tree.getAll()).toHaveLength(3);
    });

    test('should maintain balance after sequential insertions (RR rotation)', () => {
      tree.insert(10, 20, 'A');
      tree.insert(20, 30, 'B');
      tree.insert(30, 40, 'C'); // Triggers RR rotation
      
      expect(tree.getHeight()).toBeLessThanOrEqual(2);
      expect(tree.getAll()).toHaveLength(3);
    });

    test('should maintain balance after LR rotation', () => {
      tree.insert(30, 40, 'A');
      tree.insert(10, 20, 'B');
      tree.insert(20, 30, 'C'); // Triggers LR rotation
      
      expect(tree.getHeight()).toBeLessThanOrEqual(2);
      expect(tree.getAll()).toHaveLength(3);
    });

    test('should maintain balance after RL rotation', () => {
      tree.insert(10, 20, 'A');
      tree.insert(30, 40, 'B');
      tree.insert(20, 30, 'C'); // Triggers RL rotation
      
      expect(tree.getHeight()).toBeLessThanOrEqual(2);
      expect(tree.getAll()).toHaveLength(3);
    });

    test('should maintain O(log n) height for many insertions', () => {
      const n = 100;
      for (let i = 0; i < n; i++) {
        tree.insert(i * 10, i * 10 + 5, `item-${i}`);
      }
      
      // Height should be O(log n) ~ 7 for n=100
      const height = tree.getHeight();
      const maxExpectedHeight = Math.ceil(Math.log2(n)) + 2;
      
      expect(height).toBeLessThanOrEqual(maxExpectedHeight);
      expect(tree.size).toBe(n);
    });

    test('should maintain balance after deletions', () => {
      // Build a balanced tree
      for (let i = 0; i < 20; i++) {
        tree.insert(i * 10, i * 10 + 5, `item-${i}`);
      }
      
      // Delete several nodes
      for (let i = 0; i < 10; i++) {
        tree.delete(i * 10, i * 10 + 5);
      }
      
      const height = tree.getHeight();
      expect(height).toBeLessThanOrEqual(6); // Should still be balanced
      expect(tree.size).toBe(10);
    });
  });

  describe('maxEnd Augmentation', () => {
    test('should correctly compute maxEnd for single node', () => {
      tree.insert(10, 20, 'A');
      expect(tree.search(15)).toHaveLength(1);
    });

    test('should correctly propagate maxEnd up the tree', () => {
      tree.insert(10, 30, 'A');  // maxEnd = 30
      tree.insert(5, 15, 'B');   // maxEnd = 30 (inherited from parent)
      tree.insert(20, 25, 'C');  // maxEnd = 30
      
      // Should find correct results due to proper maxEnd pruning
      expect(tree.search(12)).toHaveLength(2); // A and B
      expect(tree.search(22)).toHaveLength(2); // A and C
    });

    test('should update maxEnd after deletion', () => {
      tree.insert(10, 100, 'A');  // large maxEnd
      tree.insert(20, 30, 'B');
      tree.insert(30, 40, 'C');
      
      tree.delete(10, 100);  // Remove the large interval
      
      // Tree should still function correctly
      expect(tree.size).toBe(2);
      expect(tree.search(25)).toHaveLength(1);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle many overlapping intervals', () => {
      // Create many intervals all overlapping at point 50
      const n = 50;
      for (let i = 0; i < n; i++) {
        tree.insert(i, 100 - i, `item-${i}`); // All overlap at 50
      }
      
      const results = tree.search(50);
      expect(results).toHaveLength(n);
    });

    test('should handle alternating insertions and deletions', () => {
      for (let i = 0; i < 20; i++) {
        tree.insert(i, i + 10, `item-${i}`);
      }
      
      // Delete every other
      for (let i = 0; i < 20; i += 2) {
        tree.delete(i, i + 10);
      }
      
      expect(tree.size).toBe(10);
      
      // Verify remaining are correct
      const all = tree.getAll();
      all.forEach(interval => {
        expect(parseInt(interval.value.split('-')[1]) % 2).toBe(1);
      });
    });

    test('should handle intervals with complex data types', () => {
      interface CustomData {
        id: number;
        name: string;
        tags: string[];
      }
      
      const customTree = new IntervalTree<CustomData>();
      const data: CustomData = { id: 1, name: 'Test', tags: ['a', 'b'] };
      
      customTree.insert(10, 20, data);
      
      const results = customTree.search(15);
      expect(results).toHaveLength(1);
      expect(results[0].value).toEqual(data);
    });

    test('should handle large coordinate values', () => {
      tree.insert(Number.MAX_SAFE_INTEGER - 1000, Number.MAX_SAFE_INTEGER, 'max');
      tree.insert(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER + 1000, 'min');
      tree.insert(0, 1000, 'zero');
      
      expect(tree.size).toBe(3);
      expect(tree.search(Number.MAX_SAFE_INTEGER - 500)).toHaveLength(1);
      expect(tree.search(Number.MIN_SAFE_INTEGER + 500)).toHaveLength(1);
    });

    test('should handle tree clear and reuse', () => {
      tree.insert(1, 10, 'A');
      tree.insert(20, 30, 'B');
      
      tree.clear();
      expect(tree.isEmpty).toBe(true);
      
      tree.insert(5, 15, 'C');
      expect(tree.size).toBe(1);
      expect(tree.search(10)).toHaveLength(1);
    });

    test('should handle worst-case insertion order (sorted data)', () => {
      // This would cause a degenerate tree without balancing
      for (let i = 0; i < 50; i++) {
        tree.insert(i * 2, i * 2 + 1, `item-${i}`);
      }
      
      // With AVL balancing, height should be logarithmic
      expect(tree.getHeight()).toBeLessThanOrEqual(8);
      
      // All items should still be retrievable
      expect(tree.getAll()).toHaveLength(50);
    });

    test('should handle reverse sorted insertion', () => {
      for (let i = 50; i > 0; i--) {
        tree.insert(i * 2, i * 2 + 1, `item-${i}`);
      }
      
      expect(tree.getHeight()).toBeLessThanOrEqual(8);
      expect(tree.getAll()).toHaveLength(50);
    });
  });

  describe('Stress Test', () => {
    test('should handle 1000 random operations correctly', () => {
      const operations: { op: string; start?: number; end?: number; value?: string }[] = [];
      const reference: Map<string, Interval<string>> = new Map();
      
      // Generate random operations
      for (let i = 0; i < 1000; i++) {
        const opType = Math.random();
        const start = Math.floor(Math.random() * 1000);
        const end = start + Math.floor(Math.random() * 100) + 1;
        const value = `op-${i}`;
        
        if (opType < 0.7) {
          // 70% insertions
          operations.push({ op: 'insert', start, end, value });
          reference.set(value, { start, end, value });
        } else if (opType < 0.9 && reference.size > 0) {
          // 20% deletions (only if we have items)
          const keys = Array.from(reference.keys());
          const keyToDelete = keys[Math.floor(Math.random() * keys.length)];
          const interval = reference.get(keyToDelete)!;
          operations.push({ op: 'delete', start: interval.start, end: interval.end, value: keyToDelete });
          reference.delete(keyToDelete);
        } else {
          // 10% searches
          operations.push({ op: 'search', start });
        }
      }
      
      // Execute operations
      operations.forEach(({ op, start, end, value }) => {
        if (op === 'insert') {
          tree.insert(start!, end!, value!);
        } else if (op === 'delete' && value) {
          tree.delete(start!, end!, value);
        } else if (op === 'search') {
          tree.search(start!);
        }
      });
      
      // Verify final state
      expect(tree.size).toBe(reference.size);
      
      // Verify all remaining intervals are in tree
      reference.forEach((interval) => {
        const results = tree.search(interval.start);
        const found = results.some(r => 
          r.start === interval.start && 
          r.end === interval.end && 
          r.value === interval.value
        );
        expect(found).toBe(true);
      });
    });
  });
});

// Export for potential external use
describe('IntervalTree Type Safety', () => {
  test('should work with different value types', () => {
    const numberTree = new IntervalTree<number>();
    numberTree.insert(1, 5, 42);
    expect(numberTree.search(3)[0].value).toBe(42);
    
    const objectTree = new IntervalTree<{ id: number }>();
    objectTree.insert(1, 5, { id: 123 });
    expect(objectTree.search(3)[0].value.id).toBe(123);
    
    const arrayTree = new IntervalTree<string[]>();
    arrayTree.insert(1, 5, ['a', 'b']);
    expect(arrayTree.search(3)[0].value).toEqual(['a', 'b']);
  });
});

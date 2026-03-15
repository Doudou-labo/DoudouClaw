/**
 * Interval Tree Comprehensive Test Suite
 * 
 * Test coverage:
 * - Basic operations: insert, delete, search, getAll, clear
 * - Edge cases: empty tree, single element, invalid intervals
 * - Balancing: verifies AVL tree remains balanced after operations
 * - Pruning: verifies maxEnd augmentation enables search pruning
 * - Duplicate intervals
 * - Complex scenarios: overlapping intervals, nested intervals
 * - Large dataset performance
 */

import { IntervalTree, Interval } from './llama32';

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

    test('should insert single interval', () => {
      tree.insert(1, 5, 'A');
      expect(tree.size).toBe(1);
      expect(tree.isEmpty).toBe(false);
      expect(tree.getAll()).toEqual([{ start: 1, end: 5, value: 'A' }]);
    });

    test('should insert multiple intervals', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      tree.insert(3, 7, 'C');
      expect(tree.size).toBe(3);
      // In-order traversal should be sorted by start
      expect(tree.getAll()).toEqual([
        { start: 1, end: 5, value: 'A' },
        { start: 2, end: 6, value: 'B' },
        { start: 3, end: 7, value: 'C' },
      ]);
    });

    test('should reject invalid intervals', () => {
      expect(() => tree.insert(5, 5, 'A')).toThrow('Invalid interval');
      expect(() => tree.insert(5, 3, 'A')).toThrow('Invalid interval');
      expect(tree.size).toBe(0);
    });

    test('should clear all intervals', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      tree.clear();
      expect(tree.isEmpty).toBe(true);
      expect(tree.size).toBe(0);
      expect(tree.getAll()).toEqual([]);
    });
  });

  describe('Search (Point Query)', () => {
    beforeEach(() => {
      // Create intervals: [1,5), [2,6), [3,4), [7,10), [8,12)
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      tree.insert(3, 4, 'C');
      tree.insert(7, 10, 'D');
      tree.insert(8, 12, 'E');
    });

    test('should find intervals containing point', () => {
      const results = tree.search(3);
      expect(results).toHaveLength(3);
      expect(results).toContainEqual({ start: 1, end: 5, value: 'A' });
      expect(results).toContainEqual({ start: 2, end: 6, value: 'B' });
      expect(results).toContainEqual({ start: 3, end: 4, value: 'C' });
    });

    test('should find single interval', () => {
      const results = tree.search(7.5);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({ start: 7, end: 10, value: 'D' });
    });

    test('should return empty array for point outside all intervals', () => {
      expect(tree.search(0)).toEqual([]);
      expect(tree.search(20)).toEqual([]);
      expect(tree.search(6)).toEqual([]); // Point at end boundary
    });

    test('should handle point at interval boundaries', () => {
      // start is inclusive, end is exclusive
      expect(tree.search(1)).toHaveLength(1); // At start of A
      expect(tree.search(5)).toHaveLength(1); // At start of B (not in A)
      expect(tree.search(12)).toEqual([]); // At end of E (exclusive)
    });

    test('should handle empty tree search', () => {
      const emptyTree = new IntervalTree<string>();
      expect(emptyTree.search(5)).toEqual([]);
    });
  });

  describe('Delete', () => {
    beforeEach(() => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 6, 'B');
      tree.insert(3, 7, 'C');
      tree.insert(4, 8, 'D');
    });

    test('should delete leaf node', () => {
      expect(tree.delete(4, 8, 'D')).toBe(true);
      expect(tree.size).toBe(3);
      expect(tree.getAll().map(i => i.value)).toEqual(['A', 'B', 'C']);
    });

    test('should delete node with one child', () => {
      // Build a tree where we can test single child deletion
      const t = new IntervalTree<string>();
      t.insert(10, 20, 'root');
      t.insert(5, 15, 'left');
      t.insert(15, 25, 'right');
      t.insert(3, 8, 'left-left');
      
      // Delete 'left' which has a left child
      expect(t.delete(5, 15, 'left')).toBe(true);
      expect(t.size).toBe(3);
    });

    test('should delete node with two children', () => {
      expect(tree.delete(2, 6, 'B')).toBe(true);
      expect(tree.size).toBe(3);
      expect(tree.getAll().map(i => i.value)).toContain('A');
      expect(tree.getAll().map(i => i.value)).toContain('C');
      expect(tree.getAll().map(i => i.value)).toContain('D');
    });

    test('should return false when deleting non-existent interval', () => {
      expect(tree.delete(100, 200, 'Z')).toBe(false);
      expect(tree.size).toBe(4);
    });

    test('should delete without value specification', () => {
      expect(tree.delete(1, 5)).toBe(true);
      expect(tree.size).toBe(3);
    });

    test('should handle duplicate intervals with value specification', () => {
      tree.insert(1, 5, 'A-dup');
      expect(tree.size).toBe(5);
      expect(tree.delete(1, 5, 'A')).toBe(true);
      expect(tree.size).toBe(4);
      // Verify correct one was deleted
      const remaining = tree.getAll().filter(i => i.start === 1);
      expect(remaining).toHaveLength(1);
      expect(remaining[0].value).toBe('A-dup');
    });
  });

  describe('AVL Balancing', () => {
    test('should maintain balance after sequential insertions', () => {
      // Insert in order (worst case for unbalanced tree)
      for (let i = 0; i < 100; i++) {
        tree.insert(i, i + 2, `interval-${i}`);
      }
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should maintain balance after reverse insertions', () => {
      for (let i = 99; i >= 0; i--) {
        tree.insert(i, i + 2, `interval-${i}`);
      }
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should maintain balance after random insertions', () => {
      const randomStarts: number[] = [];
      for (let i = 0; i < 100; i++) {
        randomStarts.push(Math.floor(Math.random() * 1000));
      }
      randomStarts.forEach((start, i) => {
        tree.insert(start, start + 10, `interval-${i}`);
      });
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should maintain balance after deletions', () => {
      // Build a balanced tree
      for (let i = 0; i < 50; i++) {
        tree.insert(i * 2, i * 2 + 5, `interval-${i}`);
      }
      // Delete half of them
      for (let i = 0; i < 25; i++) {
        tree.delete(i * 2, i * 2 + 5, `interval-${i}`);
      }
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
      expect(validation.errors).toEqual([]);
      expect(tree.size).toBe(25);
    });
  });

  describe('MaxEnd Augmentation', () => {
    test('should correctly compute maxEnd for all nodes', () => {
      tree.insert(1, 5, 'A');
      tree.insert(2, 8, 'B');
      tree.insert(3, 4, 'C');
      
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
    });

    test('should enable search pruning', () => {
      // Create intervals where pruning helps
      tree.insert(0, 2, 'A');
      tree.insert(10, 12, 'B');
      tree.insert(20, 22, 'C');
      tree.insert(30, 32, 'D');
      
      // Search for point 5 - should be pruned early
      const results = tree.search(5);
      expect(results).toEqual([]);
    });

    test('should update maxEnd after deletions', () => {
      tree.insert(1, 10, 'A');
      tree.insert(2, 3, 'B');
      tree.insert(4, 5, 'C');
      
      tree.delete(1, 10, 'A');
      
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
    });
  });

  describe('Overlapping Intervals', () => {
    test('should handle many overlapping intervals', () => {
      // Create 50 intervals all overlapping at point 50
      for (let i = 0; i < 50; i++) {
        tree.insert(i, 100 - i, `interval-${i}`);
      }
      
      const results = tree.search(50);
      expect(results).toHaveLength(50);
      
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
    });

    test('should handle nested intervals', () => {
      // [1, 100), [2, 99), [3, 98), ...
      for (let i = 0; i < 20; i++) {
        tree.insert(1 + i, 100 - i, `interval-${i}`);
      }
      
      const results = tree.search(50);
      expect(results).toHaveLength(20);
    });

    test('should handle disjoint intervals', () => {
      // [0,1), [2,3), [4,5), ...
      for (let i = 0; i < 100; i++) {
        tree.insert(i * 2, i * 2 + 1, `interval-${i}`);
      }
      
      expect(tree.size).toBe(100);
      expect(tree.search(0.5)).toHaveLength(1);
      expect(tree.search(1.5)).toHaveLength(0);
    });
  });

  describe('Generic Type Support', () => {
    test('should support number values', () => {
      const numTree = new IntervalTree<number>();
      numTree.insert(1, 5, 100);
      numTree.insert(2, 6, 200);
      expect(numTree.search(3).map(i => i.value)).toEqual([100, 200]);
    });

    test('should support object values', () => {
      interface Payload {
        id: number;
        name: string;
      }
      const objTree = new IntervalTree<Payload>();
      objTree.insert(1, 5, { id: 1, name: 'first' });
      objTree.insert(2, 6, { id: 2, name: 'second' });
      
      const results = objTree.search(3);
      expect(results).toHaveLength(2);
      expect(results[0].value.name).toBe('first');
    });

    test('should support array values', () => {
      const arrTree = new IntervalTree<number[]>();
      arrTree.insert(1, 5, [1, 2, 3]);
      arrTree.insert(2, 6, [4, 5, 6]);
      expect(arrTree.search(3).map(i => i.value)).toEqual([[1, 2, 3], [4, 5, 6]]);
    });
  });

  describe('Edge Cases', () => {
    test('should handle negative numbers', () => {
      tree.insert(-10, -5, 'A');
      tree.insert(-7, -3, 'B');
      tree.insert(-20, 0, 'C');
      
      expect(tree.search(-6)).toHaveLength(3);
      expect(tree.search(-4)).toHaveLength(2);
    });

    test('should handle floating point numbers', () => {
      tree.insert(1.5, 2.5, 'A');
      tree.insert(2.0, 3.0, 'B');
      
      expect(tree.search(2.2)).toHaveLength(2);
      expect(tree.search(2.7)).toHaveLength(1);
    });

    test('should handle large numbers', () => {
      tree.insert(0, Number.MAX_SAFE_INTEGER, 'A');
      expect(tree.search(Number.MAX_SAFE_INTEGER - 1)).toHaveLength(1);
    });

    test('should handle very small intervals', () => {
      tree.insert(0, 0.0001, 'A');
      tree.insert(0.00005, 0.00015, 'B');
      
      expect(tree.search(0.00007)).toHaveLength(2);
    });

    test('should maintain correct order with duplicate starts', () => {
      tree.insert(1, 5, 'A');
      tree.insert(1, 6, 'B');
      tree.insert(1, 4, 'C');
      
      const results = tree.getAll();
      expect(results).toHaveLength(3);
      expect(results[0].start).toBe(1);
    });
  });

  describe('Stress Tests', () => {
    test('should handle 1000 intervals', () => {
      const intervals: Array<[number, number, string]> = [];
      
      for (let i = 0; i < 1000; i++) {
        const start = Math.floor(Math.random() * 10000);
        const end = start + Math.floor(Math.random() * 100) + 1;
        intervals.push([start, end, `interval-${i}`]);
      }
      
      intervals.forEach(([start, end, value]) => {
        tree.insert(start, end, value);
      });
      
      expect(tree.size).toBe(1000);
      
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
      
      // Verify search works
      const results = tree.search(5000);
      // All intervals containing 5000 should be found
      const expected = intervals.filter(([start, end]) => start <= 5000 && 5000 < end);
      expect(results).toHaveLength(expected.length);
    });

    test('should handle alternating insert and delete', () => {
      for (let i = 0; i < 100; i++) {
        tree.insert(i, i + 10, `interval-${i}`);
        if (i % 2 === 0 && i > 0) {
          tree.delete(i - 2, i + 8, `interval-${i - 2}`);
        }
      }
      
      const validation = tree.validate();
      expect(validation.valid).toBe(true);
    });

    test('should handle sequential delete of all elements', () => {
      const intervals: Array<[number, number, string]> = [];
      
      for (let i = 0; i < 100; i++) {
        tree.insert(i, i + 5, `interval-${i}`);
        intervals.push([i, i + 5, `interval-${i}`]);
      }
      
      // Delete in random order
      const shuffled = [...intervals].sort(() => Math.random() - 0.5);
      shuffled.forEach(([start, end, value]) => {
        tree.delete(start, end, value);
      });
      
      expect(tree.isEmpty).toBe(true);
      expect(tree.size).toBe(0);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle interval scheduling simulation', () => {
      // Simulate meeting room scheduling
      const meetings = new IntervalTree<string>();
      
      meetings.insert(9, 11, 'Team Standup');
      meetings.insert(11, 12, 'Sprint Planning');
      meetings.insert(14, 16, 'Code Review');
      meetings.insert(10, 15, 'Deep Work Block');
      
      // Find conflicts at 10:30
      const conflicts = meetings.search(10.5);
      expect(conflicts).toHaveLength(2);
      
      // Find free slot at 13:00
      const at13 = meetings.search(13);
      expect(at13).toHaveLength(0);
    });

    test('should handle genomic interval simulation', () => {
      // Simulate genomic features (genes on chromosomes)
      const genome = new IntervalTree<{ gene: string; strand: string }>();
      
      genome.insert(1000, 5000, { gene: 'BRCA1', strand: '+' });
      genome.insert(1500, 3000, { gene: 'BRCA2', strand: '-' });
      genome.insert(4000, 7000, { gene: 'TP53', strand: '+' });
      genome.insert(2000, 4500, { gene: 'EGFR', strand: '+' });
      
      // Find genes at position 2500
      const genes = genome.search(2500);
      expect(genes).toHaveLength(3);
      expect(genes.map(g => g.value.gene).sort()).toEqual(['BRCA1', 'BRCA2', 'EGFR']);
    });

    test('should handle IP range lookup', () => {
      // Simulate IP range allocations
      const ipRanges = new IntervalTree<string>();
      
      // Convert IPs to integers (simplified)
      ipRanges.insert(167772160, 184549375, '10.0.0.0/8');    // 10.0.0.0 - 10.255.255.255
      ipRanges.insert(1681915904, 1686110207, '100.64.0.0/10'); // 100.64.0.0 - 100.127.255.255
      ipRanges.insert(3232235520, 3232301055, '192.168.0.0/16'); // 192.168.0.0 - 192.168.255.255
      
      // Lookup IP 10.0.0.5 (167772165)
      const result = ipRanges.search(167772165);
      expect(result).toHaveLength(1);
      expect(result[0].value).toBe('10.0.0.0/8');
    });
  });
});

// Benchmark-style tests
describe('IntervalTree Benchmarks', () => {
  test('insert performance', () => {
    const t = new IntervalTree<number>();
    const start = performance.now();
    
    for (let i = 0; i < 10000; i++) {
      t.insert(Math.random() * 100000, Math.random() * 100000 + 100000, i);
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(5000); // Should complete in less than 5 seconds
    expect(t.size).toBe(10000);
  });

  test('search performance', () => {
    const t = new IntervalTree<number>();
    
    for (let i = 0; i < 10000; i++) {
      t.insert(i * 10, i * 10 + 100, i);
    }
    
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      t.search(Math.random() * 100000);
    }
    
    const end = performance.now();
    expect(end - start).toBeLessThan(5000);
  });
});

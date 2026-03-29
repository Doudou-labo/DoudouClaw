/**
 * Tests for IntervalTree Implementation
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { IntervalTree } from './glm-5';

describe('IntervalTree', () => {
  let tree: IntervalTree<string>;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  describe('insert', () => {
    test('should insert a single interval', () => {
      tree.insert(10, 20, 'A');
      expect(tree.getSize()).toBe(1);
    });

    test('should insert multiple intervals', () => {
      tree.insert(10, 20, 'A');
      tree.insert(15, 25, 'B');
      tree.insert(5, 12, 'C');
      expect(tree.getSize()).toBe(3);
    });

    test('should normalize intervals (low > high)', () => {
      tree.insert(20, 10, 'normalized');
      const results = tree.search(15);
      expect(results).toContain('normalized');
    });

    test('should handle duplicate intervals', () => {
      tree.insert(10, 20, 'first');
      tree.insert(10, 20, 'second');
      expect(tree.getSize()).toBe(2);
    });
  });

  describe('search(point)', () => {
    test('should find interval containing point', () => {
      tree.insert(10, 20, 'A');
      const results = tree.search(15);
      expect(results).toEqual(['A']);
    });

    test('should find multiple overlapping intervals', () => {
      tree.insert(10, 20, 'A');
      tree.insert(15, 25, 'B');
      tree.insert(5, 12, 'C');
      
      const results = tree.search(16);
      expect(results).toContain('A');
      expect(results).toContain('B');
      expect(results.length).toBe(2);
    });

    test('should return empty array when no intervals found', () => {
      tree.insert(10, 20, 'A');
      const results = tree.search(30);
      expect(results).toEqual([]);
    });

    test('should handle point at interval boundary', () => {
      tree.insert(10, 20, 'A');
      expect(tree.search(10)).toContain('A');
      expect(tree.search(20)).toContain('A');
    });

    test('should return empty array on empty tree', () => {
      const results = tree.search(15);
      expect(results).toEqual([]);
    });

    test('should find all intervals in complex tree', () => {
      tree.insert(5, 15, 'A');
      tree.insert(10, 20, 'B');
      tree.insert(15, 25, 'C');
      tree.insert(1, 5, 'D');
      
      const results = tree.search(15);
      expect(results).toContain('A');
      expect(results).toContain('B');
      expect(results).toContain('C');
      expect(results.length).toBe(3);
    });
  });

  describe('remove', () => {
    test('should remove existing interval', () => {
      tree.insert(10, 20, 'A');
      const removed = tree.remove(10, 20);
      expect(removed).toBe(true);
      expect(tree.getSize()).toBe(0);
    });

    test('should return false for non-existing interval', () => {
      tree.insert(10, 20, 'A');
      const removed = tree.remove(5, 15);
      expect(removed).toBe(false);
      expect(tree.getSize()).toBe(1);
    });

    test('should maintain tree structure after removal', () => {
      tree.insert(10, 20, 'A');
      tree.insert(5, 15, 'B');
      tree.insert(15, 25, 'C');
      
      tree.remove(10, 20);
      expect(tree.getSize()).toBe(2);
      expect(tree.search(12)).toContain('B');
      expect(tree.search(20)).toContain('C');
    });

    test('should normalize intervals for removal', () => {
      tree.insert(10, 20, 'A');
      const removed = tree.remove(20, 10);
      expect(removed).toBe(true);
      expect(tree.getSize()).toBe(0);
    });

    test('should handle removing from empty tree', () => {
      const removed = tree.remove(10, 20);
      expect(removed).toBe(false);
    });

    test('should correctly update size after multiple removals', () => {
      tree.insert(10, 20, 'A');
      tree.insert(5, 15, 'B');
      tree.insert(20, 30, 'C');
      
      tree.remove(5, 15);
      expect(tree.getSize()).toBe(2);
      
      tree.remove(20, 30);
      expect(tree.getSize()).toBe(1);
      
      tree.remove(10, 20);
      expect(tree.getSize()).toBe(0);
    });
  });

  describe('searchInterval', () => {
    test('should find overlapping intervals', () => {
      tree.insert(10, 20, 'A');
      tree.insert(15, 25, 'B');
      tree.insert(5, 12, 'C');
      
      const results = tree.searchInterval(8, 18);
      expect(results).toContain('A');
      expect(results).toContain('C');
    });

    test('should return empty array when no overlaps', () => {
      tree.insert(10, 20, 'A');
      const results = tree.searchInterval(25, 30);
      expect(results).toEqual([]);
    });

    test('should handle exact match interval', () => {
      tree.insert(10, 20, 'A');
      const results = tree.searchInterval(10, 20);
      expect(results).toContain('A');
    });
  });

  describe('getSize', () => {
    test('should return 0 for empty tree', () => {
      expect(tree.getSize()).toBe(0);
    });

    test('should return correct count after inserts', () => {
      tree.insert(1, 5, 'A');
      tree.insert(6, 10, 'B');
      expect(tree.getSize()).toBe(2);
    });
  });

  describe('isEmpty', () => {
    test('should return true for empty tree', () => {
      expect(tree.isEmpty()).toBe(true);
    });

    test('should return false after insert', () => {
      tree.insert(1, 5, 'A');
      expect(tree.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    test('should clear all intervals', () => {
      tree.insert(1, 5, 'A');
      tree.insert(6, 10, 'B');
      tree.clear();
      expect(tree.getSize()).toBe(0);
      expect(tree.isEmpty()).toBe(true);
    });
  });

  describe('getAll', () => {
    test('should return all values in sorted order', () => {
      tree.insert(10, 20, 'B');
      tree.insert(5, 15, 'A');
      tree.insert(15, 25, 'C');
      
      const all = tree.getAll();
      expect(all).toEqual(['A', 'B', 'C']);
    });

    test('should return empty array for empty tree', () => {
      expect(tree.getAll()).toEqual([]);
    });
  });

  describe('generic types', () => {
    test('should work with number values', () => {
      const numTree = new IntervalTree<number>();
      numTree.insert(1, 10, 100);
      numTree.insert(5, 15, 200);
      
      const results = numTree.search(7);
      expect(results).toContain(100);
      expect(results).toContain(200);
    });

    test('should work with object values', () => {
      interface Data { id: string; value: number };
      const objTree = new IntervalTree<Data>();
      
      objTree.insert(1, 10, { id: 'a', value: 1 });
      objTree.insert(5, 15, { id: 'b', value: 2 });
      
      const results = objTree.search(7);
      expect(results.length).toBe(2);
      expect(results.find(r => r.id === 'a')).toBeDefined();
      expect(results.find(r => r.id === 'b')).toBeDefined();
    });
  });

  describe('complex scenarios', () => {
    test('should handle large number of intervals', () => {
      for (let i = 0; i < 100; i++) {
        tree.insert(i * 10, i * 10 + 5, `item-${i}`);
      }
      
      expect(tree.getSize()).toBe(100);
      
      const results = tree.search(50);
      expect(results).toContain('item-5');
      
      const results2 = tree.search(57);
      expect(results2).toEqual([]);
    });

    test('should handle interleaved insertions and removals', () => {
      tree.insert(10, 20, 'A');
      tree.insert(5, 15, 'B');
      tree.remove(10, 20);
      tree.insert(15, 25, 'C');
      
      expect(tree.getSize()).toBe(2);
      expect(tree.search(14)).toContain('B');
      expect(tree.search(20)).toContain('C');
    });

    test('should handle negative intervals', () => {
      tree.insert(-20, -10, 'negA');
      tree.insert(-15, -5, 'negB');
      tree.insert(0, 10, 'pos');
      
      const results = tree.search(-12);
      expect(results).toContain('negA');
      expect(results).toContain('negB');
      expect(results.length).toBe(2);
    });
  });
});

/**
 * Interval Tree Test Suite
 * 
 * Comprehensive tests for the IntervalTree implementation
 */

import { IntervalTree, Interval, createIntervalTree, intervalsOverlap, pointInInterval, intervalsOverlapRange } from './trinity';

describe('IntervalTree', () => {
  let tree: IntervalTree;

  beforeEach(() => {
    tree = createIntervalTree();
  });

  describe('Basic Operations', () => {
    it('should insert intervals correctly', () => {
      tree.insert(1, 3);
      tree.insert(2, 4);
      tree.insert(5, 7);
      
      expect(tree.size()).toBe(3);
      expect(tree.isEmpty()).toBe(false);
    });

    it('should handle empty tree operations', () => {
      expect(tree.size()).toBe(0);
      expect(tree.isEmpty()).toBe(true);
      expect(tree.getAll()).toEqual([]);
      expect(tree.search(1)).toEqual([]);
    });

    it('should clear the tree', () => {
      tree.insert(1, 3);
      tree.insert(2, 4);
      
      tree.clear();
      
      expect(tree.size()).toBe(0);
      expect(tree.isEmpty()).toBe(true);
    });
  });

  describe('Search Operations', () => {
    beforeEach(() => {
      tree.insert(1, 3);
      tree.insert(2, 4);
      tree.insert(5, 7);
      tree.insert(6, 8);
      tree.insert(9, 10);
    });

    it('should find overlapping intervals for a point', () => {
      const result = tree.search(2);
      
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { start: 1, end: 3 },
        { start: 2, end: 4 }
      ]);
    });

    it('should find no overlap for non-overlapping point', () => {
      const result = tree.search(4);
      
      expect(result).toHaveLength(0);
    });

    it('should find overlapping intervals for a range', () => {
      const result = tree.searchRange(2, 6);
      
      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { start: 1, end: 3 },
        { start: 2, end: 4 },
        { start: 5, end: 7 }
      ]);
    });

    it('should handle edge cases for range search', () => {
      // Exact match on boundaries
      let result = tree.searchRange(1, 3);
      expect(result).toHaveLength(2);
      
      // No overlap
      result = tree.searchRange(4, 5);
      expect(result).toHaveLength(0);
      
      // Full overlap
      result = tree.searchRange(0, 10);
      expect(result).toHaveLength(5);
    });

    it('should return all intervals in order', () => {
      const all = tree.getAll();
      
      expect(all).toEqual([
        { start: 1, end: 3 },
        { start: 2, end: 4 },
        { start: 5, end: 7 },
        { start: 6, end: 8 },
        { start: 9, end: 10 }
      ]);
    });
  });

  describe('Value Storage', () => {
    it('should store and retrieve values', () => {
      tree.insert(1, 3, 'A');
      tree.insert(2, 4, 'B');
      tree.insert(5, 7, 'C');
      
      const result = tree.search(2);
      
      expect(result).toEqual([
        { start: 1, end: 3, value: 'A' },
        { start: 2, end: 4, value: 'B' }
      ]);
    });

    it('should handle undefined values', () => {
      tree.insert(1, 3);
      tree.insert(2, 4, undefined);
      
      const result = tree.search(2);
      
      expect(result).toEqual([
        { start: 1, end: 3, value: undefined },
        { start: 2, end: 4, value: undefined }
      ]);
    });
  });

  describe('Deletion Operations', () => {
    beforeEach(() => {
      tree.insert(1, 3);
      tree.insert(2, 4);
      tree.insert(5, 7);
      tree.insert(6, 8);
    });

    it('should delete an interval', () => {
      const deleted = tree.delete(1, 3);
      
      expect(deleted).toBe(true);
      expect(tree.size()).toBe(3);
      expect(tree.getAll()).toEqual([
        { start: 2, end: 4 },
        { start: 5, end: 7 },
        { start: 6, end: 8 }
      ]);
    });

    it('should handle deleting non-existent interval', () => {
      const deleted = tree.delete(10, 12);
      
      expect(deleted).toBe(false);
      expect(tree.size()).toBe(4);
    });

    it('should handle deleting with value', () => {
      tree.insert(1, 3, 'A');
      tree.insert(1, 3, 'B');
      
      const deleted = tree.delete(1, 3, 'A');
      
      expect(deleted).toBe(true);
      expect(tree.size()).toBe(3);
    });

    it('should maintain tree structure after deletion', () => {
      tree.delete(2, 4);
      tree.delete(5, 7);
      
      expect(tree.size()).toBe(2);
      expect(tree.getAll()).toEqual([
        { start: 1, end: 3 },
        { start: 6, end: 8 }
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid intervals', () => {
      expect(() => tree.insert(3, 1)).toThrow('Invalid interval: start must be less than end');
    });

    it('should handle zero-length intervals', () => {
      expect(() => tree.insert(1, 1)).toThrow('Invalid interval: start must be less than end');
    });

    it('should handle nested intervals', () => {
      tree.insert(1, 10);
      tree.insert(2, 3);
      tree.insert(4, 5);
      tree.insert(6, 7);
      
      const result = tree.search(2.5);
      expect(result).toHaveLength(2);
      
      const all = tree.getAll();
      expect(all).toEqual([
        { start: 1, end: 10 },
        { start: 2, end: 3 },
        { start: 4, end: 5 },
        { start: 6, end: 7 }
      ]);
    });

    it('should handle touching intervals', () => {
      tree.insert(1, 2);
      tree.insert(2, 3);
      
      // Touching but not overlapping
      const result = tree.search(2);
      expect(result).toEqual([{ start: 2, end: 3 }]);
    });

    it('should handle large number of intervals', () => {
      const numIntervals = 1000;
      for (let i = 0; i < numIntervals; i++) {
        tree.insert(i, i + 2);
      }
      
      expect(tree.size()).toBe(numIntervals);
      
      const result = tree.search(500);
      expect(result).toHaveLength(2);
    });
  });

  describe('Utility Functions', () => {
    it('should correctly detect interval overlap', () => {
      expect(intervalsOverlap({ start: 1, end: 3 }, { start: 2, end: 4 })).toBe(true);
      expect(intervalsOverlap({ start: 1, end: 3 }, { start: 3, end: 5 })).toBe(false);
      expect(intervalsOverlap({ start: 1, end: 3 }, { start: 4, end: 5 })).toBe(false);
      expect(intervalsOverlap({ start: 1, end: 3 }, { start: 0, end: 2 })).toBe(true);
    });

    it('should correctly detect point in interval', () => {
      expect(pointInInterval(2, { start: 1, end: 3 })).toBe(true);
      expect(pointInInterval(1, { start: 1, end: 3 })).toBe(true);
      expect(pointInInterval(3, { start: 1, end: 3 })).toBe(false);
      expect(pointInInterval(0, { start: 1, end: 3 })).toBe(false);
    });

    it('should correctly detect interval overlap with range', () => {
      expect(intervalsOverlapRange({ start: 1, end: 3 }, 2, 4)).toBe(true);
      expect(intervalsOverlapRange({ start: 1, end: 3 }, 3, 4)).toBe(false);
      expect(intervalsOverlapRange({ start: 1, end: 3 }, 0, 2)).toBe(true);
      expect(intervalsOverlapRange({ start: 1, end: 3 }, 0, 1)).toBe(false);
    });
  });

  describe('Performance Characteristics', () => {
    it('should maintain O(log n) insertion', () => {
      // This is more of a conceptual test - we can't truly test O(log n)
      // but we can verify the tree stays balanced
      const sizes = [100, 1000, 10000];
      
      sizes.forEach(size => {
        const localTree = createIntervalTree();
        for (let i = 0; i < size; i++) {
          localTree.insert(i, i + 1);
        }
        
        // Verify the tree is roughly balanced by checking height
        // Height should be around log2(size)
        const height = getHeight(localTree);
        const expectedHeight = Math.ceil(Math.log2(size + 1));
        
        // Allow some tolerance for the AVL tree overhead
        expect(height).toBeLessThanOrEqual(expectedHeight + 2);
      });
    });

    it('should maintain O(log n + k) search performance', () => {
      // Insert intervals with varying overlaps
      for (let i = 0; i < 1000; i++) {
        tree.insert(i, i + 10);
      }
      
      // Search should be fast even with many intervals
      const start = performance.now();
      const result = tree.search(500);
      const end = performance.now();
      
      expect(result).toHaveLength(2);
      expect(end - start).toBeLessThan(10); // Should be very fast
    });
  });
});

// === Helper Functions ===

function getHeight(tree: IntervalTree): number {
  return getHeightNode(tree['root']);
}

function getHeightNode(node: any): number {
  if (node === null) {
    return 0;
  }
  return 1 + Math.max(getHeightNode(node.left), getHeightNode(node.right));
}

// === Performance Test ===

describe('Performance Benchmark', () => {
  it('should handle large-scale operations', () => {
    const tree = createIntervalTree();
    const numIntervals = 10000;
    
    // Insert performance
    const insertStart = performance.now();
    for (let i = 0; i < numIntervals; i++) {
      tree.insert(i, i + 2);
    }
    const insertEnd = performance.now();
    
    // Search performance
    const searchStart = performance.now();
    const result = tree.search(5000);
    const searchEnd = performance.now();
    
    // Verify results
    expect(result).toHaveLength(2);
    expect(tree.size()).toBe(numIntervals);
    
    // Performance expectations (these may need adjustment based on environment)
    expect(insertEnd - insertStart).toBeLessThan(500); // Insert 10k intervals in <500ms
    expect(searchEnd - searchStart).toBeLessThan(5);   // Search in <5ms
  });
});

// === Bonus: IntervalTree with Additional Features ===

describe('Bonus Features', () => {
  it('should support interval merging', () => {
    const tree = createIntervalTree();
    
    // Insert overlapping intervals that could be merged
    tree.insert(1, 3);
    tree.insert(2, 4);
    tree.insert(5, 7);
    tree.insert(6, 8);
    
    // Get all intervals and verify they're stored separately
    const all = tree.getAll();
    expect(all).toHaveLength(4);
    
    // Note: Merging is not implemented in the base IntervalTree
    // This is just to show what could be added as a bonus feature
  });

  it('should support interval counting', () => {
    const tree = createIntervalTree();
    
    tree.insert(1, 3);
    tree.insert(2, 4);
    tree.insert(5, 7);
    
    // Count intervals overlapping with a range
    const count = tree.searchRange(1, 5).length;
    expect(count).toBe(3);
  });
});

// === Integration Test ===

describe('Integration Test', () => {
  it('should work as a complete system', () => {
    const tree = createIntervalTree();
    
    // Test complete lifecycle
    tree.insert(1, 3, 'A');
    tree.insert(2, 5, 'B');
    tree.insert(4, 6, 'C');
    tree.insert(7, 9, 'D');
    
    expect(tree.size()).toBe(4);
    
    // Search tests
    let result = tree.search(2);
    expect(result).toEqual([
      { start: 1, end: 3, value: 'A' },
      { start: 2, end: 5, value: 'B' }
    ]);
    
    result = tree.search(5);
    expect(result).toEqual([
      { start: 2, end: 5, value: 'B' },
      { start: 4, end: 6, value: 'C' }
    ]);
    
    // Delete test
    tree.delete(2, 5, 'B');
    expect(tree.size()).toBe(3);
    
    // Final state
    const all = tree.getAll();
    expect(all).toEqual([
      { start: 1, end: 3, value: 'A' },
      { start: 4, end: 6, value: 'C' },
      { start: 7, end: 9, value: 'D' }
    ]);
    
    // Clear test
    tree.clear();
    expect(tree.isEmpty()).toBe(true);
  });
});

// === Stress Test ===

describe('Stress Test', () => {
  it('should handle random intervals', () => {
    const tree = createIntervalTree();
    const numIntervals = 1000;
    
    // Generate random intervals
    for (let i = 0; i < numIntervals; i++) {
      const start = Math.floor(Math.random() * 10000);
      const end = start + Math.floor(Math.random() * 100) + 1;
      tree.insert(start, end);
    }
    
    expect(tree.size()).toBe(numIntervals);
    
    // Test search on random points
    for (let i = 0; i < 100; i++) {
      const point = Math.floor(Math.random() * 10000);
      const result = tree.search(point);
      // Should not throw errors
      expect(result).toBeInstanceOf(Array);
    }
  });
});

// === Documentation Test ===

describe('Documentation Examples', () => {
  it('should match example usage', () => {
    const tree = createIntervalTree();
    
    // Example from documentation
    tree.insert(1, 5);
    tree.insert(3, 7);
    tree.insert(6, 10);
    tree.insert(8, 12);
    
    const result = tree.search(4);
    expect(result).toHaveLength(2);
    
    tree.delete(3, 7);
    expect(tree.size()).toBe(3);
  });
});

// === Export for External Use ===

export { IntervalTree, Interval, createIntervalTree, intervalsOverlap, pointInInterval, intervalsOverlapRange };

// === Main Execution for Manual Testing ===

if (typeof require !== 'undefined' && require.main === module) {
  console.log('Running manual IntervalTree tests...');
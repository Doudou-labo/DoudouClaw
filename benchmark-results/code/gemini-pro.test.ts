import { IntervalTree } from './gemini-pro';

describe('IntervalTree', () => {
  let tree: IntervalTree<string>;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  test('should insert intervals correctly', () => {
    tree.insert(15, 20, 'A');
    tree.insert(10, 30, 'B');
    tree.insert(17, 19, 'C');
    tree.insert(5, 20, 'D');
    tree.insert(12, 15, 'E');
    tree.insert(30, 40, 'F');

    expect(tree.getSize()).toBe(6);
    const all = tree.getAll();
    expect(all.length).toBe(6);
  });

  test('should throw error for invalid intervals', () => {
    expect(() => tree.insert(20, 15, 'A')).toThrow();
    expect(() => tree.insert(10, 10, 'B')).toThrow();
  });

  test('should search point query correctly (O(log n + k) with maxEnd pruning)', () => {
    tree.insert(15, 20, 'A');
    tree.insert(10, 30, 'B');
    tree.insert(17, 19, 'C');
    tree.insert(5, 20, 'D');
    tree.insert(12, 15, 'E');
    tree.insert(30, 40, 'F');

    // Point 16 should be in [15,20), [10,30), [5,20)
    // Not in [17,19), [12,15), [30,40)
    const result16 = tree.search(16);
    expect(result16.length).toBe(3);
    const values16 = result16.map(i => i.value).sort();
    expect(values16).toEqual(['A', 'B', 'D']);

    // Point 17 should be in [15,20), [10,30), [17,19), [5,20)
    const result17 = tree.search(17);
    expect(result17.length).toBe(4);
    const values17 = result17.map(i => i.value).sort();
    expect(values17).toEqual(['A', 'B', 'C', 'D']);

    // Point 40 should be empty because [30, 40) is exclusive at end
    const result40 = tree.search(40);
    expect(result40.length).toBe(0);
  });

  test('should delete intervals correctly', () => {
    tree.insert(15, 20, 'A');
    tree.insert(10, 30, 'B');
    tree.insert(17, 19, 'C');

    expect(tree.getSize()).toBe(3);
    
    // Delete existing
    const deleted = tree.delete(15, 20);
    expect(deleted).toBe(true);
    expect(tree.getSize()).toBe(2);

    const all = tree.getAll();
    expect(all.find(i => i.value === 'A')).toBeUndefined();

    // Delete non-existing
    const deleted2 = tree.delete(100, 200);
    expect(deleted2).toBe(false);
    expect(tree.getSize()).toBe(2);
  });

  test('should handle duplicate intervals with different values', () => {
    tree.insert(10, 20, 'V1');
    tree.insert(10, 20, 'V2');
    
    const result15 = tree.search(15);
    expect(result15.length).toBe(2);
    expect(result15.map(i => i.value).sort()).toEqual(['V1', 'V2']);

    // Delete specific value
    tree.delete(10, 20, 'V1');
    const result15After = tree.search(15);
    expect(result15After.length).toBe(1);
    expect(result15After[0].value).toBe('V2');
  });

  test('should clear the tree', () => {
    tree.insert(10, 20, 'A');
    tree.insert(20, 30, 'B');
    tree.clear();
    expect(tree.getSize()).toBe(0);
    expect(tree.getAll().length).toBe(0);
    expect(tree.search(15).length).toBe(0);
  });
});

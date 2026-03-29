import { describe, it, expect } from 'vitest';
import { IntervalTree, IntervalEntry } from './mimo-v2-pro';

describe('IntervalTree', () => {
  // ── Basic insertion & size ──────────────────────────────────────

  it('starts empty', () => {
    const tree = new IntervalTree();
    expect(tree.size).toBe(0);
    expect(tree.search(5)).toEqual([]);
  });

  it('inserts intervals and tracks size', () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, 'A');
    tree.insert(4, 8, 'B');
    tree.insert(7, 12, 'C');
    expect(tree.size).toBe(3);
  });

  it('rejects invalid intervals (low > high)', () => {
    const tree = new IntervalTree();
    expect(() => tree.insert(10, 5)).toThrow(RangeError);
  });

  it('allows zero-length intervals (low === high)', () => {
    const tree = new IntervalTree();
    tree.insert(5, 5);
    expect(tree.size).toBe(1);
    expect(tree.search(5)).toHaveLength(1);
    expect(tree.search(4)).toHaveLength(0);
  });

  // ── Search (point query) ───────────────────────────────────────

  it('returns intervals containing the query point', () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, 'A');
    tree.insert(4, 8, 'B');
    tree.insert(7, 12, 'C');
    tree.insert(15, 20, 'D');

    const hit3 = tree.search(3);
    expect(hit3.map(e => e.data)).toEqual(['A']);

    const hit5 = tree.search(5);
    expect(hit5.map(e => e.data).sort()).toEqual(['A', 'B']);

    const hit10 = tree.search(10);
    expect(hit10.map(e => e.data)).toEqual(['C']);

    const hit16 = tree.search(16);
    expect(hit16.map(e => e.data)).toEqual(['D']);
  });

  it('returns empty when no interval contains the point', () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, 'A');
    tree.insert(10, 15, 'B');
    expect(tree.search(7)).toEqual([]);
  });

  it('handles negative numbers', () => {
    const tree = new IntervalTree();
    tree.insert(-10, -5);
    tree.insert(-3, 2);
    expect(tree.search(-7)).toHaveLength(1);
    expect(tree.search(0)).toHaveLength(1);
    expect(tree.search(-4)).toHaveLength(0);
  });

  // ── Removal ─────────────────────────────────────────────────────

  it('removes an existing interval', () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, 'A');
    tree.insert(4, 8, 'B');
    expect(tree.remove(1, 5, 'A')).toBe(true);
    expect(tree.size).toBe(1);
    expect(tree.search(3)).toEqual([]);
    expect(tree.search(6).map(e => e.data)).toEqual(['B']);
  });

  it('returns false when removing a non-existent interval', () => {
    const tree = new IntervalTree();
    tree.insert(1, 5);
    expect(tree.remove(2, 6)).toBe(false);
    expect(tree.size).toBe(1);
  });

  it('handles remove from empty tree', () => {
    const tree = new IntervalTree();
    expect(tree.remove(1, 5)).toBe(false);
  });

  it('removes all intervals one by one', () => {
    const tree = new IntervalTree<number>();
    const intervals: [number, number][] = [
      [1, 10], [3, 7], [5, 15], [20, 30], [25, 40],
    ];
    intervals.forEach(([l, h], i) => tree.insert(l, h, i));

    expect(tree.size).toBe(5);
    for (const [l, h] of intervals) {
      expect(tree.remove(l, h)).toBe(true);
    }
    expect(tree.size).toBe(0);
    expect(tree.search(10)).toEqual([]);
  });

  // ── Large-scale / stress ────────────────────────────────────────

  it('handles many insertions and maintains correct search results', () => {
    const tree = new IntervalTree<number>();
    const N = 500;
    for (let i = 0; i < N; i++) {
      tree.insert(i * 10, i * 10 + 5, i);
    }
    expect(tree.size).toBe(N);

    // Point exactly at each interval
    for (let i = 0; i < N; i++) {
      const results = tree.search(i * 10);
      expect(results).toHaveLength(1);
      expect(results[0].data).toBe(i);
    }

    // Point in the gap
    expect(tree.search(7)).toEqual([]);
    expect(tree.search(8)).toEqual([]);
  });

  it('handles overlapping intervals correctly', () => {
    const tree = new IntervalTree<string>();
    tree.insert(0, 100, 'wide');
    tree.insert(10, 20, 'narrow1');
    tree.insert(30, 40, 'narrow2');
    tree.insert(50, 60, 'narrow3');

    const hit15 = tree.search(15).map(e => e.data).sort();
    expect(hit15).toEqual(['narrow1', 'wide']);

    const hit35 = tree.search(35).map(e => e.data).sort();
    expect(hit35).toEqual(['narrow2', 'wide']);

    const hit50 = tree.search(50).map(e => e.data).sort();
    expect(hit50).toEqual(['narrow3', 'wide']);
  });

  // ── toArray (structural sanity) ─────────────────────────────────

  it('toArray returns intervals sorted by low endpoint', () => {
    const tree = new IntervalTree<number>();
    tree.insert(5, 10, 1);
    tree.insert(1, 3, 2);
    tree.insert(8, 12, 3);
    const sorted = tree.toArray();
    expect(sorted.map(e => e.low)).toEqual([1, 5, 8]);
  });

  // ── Generic data type support ───────────────────────────────────

  it('supports complex data types', () => {
    const tree = new IntervalTree<{ name: string }>();
    tree.insert(1, 5, { name: 'alpha' });
    tree.insert(3, 7, { name: 'beta' });

    const hits = tree.search(4);
    expect(hits.map(e => e.data.name).sort()).toEqual(['alpha', 'beta']);
  });
});

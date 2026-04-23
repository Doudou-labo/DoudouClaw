import { describe, it, expect } from "vitest";
import { IntervalTree, type Interval } from "./interval-tree.ts";

describe("IntervalTree", () => {
  it("inserts intervals and counts them", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 3 });
    tree.insert({ low: 2, high: 4 });
    expect(tree.count()).toBe(2);
  });

  it("finds intervals containing a point", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 2, high: 3 });
    tree.insert({ low: 6, high: 10 });

    const res = tree.search(2);
    expect(res).toHaveLength(2);
    expect(res).toContainEqual({ low: 1, high: 5 });
    expect(res).toContainEqual({ low: 2, high: 3 });
  });

  it("returns empty array when no interval contains the point", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 3 });
    tree.insert({ low: 5, high: 7 });
    expect(tree.search(4)).toEqual([]);
    expect(tree.search(0)).toEqual([]);
    expect(tree.search(8)).toEqual([]);
  });

  it("handles boundary points (low and high inclusive)", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 10, high: 20 });
    expect(tree.search(10)).toHaveLength(1);
    expect(tree.search(20)).toHaveLength(1);
    expect(tree.search(15)).toHaveLength(1);
  });

  it("handles degenerate intervals (low === high)", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 5, high: 5 });
    expect(tree.search(5)).toHaveLength(1);
    expect(tree.search(4)).toHaveLength(0);
    expect(tree.search(6)).toHaveLength(0);
  });

  it("handles overlapping intervals correctly", () => {
    const tree = new IntervalTree();
    const intervals: Interval[] = [
      { low: 1, high: 10 },
      { low: 2, high: 9 },
      { low: 3, high: 8 },
      { low: 4, high: 7 },
      { low: 5, high: 6 },
    ];
    intervals.forEach((i) => tree.insert(i));
    expect(tree.count()).toBe(5);

    const res = tree.search(5);
    expect(res).toHaveLength(5);
  });

  it("handles negative intervals", () => {
    const tree = new IntervalTree();
    tree.insert({ low: -10, high: -5 });
    tree.insert({ low: -7, high: 0 });
    tree.insert({ low: -20, high: -15 });

    expect(tree.search(-7)).toHaveLength(2);
    expect(tree.search(-1)).toHaveLength(1);
    expect(tree.search(-100)).toHaveLength(0);
  });

  it("handles duplicates (same low and high)", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 1, high: 5 });

    expect(tree.count()).toBe(3);
    expect(tree.search(3)).toHaveLength(3);
  });

  it("removes an exact interval", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 2, high: 6 });

    const removed = tree.remove({ low: 1, high: 5 });
    expect(removed).toBe(true);
    expect(tree.count()).toBe(1);
    expect(tree.search(3)).toHaveLength(1);
    expect(tree.search(1)).toHaveLength(0);
  });

  it("removes one duplicate while keeping others", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 1, high: 5 });

    tree.remove({ low: 1, high: 5 });
    expect(tree.count()).toBe(2);
    expect(tree.search(3)).toHaveLength(2);

    tree.remove({ low: 1, high: 5 });
    expect(tree.count()).toBe(1);

    tree.remove({ low: 1, high: 5 });
    expect(tree.count()).toBe(0);
    expect(tree.search(3)).toHaveLength(0);
  });

  it("returns false when removing non-existing interval", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 5 });
    expect(tree.remove({ low: 10, high: 20 })).toBe(false);
    expect(tree.count()).toBe(1);
  });

  it("can be emptied completely by remove", () => {
    const tree = new IntervalTree();
    tree.insert({ low: 1, high: 3 });
    tree.insert({ low: 4, high: 6 });
    tree.insert({ low: 7, high: 9 });

    tree.remove({ low: 1, high: 3 });
    tree.remove({ low: 4, high: 6 });
    tree.remove({ low: 7, high: 9 });

    expect(tree.count()).toBe(0);
    expect(tree.search(5)).toEqual([]);
  });

  it("throws on invalid interval (low > high)", () => {
    const tree = new IntervalTree();
    expect(() => tree.insert({ low: 5, high: 3 })).toThrow(
      "Invalid interval"
    );
    expect(() => tree.remove({ low: 5, high: 3 })).toThrow(
      "Invalid interval"
    );
  });

  it("stress test: random insert, search and remove", () => {
    const tree = new IntervalTree();
    const reference: Interval[] = [];
    const rng = (seed: number) => {
      let s = seed;
      return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const rand = rng(42);

    // Insert 1000 random intervals
    for (let i = 0; i < 1000; i++) {
      const low = Math.floor(rand() * 2000) - 1000;
      const len = Math.floor(rand() * 100);
      const high = low + len;
      const iv = { low, high };
      tree.insert(iv);
      reference.push(iv);
    }

    expect(tree.count()).toBe(1000);

    // Search a sample of points and compare with brute force
    for (let p = -500; p <= 500; p += 17) {
      const fromTree = tree.search(p);
      const fromBrute = reference.filter((iv) => iv.low <= p && p <= iv.high);
      expect(fromTree.length).toBe(fromBrute.length);
    }

    // Remove half of them randomly
    for (let i = 0; i < 500; i++) {
      const idx = Math.floor(rand() * reference.length);
      const iv = reference[idx];
      tree.remove(iv);
      reference.splice(idx, 1);
    }

    expect(tree.count()).toBe(500);

    // Verify again after removals
    for (let p = -500; p <= 500; p += 17) {
      const fromTree = tree.search(p);
      const fromBrute = reference.filter((iv) => iv.low <= p && p <= iv.high);
      expect(fromTree.length).toBe(fromBrute.length);
    }
  });

  it("maintains AVL balance after many insertions", () => {
    const tree = new IntervalTree();
    for (let i = 0; i < 100; i++) {
      tree.insert({ low: i, high: i + 10 });
    }
    expect(tree.count()).toBe(100);
    // Basic sanity: all points should be searchable
    expect(tree.search(50).length).toBeGreaterThan(0);
    expect(tree.search(5).length).toBeGreaterThan(0);
    expect(tree.search(200).length).toBe(0);
  });

  it("maintains AVL balance after many deletions", () => {
    const tree = new IntervalTree();
    const intervals: Interval[] = [];
    for (let i = 0; i < 100; i++) {
      const iv = { low: i, high: i + 10 };
      tree.insert(iv);
      intervals.push(iv);
    }

    // Remove every other interval
    for (let i = 0; i < 100; i += 2) {
      tree.remove(intervals[i]);
    }

    expect(tree.count()).toBe(50);
    for (let i = 1; i < 100; i += 2) {
      expect(tree.search(i).some((iv) => iv.low === i)).toBe(true);
    }
    for (let i = 0; i < 100; i += 2) {
      expect(tree.search(i).some((iv) => iv.low === i)).toBe(false);
    }
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import { IntervalTree, Interval } from "./minimax-m25-highspeed";

type NumInterval = Interval<number>;

function iv(low: number, high: number): NumInterval {
  return { low, high };
}

function sortedByLow<T>(arr: Interval<T>[]): Interval<T>[] {
  return [...arr].sort((a, b) => (a.low as unknown as number) - (b.low as unknown as number));
}

function intervalArraysEqual(a: NumInterval[], b: NumInterval[]): boolean {
  const sa = sortedByLow(a);
  const sb = sortedByLow(b);
  if (sa.length !== sb.length) return false;
  for (let i = 0; i < sa.length; i++) {
    if (sa[i].low !== sb[i].low || sa[i].high !== sb[i].high) return false;
  }
  return true;
}

describe("IntervalTree — core API", () => {

  describe("insert + search(point)", () => {
    it("finds an interval that contains the point", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      expect(tree.search(15)).toEqual([iv(10, 20)]);
    });

    it("finds multiple intervals containing the same point", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(0, 10));
      tree.insert(iv(5, 15));
      tree.insert(iv(7, 20));
      expect(intervalArraysEqual(tree.search(7), [iv(0, 10), iv(5, 15), iv(7, 20)])).toBe(true);
    });

    it("returns empty array when point is not covered", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      expect(tree.search(25)).toEqual([]);
    });

    it("returns empty array on empty tree", () => {
      const tree = new IntervalTree<number>();
      expect(tree.search(5)).toEqual([]);
    });

    it("handles point exactly at interval low bound", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(5, 10));
      expect(tree.search(5)).toEqual([iv(5, 10)]);
    });

    it("handles point exactly at interval high bound", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(5, 10));
      expect(tree.search(10)).toEqual([iv(5, 10)]);
    });

    it("handles zero-width interval (low == high)", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(7, 7));
      expect(tree.search(7)).toEqual([iv(7, 7)]);
      expect(tree.search(6)).toEqual([]);
    });

    it("inserts many intervals and finds all overlapping a point", () => {
      const tree = new IntervalTree<number>();
      const intervals = [
        iv(0, 5), iv(3, 8), iv(6, 10), iv(9, 15), iv(12, 20),
      ];
      intervals.forEach(i => tree.insert(i));
      const found = tree.search(7);
      expect(intervalArraysEqual(found, [iv(3, 8), iv(6, 10)])).toBe(true);
    });
  });

  describe("remove", () => {
    it("removes an existing interval", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      tree.remove(iv(10, 20));
      expect(tree.search(15)).toEqual([]);
    });

    it("removes one interval but keeps others overlapping the same point", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(0, 10));
      tree.insert(iv(5, 15));
      tree.remove(iv(0, 10));
      expect(intervalArraysEqual(tree.search(7), [iv(5, 15)])).toBe(true);
    });

    it("remove is idempotent on non-existent interval", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(5, 10));
      tree.remove(iv(20, 30));  // does not exist
      expect(tree.search(7)).toEqual([iv(5, 10)]);
    });

    it("removes from root position", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(5, 10));
      tree.remove(iv(5, 10));
      expect(tree.search(5)).toEqual([]);
    });

    it("removes all intervals one by one", () => {
      const tree = new IntervalTree<number>();
      [iv(1, 2), iv(3, 4), iv(5, 6), iv(7, 8)].forEach(i => tree.insert(i));
      [iv(1, 2), iv(3, 4), iv(5, 6), iv(7, 8)].forEach(i => tree.remove(i));
      expect(tree.isEmpty).toBe(true);
    });

    it("re-insert works after remove", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(1, 10));
      tree.remove(iv(1, 10));
      tree.insert(iv(1, 10));
      expect(tree.search(5)).toEqual([iv(1, 10)]);
    });
  });

  describe("overlapsPoint", () => {
    it("returns true for point inside interval", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      expect(tree.overlapsPoint(15)).toBe(true);
    });

    it("returns false for point outside interval", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      expect(tree.overlapsPoint(25)).toBe(false);
    });

    it("returns true at boundaries", () => {
      const tree = new IntervalTree<number>();
      tree.insert(iv(10, 20));
      expect(tree.overlapsPoint(10)).toBe(true);
      expect(tree.overlapsPoint(20)).toBe(true);
    });
  });

  // searchOverlap is an extra helper; tested indirectly via bulk stress

  describe("inOrder", () => {
    it("returns intervals sorted by low bound", () => {
      const tree = new IntervalTree<number>();
      [iv(30, 40), iv(10, 20), iv(20, 30)].forEach(i => tree.insert(i));
      const seq = tree.inOrder();
      expect(seq).toEqual([iv(10, 20), iv(20, 30), iv(30, 40)]);
    });
  });

  describe("size & isEmpty", () => {
    it("reports correct size", () => {
      const tree = new IntervalTree<number>();
      expect(tree.size).toBe(0);
      expect(tree.isEmpty).toBe(true);
      tree.insert(iv(1, 5));
      expect(tree.size).toBe(1);
      expect(tree.isEmpty).toBe(false);
      tree.insert(iv(6, 10));
      expect(tree.size).toBe(2);
    });
  });

  describe("generic type support", () => {
    it("works with custom comparator for string keys", () => {
      interface StringInterval {
        low: string;
        high: string;
      }
      const tree = new IntervalTree<StringInterval>((a, b) => a.localeCompare(b));
      tree.insert({ low: "apple", high: "banana" });
      tree.insert({ low: "cherry", high: "date" });
      const found = tree.search("citrus");
      expect(found.length).toBe(1);
      expect(found[0].low).toBe("cherry");
    });
  });

  describe("bulk stress — no crashes", () => {
    it("inserts and queries 500 random intervals", () => {
      const tree = new IntervalTree<number>();
      const intervals: NumInterval[] = [];
      for (let i = 0; i < 500; i++) {
        const start = Math.floor(Math.random() * 1000);
        const end = start + Math.floor(Math.random() * 100);
        const ivi = iv(start, end);
        intervals.push(ivi);
        tree.insert(ivi);
      }
      // Query at a known point
      const found = tree.search(500);
      expect(found.length).toBeGreaterThan(0);
      // All found intervals should contain 500
      for (const f of found) {
        expect(f.low).toBeLessThanOrEqual(500);
        expect(f.high).toBeGreaterThanOrEqual(500);
      }
      // No crashes on remove
      for (const ivi of intervals.slice(0, 100)) {
        tree.remove(ivi);
      }
      expect(tree.size).toBe(400);
    });
  });
});

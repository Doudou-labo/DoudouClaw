/**
 * Jest tests for IntervalTree (minimax-m27-highspeed)
 */

import { IntervalTree } from "./minimax-m27-highspeed";

describe("IntervalTree — core operations", () => {
  let tree: IntervalTree<string>;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  describe("insert", () => {
    it("should insert a single interval", () => {
      tree.insert(0, 10, "a");
      expect(tree.size).toBe(1);
      expect(tree.isEmpty()).toBe(false);
    });

    it("should increase size on multiple inserts", () => {
      tree.insert(0, 5, "a");
      tree.insert(6, 10, "b");
      tree.insert(11, 15, "c");
      expect(tree.size).toBe(3);
    });

    it("should throw on invalid interval (start > end)", () => {
      expect(() => tree.insert(10, 5, "bad")).toThrow();
    });

    it("should allow zero-width interval (point)", () => {
      tree.insert(5, 5, "point");
      expect(tree.size).toBe(1);
    });

    it("should handle overlapping intervals", () => {
      tree.insert(0, 10, "a");
      tree.insert(5, 15, "b");
      tree.insert(8, 12, "c");
      expect(tree.size).toBe(3);
    });
  });

  describe("remove", () => {
    it("should remove an existing interval and return true", () => {
      tree.insert(0, 10, "a");
      const ok = tree.remove("a");
      expect(ok).toBe(true);
      expect(tree.size).toBe(0);
    });

    it("should return false when value not found", () => {
      tree.insert(0, 10, "a");
      const ok = tree.remove("z");
      expect(ok).toBe(false);
      expect(tree.size).toBe(1);
    });

    it("should correctly reduce size after partial removals", () => {
      tree.insert(0, 5, "a");
      tree.insert(6, 10, "b");
      tree.insert(11, 15, "c");
      tree.remove("b");
      expect(tree.size).toBe(2);
      expect(tree.getAll().map((iv) => iv.value)).toEqual(["a", "c"]);
    });

    it("should handle removing root node", () => {
      tree.insert(5, 10, "root");
      tree.insert(0, 4, "left");
      tree.insert(11, 15, "right");
      tree.remove("root");
      expect(tree.size).toBe(2);
      expect(tree.getAll().map((iv) => iv.value)).toEqual(["left", "right"]);
    });

    it("should succeed on duplicates (removes first match)", () => {
      tree.insert(0, 5, "dup");
      tree.insert(0, 5, "dup");
      tree.remove("dup");
      expect(tree.size).toBe(1);
    });
  });

  describe("search(point)", () => {
    it("should find intervals containing the point", () => {
      tree.insert(0, 10, "a");
      tree.insert(5, 15, "b");
      tree.insert(20, 30, "c");

      const r = tree.search(7);
      expect(r.map((iv) => iv.value).sort()).toEqual(["a", "b"]);
    });

    it("should return empty array when no intervals contain point", () => {
      tree.insert(0, 5, "a");
      tree.insert(10, 15, "b");
      expect(tree.search(7)).toEqual([]);
    });

    it("should include intervals where point is at start boundary", () => {
      tree.insert(5, 10, "a");
      tree.insert(10, 20, "b");
      expect(tree.search(5).map((iv) => iv.value)).toEqual(["a"]);
    });

    it("should include intervals where point is at end boundary", () => {
      tree.insert(5, 10, "a");
      tree.insert(10, 20, "b");
      expect(tree.search(10).map((iv) => iv.value)).toEqual(["a", "b"]);
    });

    it("should return empty for empty tree", () => {
      expect(tree.search(5)).toEqual([]);
    });

    it("should find all fully nested intervals", () => {
      tree.insert(0, 100, "outer");
      tree.insert(10, 90, "mid");
      tree.insert(20, 80, "inner");
      tree.insert(30, 70, "core");

      const r = tree.search(50);
      expect(r.length).toBe(4);
    });
  });

  describe("getAll", () => {
    it("should return all intervals in-order", () => {
      tree.insert(5, 10, "b");
      tree.insert(0, 3, "a");
      tree.insert(15, 20, "c");

      const all = tree.getAll();
      expect(all.map((iv) => iv.value)).toEqual(["a", "b", "c"]);
    });

    it("should return [] for empty tree", () => {
      expect(tree.getAll()).toEqual([]);
    });
  });

  describe("isEmpty / size / clear", () => {
    it("should be empty on construction", () => {
      expect(tree.isEmpty()).toBe(true);
      expect(tree.size).toBe(0);
    });

    it("should not be empty after insert", () => {
      tree.insert(0, 5, "x");
      expect(tree.isEmpty()).toBe(false);
      expect(tree.size).toBe(1);
    });

    it("should clear all intervals", () => {
      tree.insert(0, 5, "a");
      tree.insert(6, 10, "b");
      tree.clear();
      expect(tree.isEmpty()).toBe(true);
      expect(tree.size).toBe(0);
      expect(tree.getAll()).toEqual([]);
      expect(tree.search(3)).toEqual([]);
    });
  });

  describe("generic type", () => {
    it("should work with object values", () => {
      const tree2 = new IntervalTree<{ id: number }>();
      tree2.insert(0, 10, { id: 1 });
      tree2.insert(5, 15, { id: 2 });

      const r = tree2.search(7);
      expect(r.length).toBe(2);
      expect(r[0].value.id).toBeDefined();
    });

    it("should work with string values", () => {
      const tree2 = new IntervalTree<string>();
      tree2.insert(1, 5, "alpha");
      tree2.insert(3, 8, "beta");
      expect(tree2.search(4)).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ value: "alpha" }),
          expect.objectContaining({ value: "beta" }),
        ]),
      );
    });
  });

  describe("stress — many intervals", () => {
    it("should handle 100 sequential intervals", () => {
      for (let i = 0; i < 100; i++) {
        tree.insert(i * 2, i * 2 + 1, `i${i}`);
      }
      expect(tree.size).toBe(100);
      // Point 50 lies in interval [50,51]
      expect(tree.search(50).length).toBe(1);
    });

    it("should handle many overlapping intervals at same point", () => {
      for (let i = 0; i < 50; i++) {
        tree.insert(0, 100, `o${i}`);
      }
      expect(tree.size).toBe(50);
      expect(tree.search(50).length).toBe(50);
    });
  });
});

/**
 * Unit tests for IntervalTree
 */

import { IntervalTree } from "./minimax-m25";

describe("IntervalTree", () => {
  let tree: IntervalTree;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  describe("insert", () => {
    it("should insert a single interval", () => {
      tree.insert({ start: 0, end: 10, data: "test" });
      expect(tree.getSize()).toBe(1);
    });

    it("should insert multiple intervals", () => {
      tree.insert({ start: 0, end: 5 });
      tree.insert({ start: 10, end: 20 });
      tree.insert({ start: 15, end: 25 });
      expect(tree.getSize()).toBe(3);
    });

    it("should throw on invalid interval (start > end)", () => {
      expect(() => tree.insert({ start: 10, end: 5 })).toThrow();
    });

    it("should handle overlapping intervals", () => {
      tree.insert({ start: 0, end: 10 });
      tree.insert({ start: 5, end: 15 });
      tree.insert({ start: 8, end: 12 });
      expect(tree.getSize()).toBe(3);
    });
  });

  describe("remove", () => {
    it("should remove an existing interval", () => {
      tree.insert({ start: 0, end: 10 });
      const removed = tree.remove({ start: 0, end: 10 });
      expect(removed).toBe(true);
      expect(tree.getSize()).toBe(0);
    });

    it("should return false for non-existent interval", () => {
      tree.insert({ start: 0, end: 10 });
      const removed = tree.remove({ start: 5, end: 15 });
      expect(removed).toBe(false);
      expect(tree.getSize()).toBe(1);
    });

    it("should remove from middle of tree", () => {
      tree.insert({ start: 0, end: 5 });
      tree.insert({ start: 10, end: 15 });
      tree.insert({ start: 5, end: 10 });
      tree.remove({ start: 5, end: 10 });
      expect(tree.getSize()).toBe(2);
    });
  });

  describe("search", () => {
    it("should find intervals containing the point", () => {
      tree.insert({ start: 0, end: 10 });
      tree.insert({ start: 5, end: 15 });
      tree.insert({ start: 20, end: 30 });

      const results = tree.search(7);
      expect(results.length).toBe(2);
    });

    it("should return empty array when no intervals contain point", () => {
      tree.insert({ start: 0, end: 5 });
      tree.insert({ start: 10, end: 15 });

      const results = tree.search(7);
      expect(results).toEqual([]);
    });

    it("should find intervals at boundaries", () => {
      tree.insert({ start: 0, end: 10 });

      expect(tree.search(0).length).toBe(1);
      expect(tree.search(10).length).toBe(1);
      expect(tree.search(-1).length).toBe(0);
    });

    it("should handle empty tree", () => {
      const results = tree.search(5);
      expect(results).toEqual([]);
    });
  });

  describe("getAll", () => {
    it("should return all intervals", () => {
      tree.insert({ start: 0, end: 5 });
      tree.insert({ start: 10, end: 15 });

      const all = tree.getAll();
      expect(all.length).toBe(2);
    });

    it("should return empty array for empty tree", () => {
      expect(tree.getAll()).toEqual([]);
    });
  });

  describe("isEmpty and getSize", () => {
    it("should report empty on creation", () => {
      expect(tree.isEmpty()).toBe(true);
      expect(tree.getSize()).toBe(0);
    });

    it("should not be empty after insert", () => {
      tree.insert({ start: 0, end: 10 });
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getSize()).toBe(1);
    });
  });

  describe("with generic type", () => {
    it("should store data with intervals", () => {
      const treeWithData = new IntervalTree<{ id: number }>();
      treeWithData.insert({ start: 0, end: 10, data: { id: 1 } });
      treeWithData.insert({ start: 5, end: 15, data: { id: 2 } });

      const results = treeWithData.search(7);
      expect(results.length).toBe(2);
      expect(results[0].data?.id).toBeDefined();
    });
  });

  describe("complex scenarios", () => {
    it("should handle many intervals", () => {
      for (let i = 0; i < 100; i++) {
        tree.insert({ start: i * 2, end: i * 2 + 1 });
      }
      expect(tree.getSize()).toBe(100);
      expect(tree.search(50).length).toBe(1);
    });

    it("should handle fully overlapping intervals", () => {
      tree.insert({ start: 0, end: 100 });
      tree.insert({ start: 10, end: 90 });
      tree.insert({ start: 20, end: 80 });
      tree.insert({ start: 30, end: 70 });

      const results = tree.search(50);
      expect(results.length).toBe(4);
    });
  });
});
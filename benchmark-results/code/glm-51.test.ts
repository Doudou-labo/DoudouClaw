import { describe, it, expect } from "vitest";
import { IntervalTree } from "./glm-51";

describe("IntervalTree", () => {
  // ── Basic insert & search ──────────────────────────────────
  it("inserts and searches by point", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "a");
    tree.insert(3, 8, "b");
    tree.insert(10, 15, "c");

    expect(tree.search(4)).toEqual(["a", "b"]);
    expect(tree.search(12)).toEqual(["c"]);
    expect(tree.search(9)).toEqual([]);
    expect(tree.size).toBe(3);
  });

  it("finds intervals at exact boundaries", () => {
    const tree = new IntervalTree<number>();
    tree.insert(0, 10, 1);
    expect(tree.search(0)).toEqual([1]);
    expect(tree.search(10)).toEqual([1]);
    expect(tree.search(-1)).toEqual([]);
    expect(tree.search(11)).toEqual([]);
  });

  // ── Overlapping intervals ──────────────────────────────────
  it("returns all overlapping intervals", () => {
    const tree = new IntervalTree<string>();
    tree.insert(0, 10, "A");
    tree.insert(2, 4, "B");
    tree.insert(3, 7, "C");
    tree.insert(8, 12, "D");

    const r = tree.search(5);
    expect(r.sort()).toEqual(["A", "C"]);
  });

  // ── Remove ─────────────────────────────────────────────────
  it("removes an interval", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "x");
    tree.insert(2, 6, "y");

    expect(tree.remove(1, 5, "x")).toBe(true);
    expect(tree.size).toBe(1);
    expect(tree.search(3)).toEqual(["y"]);
  });

  it("remove returns false when not found", () => {
    const tree = new IntervalTree<number>();
    tree.insert(0, 5, 1);
    expect(tree.remove(0, 5, 999)).toBe(false);
    expect(tree.remove(1, 5, 1)).toBe(false);
    expect(tree.size).toBe(1);
  });

  // ── Negative intervals ─────────────────────────────────────
  it("handles negative intervals", () => {
    const tree = new IntervalTree<string>();
    tree.insert(-10, -5, "neg");
    tree.insert(-3, 3, "cross");
    tree.insert(5, 10, "pos");

    expect(tree.search(-7)).toEqual(["neg"]);
    expect(tree.search(0)).toEqual(["cross"]);
    expect(tree.search(7)).toEqual(["pos"]);
    expect(tree.search(-4)).toEqual([]);
  });

  // ── Duplicate intervals ────────────────────────────────────
  it("allows duplicate intervals with same or different values", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "dup");
    tree.insert(1, 5, "dup");
    tree.insert(1, 5, "other");

    expect(tree.search(3).sort()).toEqual(["dup", "dup", "other"]);
    expect(tree.size).toBe(3);

    // Remove one dup
    expect(tree.remove(1, 5, "dup")).toBe(true);
    expect(tree.size).toBe(2);
  });

  // ── Validation ─────────────────────────────────────────────
  it("rejects low > high", () => {
    const tree = new IntervalTree<number>();
    expect(() => tree.insert(5, 1, 0)).toThrow(RangeError);
  });

  // ── Large volume ───────────────────────────────────────────
  it("handles large volume (10 000 inserts)", () => {
    const tree = new IntervalTree<number>();
    const N = 10_000;
    for (let i = 0; i < N; i++) {
      tree.insert(i, i + 10, i);
    }
    expect(tree.size).toBe(N);

    // Point in the middle should match ~10 intervals
    const mid = Math.floor(N / 2);
    const results = tree.search(mid);
    expect(results.length).toBeGreaterThanOrEqual(10);

    // Remove a bunch
    for (let i = 0; i < N; i += 2) {
      tree.remove(i, i + 10, i);
    }
    expect(tree.size).toBe(N / 2);
  });

  // ── Empty tree ─────────────────────────────────────────────
  it("searches and removes on empty tree", () => {
    const tree = new IntervalTree<number>();
    expect(tree.search(42)).toEqual([]);
    expect(tree.remove(0, 1, 1)).toBe(false);
    expect(tree.size).toBe(0);
  });
});

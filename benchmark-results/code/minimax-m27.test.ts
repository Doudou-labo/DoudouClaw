import { IntervalTree, Interval } from "./minimax-m27";

describe("IntervalTree", () => {
  let tree: IntervalTree<number>;

  beforeEach(() => {
    tree = new IntervalTree<number>();
  });

  // ── insert ──────────────────────────────────────────────────

  it("inserts a single interval", () => {
    tree.insert(0, 10, 42);
    const result = tree.search(5);
    expect(result).toHaveLength(1);
    expect(result[0].data).toBe(42);
  });

  it("inserts multiple intervals", () => {
    tree.insert(0, 5, 1);
    tree.insert(10, 15, 2);
    tree.insert(20, 25, 3);
    expect(tree.search(2)).toHaveLength(1);
    expect(tree.search(12)).toHaveLength(1);
    expect(tree.search(22)).toHaveLength(1);
    expect(tree.search(7)).toHaveLength(0);
  });

  it("overwrites interval with same start", () => {
    tree.insert(5, 10, 1);
    tree.insert(5, 10, 2);
    const found = tree.search(7);
    expect(found).toHaveLength(1);
    expect(found[0].data).toBe(2);
  });

  // ── search (point) ──────────────────────────────────────────

  it("finds intervals containing the point", () => {
    tree.insert(0, 10);
    tree.insert(5, 15);
    tree.insert(20, 30);
    const r = tree.search(7);
    expect(r).toHaveLength(2);
    expect(r.map((i) => i.start)).toEqual(expect.arrayContaining([0, 5]));
  });

  it("returns empty array when no interval contains point", () => {
    tree.insert(0, 5);
    tree.insert(10, 15);
    expect(tree.search(7)).toHaveLength(0);
  });

  it("handles point exactly at interval start", () => {
    tree.insert(10, 20);
    expect(tree.search(10)).toHaveLength(1);
  });

  it("handles point exactly at interval end", () => {
    tree.insert(10, 20);
    expect(tree.search(20)).toHaveLength(1);
  });

  it("handles zero-length interval (point interval)", () => {
    tree.insert(5, 5);
    expect(tree.search(5)).toHaveLength(1);
    expect(tree.search(4)).toHaveLength(0);
  });

  // ── remove ──────────────────────────────────────────────────

  it("removes an existing interval", () => {
    tree.insert(5, 15);
    const ok = tree.remove(5);
    expect(ok).toBe(true);
    expect(tree.search(10)).toHaveLength(0);
  });

  it("returns false when removing non-existent interval", () => {
    tree.insert(5, 10);
    const ok = tree.remove(99);
    expect(ok).toBe(false);
  });

  it("removes correctly from a tree with multiple intervals", () => {
    tree.insert(0, 10);
    tree.insert(5, 15);
    tree.insert(20, 30);
    tree.remove(5);
    expect(tree.search(10)).toHaveLength(1); // [0,10] still there
    expect(tree.search(10)).toEqual(
      expect.arrayContaining([expect.objectContaining({ start: 0 })])
    );
  });

  it("re-balances after many removals", () => {
    for (let i = 0; i < 100; i++) {
      tree.insert(i * 2, i * 2 + 1);
    }
    for (let i = 0; i < 50; i++) {
      tree.remove(i * 2);
    }
    // remaining intervals should still be searchable
    expect(tree.search(100)).toHaveLength(1); // [100,101] still there
    expect(tree.search(1)).toHaveLength(0);   // [0,1] was removed
    expect(tree.search(0)).toHaveLength(0); // removed
  });

  // ── inOrder ─────────────────────────────────────────────────

  it("inOrder returns intervals in sorted order", () => {
    tree.insert(30, 40);
    tree.insert(10, 20);
    tree.insert(20, 25); // overlaps, same start as previous end
    const seq = tree.inOrder();
    expect(seq.map((i) => i.start)).toEqual([10, 20, 30]);
  });

  // ── generic data ────────────────────────────────────────────

  it("works with complex generic data", () => {
    interface Event {
      id: number;
      label: string;
    }
    const tree2 = new IntervalTree<Event>();
    tree2.insert(0, 100, { id: 1, label: "meeting" });
    const r = tree2.search(50);
    expect(r).toHaveLength(1);
    expect(r[0].data).toEqual({ id: 1, label: "meeting" });
  });

  // ── empty tree ──────────────────────────────────────────────

  it("search on empty tree returns empty array", () => {
    expect(new IntervalTree().search(5)).toHaveLength(0);
  });

  it("remove on empty tree returns false", () => {
    expect(new IntervalTree().remove(5)).toBe(false);
  });
});

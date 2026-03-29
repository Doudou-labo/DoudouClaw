import { IntervalTree } from "./glm-5-turbo";

describe("IntervalTree", () => {
  it("should start empty", () => {
    const tree = new IntervalTree<number>();
    expect(tree.isEmpty()).toBe(true);
  });

  it("should insert an interval and find it", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 5, high: 10 });
    expect(tree.isEmpty()).toBe(false);
    const results = tree.search(7);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ low: 5, high: 10 });
  });

  it("should not find a point outside all intervals", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 5, high: 10 });
    expect(tree.search(3)).toHaveLength(0);
    expect(tree.search(12)).toHaveLength(0);
  });

  it("should find multiple overlapping intervals", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 1, high: 10 });
    tree.insert({ low: 5, high: 15 });
    tree.insert({ low: 20, high: 30 });
    const results = tree.search(7);
    expect(results).toHaveLength(2);
  });

  it("should handle exact boundary points (low and high inclusive)", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 5, high: 10 });
    expect(tree.search(5)).toHaveLength(1);
    expect(tree.search(10)).toHaveLength(1);
  });

  it("should handle single-point intervals", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 7, high: 7 });
    expect(tree.search(7)).toHaveLength(1);
    expect(tree.search(6)).toHaveLength(0);
  });

  it("should remove an interval", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 1, high: 10 });
    tree.insert({ low: 5, high: 15 });
    const removed = tree.remove({ low: 1, high: 10 });
    expect(removed).toBe(true);
    expect(tree.search(7)).toHaveLength(1);
    expect(tree.search(3)).toHaveLength(0);
  });

  it("should return false when removing a non-existent interval", () => {
    const tree = new IntervalTree<number>();
    expect(tree.remove({ low: 1, high: 10 })).toBe(false);
  });

  it("should remove the root and maintain correctness", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 10, high: 20 });
    tree.insert({ low: 5, high: 15 });
    tree.insert({ low: 25, high: 30 });
    tree.remove({ low: 10, high: 20 });
    expect(tree.search(12)).toHaveLength(1);
    expect(tree.search(27)).toHaveLength(1);
  });

  it("should handle many inserts and searches", () => {
    const tree = new IntervalTree<number>();
    for (let i = 0; i < 100; i++) {
      tree.insert({ low: i, high: i + 10 });
    }
    expect(tree.search(50)).toHaveLength(11);
    expect(tree.search(0)).toHaveLength(1);
    expect(tree.search(109)).toHaveLength(1);
    expect(tree.search(110)).toHaveLength(0);
  });

  it("should throw on invalid interval (low > high)", () => {
    const tree = new IntervalTree<number>();
    expect(() => tree.insert({ low: 10, high: 5 })).toThrow("Invalid interval");
  });

  it("should work with a custom comparator (string intervals)", () => {
    const tree = new IntervalTree<string>((a, b) => a.localeCompare(b));
    tree.insert({ low: "apple", high: "cherry" });
    tree.insert({ low: "banana", high: "date" });
    const results = tree.search("blueberry");
    expect(results).toHaveLength(2);
    expect(tree.search("aardvark")).toHaveLength(0);
  });

  it("should correctly search after removing all intervals", () => {
    const tree = new IntervalTree<number>();
    tree.insert({ low: 1, high: 5 });
    tree.insert({ low: 10, high: 15 });
    tree.remove({ low: 1, high: 5 });
    tree.remove({ low: 10, high: 15 });
    expect(tree.isEmpty()).toBe(true);
    expect(tree.search(3)).toHaveLength(0);
  });
});

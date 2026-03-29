/**
 * Generic Interval Tree (centered / augmented BST).
 * Stores intervals [low, high] and supports insert, remove, search(point).
 */

export interface Interval<T = number> {
  low: T;
  high: T;
}

export class IntervalTreeNode<T = number> {
  interval: Interval<T>;
  maxHigh: T;
  left: IntervalTreeNode<T> | null = null;
  right: IntervalTreeNode<T> | null = null;

  constructor(interval: Interval<T>, maxHigh: T) {
    this.interval = interval;
    this.maxHigh = maxHigh;
  }
}

export class IntervalTree<T = number> {
  private root: IntervalTreeNode<T> | null = null;
  private comparator: (a: T, b: T) => number;

  constructor(comparator?: (a: T, b: T) => number) {
    this.comparator = comparator ?? ((a: any, b: any) => (a as number) - (b as number));
  }

  private cmp(a: T, b: T): number {
    return this.comparator(a, b);
  }

  private max(a: T, b: T): T {
    return this.cmp(a, b) >= 0 ? a : b;
  }

  insert(interval: Interval<T>): void {
    if (this.cmp(interval.low, interval.high) > 0) {
      throw new Error("Invalid interval: low > high");
    }
    this.root = this._insert(this.root, interval);
  }

  private _insert(node: IntervalTreeNode<T> | null, interval: Interval<T>): IntervalTreeNode<T> {
    if (node === null) {
      return new IntervalTreeNode<T>(interval, interval.high);
    }
    const c = this.cmp(interval.low, node.interval.low);
    if (c < 0) {
      node.left = this._insert(node.left, interval);
    } else {
      node.right = this._insert(node.right, interval);
    }
    node.maxHigh = this.max(node.maxHigh, interval.high);
    return node;
  }

  remove(interval: Interval<T>): boolean {
    if (this.root === null) return false;
    const result = { found: false };
    this.root = this._remove(this.root, interval, result);
    return result.found;
  }

  private _remove(
    node: IntervalTreeNode<T> | null,
    interval: Interval<T>,
    result: { found: boolean }
  ): IntervalTreeNode<T> | null {
    if (node === null) return null;

    const lowC = this.cmp(interval.low, node.interval.low);
    const highC = this.cmp(interval.high, node.interval.high);

    if (lowC < 0) {
      node.left = this._remove(node.left, interval, result);
    } else if (lowC > 0) {
      node.right = this._remove(node.right, interval, result);
    } else if (highC !== 0) {
      node.right = this._remove(node.right, interval, result);
    } else {
      result.found = true;
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;
      const successor = this._minNode(node.right);
      node.interval = successor.interval;
      node.right = this._remove(node.right, successor.interval, { found: true });
    }

    if (node !== null) {
      node.maxHigh = node.interval.high;
      if (node.left !== null) node.maxHigh = this.max(node.maxHigh, node.left.maxHigh);
      if (node.right !== null) node.maxHigh = this.max(node.maxHigh, node.right.maxHigh);
    }
    return node;
  }

  private _minNode(node: IntervalTreeNode<T>): IntervalTreeNode<T> {
    let current = node;
    while (current.left !== null) current = current.left;
    return current;
  }

  search(point: T): Interval<T>[] {
    const results: Interval<T>[] = [];
    this._search(this.root, point, results);
    return results;
  }

  private _search(node: IntervalTreeNode<T> | null, point: T, results: Interval<T>[]): void {
    while (node !== null) {
      if (this.cmp(point, node.interval.low) >= 0 && this.cmp(point, node.interval.high) <= 0) {
        results.push(node.interval);
      }
      if (node.left !== null && this.cmp(point, node.left.maxHigh) <= 0) {
        node = node.left;
      } else {
        node = node.right;
      }
    }
  }

  isEmpty(): boolean {
    return this.root === null;
  }
}

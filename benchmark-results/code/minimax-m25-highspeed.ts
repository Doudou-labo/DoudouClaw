/**
 * IntervalTree — generic, typed, production-ready
 * Supports intervals of any type T that has numeric bounds.
 */

export interface Interval<T> {
  low: T;
  high: T;
}

function toNumber<T>(v: T): number {
  return v as unknown as number;
}

/**
 * Node in the augmented AVL/RedBlack-inspired self-balancing tree.
 * Each node stores an interval, its midpoint, and sub-tree bounds (min/high)
 * for O(log n) stabbing queries.
 */
interface Node<T> {
  interval: Interval<T>;
  mid: number;
  left: Node<T> | null;
  right: Node<T> | null;
  height: number;
  minHigh: number;   // minimum `high` value in this subtree
  maxHigh: number;   // maximum `high` value in this subtree
}

export class IntervalTree<T> {
  private root: Node<T> | null = null;
  private cmp: (a: T, b: T) => number;

  constructor(cmp?: (a: T, b: T) => number) {
    this.cmp = cmp ?? ((a, b) => toNumber(a) - toNumber(b));
  }

  // ── Public API ────────────────────────────────────────────────

  insert(interval: Interval<T>): void {
    this.root = this.insertNode(this.root, interval);
  }

  remove(interval: Interval<T>): void {
    this.root = this.removeNode(this.root, interval);
  }

  /**
   * Returns all intervals that contain the given point.
   * O(log n + k) where k = number of overlapping intervals.
   */
  search(point: T): Interval<T>[] {
    const p = toNumber(point);
    const results: Interval<T>[] = [];
    this.stabbingQuery(this.root, p, results);
    return results;
  }

  /**
   * Returns true if any interval overlaps the given point.
   * O(log n).
   */
  overlapsPoint(point: T): boolean {
    return this.overlapsPointNode(this.root, toNumber(point));
  }

  /**
   * Returns all intervals that overlap the given interval.
   * O(log n + k).
   */
  searchOverlap(interval: Interval<T>): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.overlapQuery(this.root, interval, results);
    return results;
  }

  /** In-order traversal */
  inOrder(): Interval<T>[] {
    const result: Interval<T>[] = [];
    this.inOrderWalk(this.root, result);
    return result;
  }

  get size(): number {
    return this.countNodes(this.root);
  }

  get isEmpty(): boolean {
    return this.root === null;
  }

  // ── Private helpers ────────────────────────────────────────────

  private insertNode(node: Node<T> | null, interval: Interval<T>): Node<T> {
    if (node === null) {
      return this.makeNode(interval);
    }

    const cmp = this.cmp(interval.low, node.interval.low);
    if (cmp < 0) {
      node.left = this.insertNode(node.left, interval);
      if (this.height(node.left) - this.height(node.right) === 2) {
        node = this.balanceLeft(node, interval);
      }
    } else if (cmp > 0) {
      node.right = this.insertNode(node.right, interval);
      if (this.height(node.right) - this.height(node.left) === 2) {
        node = this.balanceRight(node, interval);
      }
    } else {
      // Duplicate low bound — store in right subtree
      node.right = this.insertNode(node.right, interval);
    }

    return this.recalc(node);
  }

  private removeNode(node: Node<T> | null, interval: Interval<T>): Node<T> | null {
    if (node === null) return null;

    const cmp = this.cmp(interval.low, node.interval.low);
    if (cmp < 0) {
      node.left = this.removeNode(node.left, interval);
    } else if (cmp > 0) {
      node.right = this.removeNode(node.right, interval);
    } else {
      // Found node — handle removal
      if (node.left !== null && node.right !== null) {
        const successor = this.minNode(node.right);
        node.interval = successor.interval;
        node.right = this.removeNode(node.right, successor.interval);
      } else {
        return node.left ?? node.right;
      }
    }

    if (node === null) return null;

    node = this.rebalance(node);
    return this.recalc(node);
  }

  private minNode(node: Node<T>): Node<T> {
    while (node.left !== null) node = node.left;
    return node;
  }

  // ── AVL balance ────────────────────────────────────────────────

  private balanceLeft(node: Node<T>, interval: Interval<T>): Node<T> {
    const child = node.left!;
    if (this.cmp(interval.low, child.interval.low) < 0) {
      return this.rotateRight(node);
    } else {
      node.left = this.rotateLeft(child);
      return this.rotateRight(node);
    }
  }

  private balanceRight(node: Node<T>, interval: Interval<T>): Node<T> {
    const child = node.right!;
    if (this.cmp(interval.low, child.interval.low) >= 0) {
      return this.rotateLeft(node);
    } else {
      node.right = this.rotateRight(child);
      return this.rotateLeft(node);
    }
  }

  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    this.recalcBoth(x, y);
    return x;
  }

  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    this.recalcBoth(x, y);
    return y;
  }

  private rebalance(node: Node<T>): Node<T> {
    const lh = this.height(node.left);
    const rh = this.height(node.right);
    if (lh - rh === 2) {
      const child = node.left!;
      if (this.height(child.right) > this.height(child.left)) {
        node.left = this.rotateLeft(child);
      }
      node = this.rotateRight(node);
    } else if (rh - lh === 2) {
      const child = node.right!;
      if (this.height(child.left) > this.height(child.right)) {
        node.right = this.rotateRight(child);
      }
      node = this.rotateLeft(node);
    }
    return node;
  }

  // ── Rebalance & Recalc ─────────────────────────────────────────

  private recalc(node: Node<T>): Node<T> {
    this.recalcBoth(node);
    return node;
  }

  private recalcBoth(...nodes: Node<T>[]): void {
    for (const node of nodes) {
      if (node) {
        node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
        const highN = toNumber(node.interval.high);
        const leftHigh = node.left?.minHigh ?? Infinity;
        const rightHigh = node.right?.minHigh ?? Infinity;
        node.minHigh = Math.min(highN, leftHigh, rightHigh);
        const leftMax = node.left?.maxHigh ?? -Infinity;
        const rightMax = node.right?.maxHigh ?? -Infinity;
        node.maxHigh = Math.max(highN, leftMax, rightMax);
        node.mid = (toNumber(node.interval.low) + toNumber(node.interval.high)) / 2;
      }
    }
  }

  private height(node: Node<T> | null): number {
    return node?.height ?? 0;
  }

  private makeNode(interval: Interval<T>): Node<T> {
    const mid = (toNumber(interval.low) + toNumber(interval.high)) / 2;
    const highN = toNumber(interval.high);
    return {
      interval,
      mid,
      left: null,
      right: null,
      height: 1,
      minHigh: highN,
      maxHigh: highN,
    };
  }

  private countNodes(node: Node<T> | null): number {
    if (node === null) return 0;
    return 1 + this.countNodes(node.left) + this.countNodes(node.right);
  }

  // ── Stabbing / Overlap queries ──────────────────────────────────

  private stabbingQuery(node: Node<T> | null, point: number, out: Interval<T>[]): void {
    if (node === null) return;

    // If point < low, go left only (intervals on the right all start higher)
    // If point > maxHigh, no interval in this subtree can contain point
    if (point < toNumber(node.interval.low)) {
      this.stabbingQuery(node.left, point, out);
      return;
    }
    if (point > node.maxHigh) return;

    // Check this node
    if (point >= toNumber(node.interval.low) && point <= toNumber(node.interval.high)) {
      out.push(node.interval);
    }

    // Left subtree: if point >= mid, some intervals there may contain point
    if (point <= node.mid) {
      this.stabbingQuery(node.left, point, out);
    }

    // Right subtree
    this.stabbingQuery(node.right, point, out);
  }

  private overlapsPointNode(node: Node<T> | null, point: number): boolean {
    if (node === null) return false;
    if (point < toNumber(node.interval.low)) {
      return this.overlapsPointNode(node.left, point);
    }
    if (point > node.maxHigh) return false;
    if (point >= toNumber(node.interval.low) && point <= toNumber(node.interval.high)) {
      return true;
    }
    if (point <= node.mid) {
      if (this.overlapsPointNode(node.left, point)) return true;
    }
    return this.overlapsPointNode(node.right, point);
  }

  private overlapQuery(node: Node<T> | null, interval: Interval<T>, out: Interval<T>[]): void {
    if (node === null) return;

    const lo = toNumber(interval.low);
    const hi = toNumber(interval.high);

    // Prune: if node's minHigh > hi, no overlap possible
    if (node.minHigh > hi) return;
    // Prune: if node's interval low > interval high, no overlap
    if (toNumber(node.interval.low) > hi) return;
    if (toNumber(node.interval.high) < lo) return;

    // Check overlap
    const nodeLo = toNumber(node.interval.low);
    const nodeHi = toNumber(node.interval.high);
    if (nodeLo <= hi && nodeHi >= lo) {
      out.push(node.interval);
    }

    if (node.mid >= lo) {
      this.overlapQuery(node.left, interval, out);
    }
    if (node.mid <= hi) {
      this.overlapQuery(node.right, interval, out);
    }
  }

  private inOrderWalk(node: Node<T> | null, out: Interval<T>[]): void {
    if (node === null) return;
    this.inOrderWalk(node.left, out);
    out.push(node.interval);
    this.inOrderWalk(node.right, out);
  }
}

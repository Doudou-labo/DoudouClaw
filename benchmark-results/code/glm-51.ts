/**
 * IntervalTree — AVL-balanced interval tree for efficient overlap queries.
 *
 * Each node stores an interval [low, high] with an associated value,
 * plus `maxHigh` (the maximum `high` in its subtree) for pruning.
 * All operations are O(log n) amortised.
 */

/** Internal tree node */
class IntervalNode<T> {
  low: number;
  high: number;
  value: T;
  maxHigh: number;
  height: number;
  left: IntervalNode<T> | null = null;
  right: IntervalNode<T> | null = null;

  constructor(low: number, high: number, value: T) {
    this.low = low;
    this.high = high;
    this.value = value;
    this.maxHigh = high;
    this.height = 1;
  }
}

export class IntervalTree<T> {
  private root: IntervalNode<T> | null = null;
  private _size = 0;

  // ── Public API ──────────────────────────────────────────────

  /** Number of intervals stored. */
  get size(): number {
    return this._size;
  }

  /** Insert interval [low, high] with associated `value`. */
  insert(low: number, high: number, value: T): void {
    if (low > high) throw new RangeError(`low (${low}) must be <= high (${high})`);
    this.root = this.insertNode(this.root, low, high, value);
    this._size++;
  }

  /** Return all values whose interval contains `point`. */
  search(point: number): T[] {
    const results: T[] = [];
    this.searchNode(this.root, point, results);
    return results;
  }

  /**
   * Remove the first node whose interval equals [low, high] **and**
   * whose value equals `value` (triple-equality). Returns true if removed.
   */
  remove(low: number, high: number, value: T): boolean {
    const ctx: { removed: boolean } = { removed: false };
    this.root = this.removeNode(this.root, low, high, value, ctx);
    if (ctx.removed) this._size--;
    return ctx.removed;
  }

  // ── AVL helpers ─────────────────────────────────────────────

  private height(n: IntervalNode<T> | null): number {
    return n ? n.height : 0;
  }

  private maxHigh(n: IntervalNode<T> | null): number {
    return n ? n.maxHigh : -Infinity;
  }

  private update(n: IntervalNode<T>): void {
    n.height = 1 + Math.max(this.height(n.left), this.height(n.right));
    n.maxHigh = Math.max(n.high, this.maxHigh(n.left), this.maxHigh(n.right));
  }

  private balanceFactor(n: IntervalNode<T>): number {
    return this.height(n.left) - this.height(n.right);
  }

  private rotateRight(y: IntervalNode<T>): IntervalNode<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    this.update(y);
    this.update(x);
    return x;
  }

  private rotateLeft(x: IntervalNode<T>): IntervalNode<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    this.update(x);
    this.update(y);
    return y;
  }

  private rebalance(n: IntervalNode<T>): IntervalNode<T> {
    this.update(n);
    const bf = this.balanceFactor(n);

    if (bf > 1) {
      if (this.balanceFactor(n.left!) < 0) n.left = this.rotateLeft(n.left!);
      return this.rotateRight(n);
    }
    if (bf < -1) {
      if (this.balanceFactor(n.right!) > 0) n.right = this.rotateRight(n.right!);
      return this.rotateLeft(n);
    }
    return n;
  }

  // ── Internal insert ─────────────────────────────────────────

  private insertNode(
    n: IntervalNode<T> | null,
    low: number,
    high: number,
    value: T,
  ): IntervalNode<T> {
    if (!n) return new IntervalNode(low, high, value);

    if (low < n.low) {
      n.left = this.insertNode(n.left, low, high, value);
    } else {
      n.right = this.insertNode(n.right, low, high, value);
    }
    return this.rebalance(n);
  }

  // ── Internal search ─────────────────────────────────────────

  private searchNode(n: IntervalNode<T> | null, point: number, out: T[]): void {
    if (!n) return;

    // Prune: if the maximum high in this subtree < point, nothing matches
    if (n.maxHigh < point) return;

    this.searchNode(n.left, point, out);

    if (point >= n.low && point <= n.high) out.push(n.value);

    // If point < n.low, right subtree intervals all start >= n.low > point → skip
    if (point >= n.low) this.searchNode(n.right, point, out);
  }

  // ── Internal remove ─────────────────────────────────────────

  private removeNode(
    n: IntervalNode<T> | null,
    low: number,
    high: number,
    value: T,
    ctx: { removed: boolean },
  ): IntervalNode<T> | null {
    if (!n) return null;

    // First try to find the target in the left subtree (smaller keys)
    if (low < n.low || (low === n.low && !ctx.removed)) {
      n.left = this.removeNode(n.left, low, high, value, ctx);
    }

    // If not yet removed, check this node
    if (!ctx.removed && n.low === low && n.high === high && n.value === value) {
      ctx.removed = true;
      // Node found — delete it
      if (!n.left) return n.right;
      if (!n.right) return n.left;
      // In-order successor
      let succ = n.right;
      while (succ.left) succ = succ.left;
      n.low = succ.low;
      n.high = succ.high;
      n.value = succ.value;
      n.right = this.removeNode(n.right, succ.low, succ.high, succ.value, { removed: true });
    } else if (!ctx.removed) {
      n.right = this.removeNode(n.right, low, high, value, ctx);
    }

    return this.rebalance(n);
  }
}

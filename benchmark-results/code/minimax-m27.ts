/**
 * IntervalTree — generic, typed, no-dependency
 * Supports: insert, remove, search (point query)
 */

export interface Interval<T> {
  start: number;
  end: number;
  data?: T;
}

interface Node<T> {
  interval: Interval<T>;
  max: number;
  left: Node<T> | null;
  right: Node<T> | null;
  height: number;
}

export class IntervalTree<T = unknown> {
  private root: Node<T> | null = null;

  // ── helpers ────────────────────────────────────────────────

  private maxOf(a: number, b: number): number {
    return a > b ? a : b;
  }

  private height(n: Node<T> | null): number {
    return n ? n.height : 0;
  }

  private newNode(interval: Interval<T>): Node<T> {
    return {
      interval,
      max: interval.end,
      left: null,
      right: null,
      height: 1,
    };
  }

  private balance(n: Node<T> | null): number {
    return n ? this.height(n.left) - this.height(n.right) : 0;
  }

  private updateMax(n: Node<T>): void {
    n.max = this.maxOf(
      n.interval.end,
      this.maxOf(n.left ? n.left.max : 0, n.right ? n.right.max : 0)
    );
  }

  private updateHeight(n: Node<T>): void {
    n.height = 1 + this.maxOf(this.height(n.left), this.height(n.right));
  }

  // ── rotations ──────────────────────────────────────────────

  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    this.updateHeight(y);
    this.updateHeight(x);
    this.updateMax(y);
    this.updateMax(x);
    return x;
  }

  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right!;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    this.updateHeight(x);
    this.updateHeight(y);
    this.updateMax(x);
    this.updateMax(y);
    return y;
  }

  // ── core bst insert with rebalance ─────────────────────────

  private _insert(node: Node<T> | null, interval: Interval<T>): Node<T> {
    if (!node) return this.newNode(interval);

    if (interval.start < node.interval.start) {
      node.left = this._insert(node.left, interval);
    } else if (interval.start > node.interval.start) {
      node.right = this._insert(node.right, interval);
    } else {
      // same start — replace payload but keep subtree
      node.interval = interval;
      this.updateMax(node);
      return node;
    }

    this.updateHeight(node);
    this.updateMax(node);

    const bal = this.balance(node);

    // LL
    if (bal > 1 && interval.start < node.left!.interval.start) {
      return this.rotateRight(node);
    }
    // RR
    if (bal < -1 && interval.start > node.right!.interval.start) {
      return this.rotateLeft(node);
    }
    // LR
    if (bal > 1 && interval.start > node.left!.interval.start) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }
    // RL
    if (bal < -1 && interval.start < node.right!.interval.start) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  // ── public API ─────────────────────────────────────────────

  insert(start: number, end: number, data?: T): void {
    const interval: Interval<T> = { start, end, data };
    this.root = this._insert(this.root, interval);
  }

  remove(start: number): boolean {
    const removed = { found: false };
    this.root = this._remove(this.root, start, removed);
    return removed.found;
  }

  private _remove(
    node: Node<T> | null,
    start: number,
    removed: { found: boolean }
  ): Node<T> | null {
    if (!node) return null;

    if (start < node.interval.start) {
      node.left = this._remove(node.left, start, removed);
    } else if (start > node.interval.start) {
      node.right = this._remove(node.right, start, removed);
    } else {
      removed.found = true;
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // two children: swap with inorder predecessor (max of left)
      let successor = node.left;
      while (successor.right) successor = successor.right;
      node.interval = successor.interval;
      node.left = this._remove(node.left, successor.interval.start, removed);
    }

    if (!node) return null;
    this.updateHeight(node);
    this.updateMax(node);

    const bal = this.balance(node);
    const leftH = this.height(node.left);
    const rightH = this.height(node.right);

    if (bal > 1 && this.balance(node.left) >= 0) return this.rotateRight(node);
    if (bal > 1 && this.balance(node.left) < 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }
    if (bal < -1 && this.balance(node.right) <= 0) return this.rotateLeft(node);
    if (bal < -1 && this.balance(node.right) > 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  /**
   * Returns all intervals that contain the given point.
   */
  search(point: number): Interval<T>[] {
    const result: Interval<T>[] = [];
    this._search(this.root, point, result);
    return result;
  }

  private _search(node: Node<T> | null, point: number, out: Interval<T>[]): void {
    if (!node) return;

    // If node.max < point, nothing in this subtree can contain point
    if (node.max < point) return;

    if (node.interval.start <= point && point <= node.interval.end) {
      out.push(node.interval);
    }

    if (node.left && node.left.max >= point) {
      this._search(node.left, point, out);
    }

    this._search(node.right, point, out);
  }

  /** In-order traversal for debugging / verification */
  inOrder(): Interval<T>[] {
    const result: Interval<T>[] = [];
    this._inOrder(this.root, result);
    return result;
  }

  private _inOrder(node: Node<T> | null, out: Interval<T>[]): void {
    if (!node) return;
    this._inOrder(node.left, out);
    out.push(node.interval);
    this._inOrder(node.right, out);
  }
}

/**
 * Generic Interval Tree — AVL-backed
 * insert, remove, search(point)
 * O(log n) for insert and search
 */

export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

interface Node<T> {
  iv: Interval<T>;
  max: number;
  left: Node<T> | null;
  right: Node<T> | null;
  height: number;
}

export class IntervalTree<T> {
  private root: Node<T> | null = null;
  private _size = 0;

  // ── height / balance ──────────────────────────────────────

  private height(n: Node<T> | null): number {
    return n?.height ?? 0;
  }

  private bf(n: Node<T>): number {
    return this.height(n.left) - this.height(n.right);
  }

  private refresh(n: Node<T>): void {
    n.height = 1 + Math.max(this.height(n.left), this.height(n.right));
    n.max = Math.max(
      n.iv.end,
      Math.max(n.left?.max ?? -Infinity, n.right?.max ?? -Infinity),
    );
  }

  // ── rotations ─────────────────────────────────────────────

  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;
    y.left = x.right;
    x.right = y;
    this.refresh(y);
    this.refresh(x);
    return x;
  }

  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right!;
    x.right = y.left;
    y.left = x;
    this.refresh(x);
    this.refresh(y);
    return y;
  }

  private balance(n: Node<T>): Node<T> {
    const bal = this.bf(n);
    if (bal > 1) {
      if (this.bf(n.left!) < 0) n.left = this.rotateLeft(n.left!);
      return this.rotateRight(n);
    }
    if (bal < -1) {
      if (this.bf(n.right!) > 0) n.right = this.rotateRight(n.right!);
      return this.rotateLeft(n);
    }
    return n;
  }

  // ── insert ────────────────────────────────────────────────

  insert(start: number, end: number, value: T): void {
    if (start > end) throw new Error(`Invalid interval: ${start} > ${end}`);
    const iv: Interval<T> = { start, end, value };
    this.root = this.ins(this.root, iv);
    this._size++;
  }

  private ins(n: Node<T> | null, iv: Interval<T>): Node<T> {
    if (!n) return { iv, max: iv.end, left: null, right: null, height: 1 };

    if (iv.start < n.iv.start || (iv.start === n.iv.start && iv.end < n.iv.end)) {
      n.left = this.ins(n.left, iv);
    } else {
      n.right = this.ins(n.right, iv);
    }

    this.refresh(n);
    return this.balance(n);
  }

  // ── search(point) ─────────────────────────────────────────

  search(point: number): Interval<T>[] {
    const out: Interval<T>[] = [];
    this.searchNode(this.root, point, out);
    return out;
  }

  private searchNode(n: Node<T> | null, pt: number, out: Interval<T>[]): void {
    if (!n) return;

    if (n.left && n.left.max >= pt) this.searchNode(n.left, pt, out);

    if (n.iv.start <= pt && pt <= n.iv.end) out.push(n.iv);

    if (n.right && n.iv.start <= pt) this.searchNode(n.right, pt, out);
  }

  // ── remove ───────────────────────────────────────────────

  remove(value: T): boolean {
    const before = this._size;
    this.root = this.rem(this.root, value);
    return this._size < before;
  }

  private rem(n: Node<T> | null, value: T): Node<T> | null {
    if (!n) return null;

    if (n.iv.value === value) {
      // Found node to delete
      this._size--;
      if (!n.left) return n.right;
      if (!n.right) return n.left;
      // Two children: replace with in-order successor
      const succ = this.minNode(n.right);
      n.iv = succ.iv;
      n.right = this.remMin(n.right!);
    } else {
      // Tree is ordered by (start, end) — search both subtrees
      n.left = this.rem(n.left, value);
      n.right = this.rem(n.right, value);
    }

    this.refresh(n);
    return this.balance(n);
  }

  private minNode(n: Node<T>): Node<T> {
    return n.left ? this.minNode(n.left) : n;
  }

  private remMin(n: Node<T>): Node<T> | null {
    if (!n.left) return n.right;
    n.left = this.remMin(n.left);
    this.refresh(n);
    return this.balance(n);
  }

  // ── helpers ─────────────────────────────────────────────

  get size(): number {
    return this._size;
  }

  isEmpty(): boolean {
    return this._size === 0;
  }

  getAll(): Interval<T>[] {
    const out: Interval<T>[] = [];
    this.inorder(this.root, out);
    return out;
  }

  private inorder(n: Node<T> | null, out: Interval<T>[]): void {
    if (!n) return;
    this.inorder(n.left, out);
    out.push(n.iv);
    this.inorder(n.right, out);
  }

  clear(): void {
    this.root = null;
    this._size = 0;
  }
}

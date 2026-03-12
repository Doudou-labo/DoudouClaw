/**
 * Interval Tree implementation in pure TypeScript.
 * Uses an Augmented Red-Black Tree for O(log n) insert, search, and delete.
 *
 * Each node stores:
 *  - interval [start, end]
 *  - associated value
 *  - maxEnd: maximum end value in the subtree (augmentation for overlap search)
 *  - color: RED or BLACK (for RB balancing)
 */

export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

const enum Color {
  RED = 0,
  BLACK = 1,
}

interface Node<T> {
  interval: Interval<T>;
  maxEnd: number;
  color: Color;
  left: Node<T> | null;
  right: Node<T> | null;
  parent: Node<T> | null;
}

function createNode<T>(interval: Interval<T>): Node<T> {
  return {
    interval,
    maxEnd: interval.end,
    color: Color.RED,
    left: null,
    right: null,
    parent: null,
  };
}

export class IntervalTree<T> {
  private root: Node<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  /** Insert an interval [start, end] with an associated value. O(log n) */
  insert(start: number, end: number, value: T): void {
    if (start > end) throw new RangeError(`start (${start}) must be <= end (${end})`);
    const interval: Interval<T> = { start, end, value };
    const node = createNode(interval);
    this.bstInsert(node);
    this.fixInsert(node);
    this._size++;
  }

  /**
   * Return all intervals overlapping a given point p.
   * [s, e] overlaps p iff s <= p <= e.
   * O(log n + k) where k is the number of results.
   */
  queryPoint(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchPoint(this.root, point, results);
    return results;
  }

  /**
   * Return all intervals overlapping the query interval [qs, qe].
   * Two intervals overlap iff they are NOT disjoint: !(qe < s || e < qs)
   * O(log n + k) where k is the number of results.
   */
  queryInterval(qs: number, qe: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    this.searchInterval(this.root, qs, qe, results);
    return results;
  }

  /**
   * Delete the first interval whose value strictly equals `value` (===).
   * Returns true if something was deleted, false otherwise. O(log n)
   */
  delete(value: T): boolean {
    const node = this.findByValue(this.root, value);
    if (!node) return false;
    this.deleteNode(node);
    this._size--;
    return true;
  }

  /**
   * Return all intervals sorted by start (then by end, then insertion order).
   * O(n)
   */
  getAll(): Interval<T>[] {
    const result: Interval<T>[] = [];
    this.inorder(this.root, result);
    return result;
  }

  // ─── BST helpers ─────────────────────────────────────────────────────────────

  private bstInsert(node: Node<T>): void {
    let current = this.root;
    let parent: Node<T> | null = null;

    while (current !== null) {
      parent = current;
      // Update maxEnd on the way down
      if (node.interval.end > current.maxEnd) current.maxEnd = node.interval.end;

      if (node.interval.start < current.interval.start) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    node.parent = parent;
    if (parent === null) {
      this.root = node;
    } else if (node.interval.start < parent.interval.start) {
      parent.left = node;
    } else {
      parent.right = node;
    }
  }

  private updateMaxEnd(node: Node<T>): void {
    node.maxEnd = node.interval.end;
    if (node.left && node.left.maxEnd > node.maxEnd) node.maxEnd = node.left.maxEnd;
    if (node.right && node.right.maxEnd > node.maxEnd) node.maxEnd = node.right.maxEnd;
  }

  // ─── Red-Black Tree balancing ────────────────────────────────────────────────

  private fixInsert(z: Node<T>): void {
    while (z.parent !== null && z.parent.color === Color.RED) {
      const parent = z.parent;
      const grandparent = parent.parent!;

      if (parent === grandparent.left) {
        const uncle = grandparent.right;
        if (uncle !== null && uncle.color === Color.RED) {
          // Case 1
          parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          grandparent.color = Color.RED;
          z = grandparent;
        } else {
          if (z === parent.right) {
            // Case 2
            z = parent;
            this.rotateLeft(z);
          }
          // Case 3
          z.parent!.color = Color.BLACK;
          z.parent!.parent!.color = Color.RED;
          this.rotateRight(z.parent!.parent!);
        }
      } else {
        const uncle = grandparent.left;
        if (uncle !== null && uncle.color === Color.RED) {
          parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          grandparent.color = Color.RED;
          z = grandparent;
        } else {
          if (z === parent.left) {
            z = parent;
            this.rotateRight(z);
          }
          z.parent!.color = Color.BLACK;
          z.parent!.parent!.color = Color.RED;
          this.rotateLeft(z.parent!.parent!);
        }
      }
    }
    this.root!.color = Color.BLACK;
  }

  private rotateLeft(x: Node<T>): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left !== null) y.left.parent = x;
    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;

    // Update maxEnd bottom-up
    this.updateMaxEnd(x);
    this.updateMaxEnd(y);
  }

  private rotateRight(x: Node<T>): void {
    const y = x.left!;
    x.left = y.right;
    if (y.right !== null) y.right.parent = x;
    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    y.right = x;
    x.parent = y;

    this.updateMaxEnd(x);
    this.updateMaxEnd(y);
  }

  // ─── Deletion ─────────────────────────────────────────────────────────────────

  private findByValue(node: Node<T> | null, value: T): Node<T> | null {
    if (node === null) return null;
    if (node.interval.value === value) return node;
    return this.findByValue(node.left, value) ?? this.findByValue(node.right, value);
  }

  private minimum(node: Node<T>): Node<T> {
    while (node.left !== null) node = node.left;
    return node;
  }

  private transplant(u: Node<T>, v: Node<T> | null): void {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    if (v !== null) v.parent = u.parent;
  }

  private deleteNode(z: Node<T>): void {
    let y = z;
    let yOriginalColor = y.color;
    let x: Node<T> | null;
    let xParent: Node<T> | null;

    if (z.left === null) {
      x = z.right;
      xParent = z.parent;
      this.transplant(z, z.right);
    } else if (z.right === null) {
      x = z.left;
      xParent = z.parent;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;

      if (y.parent === z) {
        xParent = y;
      } else {
        xParent = y.parent;
        this.transplant(y, y.right);
        y.right = z.right;
        y.right.parent = y;
      }

      this.transplant(z, y);
      y.left = z.left;
      y.left.parent = y;
      y.color = z.color;
    }

    // Recompute maxEnd upward from xParent
    this.fixMaxEndUp(xParent);

    if (yOriginalColor === Color.BLACK) {
      this.fixDelete(x, xParent);
    }
  }

  private fixMaxEndUp(node: Node<T> | null): void {
    while (node !== null) {
      this.updateMaxEnd(node);
      node = node.parent;
    }
  }

  private fixDelete(x: Node<T> | null, xParent: Node<T> | null): void {
    while (x !== this.root && (x === null || x.color === Color.BLACK)) {
      if (xParent === null) break;

      if (x === xParent.left) {
        let w = xParent.right;
        if (w === null) { x = xParent; xParent = x.parent; continue; }

        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          xParent.color = Color.RED;
          this.rotateLeft(xParent);
          w = xParent.right;
        }

        if (w === null) { x = xParent; xParent = x.parent; continue; }

        const wLeftBlack = w.left === null || w.left.color === Color.BLACK;
        const wRightBlack = w.right === null || w.right.color === Color.BLACK;

        if (wLeftBlack && wRightBlack) {
          w.color = Color.RED;
          x = xParent;
          xParent = x.parent;
        } else {
          if (wRightBlack) {
            if (w.left !== null) w.left.color = Color.BLACK;
            w.color = Color.RED;
            this.rotateRight(w);
            w = xParent.right;
          }
          if (w !== null) {
            w.color = xParent.color;
            if (w.right !== null) w.right.color = Color.BLACK;
          }
          xParent.color = Color.BLACK;
          this.rotateLeft(xParent);
          x = this.root;
          xParent = null;
        }
      } else {
        let w = xParent.left;
        if (w === null) { x = xParent; xParent = x.parent; continue; }

        if (w.color === Color.RED) {
          w.color = Color.BLACK;
          xParent.color = Color.RED;
          this.rotateRight(xParent);
          w = xParent.left;
        }

        if (w === null) { x = xParent; xParent = x.parent; continue; }

        const wRightBlack = w.right === null || w.right.color === Color.BLACK;
        const wLeftBlack = w.left === null || w.left.color === Color.BLACK;

        if (wRightBlack && wLeftBlack) {
          w.color = Color.RED;
          x = xParent;
          xParent = x.parent;
        } else {
          if (wLeftBlack) {
            if (w.right !== null) w.right.color = Color.BLACK;
            w.color = Color.RED;
            this.rotateLeft(w);
            w = xParent.left;
          }
          if (w !== null) {
            w.color = xParent.color;
            if (w.left !== null) w.left.color = Color.BLACK;
          }
          xParent.color = Color.BLACK;
          this.rotateRight(xParent);
          x = this.root;
          xParent = null;
        }
      }
    }
    if (x !== null) x.color = Color.BLACK;
  }

  // ─── Search ───────────────────────────────────────────────────────────────────

  private searchPoint(node: Node<T> | null, point: number, results: Interval<T>[]): void {
    if (node === null) return;
    // Prune: if maxEnd of this subtree < point, no interval in subtree can contain point
    if (node.maxEnd < point) return;

    // Search left subtree
    this.searchPoint(node.left, point, results);

    // Check this node
    const { start, end } = node.interval;
    if (start <= point && point <= end) {
      results.push(node.interval);
    }

    // Prune right: if node.start > point, no node in right subtree can start <= point
    if (node.interval.start <= point) {
      this.searchPoint(node.right, point, results);
    }
  }

  private searchInterval(
    node: Node<T> | null,
    qs: number,
    qe: number,
    results: Interval<T>[],
  ): void {
    if (node === null) return;
    // Prune: subtree max end < qs → no overlap possible
    if (node.maxEnd < qs) return;

    this.searchInterval(node.left, qs, qe, results);

    const { start, end } = node.interval;
    // Overlap condition: NOT (qe < start || end < qs)
    if (!(qe < start || end < qs)) {
      results.push(node.interval);
    }

    if (node.interval.start <= qe) {
      this.searchInterval(node.right, qs, qe, results);
    }
  }

  // ─── Traversal ────────────────────────────────────────────────────────────────

  private inorder(node: Node<T> | null, result: Interval<T>[]): void {
    if (node === null) return;
    this.inorder(node.left, result);
    result.push(node.interval);
    this.inorder(node.right, result);
  }
}

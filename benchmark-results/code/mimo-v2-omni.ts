/**
 * Generic Interval Tree — Treap-based implementation.
 *
 * Each node stores an interval [low, high] and an associated value of type T.
 * The tree is augmented with `maxHigh` so that point queries can prune
 * entire sub-trees that cannot contain a matching interval.
 *
 * Expected time complexity (randomised treap):
 *   insert  O(log n)
 *   remove  O(log n)
 *   search  O(log n + k)   where k = number of returned intervals
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Interval<T> {
  low: number;
  high: number;
  value: T;
}

interface TreapNode<T> {
  low: number;
  high: number;
  value: T;
  priority: number;        // heap key (random)
  maxHigh: number;         // subtree max of `high`
  left: TreapNode<T> | null;
  right: TreapNode<T> | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function randomPriority(): number {
  return Math.random();
}

function maxOf(...vals: number[]): number {
  let m = -Infinity;
  for (const v of vals) if (v > m) m = v;
  return m;
}

function recalc<T>(node: TreapNode<T> | null): void {
  if (!node) return;
  node.maxHigh = maxOf(
    node.high,
    node.left ? node.left.maxHigh : -Infinity,
    node.right ? node.right.maxHigh : -Infinity,
  );
}

// ─── Rotations ───────────────────────────────────────────────────────────────

function rotateRight<T>(root: TreapNode<T>): TreapNode<T> {
  const child = root.left!;
  root.left = child.right;
  child.right = root;
  recalc(root);
  recalc(child);
  return child;
}

function rotateLeft<T>(root: TreapNode<T>): TreapNode<T> {
  const child = root.right!;
  root.right = child.left;
  child.left = root;
  recalc(root);
  recalc(child);
  return child;
}

// ─── Insert ──────────────────────────────────────────────────────────────────

function insertNode<T>(root: TreapNode<T> | null, node: TreapNode<T>): TreapNode<T> {
  if (!root) return node;

  if (node.low < root.low || (node.low === root.low && node.high < root.high)) {
    root.left = insertNode(root.left, node);
    if (root.left.priority > root.priority) {
      root = rotateRight(root);
    }
  } else {
    root.right = insertNode(root.right, node);
    if (root.right!.priority > root.priority) {
      root = rotateLeft(root);
    }
  }

  recalc(root);
  return root;
}

// ─── Remove (by value identity) ─────────────────────────────────────────────

function removeNode<T>(
  root: TreapNode<T> | null,
  low: number,
  high: number,
  value: T,
): TreapNode<T> | null {
  if (!root) return null;

  if (low < root.low || (low === root.low && high < root.high) ||
      (low === root.low && high === root.high && value !== root.value && value < root.value)) {
    root.left = removeNode(root.left, low, high, value);
    recalc(root);
    return root;
  }

  if (low > root.low || (low === root.low && high > root.high) ||
      (low === root.low && high === root.high && value !== root.value && value > root.value)) {
    root.right = removeNode(root.right, low, high, value);
    recalc(root);
    return root;
  }

  // Exact match found — remove this node by merging children.
  if (!root.left && !root.right) return null;
  if (!root.left) return root.right;
  if (!root.right) return root.left;

  if (root.left.priority > root.right.priority) {
    root = rotateRight(root);
    root.right = removeNode(root.right, low, high, value);
  } else {
    root = rotateLeft(root);
    root.left = removeNode(root.left, low, high, value);
  }

  recalc(root);
  return root;
}

/** Returns whether removal occurred and the new root. */
function removeNodeChecked<T>(
  root: TreapNode<T> | null,
  low: number,
  high: number,
  value: T,
): { removed: boolean; newRoot: TreapNode<T> | null } {
  if (!findNodeExact(root, low, high, value)) {
    return { removed: false, newRoot: root };
  }
  return { removed: true, newRoot: removeNode(root, low, high, value) };
}

function findNodeExact<T>(
  root: TreapNode<T> | null,
  low: number,
  high: number,
  value: T,
): TreapNode<T> | null {
  while (root) {
    if (low < root.low || (low === root.low && high < root.high)) {
      root = root.left;
    } else if (low > root.low || (low === root.low && high > root.high)) {
      root = root.right;
    } else {
      // low and high match — compare value
      if (value === root.value) return root;
      // value doesn't match — need to check both sides (duplicates with different values)
      const found = findNodeExact(root.left, low, high, value);
      if (found) return found;
      root = root.right;
    }
  }
  return null;
}

// ─── Search (all intervals containing point) ────────────────────────────────

function searchNode<T>(root: TreapNode<T> | null, point: number, out: Interval<T>[]): void {
  if (!root) return;

  // If point is to the right of the max possible high in this subtree, prune.
  if (point > root.maxHigh) return;

  // Check current node.
  if (point >= root.low && point <= root.high) {
    out.push({ low: root.low, high: root.high, value: root.value });
  }

  // Left child may have intervals whose low <= point.
  searchNode(root.left, point, out);

  // Right child: only if its maxHigh >= point (already pruned above),
  // but also we need low <= point. Since low >= root.low for right children
  // in our ordering, we still need to recurse — the maxHigh check above handles pruning.
  if (root.right && root.right.maxHigh >= point) {
    searchNode(root.right, point, out);
  }
}

// ─── Public class ────────────────────────────────────────────────────────────

export class IntervalTree<T = void> {
  private root: TreapNode<T> | null = null;
  private _size = 0;

  /** Number of intervals stored. */
  get size(): number {
    return this._size;
  }

  /** Insert an interval [low, high] with an associated value. */
  insert(low: number, high: number, value: T): void {
    if (low > high) {
      throw new RangeError(`Invalid interval: low (${low}) > high (${high})`);
    }
    const node: TreapNode<T> = {
      low,
      high,
      value,
      priority: randomPriority(),
      maxHigh: high,
      left: null,
      right: null,
    };
    this.root = insertNode(this.root, node);
    this._size++;
  }

  /** Remove the first interval matching low, high, and value. Returns true if removed. */
  remove(low: number, high: number, value: T): boolean {
    const result = removeNodeChecked(this.root, low, high, value);
    if (result.removed) {
      this.root = result.newRoot;
      this._size--;
      return true;
    }
    return false;
  }

  /** Return all intervals that contain the given point. */
  search(point: number): Interval<T>[] {
    const results: Interval<T>[] = [];
    searchNode(this.root, point, results);
    return results;
  }

  /** Remove all intervals. */
  clear(): void {
    this.root = null;
    this._size = 0;
  }

  /** In-order traversal (for debugging / testing). */
  toArray(): Interval<T>[] {
    const out: Interval<T>[] = [];
    this.inOrder(this.root, out);
    return out;
  }

  // ─── Internal helpers ────────────────────────────────────────────────────

  private inOrder(node: TreapNode<T> | null, out: Interval<T>[]): void {
    if (!node) return;
    this.inOrder(node.left, out);
    out.push({ low: node.low, high: node.high, value: node.value });
    this.inOrder(node.right, out);
  }
}

export default IntervalTree;

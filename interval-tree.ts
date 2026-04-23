export type Interval = {
  low: number;
  high: number;
};

class IntervalTreeNode {
  low: number;
  high: number;
  intervals: Interval[];
  left: IntervalTreeNode | null = null;
  right: IntervalTreeNode | null = null;
  height: number = 1;
  maxHigh: number;

  constructor(interval: Interval) {
    this.low = interval.low;
    this.high = interval.high;
    this.intervals = [interval];
    this.maxHigh = interval.high;
  }
}

function compareIntervals(a: Interval, b: Interval): number {
  if (a.low !== b.low) return a.low - b.low;
  return a.high - b.high;
}

function getHeight(node: IntervalTreeNode | null): number {
  return node ? node.height : 0;
}

function getMaxHigh(node: IntervalTreeNode | null): number {
  return node ? node.maxHigh : -Infinity;
}

function updateNode(node: IntervalTreeNode): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
  node.maxHigh = Math.max(
    node.high,
    getMaxHigh(node.left),
    getMaxHigh(node.right)
  );
}

function getBalance(node: IntervalTreeNode | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function rotateRight(y: IntervalTreeNode): IntervalTreeNode {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateNode(y);
  updateNode(x);

  return x;
}

function rotateLeft(x: IntervalTreeNode): IntervalTreeNode {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateNode(x);
  updateNode(y);

  return y;
}

export class IntervalTree {
  private root: IntervalTreeNode | null = null;
  private _count = 0;

  private validate(interval: Interval): void {
    if (interval.low > interval.high) {
      throw new Error(
        `Invalid interval: low (${interval.low}) > high (${interval.high})`
      );
    }
  }

  insert(interval: Interval): void {
    this.validate(interval);
    this.root = this._insert(this.root, interval);
  }

  private _insert(
    node: IntervalTreeNode | null,
    interval: Interval
  ): IntervalTreeNode {
    if (!node) {
      this._count++;
      return new IntervalTreeNode(interval);
    }

    const cmp = compareIntervals(interval, { low: node.low, high: node.high });

    if (cmp < 0) {
      node.left = this._insert(node.left, interval);
    } else if (cmp > 0) {
      node.right = this._insert(node.right, interval);
    } else {
      // Exact duplicate: store in the same node
      node.intervals.push(interval);
      this._count++;
      return node;
    }

    updateNode(node);

    const balance = getBalance(node);

    // Left Left
    if (balance > 1 && compareIntervals(interval, { low: node.left!.low, high: node.left!.high }) < 0) {
      return rotateRight(node);
    }

    // Right Right
    if (balance < -1 && compareIntervals(interval, { low: node.right!.low, high: node.right!.high }) > 0) {
      return rotateLeft(node);
    }

    // Left Right
    if (balance > 1 && compareIntervals(interval, { low: node.left!.low, high: node.left!.high }) > 0) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Left
    if (balance < -1 && compareIntervals(interval, { low: node.right!.low, high: node.right!.high }) < 0) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  }

  search(point: number): Interval[] {
    const results: Interval[] = [];
    this._search(this.root, point, results);
    return results;
  }

  private _search(
    node: IntervalTreeNode | null,
    point: number,
    results: Interval[]
  ): void {
    if (!node) return;

    if (node.left && node.left.maxHigh >= point) {
      this._search(node.left, point, results);
    }

    if (node.low <= point && point <= node.high) {
      results.push(...node.intervals);
    }

    // Prune right subtree: every node there has low >= node.low.
    // If point < node.low, none of them can contain the point.
    if (node.right && node.right.maxHigh >= point && node.low <= point) {
      this._search(node.right, point, results);
    }
  }

  remove(interval: Interval): boolean {
    this.validate(interval);
    const prevCount = this._count;
    this.root = this._remove(this.root, interval);
    return this._count < prevCount;
  }

  private _deleteNodeEntirely(
    node: IntervalTreeNode | null,
    interval: Interval
  ): IntervalTreeNode | null {
    if (!node) return null;

    const cmp = compareIntervals(interval, { low: node.low, high: node.high });

    if (cmp < 0) {
      node.left = this._deleteNodeEntirely(node.left, interval);
    } else if (cmp > 0) {
      node.right = this._deleteNodeEntirely(node.right, interval);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      const succ = this._minValueNode(node.right);
      node.low = succ.low;
      node.high = succ.high;
      node.intervals = [...succ.intervals];
      node.right = this._deleteNodeEntirely(node.right, { low: succ.low, high: succ.high });
    }

    if (!node) return node;

    updateNode(node);

    const balance = getBalance(node);

    if (balance > 1 && getBalance(node.left) >= 0) {
      return rotateRight(node);
    }

    if (balance > 1 && getBalance(node.left) < 0) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    if (balance < -1 && getBalance(node.right) <= 0) {
      return rotateLeft(node);
    }

    if (balance < -1 && getBalance(node.right) > 0) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  }

  private _remove(
    node: IntervalTreeNode | null,
    interval: Interval
  ): IntervalTreeNode | null {
    if (!node) return null;

    const cmp = compareIntervals(interval, { low: node.low, high: node.high });

    if (cmp < 0) {
      node.left = this._remove(node.left, interval);
    } else if (cmp > 0) {
      node.right = this._remove(node.right, interval);
    } else {
      // Found matching (low, high)
      if (node.intervals.length > 1) {
        node.intervals.pop();
        this._count--;
        return node;
      }

      // Remove the AVL node itself
      if (!node.left) {
        this._count--;
        return node.right;
      }
      if (!node.right) {
        this._count--;
        return node.left;
      }

      // Two children: replace with in-order successor data
      const succ = this._minValueNode(node.right);
      const removedCount = node.intervals.length;
      node.low = succ.low;
      node.high = succ.high;
      node.intervals = [...succ.intervals];
      node.right = this._deleteNodeEntirely(node.right, { low: succ.low, high: succ.high });
      this._count -= removedCount;
    }

    if (!node) return node;

    updateNode(node);

    const balance = getBalance(node);

    // Left Left
    if (balance > 1 && getBalance(node.left) >= 0) {
      return rotateRight(node);
    }

    // Left Right
    if (balance > 1 && getBalance(node.left) < 0) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }

    // Right Right
    if (balance < -1 && getBalance(node.right) <= 0) {
      return rotateLeft(node);
    }

    // Right Left
    if (balance < -1 && getBalance(node.right) > 0) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  }

  private _minValueNode(node: IntervalTreeNode): IntervalTreeNode {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }

  count(): number {
    return this._count;
  }
}

export interface IntervalRecord<T> {
  start: number;
  end: number;
  value: T;
}

class IntervalNode<T> {
  public left: IntervalNode<T> | null = null;
  public right: IntervalNode<T> | null = null;
  public height = 1;
  public maxEnd: number;
  public start: number;
  public end: number;
  public value: T;

  constructor(start: number, end: number, value: T) {
    this.start = start;
    this.end = end;
    this.value = value;
    this.maxEnd = end;
  }
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;

  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA === typeB && (typeA === 'number' || typeA === 'bigint' || typeA === 'string' || typeA === 'boolean')) {
    return a < b ? -1 : 1;
  }

  const sa = String(a);
  const sb = String(b);
  if (sa === sb) return 0;
  return sa < sb ? -1 : 1;
}

function compareEntries<T>(
  a: Pick<IntervalRecord<T>, 'start' | 'end' | 'value'>,
  b: Pick<IntervalRecord<T>, 'start' | 'end' | 'value'>,
): number {
  if (a.start !== b.start) return a.start - b.start;
  if (a.end !== b.end) return a.end - b.end;
  return compareValues(a.value, b.value);
}

export class IntervalTree<T> {
  private root: IntervalNode<T> | null = null;
  private size = 0;

  insert(start: number, end: number, value: T): void {
    this.validateInterval(start, end);
    const node = new IntervalNode(start, end, value);
    this.root = this.insertNode(this.root, node);
    this.size += 1;
  }

  search(point: number): IntervalRecord<T>[] {
    if (!Number.isFinite(point)) {
      throw new Error('Point must be a finite number');
    }

    const results: IntervalRecord<T>[] = [];
    this.searchPoint(this.root, point, results);
    return results.sort(compareEntries);
  }

  remove(value: T): boolean {
    const target = this.findByValue(this.root, value);
    if (!target) return false;

    this.root = this.removeExact(this.root, target);
    this.size -= 1;
    return true;
  }

  getAll(): IntervalRecord<T>[] {
    const result: IntervalRecord<T>[] = [];
    this.inOrder(this.root, result);
    return result;
  }

  count(): number {
    return this.size;
  }

  private validateInterval(start: number, end: number): void {
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
      throw new Error('Interval bounds must be finite numbers');
    }
    if (start > end) {
      throw new Error('Interval start must be less than or equal to end');
    }
  }

  private height(node: IntervalNode<T> | null): number {
    return node?.height ?? 0;
  }

  private update(node: IntervalNode<T>): void {
    node.height = Math.max(this.height(node.left), this.height(node.right)) + 1;
    node.maxEnd = Math.max(
      node.end,
      node.left?.maxEnd ?? Number.NEGATIVE_INFINITY,
      node.right?.maxEnd ?? Number.NEGATIVE_INFINITY,
    );
  }

  private balanceFactor(node: IntervalNode<T>): number {
    return this.height(node.left) - this.height(node.right);
  }

  private rotateRight(y: IntervalNode<T>): IntervalNode<T> {
    const x = y.left!;
    const t2 = x.right;

    x.right = y;
    y.left = t2;

    this.update(y);
    this.update(x);

    return x;
  }

  private rotateLeft(x: IntervalNode<T>): IntervalNode<T> {
    const y = x.right!;
    const t2 = y.left;

    y.left = x;
    x.right = t2;

    this.update(x);
    this.update(y);

    return y;
  }

  private rebalance(node: IntervalNode<T>): IntervalNode<T> {
    this.update(node);
    const balance = this.balanceFactor(node);

    if (balance > 1) {
      if (this.balanceFactor(node.left!) < 0) {
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    if (balance < -1) {
      if (this.balanceFactor(node.right!) > 0) {
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  private insertNode(current: IntervalNode<T> | null, node: IntervalNode<T>): IntervalNode<T> {
    if (current === null) return node;

    const cmp = compareEntries(node, current);
    if (cmp < 0) {
      current.left = this.insertNode(current.left, node);
    } else {
      current.right = this.insertNode(current.right, node);
    }

    return this.rebalance(current);
  }

  private searchPoint(node: IntervalNode<T> | null, point: number, results: IntervalRecord<T>[]): void {
    if (node === null) return;

    if (node.left !== null && node.left.maxEnd >= point) {
      this.searchPoint(node.left, point, results);
    }

    if (node.start <= point && point <= node.end) {
      results.push({ start: node.start, end: node.end, value: node.value });
    }

    if (node.right !== null && point >= node.start) {
      this.searchPoint(node.right, point, results);
    }
  }

  private inOrder(node: IntervalNode<T> | null, result: IntervalRecord<T>[]): void {
    if (node === null) return;
    this.inOrder(node.left, result);
    result.push({ start: node.start, end: node.end, value: node.value });
    this.inOrder(node.right, result);
  }

  private findByValue(node: IntervalNode<T> | null, value: T): IntervalRecord<T> | null {
    if (node === null) return null;
    if (node.value === value) {
      return { start: node.start, end: node.end, value: node.value };
    }
    return this.findByValue(node.left, value) ?? this.findByValue(node.right, value);
  }

  private removeExact(node: IntervalNode<T> | null, target: IntervalRecord<T>): IntervalNode<T> | null {
    if (node === null) return null;

    const cmp = compareEntries(target, node);
    if (cmp < 0) {
      node.left = this.removeExact(node.left, target);
      return this.rebalance(node);
    }

    if (cmp > 0) {
      node.right = this.removeExact(node.right, target);
      return this.rebalance(node);
    }

    if (node.left === null) return node.right;
    if (node.right === null) return node.left;

    const successor = this.minNode(node.right);
    node.start = successor.start;
    node.end = successor.end;
    node.value = successor.value;
    node.right = this.removeExact(node.right, {
      start: successor.start,
      end: successor.end,
      value: successor.value,
    });

    return this.rebalance(node);
  }

  private minNode(node: IntervalNode<T>): IntervalNode<T> {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }
}

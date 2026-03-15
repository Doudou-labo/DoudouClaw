export interface Interval<T> {
  start: number;
  end: number;
  value: T;
}

class Node<T> {
  start: number;
  end: number;
  value: T;
  maxEnd: number;
  height: number;
  left: Node<T> | null;
  right: Node<T> | null;

  constructor(start: number, end: number, value: T) {
    this.start = start;
    this.end = end;
    this.value = value;
    this.maxEnd = end;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

export class IntervalTree<T> {
  private root: Node<T> | null = null;
  private size: number = 0;

  private getHeight(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  private getMaxEnd(node: Node<T> | null): number {
    return node ? node.maxEnd : -Infinity;
  }

  private update(node: Node<T>): void {
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    node.maxEnd = Math.max(node.end, Math.max(this.getMaxEnd(node.left), this.getMaxEnd(node.right)));
  }

  private rightRotate(y: Node<T>): Node<T> {
    const x = y.left!;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    this.update(y);
    this.update(x);
    return x;
  }

  private leftRotate(x: Node<T>): Node<T> {
    const y = x.right!;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    this.update(x);
    this.update(y);
    return y;
  }

  private getBalance(node: Node<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  public insert(start: number, end: number, value: T): void {
    if (start >= end) throw new Error("start must be less than end");
    this.root = this.insertNode(this.root, start, end, value);
    this.size++;
  }

  private insertNode(node: Node<T> | null, start: number, end: number, value: T): Node<T> {
    if (!node) return new Node(start, end, value);

    if (start < node.start) {
      node.left = this.insertNode(node.left, start, end, value);
    } else if (start > node.start) {
      node.right = this.insertNode(node.right, start, end, value);
    } else {
      // If start is same, order by end
      if (end < node.end) {
        node.left = this.insertNode(node.left, start, end, value);
      } else {
        node.right = this.insertNode(node.right, start, end, value);
      }
    }

    this.update(node);

    const balance = this.getBalance(node);

    if (balance > 1 && (start < node.left!.start || (start === node.left!.start && end < node.left!.end))) {
      return this.rightRotate(node);
    }
    if (balance < -1 && (start > node.right!.start || (start === node.right!.start && end >= node.right!.end))) {
      return this.leftRotate(node);
    }
    if (balance > 1 && (start > node.left!.start || (start === node.left!.start && end >= node.left!.end))) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (balance < -1 && (start < node.right!.start || (start === node.right!.start && end < node.right!.end))) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  private minValueNode(node: Node<T>): Node<T> {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  public delete(start: number, end: number, value?: T): boolean {
    const initialSize = this.size;
    let deleted = false;
    
    const deleteNode = (node: Node<T> | null, start: number, end: number, value?: T): Node<T> | null => {
      if (!node) return null;

      if (start < node.start) {
        node.left = deleteNode(node.left, start, end, value);
      } else if (start > node.start) {
        node.right = deleteNode(node.right, start, end, value);
      } else if (end !== node.end) {
        if (end < node.end) {
          node.left = deleteNode(node.left, start, end, value);
        } else {
          node.right = deleteNode(node.right, start, end, value);
        }
      } else {
        if (value !== undefined && node.value !== value) {
           // Keep searching if value doesn't match and there are duplicate intervals
           node.right = deleteNode(node.right, start, end, value);
        } else {
          deleted = true;
          if (!node.left || !node.right) {
            node = node.left ? node.left : node.right;
          } else {
            const temp = this.minValueNode(node.right);
            node.start = temp.start;
            node.end = temp.end;
            node.value = temp.value;
            node.right = deleteNode(node.right, temp.start, temp.end, temp.value);
          }
        }
      }

      if (!node) return null;

      this.update(node);
      const balance = this.getBalance(node);

      if (balance > 1 && this.getBalance(node.left) >= 0) {
        return this.rightRotate(node);
      }
      if (balance > 1 && this.getBalance(node.left) < 0) {
        node.left = this.leftRotate(node.left!);
        return this.rightRotate(node);
      }
      if (balance < -1 && this.getBalance(node.right) <= 0) {
        return this.leftRotate(node);
      }
      if (balance < -1 && this.getBalance(node.right) > 0) {
        node.right = this.rightRotate(node.right!);
        return this.leftRotate(node);
      }

      return node;
    };

    this.root = deleteNode(this.root, start, end, value);
    if (deleted) this.size--;
    return deleted;
  }

  public search(point: number): Interval<T>[] {
    const result: Interval<T>[] = [];
    
    const searchNode = (node: Node<T> | null) => {
      if (!node) return;
      
      // If the point is greater than the maxEnd in this subtree, no intervals can contain it
      if (point >= node.maxEnd) return;

      if (node.left) searchNode(node.left);
      
      if (point >= node.start && point < node.end) {
        result.push({ start: node.start, end: node.end, value: node.value });
      }

      // If point < node.start, then we don't need to search right subtree 
      // because all nodes in right subtree have start >= node.start > point.
      if (point >= node.start && node.right) {
        searchNode(node.right);
      }
    };

    searchNode(this.root);
    return result;
  }

  public getAll(): Interval<T>[] {
    const result: Interval<T>[] = [];
    const traverse = (node: Node<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push({ start: node.start, end: node.end, value: node.value });
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  public clear(): void {
    this.root = null;
    this.size = 0;
  }

  public getSize(): number {
    return this.size;
  }
}

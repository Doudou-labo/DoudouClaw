import { IntervalTree } from './gemini-flash';

describe('IntervalTree', () => {
  let tree: IntervalTree<string>;

  beforeEach(() => {
    tree = new IntervalTree<string>();
  });

  test('should insert and search point', () => {
    tree.insert(10, 20, 'A');
    tree.insert(15, 25, 'B');
    tree.insert(25, 30, 'C');

    const search12 = tree.search(12);
    expect(search12.length).toBe(1);
    expect(search12[0].data).toBe('A');

    const search17 = tree.search(17);
    expect(search17.length).toBe(2);
    expect(search17.map(i => i.data)).toContain('A');
    expect(search17.map(i => i.data)).toContain('B');

    const search22 = tree.search(22);
    expect(search22.length).toBe(1);
    expect(search22[0].data).toBe('B');

    const search27 = tree.search(27);
    expect(search27.length).toBe(1);
    expect(search27[0].data).toBe('C');

    const search35 = tree.search(35);
    expect(search35.length).toBe(0);
  });

  test('should delete an interval', () => {
    tree.insert(10, 20, 'A');
    tree.insert(15, 25, 'B');
    tree.insert(25, 30, 'C');

    expect(tree.size).toBe(3);
    expect(tree.delete(15, 25, 'B')).toBe(true);
    expect(tree.size).toBe(2);

    const search17 = tree.search(17);
    expect(search17.length).toBe(1);
    expect(search17[0].data).toBe('A');

    expect(tree.delete(15, 25, 'B')).toBe(false);
    expect(tree.size).toBe(2);
  });

  test('should search ranges overlapping intervals', () => {
    tree.insert(10, 20, 'A');
    tree.insert(15, 25, 'B');
    tree.insert(25, 30, 'C');

    const overlap10to15 = tree.searchRange(10, 15);
    expect(overlap10to15.length).toBe(1);
    expect(overlap10to15[0].data).toBe('A');

    const overlap18to26 = tree.searchRange(18, 26);
    expect(overlap18to26.length).toBe(3);
    expect(overlap18to26.map(i => i.data)).toContain('A');
    expect(overlap18to26.map(i => i.data)).toContain('B');
    expect(overlap18to26.map(i => i.data)).toContain('C');

    const overlap30to40 = tree.searchRange(30, 40);
    expect(overlap30to40.length).toBe(0);
  });

  test('should clear the tree', () => {
    tree.insert(1, 10, 'X');
    tree.insert(5, 15, 'Y');
    expect(tree.size).toBe(2);
    tree.clear();
    expect(tree.size).toBe(0);
    expect(tree.getAll().length).toBe(0);
  });

  test('edge case: invalid interval', () => {
    expect(() => tree.insert(20, 10, 'Z')).toThrow();
    expect(() => tree.insert(10, 10, 'Z')).toThrow();
  });

  test('edge case: duplicate starts', () => {
    tree.insert(10, 20, 'A');
    tree.insert(10, 15, 'B');
    tree.insert(10, 25, 'C');

    const results = tree.search(12);
    expect(results.length).toBe(3);
    expect(tree.size).toBe(3);
    
    tree.delete(10, 15, 'B');
    expect(tree.size).toBe(2);
    expect(tree.search(12).length).toBe(2);
  });

  test('edge case: large scale insert and search (basic stress)', () => {
    for (let i = 0; i < 1000; i++) {
      tree.insert(i, i + 10, i.toString());
    }
    expect(tree.size).toBe(1000);
    const results = tree.search(500);
    // Point 500 should be in intervals [491, 501), [492, 502), ..., [500, 510)
    // So 491 to 500 = 10 intervals
    expect(results.length).toBe(10);
  });
});

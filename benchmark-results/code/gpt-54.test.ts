import assert from 'node:assert/strict';
import { IntervalTree } from './interval-tree.ts';

type TestCase = {
  name: string;
  fn: () => void;
};

const tests: TestCase[] = [];

function test(name: string, fn: () => void): void {
  tests.push({ name, fn });
}

function valuesAt(tree: IntervalTree<string>, point: number): string[] {
  return tree.search(point).map((item) => item.value);
}

test('insertion simple et getAll trié', () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, 'b');
  tree.insert(1, 3, 'a');
  tree.insert(12, 15, 'c');

  assert.deepEqual(tree.getAll(), [
    { start: 1, end: 3, value: 'a' },
    { start: 5, end: 10, value: 'b' },
    { start: 12, end: 15, value: 'c' },
  ]);
});

test('recherche vide sur arbre vide', () => {
  const tree = new IntervalTree<string>();
  assert.deepEqual(tree.search(7), []);
});

test('recherche avec chevauchements multiples', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(3, 7, 'b');
  tree.insert(4, 4, 'c');
  tree.insert(8, 10, 'd');

  assert.deepEqual(valuesAt(tree, 4), ['a', 'b', 'c']);
});

test('recherche exclut les intervalles qui ne contiennent pas le point', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(6, 9, 'b');

  assert.deepEqual(valuesAt(tree, 5.5), []);
});

test('intervalles adjacents: bornes inclusives sans faux positif entre les deux', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 3, 'left');
  tree.insert(3, 5, 'right');

  assert.deepEqual(valuesAt(tree, 3), ['left', 'right']);
  assert.deepEqual(valuesAt(tree, 2.999), ['left']);
  assert.deepEqual(valuesAt(tree, 5), ['right']);
});

test('doublons sur même intervalle avec valeurs différentes', () => {
  const tree = new IntervalTree<string>();
  tree.insert(2, 6, 'x');
  tree.insert(2, 6, 'y');

  assert.deepEqual(valuesAt(tree, 4), ['x', 'y']);
  assert.equal(tree.count(), 2);
});

test('suppression par valeur retire le bon intervalle', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');
  tree.insert(10, 20, 'b');
  tree.insert(3, 8, 'c');

  assert.equal(tree.remove('b'), true);
  assert.deepEqual(tree.getAll(), [
    { start: 1, end: 5, value: 'a' },
    { start: 3, end: 8, value: 'c' },
  ]);
  assert.deepEqual(valuesAt(tree, 12), []);
});

test('suppression d une valeur absente retourne false', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, 'a');

  assert.equal(tree.remove('missing'), false);
  assert.equal(tree.count(), 1);
});

test('suppression avec doublons de valeur identique retire une occurrence à la fois', () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 2, 'dup');
  tree.insert(3, 4, 'dup');
  tree.insert(5, 6, 'other');

  assert.equal(tree.remove('dup'), true);
  assert.equal(tree.count(), 2);
  assert.equal(tree.getAll().filter((item) => item.value === 'dup').length, 1);

  assert.equal(tree.remove('dup'), true);
  assert.equal(tree.getAll().filter((item) => item.value === 'dup').length, 0);
});

test('point sur borne gauche et borne droite est inclus', () => {
  const tree = new IntervalTree<string>();
  tree.insert(10, 20, 'segment');

  assert.deepEqual(valuesAt(tree, 10), ['segment']);
  assert.deepEqual(valuesAt(tree, 20), ['segment']);
});

test('validation: intervalle invalide si start > end', () => {
  const tree = new IntervalTree<string>();
  assert.throws(() => tree.insert(5, 1, 'bad'), /start must be less than or equal to end/);
});

test('validation: point de recherche invalide', () => {
  const tree = new IntervalTree<string>();
  assert.throws(() => tree.search(Number.NaN), /Point must be a finite number/);
});

test('structure équilibrée: beaucoup d insertions puis recherche cohérente', () => {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 100; i += 1) {
    tree.insert(i * 2, i * 2 + 3, i);
  }

  const hits = tree.search(50).map((item) => item.value);
  assert.deepEqual(hits, [24, 25]);
  assert.equal(tree.count(), 100);
});

let passed = 0;
for (const { name, fn } of tests) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed += 1;
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

console.log(`\n${passed}/${tests.length} tests passed`);

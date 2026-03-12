/**
 * Test suite for IntervalTree.
 * Pure TypeScript — uses a tiny assert helper, no external deps.
 */

import { IntervalTree } from './interval-tree';

// ── Minimal test harness ──

let passed = 0;
let failed = 0;

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`  ✗ FAIL: ${msg}`);
    failed++;
  } else {
    passed++;
  }
}

function test(name: string, fn: () => void): void {
  console.log(`\n▸ ${name}`);
  fn();
}

// ── Tests ──

test('1. Insertion simple et taille', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  t.insert(30, 40, 'B');
  t.insert(50, 60, 'C');
  assert(t.size === 3, `size should be 3, got ${t.size}`);
});

test('2. Recherche point unique', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  t.insert(30, 40, 'B');
  const r = t.search(15);
  assert(r.length === 1, `should find 1, got ${r.length}`);
  assert(r[0].value === 'A', `should be 'A', got ${r[0].value}`);
});

test('3. Recherche point hors intervalles', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  t.insert(30, 40, 'B');
  const r = t.search(25);
  assert(r.length === 0, `should find 0, got ${r.length}`);
});

test('4. Recherche chevauchements multiples', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 30, 'A');
  t.insert(20, 40, 'B');
  t.insert(25, 35, 'C');
  t.insert(50, 60, 'D');
  const r = t.search(27);
  const values = r.map(x => x.value).sort();
  assert(values.length === 3, `should find 3, got ${values.length}`);
  assert(values.join(',') === 'A,B,C', `expected A,B,C got ${values.join(',')}`);
});

test('5. Suppression simple', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  t.insert(30, 40, 'B');
  const removed = t.remove('A');
  assert(removed === true, 'remove should return true');
  assert(t.size === 1, `size should be 1, got ${t.size}`);
  const r = t.search(15);
  assert(r.length === 0, 'should not find deleted interval');
});

test('6. Suppression valeur inexistante', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  const removed = t.remove('Z');
  assert(removed === false, 'remove should return false');
  assert(t.size === 1, `size should be 1, got ${t.size}`);
});

test('7. getAll() trié par start puis end', () => {
  const t = new IntervalTree<string>();
  t.insert(30, 40, 'B');
  t.insert(10, 20, 'A');
  t.insert(10, 15, 'C');
  t.insert(50, 60, 'D');
  const all = t.getAll();
  assert(all.length === 4, `size should be 4, got ${all.length}`);
  const labels = all.map(x => x.value).join(',');
  // Sort order: (10,15)=C, (10,20)=A, (30,40)=B, (50,60)=D
  assert(labels === 'C,A,B,D', `expected C,A,B,D got ${labels}`);
});

test('8. Intervalles adjacents ne se chevauchent pas au point frontière', () => {
  const t = new IntervalTree<string>();
  t.insert(0, 10, 'A');
  t.insert(10, 20, 'B');
  // Point 10: belongs to both (closed intervals: 0<=10<=10 and 10<=10<=20)
  const r10 = t.search(10);
  assert(r10.length === 2, `point 10 should match 2, got ${r10.length}`);
  // Point 9: only A
  const r9 = t.search(9);
  assert(r9.length === 1 && r9[0].value === 'A', 'point 9 should match A');
  // Point 11: only B
  const r11 = t.search(11);
  assert(r11.length === 1 && r11[0].value === 'B', 'point 11 should match B');
});

test('9. Doublons (mêmes intervalles, valeurs différentes)', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'X');
  t.insert(10, 20, 'Y');
  assert(t.size === 2, `size should be 2, got ${t.size}`);
  const r = t.search(15);
  const vals = r.map(x => x.value).sort();
  assert(vals.join(',') === 'X,Y', `expected X,Y got ${vals.join(',')}`);
  // Remove one
  t.remove('X');
  assert(t.size === 1, `after remove size should be 1, got ${t.size}`);
  const r2 = t.search(15);
  assert(r2.length === 1 && r2[0].value === 'Y', 'only Y should remain');
});

test('10. Arbre vide — recherche et suppression', () => {
  const t = new IntervalTree<number>();
  assert(t.size === 0, 'empty tree size should be 0');
  assert(t.search(42).length === 0, 'search on empty returns nothing');
  assert(t.remove(99) === false, 'remove on empty returns false');
  assert(t.getAll().length === 0, 'getAll on empty returns []');
});

test('11. Intervalles imbriqués (nested)', () => {
  const t = new IntervalTree<string>();
  t.insert(0, 100, 'outer');
  t.insert(20, 80, 'mid');
  t.insert(40, 60, 'inner');
  const r50 = t.search(50);
  assert(r50.length === 3, `point 50 should match 3, got ${r50.length}`);
  // Remove mid
  t.remove('mid');
  assert(t.size === 2, `size should be 2, got ${t.size}`);
  const r50b = t.search(50);
  assert(r50b.length === 2, `point 50 should match 2 after remove, got ${r50b.length}`);
});

test('12. Recherche aux bornes (start et end)', () => {
  const t = new IntervalTree<string>();
  t.insert(5, 15, 'A');
  const rStart = t.search(5);
  assert(rStart.length === 1, 'start boundary should match');
  const rEnd = t.search(15);
  assert(rEnd.length === 1, 'end boundary should match');
  const rOut = t.search(4);
  assert(rOut.length === 0, 'before start should not match');
});

test('13. Grand volume — 1000 insertions + recherche', () => {
  const t = new IntervalTree<number>();
  for (let i = 0; i < 1000; i++) {
    t.insert(i * 10, i * 10 + 5, i);
  }
  assert(t.size === 1000, `size should be 1000, got ${t.size}`);
  // Every point 0-5, 10-15, ... should find exactly 1
  for (let i = 0; i < 1000; i++) {
    const pt = i * 10 + 2;
    const r = t.search(pt);
    assert(r.length === 1 && r[0].value === i, `search(${pt}) should find [${i}]`);
  }
  // Points between intervals should find nothing
  const rGap = t.search(7);
  assert(rGap.length === 0, `gap point 7 should find nothing`);
});

test('14. Suppression racine puis getAll', () => {
  const t = new IntervalTree<string>();
  t.insert(50, 60, 'root-ish');
  t.insert(20, 30, 'left');
  t.insert(70, 80, 'right');
  t.remove('root-ish');
  const all = t.getAll();
  assert(all.length === 2, `should have 2 after root removal, got ${all.length}`);
  assert(all[0].value === 'left', 'first should be left');
  assert(all[1].value === 'right', 'second should be right');
});

test('15. max endpoint propagation', () => {
  const t = new IntervalTree<string>();
  t.insert(10, 20, 'A');
  t.insert(5, 50, 'B'); // large endpoint
  t.insert(30, 35, 'C');
  // A search at 45 should find B (max propagation ensures left/right are checked)
  const r = t.search(45);
  assert(r.length === 1 && r[0].value === 'B', `search(45) should find B, got ${r.map(x => x.value)}`);
});

// ── Summary ──

console.log('\n' + '═'.repeat(40));
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('═'.repeat(40));

if (failed > 0) process.exit(1);

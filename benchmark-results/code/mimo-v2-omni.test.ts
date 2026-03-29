/**
 * Tests for IntervalTree (treap-based).
 *
 * Run with:  npx ts-node --esm mimo-v2-omni.test.ts
 *        or: npx tsx mimo-v2-omni.test.ts
 */

import { IntervalTree, Interval } from "./mimo-v2-omni";

// ─── Minimal test harness ────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string): void {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

function assertDeepEqual<T>(actual: T, expected: T, msg: string): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  assert(a === e, `${msg} — expected ${e}, got ${a}`);
}

function section(name: string): void {
  console.log(`\n▸ ${name}`);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

// Test 1
section("insert and size");
{
  const tree = new IntervalTree<string>();
  assert(tree.size === 0, "initial size is 0");
  tree.insert(1, 5, "a");
  assert(tree.size === 1, "size after one insert");
  tree.insert(2, 8, "b");
  tree.insert(3, 6, "c");
  assert(tree.size === 3, "size after three inserts");
}

// Test 2
section("search — single match");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "alpha");
  tree.insert(10, 20, "beta");
  const r = tree.search(3);
  assert(r.length === 1, "one result for point 3");
  assert(r[0].value === "alpha", "correct value");
}

// Test 3
section("search — multiple matches");
{
  const tree = new IntervalTree<number>();
  tree.insert(1, 10, 1);
  tree.insert(3, 7, 2);
  tree.insert(5, 12, 3);
  tree.insert(20, 30, 4);
  const r = tree.search(6);
  assert(r.length === 3, "three intervals contain 6");
  const values = r.map((i) => i.value).sort();
  assertDeepEqual(values, [1, 2, 3], "correct values");
}

// Test 4
section("search — no match");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "a");
  tree.insert(10, 15, "b");
  const r = tree.search(100);
  assert(r.length === 0, "no interval contains 100");
}

// Test 5
section("search — boundary points");
{
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "x");
  assert(tree.search(5).length === 1, "left boundary included");
  assert(tree.search(10).length === 1, "right boundary included");
  assert(tree.search(4).length === 0, "point before interval");
  assert(tree.search(11).length === 0, "point after interval");
}

// Test 6
section("remove — existing interval");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "a");
  tree.insert(3, 8, "b");
  const removed = tree.remove(1, 5, "a");
  assert(removed === true, "remove returns true");
  assert(tree.size === 1, "size decreased");
  assert(tree.search(2).length === 0, "removed interval not found");
  assert(tree.search(5).length === 1, "other interval still present");
}

// Test 7
section("remove — non-existent interval");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "a");
  const removed = tree.remove(99, 100, "nope");
  assert(removed === false, "remove returns false for non-existent");
  assert(tree.size === 1, "size unchanged");
}

// Test 8
section("remove all then search");
{
  const tree = new IntervalTree<number>();
  tree.insert(1, 5, 1);
  tree.insert(6, 10, 2);
  tree.remove(1, 5, 1);
  tree.remove(6, 10, 2);
  assert(tree.size === 0, "tree is empty");
  assert(tree.search(3).length === 0, "search on empty tree");
}

// Test 9
section("duplicate intervals (same range, different values)");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, "x");
  tree.insert(1, 10, "y");
  tree.insert(1, 10, "z");
  assert(tree.size === 3, "three duplicates stored");
  const r = tree.search(5);
  assert(r.length === 3, "all three found at point 5");
  tree.remove(1, 10, "y");
  assert(tree.size === 2, "one duplicate removed");
  const r2 = tree.search(5);
  assert(r2.length === 2, "two remain after removal");
}

// Test 10
section("overlapping intervals");
{
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "wide");
  tree.insert(3, 5, "narrow1");
  tree.insert(4, 8, "narrow2");
  tree.insert(7, 12, "shifted");
  const r = tree.search(4);
  assert(r.length === 3, "three intervals overlap at 4");
}

// Test 11
section("single-point intervals");
{
  const tree = new IntervalTree<string>();
  tree.insert(5, 5, "point");
  tree.insert(3, 7, "range");
  assert(tree.search(5).length === 2, "both contain 5");
  assert(tree.search(4).length === 1, "only range contains 4");
  assert(tree.search(5.5).length === 1, "only range contains 5.5");
}

// Test 12
section("large insert/search stress");
{
  const tree = new IntervalTree<number>();
  const N = 1000;
  for (let i = 0; i < N; i++) {
    tree.insert(i, i + 10, i);
  }
  assert(tree.size === N, `${N} intervals inserted`);
  // Point 5 should be covered by intervals [0..10], [1..11], ..., [5..15]
  const r = tree.search(5);
  assert(r.length === 6, "six intervals contain point 5");
}

// Test 13
section("remove in bulk");
{
  const tree = new IntervalTree<number>();
  const N = 100;
  for (let i = 0; i < N; i++) {
    tree.insert(i, i + 5, i);
  }
  for (let i = 0; i < N; i++) {
    tree.remove(i, i + 5, i);
  }
  assert(tree.size === 0, "all removed, tree empty");
  assert(tree.search(50).length === 0, "search on emptied tree");
}

// Test 14
section("clear");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 2, "a");
  tree.insert(3, 4, "b");
  tree.clear();
  assert(tree.size === 0, "cleared");
  assert(tree.search(1).length === 0, "nothing after clear");
}

// Test 15
section("toArray — in-order");
{
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "b");
  tree.insert(1, 5, "a");
  tree.insert(3, 8, "c");
  const arr = tree.toArray();
  assert(arr.length === 3, "three elements");
  assert(arr[0].low <= arr[1].low && arr[1].low <= arr[2].low, "sorted by low");
}

// Test 16
section("insert invalid interval throws");
{
  const tree = new IntervalTree<string>();
  let threw = false;
  try {
    tree.insert(10, 5, "bad");
  } catch {
    threw = true;
  }
  assert(threw, "insert(10,5) throws RangeError");
}

// Test 17
section("negative and floating-point intervals");
{
  const tree = new IntervalTree<string>();
  tree.insert(-10.5, -3.2, "neg");
  tree.insert(0.1, 0.9, "frac");
  assert(tree.search(-5).length === 1, "negative point found");
  assert(tree.search(0.5).length === 1, "fractional point found");
  assert(tree.search(0).length === 0, "zero not in any interval");
}

// Test 18
section("search returns copies, not references");
{
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "original");
  const r = tree.search(3);
  r[0].value = "modified";
  const r2 = tree.search(3);
  assert(r2[0].value === "original", "internal value unchanged");
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`  Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log(`${"─".repeat(40)}`);

if (failed > 0) {
  try { (process as any).exit(1); } catch { /* ts-node without @types/node */ }
}

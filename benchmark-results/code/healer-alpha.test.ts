/**
 * Unit tests for IntervalTree.
 * Pure TypeScript — no external dependencies.
 * Run with: npx tsx interval-tree.test.ts
 *   or:    npx ts-node interval-tree.test.ts
 */

import { IntervalTree, Interval } from "./interval-tree";

// ── Minimal test framework ───────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures: { test: string; error: string }[] = [];

function assert(condition: boolean, msg: string): void {
  if (!condition) throw new Error(`Assertion failed: ${msg}`);
}

function assertEquals<T>(actual: T, expected: T, msg?: string): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    throw new Error(`${msg ?? "assertEquals"}: expected ${e}, got ${a}`);
  }
}

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err: any) {
    failed++;
    failures.push({ test: name, error: err.message });
    console.log(`  ❌ ${name} — ${err.message}`);
  }
}

// ── Helper: extract values from search results ───────────────────────

function vals(intervals: Interval<string>[]): string[] {
  return intervals.map((i) => i.value);
}

// ── Tests ────────────────────────────────────────────────────────────

console.log("\n🌳 IntervalTree — unit tests\n");

// 1. Insertion simple
test("insert a single interval and verify size", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  assert(tree.size === 1, "size should be 1");
  assert(!tree.isEmpty, "should not be empty");
});

// 2. Recherche : point dans un intervalle
test("search finds a point inside an interval", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  const result = vals(tree.search(5));
  assertEquals(result, ["A"], "point 5 should be in [0,10]");
});

// 3. Recherche : point exact sur les bornes
test("search matches at exact boundaries", () => {
  const tree = new IntervalTree<string>();
  tree.insert(3, 7, "X");
  assertEquals(vals(tree.search(3)), ["X"], "start boundary");
  assertEquals(vals(tree.search(7)), ["X"], "end boundary");
});

// 4. Recherche : point hors intervalle
test("search returns empty when point is outside all intervals", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 5, "A");
  tree.insert(10, 20, "B");
  assertEquals(vals(tree.search(7)), [], "point between intervals");
  assertEquals(vals(tree.search(-1)), [], "point before all");
  assertEquals(vals(tree.search(100)), [], "point after all");
});

// 5. Recherche : chevauchements multiples
test("search returns all overlapping intervals", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(5, 15, "B");
  tree.insert(8, 20, "C");
  tree.insert(25, 30, "D"); // no overlap with point 7

  const result = vals(tree.search(7));
  // point 7 is in [0,10], [5,15] → A, B
  // point 7 is NOT in [8,20] because 8 > 7
  assertEquals(result.sort(), ["A", "B"]);
});

// 6. Suppression par valeur
test("deleteByValue removes the correct interval", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(5, 15, "B");
  tree.insert(12, 20, "C");

  const deleted = tree.deleteByValue("B");
  assert(deleted, "should return true");
  assert(tree.size === 2, "size should be 2");

  assertEquals(vals(tree.search(10)), ["A"], "point 10 now only in A");
  assertEquals(vals(tree.search(13)), ["C"], "point 13 only in C");
});

// 7. Suppression d'un élément inexistant
test("deleteByValue returns false for non-existent value", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  const deleted = tree.deleteByValue("Z");
  assert(!deleted, "should return false");
  assert(tree.size === 1, "size unchanged");
});

// 8. getAll retourne trié
test("getAll returns intervals sorted by start then end", () => {
  const tree = new IntervalTree<string>();
  tree.insert(15, 20, "C");
  tree.insert(0, 10, "A");
  tree.insert(5, 25, "B");
  tree.insert(5, 12, "D");

  const all = tree.getAll();
  assertEquals(
    all.map((i) => i.value),
    ["A", "D", "B", "C"],
  );
  // Verify sorted: 0<5=5<15, and for equal start 5, D.end(12) < B.end(25)
});

// 9. Cas limite : intervalles adjacents (fin = début du suivant)
test("adjacent intervals do not overlap", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 5, "A");
  tree.insert(5, 10, "B");

  // Point 5: in [0,5] AND in [5,10] — both contain their boundaries
  const result = vals(tree.search(5));
  assertEquals(result.sort(), ["A", "B"]);

  // Point 4.9: only A
  assertEquals(vals(tree.search(4.9)), ["A"]);
  // Point 5.1: only B
  assertEquals(vals(tree.search(5.1)), ["B"]);
});

// 10. Cas limite : arbre vide
test("empty tree returns empty results", () => {
  const tree = new IntervalTree<string>();
  assert(tree.isEmpty, "should be empty");
  assert(tree.size === 0, "size 0");
  assertEquals(vals(tree.search(42)), [], "search on empty tree");
  assertEquals(tree.getAll(), [], "getAll on empty tree");
  assert(!tree.deleteByValue("x"), "delete on empty tree returns false");
});

// 11. Cas limite : suppression de tous les éléments
test("delete all intervals one by one", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(5, 15, "B");
  tree.insert(20, 30, "C");

  assert(tree.deleteByValue("A"), "");
  assert(tree.deleteByValue("C"), "");
  assert(tree.deleteByValue("B"), "");
  assert(tree.size === 0, "all deleted");
  assert(tree.isEmpty, "should be empty");
  assertEquals(tree.getAll(), [], "");
});

// 12. Insertion avec start > end → doit lever une erreur
test("insert throws when start > end", () => {
  const tree = new IntervalTree<string>();
  let threw = false;
  try {
    tree.insert(10, 5, "bad");
  } catch {
    threw = true;
  }
  assert(threw, "should throw");
  assert(tree.size === 0, "nothing inserted");
});

// 13. Intervalles de longueur 0 (points)
test("zero-length intervals (points) work correctly", () => {
  const tree = new IntervalTree<number>();
  tree.insert(5, 5, 100); // point at 5
  tree.insert(10, 10, 200); // point at 10

  assertEquals(vals(tree.search(5) as any), [100]);
  assertEquals(vals(tree.search(10) as any), [200]);
  assertEquals(vals(tree.search(7)), []);
});

// 14. Suppression de doublons (même valeur sur intervalles différents)
test("deleteByValue removes only the first match", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "dup");
  tree.insert(20, 30, "dup");

  const deleted = tree.deleteByValue("dup");
  assert(deleted, "should delete one");
  assert(tree.size === 1, "one remaining");

  const remaining = tree.getAll();
  // One of the two should remain — could be either
  assertEquals(remaining.length, 1);
});

// 15. Nombreuses insertions : structure rester cohérente
test("many intervals — search returns all correct overlaps", () => {
  const tree = new IntervalTree<number>();
  // Insert 100 intervals: [i, i+5] for i in 0..99
  for (let i = 0; i < 100; i++) {
    tree.insert(i, i + 5, i);
  }
  assert(tree.size === 100, "100 intervals");

  // Point 50 overlaps intervals starting from 45 to 50: [45,50],[46,51],...,[50,55]
  const result = tree.search(50);
  // start <= 50 <= start+5 → start ∈ [45, 50] → 6 intervals
  assertEquals(result.length, 6, "should find 6 overlaps at point 50");
});

// 16. clear() remet tout à zéro
test("clear resets tree to empty state", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(5, 15, "B");
  tree.clear();
  assert(tree.isEmpty, "should be empty");
  assert(tree.size === 0, "size 0");
  assertEquals(tree.getAll(), [], "");
});

// 17. getAll avec un seul élément
test("getAll with single element", () => {
  const tree = new IntervalTree<string>();
  tree.insert(42, 99, "solo");
  const all = tree.getAll();
  assertEquals(all.length, 1);
  assertEquals(all[0].value, "solo");
  assertEquals(all[0].start, 42);
  assertEquals(all[0].end, 99);
});

// 18. Suppression du nœud racine
test("deleteByValue works on root node", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "root");
  assert(tree.deleteByValue("root"), "deleted root");
  assert(tree.size === 0, "empty");
  assert(tree.isEmpty, "isEmpty");
});

// ── Summary ──────────────────────────────────────────────────────────

console.log(`\n${"─".repeat(40)}`);
console.log(`  Total: ${passed + failed} | ✅ ${passed} passed | ❌ ${failed} failed`);
if (failures.length) {
  console.log("\nFailures:");
  for (const f of failures) console.log(`  • ${f.test}: ${f.error}`);
}
console.log("");

process.exit(failed > 0 ? 1 : 0);

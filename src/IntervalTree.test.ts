/**
 * ============================================================================
 * IntervalTree — Tests unitaires
 * ============================================================================
 *
 * Pour exécuter :
 *   npx tsx src/IntervalTree.test.ts
 * ou compiler puis exécuter :
 *   npx tsc --strict src/IntervalTree.ts src/IntervalTree.test.ts --outDir dist
 *   node dist/IntervalTree.test.js
 *
 * Les tests utilisent un framework minimal intégré (pas de dépendance externe).
 * ============================================================================
 */

import { IntervalTree } from "./IntervalTree";

// ---------------------------------------------------------------------------
// Mini test runner (zéro dépendance)
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ❌ ${name}`);
    console.log(`      ${e instanceof Error ? e.message : String(e)}`);
  }
}

function assert(condition: boolean, msg: string): void {
  if (!condition) throw new Error(msg);
}
function assertEq<T>(a: T, b: T, msg?: string): void {
  const label = msg || `Expected ${String(a)} to equal ${String(b)}`;
  if (a !== b) throw new Error(label);
}
function assertDeepEq<T>(a: T, b: T, msg?: string): void {
  const label = msg || `Expected deep equality`;
  if (JSON.stringify(a) !== JSON.stringify(b))
    throw new Error(`${label}: ${JSON.stringify(a)} !== ${JSON.stringify(b)}`);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

console.log("\n--- IntervalTree — Tests unitaires ---\n");

// 1 — Insertion et query de base
test("insert single interval and query point inside", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "A");
  assertDeepEq(tree.query(7), ["A"], "point 7 should match [5,10]");
});

// 2 — Query sur un point en dehors de tous les intervalles
test("query point not covered by any interval", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "A");
  assertDeepEq(tree.query(15), [], "point 15 should match nothing");
});

// 3 — Query sur les bornes exactes
test("query on exact interval boundaries", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 10, "A");
  assertDeepEq(tree.query(5), ["A"], "start bound should match");
  assertDeepEq(tree.query(10), ["A"], "end bound should match");
  assertDeepEq(tree.query(4), [], "just before start");
  assertDeepEq(tree.query(11), [], "just after end");
});

// 4 — Plusieurs intervalles qui se chevauchent
test("multiple overlapping intervals", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 6, "A");
  tree.insert(2, 8, "B");
  tree.insert(5, 10, "C");
  tree.insert(8, 12, "D");

  // Point 5 : A (1-6), B (2-8), C (5-10)
  const r5 = tree.query(5).sort();
  assertDeepEq(r5, ["A", "B", "C"], "point 5 matches A, B, C");

  // Point 8 : B (2-8), C (5-10), D (8-12)
  const r8 = tree.query(8).sort();
  assertDeepEq(r8, ["B", "C", "D"], "point 8 matches B, C, D");

  // Point 1 : seul A
  assertDeepEq(tree.query(1), ["A"], "point 1 matches only A");

  // Point 0 : rien
  assertDeepEq(tree.query(0), [], "point 0 matches nothing");
});

// 5 — Intervalle unique (start == end)
test("degenerate interval (single point)", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 5, "X");
  assertDeepEq(tree.query(5), ["X"], "point interval matches only at 5");
  assertDeepEq(tree.query(4), [], "4 should not match [5,5]");
  assertDeepEq(tree.query(6), [], "6 should not match [5,5]");
});

// 6 — Remove basique
test("remove existing interval", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(3, 8, "B");
  const removed = tree.remove(1, 5);
  assert(removed, "remove should return true");
  assertDeepEq(tree.query(2), [], "after removal, point 2 matches nothing");
  assertDeepEq(tree.query(6), ["B"], "point 6 still matches B");
});

// 7 — Remove interval non existant
test("remove non-existing interval returns false", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  const removed = tree.remove(10, 20);
  assert(!removed, "remove should return false for non-existing interval");
  assertEq(tree.size(), 1, "tree size unchanged");
});

// 8 — Valeurs de types arbitraires (génériques)
test("generic values — numbers and objects", () => {
  const numTree = new IntervalTree<number>();
  numTree.insert(0, 100, 42);
  assertDeepEq(numTree.query(50), [42], "number value");

  interface Item { id: number; name: string }
  const objTree = new IntervalTree<Item>();
  const item: Item = { id: 1, name: "Widget" };
  objTree.insert(0, 200, item);
  const res = objTree.query(100);
  assertEq(res.length, 1, "object query: one result");
  assertEq(res[0].id, 1, "object id preserved");
  assertEq(res[0].name, "Widget", "object name preserved");
});

// 9 — Insertion d'intervalles identiques (doublons)
test("duplicate intervals are both stored and returned", () => {
  const tree = new IntervalTree<string>();
  tree.insert(3, 7, "A");
  tree.insert(3, 7, "B");
  const results = tree.query(5).sort();
  assertDeepEq(results, ["A", "B"], "both duplicates returned");
  assertEq(tree.size(), 2, "size reflects both entries");
});

// 10 — Remove sur un doublon (un seul supprimé)
test("remove one of two duplicate intervals", () => {
  const tree = new IntervalTree<string>();
  tree.insert(3, 7, "A");
  tree.insert(3, 7, "B");
  tree.remove(3, 7);
  const results = tree.query(5);
  assertEq(results.length, 1, "one duplicate remains");
  assertEq(tree.size(), 1, "size decremented");
});

// 11 — Arbre vide
test("empty tree queries and removes", () => {
  const tree = new IntervalTree<string>();
  assertDeepEq(tree.query(0), [], "query on empty tree");
  assert(!tree.remove(1, 5), "remove on empty tree returns false");
  assert(tree.isEmpty(), "isEmpty is true");
});

// 12 — Insertion de nombreux intervalles (stress / équilibrage)
test("large insertion — 1000 intervals — tree stays balanced", () => {
  const tree = new IntervalTree<string>();
  for (let i = 0; i < 1000; i++) {
    tree.insert(i, i + 50, `val-${i}`);
  }
  assertEq(tree.size(), 1000, "1000 intervals stored");
  // Point 500 doit toucher les intervalles [450,500] à [500,550]
  const results = tree.query(500);
  // Intervalle [i, i+50] contient 500 si i <= 500 <= i+50 => i ∈ [450, 500]
  assertEq(results.length, 51, `expected 51 results at point 500, got ${results.length}`);
});

// 13 — Insertion avec intervalle invalide
test("throws on invalid interval (start > end)", () => {
  const tree = new IntervalTree<string>();
  let threw = false;
  try {
    tree.insert(10, 5, "X");
  } catch {
    threw = true;
  }
  assert(threw, "should throw when start > end");
});

// 14 — Remove puis verify
test("remove all intervals one by one", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(10, 20, "B");
  tree.insert(20, 30, "C");
  assert(tree.remove(0, 10), "remove A");
  assert(tree.remove(10, 20), "remove B");
  assert(tree.remove(20, 30), "remove C");
  assert(tree.isEmpty(), "tree should be empty after removing all");
  assertDeepEq(tree.query(15), [], "no results after full removal");
});

// 15 — Intervalles imbriqués
test("nested intervals", () => {
  const tree = new IntervalTree<string>();
  tree.insert(0, 100, "outer");
  tree.insert(20, 80, "mid");
  tree.insert(40, 60, "inner");

  assertDeepEq(tree.query(10), ["outer"], "point 10 in outer only");
  assertDeepEq(tree.query(30).sort(), ["mid", "outer"], "point 30 in outer+mid");
  assertDeepEq(tree.query(50).sort(), ["inner", "mid", "outer"], "point 50 in all three");
});

// ---------------------------------------------------------------------------
// Résumé
// ---------------------------------------------------------------------------
console.log(`\n--- Résumé : ${passed} passé(s), ${failed} échoué(s) ---\n`);

if (failed > 0) {
  process.exit(1);
}

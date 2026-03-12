/**
 * Unit tests for IntervalTree
 * Run with: npx ts-node interval-tree.test.ts
 * Or compile and run with Node.js
 */

import { IntervalTree, Interval } from "./interval-tree";

// Simple test runner
let passed = 0;
let failed = 0;

function test(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err}`);
    failed++;
  }
}

function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function arraysEqual<T>(a: T[], b: T[], msg?: string): void {
  if (a.length !== b.length) {
    throw new Error(msg || `Length mismatch: ${a.length} vs ${b.length}`);
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      throw new Error(msg || `Mismatch at ${i}: ${a[i]} vs ${b[i]}`);
    }
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

console.log("Running IntervalTree tests...\n");

// Test 1: Insertion simple
test("Insertion simple - ajoute un intervalle", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  assert(tree.size === 1, "Size should be 1");
  const all = tree.getAll();
  assert(all.length === 1, "Should have 1 interval");
  assert(all[0].start === 1 && all[0].end === 5 && all[0].value === "A");
});

// Test 2: Insertion multiple et ordre de getAll
test("Insertion multiple - getAll retourne trié par start", () => {
  const tree = new IntervalTree<string>();
  tree.insert(10, 15, "C");
  tree.insert(1, 5, "A");
  tree.insert(5, 10, "B");
  const all = tree.getAll();
  arraysEqual(
    all.map((i) => i.value),
    ["A", "B", "C"]
  );
});

// Test 3: Recherche par point simple
test("Recherche par point - trouve intervalle contenant le point", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, "A");
  tree.insert(15, 20, "B");
  const results = tree.queryPoint(5);
  assert(results.length === 1, "Should find 1 interval");
  assert(results[0].value === "A");
});

// Test 4: Recherche par point avec plusieurs résultats
test("Recherche par point - plusieurs intervalles chevauchent", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, "A");
  tree.insert(5, 15, "B");
  tree.insert(7, 12, "C");
  tree.insert(20, 30, "D");
  const results = tree.queryPoint(8);
  const values = results.map((r) => r.value).sort();
  arraysEqual(values, ["A", "B", "C"]);
});

// Test 5: Recherche par point - pas de résultat
test("Recherche par point - aucun chevauchement", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(10, 15, "B");
  const results = tree.queryPoint(7);
  assert(results.length === 0);
});

// Test 6: Suppression simple
test("Suppression - supprime par valeur", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, "A");
  tree.insert(5, 15, "B");
  const deleted = tree.delete("A");
  assert(deleted === true, "Should return true on delete");
  assert(tree.size === 1, "Size should be 1");
  const results = tree.queryPoint(3);
  assert(results.length === 0, "A should no longer exist");
});

// Test 7: Suppression - valeur inexistante
test("Suppression - valeur inexistante retourne false", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  const deleted = tree.delete("Z");
  assert(deleted === false);
  assert(tree.size === 1, "Size unchanged");
});

// Test 8: Cas limite - intervalles adjacents
test("Cas limite - intervalles adjacents ne se chevauchent pas", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(6, 10, "B");
  const resultsA = tree.queryPoint(5);
  assert(resultsA.length === 1 && resultsA[0].value === "A");
  const resultsB = tree.queryPoint(6);
  assert(resultsB.length === 1 && resultsB[0].value === "B");
  const resultsBetween = tree.queryPoint(5.5);
  assert(resultsBetween.length === 0);
});

// Test 9: Cas limite - doublons (même start/end avec valeurs différentes)
test("Cas limite - doublons (mêmes start/end, valeurs différentes)", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(1, 5, "B");
  tree.insert(1, 5, "C");
  assert(tree.size === 3, "Size should be 3");
  const results = tree.queryPoint(3);
  const values = results.map((r) => r.value).sort();
  arraysEqual(values, ["A", "B", "C"]);
  // Supprimer un doublon
  tree.delete("B");
  assert(tree.size === 2);
  const resultsAfter = tree.queryPoint(3).map((r) => r.value).sort();
  arraysEqual(resultsAfter, ["A", "C"]);
});

// Test 10: Cas limite - arbre vide
test("Cas limite - opérations sur arbre vide", () => {
  const tree = new IntervalTree<string>();
  assert(tree.size === 0);
  assert(tree.getAll().length === 0);
  assert(tree.queryPoint(5).length === 0);
  assert(tree.delete("A") === false);
});

// Test 11: Recherche d'intervalles
test("Recherche d'intervalles - queryInterval", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(10, 15, "B");
  tree.insert(20, 25, "C");
  tree.insert(3, 12, "D");
  const results = tree.queryInterval(6, 11);
  const values = results.map((r) => r.value).sort();
  arraysEqual(values, ["B", "D"]);
});

// Test 12: Grand arbre - stress test
test("Stress test - 1000 insertions et recherches", () => {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 1000; i++) {
    tree.insert(i * 2, i * 2 + 5, i);
  }
  assert(tree.size === 1000);
  // Cherche le point 100 (chevauche 50..52 approx)
  const results = tree.queryPoint(100);
  // 100 est dans [i*2, i*2+5] quand i*2 <= 100 <= i*2+5
  // i <= 50 et i >= 47.5 donc i in [48, 49, 50]
  assert(results.length === 3, `Expected 3 results, got ${results.length}`);
});

// Test 13: Suppression et réinsertion
test("Suppression et réinsertion - maintient la structure", () => {
  const tree = new IntervalTree<string>();
  tree.insert(1, 10, "A");
  tree.insert(2, 8, "B");
  tree.insert(3, 12, "C");
  tree.delete("B");
  tree.insert(4, 6, "D");
  const results = tree.queryPoint(5).map((r) => r.value).sort();
  arraysEqual(results, ["A", "C", "D"]);
});

// Test 14: Intervalles à un seul point
test("Intervalles à un seul point (start === end)", () => {
  const tree = new IntervalTree<string>();
  tree.insert(5, 5, "A");
  tree.insert(3, 7, "B");
  const resultsAt5 = tree.queryPoint(5).map((r) => r.value).sort();
  arraysEqual(resultsAt5, ["A", "B"]);
  const resultsAt4 = tree.queryPoint(4).map((r) => r.value).sort();
  arraysEqual(resultsAt4, ["B"]);
});

// Test 15: Validation des arguments (start > end)
test("Validation - start > end lance une erreur", () => {
  const tree = new IntervalTree<string>();
  let threw = false;
  try {
    tree.insert(10, 5, "A");
  } catch (e) {
    threw = true;
  }
  assert(threw, "Should throw when start > end");
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log(`\n${"=".repeat(40)}`);
console.log(`Total: ${passed + failed} tests`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`${"=".repeat(40)}`);

process.exit(failed > 0 ? 1 : 0);

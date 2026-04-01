/**
 * Tests unitaires pour IntervalTree
 * Exécuter avec : npx ts-node --esm IntervalTree.test.ts
 * Ou compiler et exécuter avec Jest/Mocha
 */

import { IntervalTree } from "./IntervalTree";

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
  }
}

function assertArrayEqual<T>(
  actual: T[],
  expected: T[],
  message: string
): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `${message}\n  Expected length: ${expected.length}\n  Actual length: ${actual.length}`
    );
  }
  for (let i = 0; i < actual.length; i++) {
    if (actual[i] !== expected[i]) {
      throw new Error(
        `${message}\n  Mismatch at index ${i}\n  Expected: ${expected}\n  Actual: ${actual}`
      );
    }
  }
}

// ==================== TESTS ====================

function testBasicInsertionAndQuery(): void {
  const tree = new IntervalTree<number>();
  tree.insert(10, 20, 100);
  tree.insert(30, 40, 300);

  const res1 = tree.query(15);
  assertArrayEqual(res1, [100], "Query 15 should return [100]");

  const res2 = tree.query(35);
  assertArrayEqual(res2, [300], "Query 35 should return [300]");

  const res3 = tree.query(25);
  assertArrayEqual(res3, [], "Query 25 should return []");

  console.log("✅ testBasicInsertionAndQuery passed");
}

function testMultipleOverlappingIntervals(): void {
  const tree = new IntervalTree<string>();
  tree.insert(1, 5, "A");
  tree.insert(2, 6, "B");
  tree.insert(3, 7, "C");
  tree.insert(10, 15, "D");

  const res1 = tree.query(3);
  // 3 est dans [1,5), [2,6), [3,7)
  assertArrayEqual(res1, ["A", "B", "C"], "Query 3 should return A,B,C");

  const res2 = tree.query(6);
  // 6 est dans [2,6) uniquement (car [2,6) inclut 6? Non, 6 est exclu car end=6)
  // Correction: [2,6) → 2 <= x < 6. Donc 6 n'est pas dedans.
  assertArrayEqual(res2, [], "Query 6 should return []");

  const res3 = tree.query(14);
  assertArrayEqual(res3, ["D"], "Query 14 should return D");

  console.log("✅ testMultipleOverlappingIntervals passed");
}

function testNestedIntervals(): void {
  const tree = new IntervalTree<number>();
  tree.insert(0, 100, 1); // grand intervalle
  tree.insert(10, 20, 2);
  tree.insert(15, 18, 3);

  const res = tree.query(16);
  // 16 ∈ [0,100), [10,20), [15,18)
  assertArrayEqual(res, [1, 2, 3], "Query 16 should return 1,2,3");

  console.log("✅ testNestedIntervals passed");
}

function testRemoveBasic(): void {
  const tree = new IntervalTree<number>();
  tree.insert(5, 10, 50);
  tree.insert(15, 20, 150);

  const removed1 = tree.remove(5, 10);
  assertEqual(removed1, true, "Should remove interval [5,10)");

  const after = tree.query(7);
  assertArrayEqual(after, [], "After removal, query 7 should return []");

  const removed2 = tree.remove(999, 1000);
  assertEqual(removed2, false, "Should return false for non-existent interval");

  console.log("✅ testRemoveBasic passed");
}

function testRemoveAndReinsert(): void {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "A");
  tree.insert(20, 30, "B");

  tree.remove(0, 10);
  tree.insert(5, 15, "C");

  const res = tree.query(7);
  assertArrayEqual(res, ["C"], "After remove+insert, query 7 should return C");

  console.log("✅ testRemoveAndReinsert passed");
}

function testBoundaryConditions(): void {
  const tree = new IntervalTree<number>();
  tree.insert(0, 1, 1);
  tree.insert(1, 2, 2);
  tree.insert(-5, 0, -5);

  const res1 = tree.query(0);
  // 0 est dans [-5,0) ? Non, car end=0 exclut 0.
  // 0 est dans [0,1) ? Oui, start=0 inclus.
  assertArrayEqual(res1, [1], "Query 0 should return [1]");

  const res2 = tree.query(1);
  // 1 est dans [1,2) ? Oui.
  assertArrayEqual(res2, [2], "Query 1 should return [2]");

  const res3 = tree.query(-3);
  assertArrayEqual(res3, [-5], "Query -3 should return [-5]");

  console.log("✅ testBoundaryConditions passed");
}

function testManyIntervalsAndQuery(): void {
  const tree = new IntervalTree<number>();
  for (let i = 0; i < 100; i++) {
    tree.insert(i * 2, i * 2 + 1, i);
  }

  // Query au centre de chaque intervalle
  for (let i = 0; i < 100; i++) {
    const res = tree.query(i * 2 + 0.5);
    assertArrayEqual(res, [i], `Query midpoint of interval ${i} should return [${i}]`);
  }

  // Query en dehors de tous les intervalles
  const out = tree.query(200.5);
  assertArrayEqual(out, [], "Query outside should return []");

  console.log("✅ testManyIntervalsAndQuery passed");
}

function testMaxEndRefreshingAfterInsert(): void {
  const tree = new IntervalTree<number>();
  tree.insert(10, 20, 1);
  tree.insert(5, 8, 2);
  tree.insert(30, 40, 3);

  // L'arbre devrait avoir maxEnd = 40 à la racine
  const array = tree.toArray();
  // Le root peut varier selon l'équilibre, mais le maxEnd doit être 40
  // On vérifie en insérant un intervalle qui s'étend plus loin
  tree.insert(25, 50, 4);

  // Après insertion, le maxEnd doit être 50
  const res = tree.query(45);
  assertArrayEqual(res, [4], "Query 45 should return [4] after extending maxEnd");

  console.log("✅ testMaxEndRefreshingAfterInsert passed");
}

function testIntervalsOutOfOrderInsertion(): void {
  const tree = new IntervalTree<string>();
  // Insertion dans un ordre non trié pour tester la structure
  tree.insert(100, 200, "C");
  tree.insert(10, 50, "A");
  tree.insert(60, 90, "B");

  const res1 = tree.query(25);
  assertArrayEqual(res1, ["A"], "Query 25 → A");

  const res2 = tree.query(70);
  assertArrayEqual(res2, ["B"], "Query 70 → B");

  const res3 = tree.query(150);
  assertArrayEqual(res3, ["C"], "Query 150 → C");

  console.log("✅ testIntervalsOutOfOrderInsertion passed");
}

function testInvalidInputThrows(): void {
  const tree = new IntervalTree<number>();

  let threw = false;
  try {
    tree.insert(10, 5, 1); // start >= end
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error("Expected error for insert with start>=end");

  threw = false;
  try {
    tree.remove(5, 5); // start == end
  } catch (e) {
    threw = true;
  }
  if (!threw) throw new Error("Expected error for remove with start==end");

  console.log("✅ testInvalidInputThrows passed");
}

function testComplexOverlapScenario(): void {
  const tree = new IntervalTree<string>();
  tree.insert(0, 10, "base");
  tree.insert(3, 7, "overlap1");
  tree.insert(5, 6, "overlap2");
  tree.insert(20, 30, "other");

  const r1 = tree.query(4);
  // 4 ∈ [0,10) et [3,7)
  assertArrayEqual(r1, ["base", "overlap1"], "Query 4 → base,overlap1");

  const r2 = tree.query(5);
  // 5 ∈ [0,10), [3,7), [5,6)
  assertArrayEqual(r2, ["base", "overlap1", "overlap2"], "Query 5 → base,overlap1,overlap2");

  const r3 = tree.query(8);
  // 8 ∈ [0,10) seulement
  assertArrayEqual(r3, ["base"], "Query 8 → base");

  console.log("✅ testComplexOverlapScenario passed");
}

function testRemoveInnerIntervalOnly(): void {
  const tree = new IntervalTree<number>();
  tree.insert(0, 10, 0);
  tree.insert(1, 2, 1);
  tree.insert(3, 4, 3);

  tree.remove(1, 2);
  tree.remove(3, 4);

  const res = tree.query(5);
  assertArrayEqual(res, [0], "After removing inner intervals, query 5 → [0]");

  console.log("✅ testRemoveInnerIntervalOnly passed");
}

// ==================== EXÉCUTION ====================

console.log("=== IntervalTree Tests ===\n");

try {
  testBasicInsertionAndQuery();
  testMultipleOverlappingIntervals();
  testNestedIntervals();
  testRemoveBasic();
  testRemoveAndReinsert();
  testBoundaryConditions();
  testManyIntervalsAndQuery();
  testMaxEndRefreshingAfterInsert();
  testIntervalsOutOfOrderInsertion();
  testInvalidInputThrows();
  testComplexOverlapScenario();
  testRemoveInnerIntervalOnly();

  console.log("\n✅ Tous les tests ont passé!");
} catch (error) {
  console.error("\n❌ Échec du test:", error.message);
  process.exit(1);
}

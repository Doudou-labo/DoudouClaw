"use strict";
/**
 * Tests unitaires pour IntervalTree
 *
 * Framework d'assertion simple sans dépendances externes
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ============ Framework d'assertion simple ============
function assert(condition, message) {
    if (!condition) {
        throw new Error(message ?? 'Assertion failed');
    }
}
function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message ?? `Expected ${expected}, got ${actual}`);
    }
}
function assertArrayEqual(actual, expected, message) {
    if (actual.length !== expected.length) {
        throw new Error(message ?? `Arrays length differ: ${actual.length} vs ${expected.length}`);
    }
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) {
            throw new Error(message ?? `Arrays differ at index ${i}: ${actual[i]} vs ${expected[i]}`);
        }
    }
}
function assertDeepEqual(actual, expected, message) {
    if (actual.length !== expected.length) {
        throw new Error(message ?? `Arrays length differ: ${actual.length} vs ${expected.length}`);
    }
    for (let i = 0; i < actual.length; i++) {
        const a = actual[i];
        const e = expected[i];
        if (a.start !== e.start || a.end !== e.end || a.value !== e.value) {
            throw new Error(message ?? `Intervals differ at index ${i}: {${a.start},${a.end},${a.value}} vs {${e.start},${e.end},${e.value}}`);
        }
    }
}
// ============ Imports ============
const IntervalTree_1 = require("./IntervalTree");
// ============ Suite de tests ============
console.log('Running IntervalTree tests...\n');
let testsPassed = 0;
let testsFailed = 0;
function runTest(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        testsPassed++;
    }
    catch (error) {
        console.error(`✗ ${name}`);
        console.error(`  Error: ${error.message}`);
        testsFailed++;
    }
}
// ============ Tests d'insertion ============
runTest('Insertion basic - single interval', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    assertEqual(tree.size, 1);
});
runTest('Insertion basic - multiple intervals', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(30, 40, 2);
    tree.insert(50, 60, 3);
    assertEqual(tree.size, 3);
});
runTest('Insertion - overlapping intervals', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 30, 1); // [10,30)
    tree.insert(20, 40, 2); // [20,40) - overlap with first
    tree.insert(15, 25, 3); // [15,25) - overlap with both
    assertEqual(tree.size, 3);
});
runTest('Insertion - nested intervals', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 50, 1);
    tree.insert(20, 40, 2);
    tree.insert(25, 35, 3);
    assertEqual(tree.size, 3);
});
runTest('Insertion - duplicate intervals (same start, end, value)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(10, 20, 1); // duplicate
    assertEqual(tree.size, 2); // Autorise les duplicatas
});
runTest('Insertion - duplicate intervals (same start, end, different value)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(10, 20, 2);
    assertEqual(tree.size, 2);
});
runTest('Insertion - with non-primitive values', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, { name: 'first', data: [1, 2, 3] });
    tree.insert(30, 40, { name: 'second', data: [4, 5, 6] });
    assertEqual(tree.size, 2);
    const result = tree.search(15)[0];
    assertEqual(result.value.name, 'first');
});
runTest('Insertion - throws on invalid interval (start >= end)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    let thrown = false;
    try {
        tree.insert(20, 10, 1); // start > end
    }
    catch (e) {
        thrown = true;
    }
    assert(thrown, 'Should throw on start > end');
    thrown = false;
    try {
        tree.insert(10, 10, 1); // start == end
    }
    catch (e) {
        thrown = true;
    }
    assert(thrown, 'Should throw on start == end');
});
runTest('Insertion - maintains AVL balance', () => {
    const tree = new IntervalTree_1.IntervalTree();
    // Insert sorted (pire cas sans AVL) -> la rebalance doit fonctionner
    tree.insert(10, 20, 1);
    tree.insert(15, 25, 2);
    tree.insert(20, 30, 3);
    tree.insert(25, 35, 4);
    tree.insert(30, 40, 5);
    assertEqual(tree.size, 5);
});
// ============ Tests de recherche ============
runTest('Search - point inside interval', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    const result = tree.search(15);
    assertEqual(result.length, 1);
    assertDeepEqual(result, [{ start: 10, end: 20, value: 1 }]);
});
runTest('Search - point outside all intervals', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(30, 40, 2);
    const result = tree.search(25);
    assertEqual(result.length, 0);
});
runTest('Search - point at boundary (start inclusive)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    const result = tree.search(10);
    assertEqual(result.length, 1);
});
runTest('Search - point at boundary (end exclusive)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    const result = tree.search(20);
    assertEqual(result.length, 0);
});
runTest('Search - multiple overlapping intervals containing point', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 30, 1);
    tree.insert(20, 40, 2);
    tree.insert(15, 25, 3);
    tree.insert(5, 50, 4);
    const result = tree.search(22);
    // [10,30) ✓, [20,40) ✓, [15,25) ✓, [5,50) ✓ — 4 intervals actually contain 22
    assertEqual(result.length, 4);
});
runTest('Search - no false positives', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(30, 40, 2);
    assertEqual(tree.search(5).length, 0);
    assertEqual(tree.search(20).length, 0);
    assertEqual(tree.search(30).length, 1);
    assertEqual(tree.search(40).length, 0);
});
runTest('Search - on empty tree', () => {
    const tree = new IntervalTree_1.IntervalTree();
    const result = tree.search(10);
    assertEqual(result.length, 0);
});
// ============ Tests de suppression ============
runTest('Delete - removes single interval', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    const deleted = tree.delete(10, 20);
    assert(deleted, 'Should return true');
    assertEqual(tree.size, 0);
});
runTest('Delete - returns false for non-existent interval', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    const deleted = tree.delete(30, 40);
    assert(!deleted, 'Should return false');
    assertEqual(tree.size, 1);
});
runTest('Delete - leaf node', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(30, 40, 2);
    tree.delete(10, 20);
    assertEqual(tree.size, 1);
    assertEqual(tree.search(35)[0].value, 2);
});
runTest('Delete - node with one child', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(30, 40, 1);
    tree.insert(10, 20, 2); // gauche de 30
    tree.delete(30, 40);
    assertEqual(tree.size, 1);
    assertEqual(tree.search(15)[0].value, 2);
});
runTest('Delete - node with two children (uses successor)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(20, 30, 1);
    tree.insert(10, 20, 2); // gauche
    tree.insert(30, 40, 3); // droite
    tree.delete(20, 30);
    assertEqual(tree.size, 2);
    // After deletion, the tree should still have the other two intervals
    assertEqual(tree.search(15)[0].value, 2);
    assertEqual(tree.search(35)[0].value, 3);
});
runTest('Delete - with specific value', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(10, 20, 2); // duplicat avec valeur différente
    const deleted = tree.delete(10, 20, 1);
    assert(deleted, 'Should delete the specific value');
    assertEqual(tree.size, 1);
    const result = tree.search(15);
    assertEqual(result.length, 1);
    assertEqual(result[0].value, 2);
});
runTest('Delete - maintains AVL balance after multiple deletes', () => {
    const tree = new IntervalTree_1.IntervalTree();
    for (let i = 0; i < 20; i++) {
        tree.insert(i * 10, i * 10 + 5, i);
    }
    assertEqual(tree.size, 20);
    // Supprimer plusieurs nœuds
    for (let i = 0; i < 10; i++) {
        tree.delete(i * 10, i * 10 + 5);
    }
    assertEqual(tree.size, 10);
});
// ============ Tests de cas limites ============
runTest('Edge case - empty tree operations', () => {
    const tree = new IntervalTree_1.IntervalTree();
    assertEqual(tree.size, 0);
    assert(tree.isEmpty);
    assertArrayEqual(tree.search(10), []);
    assert(!tree.delete(10, 20));
});
runTest('Edge case - single interval', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(100, 200, 1);
    assertEqual(tree.size, 1);
    const result = tree.search(150);
    assertEqual(result.length, 1);
    assertEqual(result[0].value, 1);
});
runTest('Edge case - large dataset (1000 intervals)', () => {
    const tree = new IntervalTree_1.IntervalTree();
    const n = 1000;
    for (let i = 0; i < n; i++) {
        tree.insert(i * 2, i * 2 + 2, i);
    }
    assertEqual(tree.size, n);
    // Recherche d'un point dans un intervalle
    const result = tree.search(1005);
    assertEqual(result.length, 1);
    assertEqual(result[0].value, 502);
    // Recherche d'un point à la frontière
    const result2 = tree.search(1000); // exactly start of interval 500-502
    assertEqual(result2.length, 1);
});
runTest('Edge case - values at extremes', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(-1000000, 1000000, 1);
    tree.insert(Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER + 100, 2);
    tree.insert(Number.MAX_SAFE_INTEGER - 100, Number.MAX_SAFE_INTEGER, 3);
    assertEqual(tree.size, 3);
});
// ============ Tests d'intégration ============
runTest('Integration - mixed operations', () => {
    const tree = new IntervalTree_1.IntervalTree();
    // Insert
    tree.insert(10, 20, 'a');
    tree.insert(15, 25, 'b');
    tree.insert(30, 40, 'c');
    assertEqual(tree.size, 3);
    // Search
    assertEqual(tree.search(18).length, 2);
    assertEqual(tree.search(35).length, 1);
    // Delete
    tree.delete(15, 25);
    assertEqual(tree.size, 2);
    assertEqual(tree.search(18).length, 1); // Only 'a' remains
    // Insert again
    tree.insert(5, 15, 'd');
    assertEqual(tree.size, 3);
    assertEqual(tree.search(12).length, 2); // 'a' and 'd'
});
runTest('Integration - clear and reuse', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(10, 20, 1);
    tree.insert(30, 40, 2);
    assertEqual(tree.size, 2);
    tree.clear();
    assertEqual(tree.size, 0);
    assert(tree.isEmpty);
    tree.insert(50, 60, 3);
    assertEqual(tree.size, 1);
});
// ============ Tests getAll ============
runTest('getAll - returns sorted intervals by start', () => {
    const tree = new IntervalTree_1.IntervalTree();
    tree.insert(30, 40, 3);
    tree.insert(10, 20, 1);
    tree.insert(20, 30, 2);
    const all = tree.getAll();
    assertEqual(all.length, 3);
    assertEqual(all[0].start, 10);
    assertEqual(all[1].start, 20);
    assertEqual(all[2].start, 30);
});
// ============ Résumé ============
console.log('\n' + '='.repeat(50));
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(50));
if (testsFailed > 0) {
    process.exit(1);
}

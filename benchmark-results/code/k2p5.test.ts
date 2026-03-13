/**
 * Tests unitaires pour IntervalTree
 * TypeScript pur - pas de dépendances externes
 */

import { IntervalTree, IntervalValue } from "./interval-tree";

// Simple assertion helper
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`❌ FAILED: ${message}`);
  }
}

function assertEquals(actual: any, expected: any, message: string): void {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`❌ FAILED: ${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
  }
}

// Test runner
function describe(name: string, fn: () => void) {
  console.log(`\n📦 ${name}`);
  try {
    fn();
    console.log(`✅ All tests passed`);
  } catch (e) {
    console.error((e as Error).message);
    process.exit(1);
  }
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
  } catch (e) {
    console.error(`  ❌ ${name}`);
    throw e;
  }
}

// ============== TESTS ==============

describe("IntervalTree - Tests basiques", () => {
  it("devrait créer un arbre vide", () => {
    const tree = new IntervalTree<string>();
    assert(tree.isEmpty(), "L'arbre devrait être vide");
    assertEquals(tree.getSize(), 0, "La taille devrait être 0");
    assertEquals(tree.getAll(), [], "getAll() devrait retourner un tableau vide");
  });

  it("devrait insérer un intervalle simple", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");
    
    assertEquals(tree.getSize(), 1, "La taille devrait être 1");
    assert(!tree.isEmpty(), "L'arbre ne devrait pas être vide");
    
    const all = tree.getAll();
    assertEquals(all.length, 1, "Devrait retourner 1 intervalle");
    assertEquals(all[0], { start: 1, end: 5, value: "A" }, "L'intervalle devrait être correct");
  });

  it("devrait insérer plusieurs intervalles et les retourner triés", () => {
    const tree = new IntervalTree<string>();
    tree.insert(5, 10, "B");
    tree.insert(1, 3, "A");
    tree.insert(15, 20, "C");
    tree.insert(7, 12, "D");
    
    const all = tree.getAll();
    assertEquals(all.length, 4, "Devrait retourner 4 intervalles");
    assertEquals(all[0].value, "A", "Premier intervalle devrait être A (start=1)");
    assertEquals(all[1].value, "B", "Deuxième intervalle devrait être B (start=5)");
    assertEquals(all[2].value, "D", "Troisième intervalle devrait être D (start=7)");
    assertEquals(all[3].value, "C", "Quatrième intervalle devrait être C (start=15)");
  });
});

describe("IntervalTree - Recherche", () => {
  it("devrait trouver les intervalles qui chevauchent un point donné", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");   // chevauche 3
    tree.insert(3, 8, "B");   // chevauche 3 (maintenant commence à 3)
    tree.insert(10, 15, "C"); // ne chevauche pas 3
    tree.insert(0, 2, "D");   // chevauche 1
    
    const results = tree.search(3);
    const values = results.map(r => r.value).sort();
    
    assertEquals(values, ["A", "B"], "Devrait trouver A et B pour le point 3");
  });

  it("devrait retourner un tableau vide si aucun intervalle ne chevauche", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");
    tree.insert(10, 15, "B");
    
    const results = tree.search(7);
    assertEquals(results, [], "Devrait retourner un tableau vide pour le point 7");
  });

  it("devrait trouver tous les intervalles pour un point au milieu", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 10, "A");
    tree.insert(2, 8, "B");
    tree.insert(3, 7, "C");
    tree.insert(4, 6, "D");
    tree.insert(5, 5, "E");
    
    const results = tree.search(5);
    assertEquals(results.length, 5, "Tous les intervalles devraient chevaucher le point 5");
  });
});

describe("IntervalTree - Suppression", () => {
  it("devrait supprimer un intervalle par sa valeur", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");
    tree.insert(3, 7, "B");
    tree.insert(10, 15, "C");
    
    const removed = tree.remove("B");
    
    assert(removed, "La suppression devrait réussir");
    assertEquals(tree.getSize(), 2, "La taille devrait être 2 après suppression");
    
    const all = tree.getAll();
    const values = all.map(r => r.value);
    assertEquals(values, ["A", "C"], "Seuls A et C devraient rester");
  });

  it("devrait retourner false si la valeur n'existe pas", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");
    
    const removed = tree.remove("X");
    
    assert(!removed, "La suppression devrait échouer pour une valeur inexistante");
    assertEquals(tree.getSize(), 1, "La taille ne devrait pas changer");
  });

  it("devrait supprimer correctement la racine avec deux enfants", () => {
    const tree = new IntervalTree<string>();
    tree.insert(10, 20, "Root");
    tree.insert(5, 8, "Left");
    tree.insert(15, 25, "Right");
    tree.insert(3, 6, "LeftLeft");
    tree.insert(7, 9, "LeftRight");
    
    tree.remove("Root");
    
    const all = tree.getAll();
    const values = all.map(r => r.value);
    
    assertEquals(values, ["LeftLeft", "Left", "LeftRight", "Right"], "Root devrait être supprimé");
  });
});

describe("IntervalTree - Cas limites", () => {
  it("devrait gérer les intervalles adjacents (non chevauchants)", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");   // fin à 5
    tree.insert(6, 10, "B");  // commence à 6 (adjacent mais pas chevauchant)
    
    const search5 = tree.search(5);
    assertEquals(search5.length, 1, "Seul A devrait chevaucher 5");
    assertEquals(search5[0].value, "A", "A devrait être trouvé");
    
    const search6 = tree.search(6);
    assertEquals(search6.length, 1, "Seul B devrait chevaucher 6");
    assertEquals(search6[0].value, "B", "B devrait être trouvé");
    
    const search55 = tree.search(5.5);
    assertEquals(search55, [], "Aucun intervalle ne devrait chevaucher 5.5");
  });

  it("devrait gérer les doublons (même intervalle, valeurs différentes)", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A1");
    tree.insert(1, 5, "A2");
    tree.insert(1, 5, "A3");
    
    assertEquals(tree.getSize(), 3, "La taille devrait être 3");
    
    const all = tree.getAll();
    assertEquals(all.length, 3, "Devrait retourner 3 intervalles");
    
    const search = tree.search(3);
    assertEquals(search.length, 3, "Tous les intervalles devraient chevaucher 3");
  });

  it("devrait gérer les doublons avec suppression sélective", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A1");
    tree.insert(1, 5, "A2");
    
    tree.remove("A1");
    
    const all = tree.getAll();
    assertEquals(all.length, 1, "Un seul intervalle devrait rester");
    assertEquals(all[0].value, "A2", "A2 devrait rester");
  });

  it("devrait gérer l'insertion de nombreux intervalles (stress test)", () => {
    const tree = new IntervalTree<number>();
    const count = 100;
    
    for (let i = 0; i < count; i++) {
      tree.insert(i, i + 5, i);
    }
    
    assertEquals(tree.getSize(), count, `La taille devrait être ${count}`);
    
    // Recherche au milieu
    const results = tree.search(50);
    // Les intervalles 45-50, 46-51, 47-52, 48-53, 49-54, 50-55 chevauchent 50
    assertEquals(results.length, 6, "6 intervalles devraient chevaucher le point 50");
  });

  it("devrait lancer une erreur pour un intervalle invalide", () => {
    const tree = new IntervalTree<string>();
    
    let errorThrown = false;
    try {
      tree.insert(10, 5, "Invalid");
    } catch (e) {
      errorThrown = true;
    }
    
    assert(errorThrown, "Devrait lancer une erreur pour start > end");
  });

  it("devrait vider l'arbre correctement", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");
    tree.insert(2, 6, "B");
    
    tree.clear();
    
    assert(tree.isEmpty(), "L'arbre devrait être vide après clear()");
    assertEquals(tree.getSize(), 0, "La taille devrait être 0");
    assertEquals(tree.getAll(), [], "getAll() devrait retourner []");
    assertEquals(tree.search(3), [], "search() devrait retourner []");
  });

  it("devrait gérer les intervalles à un seul point (start === end)", () => {
    const tree = new IntervalTree<string>();
    tree.insert(5, 5, "Point");
    tree.insert(1, 10, "Range");
    
    const results = tree.search(5);
    const values = results.map(r => r.value).sort();
    
    assertEquals(values, ["Point", "Range"], "Les deux intervalles devraient chevaucher le point 5");
  });
});

describe("IntervalTree - Recherche d'intervalles", () => {
  it("devrait trouver les intervalles qui chevauchent un autre intervalle", () => {
    const tree = new IntervalTree<string>();
    tree.insert(1, 5, "A");   // chevauche [3, 7]
    tree.insert(4, 8, "B");   // chevauche [3, 7]
    tree.insert(10, 15, "C"); // ne chevauche pas [3, 7]
    tree.insert(2, 3, "D");   // chevauche [3, 7] (point de contact)
    
    const results = tree.searchInterval(3, 7);
    const values = results.map(r => r.value).sort();
    
    assertEquals(values, ["A", "B", "D"], "Devrait trouver A, B et D");
  });
});

// Run all tests
console.log("🧪 Running IntervalTree tests...\n");
console.log("=================================================");

// Les tests sont exécutés automatiquement par les appels describe

console.log("=================================================");
console.log("\n🎉 All tests passed! (12+ test suites)");

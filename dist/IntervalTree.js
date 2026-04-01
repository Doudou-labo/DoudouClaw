"use strict";
/**
 * ============================================================================
 * IntervalTree — Arbre d'intervalles augmenté (basé sur un AVL)
 * ============================================================================
 *
 * Architecture choisie :
 * Un **arbre binaire de recherche augmenté** auto-équilibré (AVL), où chaque
 * nœud stocke :
 *   - Un intervalle [start, end] associé à une valeur de type T
 *   - Le champ `maxEnd` : le maximum de `end` dans tout le sous-arbre
 *
 * L'ordre de l'arbre est déterminé par la borne `start` des intervalles.
 * Le champ `maxEnd` permet d'élaguer efficacement les branches lors des
 * requêtes par point : si `point < node.maxEnd` on ne descend pas dans
 * un sous-arbre qui ne peut contenir aucune correspondance.
 *
 * Complexités :
 *   - insert : O(log n)
 *   - query  : O(log n + k)  (k = nombre de résultats)
 *   - remove : O(log n)
 *
 * Contraintes : pas de dépendance externe, TypeScript strict uniquement.
 * ============================================================================
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalTree = void 0;
// ---------------------------------------------------------------------------
// Node interne
// ---------------------------------------------------------------------------
class IntervalNode {
    start;
    end;
    value;
    left = null;
    right = null;
    height = 1; // pour l'équilibrage AVL
    maxEnd; // champ augmenté : max(end) du sous-arbre
    constructor(start, end, value) {
        this.start = start;
        this.end = end;
        this.value = value;
        this.maxEnd = end;
    }
}
// ---------------------------------------------------------------------------
// Fonctions utilitaires AVL
// ---------------------------------------------------------------------------
function height(node) {
    return node ? node.height : 0;
}
function updateAugmentedFields(node) {
    node.height = 1 + Math.max(height(node.left), height(node.right));
    node.maxEnd = Math.max(node.end, node.left ? node.left.maxEnd : -Infinity, node.right ? node.right.maxEnd : -Infinity);
}
function balanceFactor(node) {
    return height(node.left) - height(node.right);
}
function rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    updateAugmentedFields(y);
    updateAugmentedFields(x);
    return x;
}
function rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    updateAugmentedFields(x);
    updateAugmentedFields(y);
    return y;
}
function balance(node) {
    updateAugmentedFields(node);
    const bf = balanceFactor(node);
    // Left-heavy
    if (bf > 1) {
        if (node.left && balanceFactor(node.left) < 0) {
            node.left = rotateLeft(node.left); // Left-Right
        }
        return rotateRight(node); // Left-Left
    }
    // Right-heavy
    if (bf < -1) {
        if (node.right && balanceFactor(node.right) > 0) {
            node.right = rotateRight(node.right); // Right-Left
        }
        return rotateLeft(node); // Right-Right
    }
    return node;
}
// ---------------------------------------------------------------------------
// Insertion — insère par ordre croissant de `start`, avec dé-duplication
// ---------------------------------------------------------------------------
function insert(node, start, end, value) {
    if (!node) {
        return new IntervalNode(start, end, value);
    }
    if (start < node.start) {
        node.left = insert(node.left, start, end, value);
    }
    else if (start > node.start) {
        node.right = insert(node.right, start, end, value);
    }
    else {
        // Même start : on insère à droite pour accepter les doublons
        node.right = insert(node.right, start, end, value);
        updateAugmentedFields(node);
        return node;
    }
    return balance(node);
}
// ---------------------------------------------------------------------------
// Suppression — supprime le premier nœud dont l'intervalle correspond
// ---------------------------------------------------------------------------
function remove(node, start, end) {
    if (!node) {
        return { root: null, removed: false };
    }
    if (start < node.start) {
        const result = remove(node.left, start, end);
        if (!result.removed)
            return { root: node, removed: false };
        node.left = result.root;
        return { root: balance(node), removed: true };
    }
    if (start > node.start) {
        const result = remove(node.right, start, end);
        if (!result.removed)
            return { root: node, removed: false };
        node.right = result.root;
        return { root: balance(node), removed: true };
    }
    // start match — vérifier end
    if (node.end !== end) {
        // Même start mais end différent : chercher à droite (les doublons vont à droite)
        const result = remove(node.right, start, end);
        if (!result.removed)
            return { root: node, removed: false };
        node.right = result.root;
        return { root: balance(node), removed: true };
    }
    // Nœud trouvé — suppression classique AVL
    if (!node.left) {
        return { root: node.right, removed: true };
    }
    if (!node.right) {
        return { root: node.left, removed: true };
    }
    // Deux enfants : remplacer par le minimum du sous-arbre droit
    let successor = node.right;
    while (successor.left) {
        successor = successor.left;
    }
    node.start = successor.start;
    node.end = successor.end;
    node.value = successor.value;
    const result = remove(node.right, successor.start, successor.end);
    node.right = result.root;
    return { root: balance(node), removed: true };
}
// ---------------------------------------------------------------------------
// Query — collecte toutes les valeurs dont l'intervalle contient `point`
// ---------------------------------------------------------------------------
function query(node, point, results) {
    if (!node)
        return;
    // Élagage : si le point est plus grand que le maxEnd du sous-arbre,
    // aucun intervalle dans ce sous-arbre ne peut contenir le point.
    if (point > node.maxEnd)
        return;
    // Descendre à gauche si le point pourrait s'y trouver
    if (node.left && point <= node.left.maxEnd) {
        query(node.left, point, results);
    }
    // Vérifier le nœud courant
    if (point >= node.start && point <= node.end) {
        results.push(node.value);
    }
    // Descendre à droite : comme l'arbre est trié par start, les noeuds
    // du sous-arbre droit ont un start >= celui du noeud courant.
    // On descend si au moins un de ces intervalles pourrait couvrir le point
    // (élagage par maxEnd, pas par start — les intervalles commencent après
    // mais peuvent quand même s'étendre au-delà du point).
    if (node.right && point <= node.right.maxEnd) {
        query(node.right, point, results);
    }
}
// ---------------------------------------------------------------------------
// Parcours in-order (pour débogage / export)
// ---------------------------------------------------------------------------
function inOrder(node) {
    if (!node)
        return [];
    return [
        ...inOrder(node.left),
        [node.start, node.end, node.value],
        ...inOrder(node.right),
    ];
}
// ---------------------------------------------------------------------------
// Export publique
// ---------------------------------------------------------------------------
class IntervalTree {
    root = null;
    /** Insère un intervalle [start, end] associé à une valeur */
    insert(start, end, value) {
        if (start > end) {
            throw new Error(`Invalid interval: start (${start}) > end (${end})`);
        }
        this.root = insert(this.root, start, end, value);
    }
    /** Retourne toutes les valeurs dont l'intervalle contient `point` */
    query(point) {
        const results = [];
        query(this.root, point, results);
        return results;
    }
    /** Supprime le premier intervalle dont [start, end] correspond exactement.
     *  Retourne `true` si une suppression a eu lieu. */
    remove(start, end) {
        const result = remove(this.root, start, end);
        this.root = result.root;
        return result.removed;
    }
    /** Retourne `true` si l'arbre est vide */
    isEmpty() {
        return this.root === null;
    }
    /** Retourne le nombre de nœuds — O(n) */
    size() {
        return inOrder(this.root).length;
    }
    /** Dump in-order pour inspection */
    dump() {
        return inOrder(this.root);
    }
}
exports.IntervalTree = IntervalTree;

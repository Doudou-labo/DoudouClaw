"use strict";
/**
 * IntervalTree - Un arbre binaire de recherche équilibré (AVL) pour les intervalles
 *
 * Cette implémentation utilise un arbre AVL augmenté avec un champ `maxEnd`
 * permettant de trouver tous les intervalles contenant un point en temps logarithmique.
 *
 * Complexité:
 * - insert: O(log n)
 * - delete: O(log n)
 * - search: O(log n + k) où k est le nombre d'intervalles trouvés
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntervalTree = void 0;
class IntervalTree {
    constructor() {
        this.root = null;
    }
    /**
     * Insère un intervalle dans l'arbre
     * @param start - Début de l'intervalle (inclusif)
     * @param end - Fin de l'intervalle (exclusif)
     * @param value - Valeur associée à l'intervalle
     */
    insert(start, end, value) {
        if (start >= end) {
            throw new Error(`Invalid interval: start (${start}) must be < end (${end})`);
        }
        this.root = this.insertNode(this.root, start, end, value);
    }
    /**
     * Supprime un intervalle de l'arbre
     * @param start - Début de l'intervalle à supprimer
     * @param end - Fin de l'intervalle à supprimer
     * @param value - Valeur optionnelle pour cibler une suppression spécifique
     * @returns true si au moins un intervalle a été supprimé, false sinon
     */
    delete(start, end, value) {
        const initialSize = this.size;
        this.root = this.deleteNode(this.root, start, end, value);
        return this.size < initialSize;
    }
    /**
     * Recherche tous les intervalles contenant un point
     * @param point - Point à tester
     * @returns Liste des intervalles contenant le point
     */
    search(point) {
        const result = [];
        this.searchNode(this.root, point, result);
        return result;
    }
    /**
     * Retourne le nombre d'intervalles dans l'arbre
     */
    get size() {
        return this.countNodes(this.root);
    }
    /**
     * Vérifie si l'arbre est vide
     */
    get isEmpty() {
        return this.root === null;
    }
    // ============ Méthodes privées ============
    insertNode(node, start, end, value) {
        if (node === null) {
            return new IntervalNode(start, end, value);
        }
        if (start < node.start) {
            node.left = this.insertNode(node.left, start, end, value);
        }
        else if (start > node.start) {
            node.right = this.insertNode(node.right, start, end, value);
        }
        else {
            // Même start, insérer à droite pour éviter conflit
            node.right = this.insertNode(node.right, start, end, value);
        }
        this.updateNode(node);
        return this.balance(node);
    }
    deleteNode(node, start, end, value) {
        if (node === null) {
            return null;
        }
        if (start < node.start) {
            node.left = this.deleteNode(node.left, start, end, value);
        }
        else if (start > node.start) {
            node.right = this.deleteNode(node.right, start, end, value);
        }
        else {
            // start égal : vérifier end et value si fourni
            if (node.end === end && (value === undefined || node.value === value)) {
                // Nœud à supprimer
                if (node.left === null) {
                    return node.right;
                }
                else if (node.right === null) {
                    return node.left;
                }
                else {
                    // Deux enfants : remplacer par le successeur
                    const successor = this.minNode(node.right);
                    node.start = successor.start;
                    node.end = successor.end;
                    node.value = successor.value;
                    node.right = this.deleteMin(node.right);
                }
            }
            else if (node.end === end) {
                // Même start et end mais valeur différente : chercher ailleurs
                // Essaye d'abord à droite
                node.right = this.deleteNode(node.right, start, end, value);
                if (node.right === null || !this.containsExact(node.right, start, end, value)) {
                    // Pas trouvé à droite, essayer à gauche (cas improbable mais possible)
                    node.left = this.deleteNode(node.left, start, end, value);
                }
            }
            else {
                // Même start mais end différent : continuer la recherche
                node.right = this.deleteNode(node.right, start, end, value);
            }
        }
        this.updateNode(node);
        return this.balance(node);
    }
    containsExact(node, start, end, value) {
        if (node.start === start && node.end === end && (value === undefined || node.value === value)) {
            return true;
        }
        return false;
    }
    deleteMin(node) {
        if (node.left === null) {
            return node.right;
        }
        node.left = this.deleteMin(node.left);
        this.updateNode(node);
        return this.balance(node);
    }
    minNode(node) {
        while (node.left !== null) {
            node = node.left;
        }
        return node;
    }
    searchNode(node, point, result) {
        if (node === null) {
            return;
        }
        // Si le sous-arbre gauche peut contenir des intervalles avec le point
        if (node.left !== null && node.left.maxEnd > point) {
            this.searchNode(node.left, point, result);
        }
        // Vérifier le nœud actuel
        if (point >= node.start && point < node.end) {
            result.push({ start: node.start, end: node.end, value: node.value });
        }
        // Si le point est >= start du nœud courant, alors le sous-arbre droit
        // peut contenir des intervalles avec start <= point.
        // On peut aussi optimiser avec maxEnd: si le maxEnd du droit <= point, aucun intervalle du droit ne peut contenir le point.
        if (node.right !== null && point >= node.start && node.right.maxEnd > point) {
            this.searchNode(node.right, point, result);
        }
    }
    updateNode(node) {
        const leftHeight = node.left?.height ?? 0;
        const rightHeight = node.right?.height ?? 0;
        node.height = Math.max(leftHeight, rightHeight) + 1;
        const leftMax = node.left?.maxEnd ?? -Infinity;
        const rightMax = node.right?.maxEnd ?? -Infinity;
        node.maxEnd = Math.max(node.end, leftMax, rightMax);
    }
    balance(node) {
        const balanceFactor = this.getBalance(node);
        // Déséquilibre à gauche
        if (balanceFactor > 1) {
            if (this.getBalance(node.left) < 0) {
                node.left = this.rotateLeft(node.left);
            }
            return this.rotateRight(node);
        }
        // Déséquilibre à droite
        if (balanceFactor < -1) {
            if (this.getBalance(node.right) > 0) {
                node.right = this.rotateRight(node.right);
            }
            return this.rotateLeft(node);
        }
        return node;
    }
    rotateRight(y) {
        const x = y.left;
        const T2 = x.right;
        x.right = y;
        y.left = T2;
        this.updateNode(y);
        this.updateNode(x);
        return x;
    }
    rotateLeft(x) {
        const y = x.right;
        const T2 = y.left;
        y.left = x;
        x.right = T2;
        this.updateNode(x);
        this.updateNode(y);
        return y;
    }
    getBalance(node) {
        const leftHeight = node.left?.height ?? 0;
        const rightHeight = node.right?.height ?? 0;
        return leftHeight - rightHeight;
    }
    countNodes(node) {
        if (node === null)
            return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
    // ============ Méthodes utilitaires (optionnelles) ============
    /**
     * Retourne tous les intervalles de l'arbre (parcours in-order)
     */
    getAll() {
        const result = [];
        this.inOrder(this.root, result);
        return result;
    }
    inOrder(node, result) {
        if (node === null)
            return;
        this.inOrder(node.left, result);
        result.push({ start: node.start, end: node.end, value: node.value });
        this.inOrder(node.right, result);
    }
    /**
     * Efface tous les intervalles
     */
    clear() {
        this.root = null;
    }
}
exports.IntervalTree = IntervalTree;
/**
 * Nœud interne de l'arbre AVL
 */
class IntervalNode {
    constructor(start, end, value) {
        this.left = null;
        this.right = null;
        this.start = start;
        this.end = end;
        this.value = value;
        this.height = 1;
        this.maxEnd = end;
    }
}

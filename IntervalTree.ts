/**
 * IntervalTree - Arbre d'intervalles générique avec équilibrage AVL
 *
 * Architecture choisie :
 * ──────────────────────
 * - AVL Tree (arbre binaire de recherche équilibré) pour garantir O(log n)
 *   sur insert / remove / query quel que soit l'ordre d'insertion.
 *
 * - Chaque nœud est_augmenté_ avec `maxEnd` : le maximum des endpoints (valeurs
 *   de fin) dans tout le sous-arbre. Cet attribut permet d'élaguer les branches
 *   qui ne peuvent pas contenir le point recherché.
 *
 * - Ordonnancement : les nœuds sont triés par `start` (clé primaire).
 *   Les intervalles avec le même start sont rangés à droite (comportement stable).
 *
 * - Suppression : suppression par start+end exacts (identifiants uniques).
 *
 * Structure d'un nœud :
 *   start  – borne inférieure de l'intervalle (incluse)
 *   end    – borne supérieure (EXCLUE : [start, end))
 *   value  – valeur arbitraire de type T
 *   maxEnd – max(end, sous-arbre gauche.maxEnd, sous-arbre droit.maxEnd)
 *   height – hauteur AVL (feuille = 1, null = 0)
 *   left / right – enfants
 *
 * Requête (point) — logique d'élaguage :
 *   1. Sous-arbre gauche : explorer si left.maxEnd > point
 *      (un intervalle du gauche peut contenir le point si son end dépasse le point)
 *   2. Nœud courant : ajouter si point ∈ [start, end)
 *   3. Sous-arbre droit : explorer si
 *        - le nœud contient le point (ses descendants peuvent aussi le contenir)
 *        - OU (node.start <= point ET right.maxEnd > point)
 *          (le point est dans la "zone d'influence" du nœud ET le droit dépasse)
 *        - si node.start > point → aucun descendant du droit ne peut contenir le point
 *
 * Complexités :
 *   insert : O(log n)
 *   remove : O(log n)
 *   query  : O(k + log n)   où k = nombre d'intervalles trouvés
 *
 * Copyright 2026 - DoudouClaw
 */

// ============================================================================
// Types
// ============================================================================

interface IntervalNode<T> {
    start: number;
    end: number;
    value: T;
    maxEnd: number;
    height: number;
    left: IntervalNode<T> | null;
    right: IntervalNode<T> | null;
}

// ============================================================================
// Classe principale
// ============================================================================

export class IntervalTree<T> {
    private root: IntervalNode<T> | null = null;

    // ========================================================================
    // API publique
    // ========================================================================

    /**
     * Insère un intervalle [start, end) avec une valeur associée.
     * @param start – borne inférieure (incluse)
     * @param end   – borne supérieure (EXCLUE)
     * @param value – valeur stockée avec cet intervalle
     * @throws Error si start >= end
     */
    insert(start: number, end: number, value: T): void {
        if (start >= end) {
            throw new Error(`Interval invalide : start (${start}) >= end (${end})`);
        }
        this.root = this._insert(this.root, start, end, value);
    }

    /**
     * Retourne toutes les valeurs dont l'intervalle contient le point donné.
     * L'intervalle [start, end) contient point p si et seulement si start <= p < end.
     * @param point – point à tester
     * @returns tableau de valeurs (peut être vide)
     */
    query(point: number): T[] {
        const results: T[] = [];
        this._query(this.root, point, results);
        return results;
    }

    /**
     * Supprime l'intervalle correspondant exactement à [start, end).
     * @returns true si un intervalle a été supprimé, false si non trouvé
     */
    remove(start: number, end: number): boolean {
        const before = this._size(this.root);
        this.root = this._remove(this.root, start, end);
        return this._size(this.root) < before;
    }

    /** Nombre d'intervalles dans l'arbre */
    count(): number {
        return this._size(this.root);
    }

    /** Vrai si l'arbre est vide */
    isEmpty(): boolean {
        return this.root === null;
    }

    /**
     * Retourne tous les intervalles triés par start (pour debug / tests).
     */
    toArray(): { start: number; end: number; value: T }[] {
        const out: { start: number; end: number; value: T }[] = [];
        this._inorder(this.root, out);
        return out;
    }

    // ========================================================================
    // Insertion AVL
    // ========================================================================

    private _insert(node: IntervalNode<T> | null, start: number, end: number, value: T): IntervalNode<T> {
        if (node === null) {
            return { start, end, value, maxEnd: end, height: 1, left: null, right: null };
        }

        if (start < node.start) {
            node.left = this._insert(node.left, start, end, value);
        } else {
            node.right = this._insert(node.right, start, end, value);
        }

        this._update(node);
        return this._balance(node);
    }

    // ========================================================================
    // Suppression AVL
    // ========================================================================

    private _remove(node: IntervalNode<T> | null, start: number, end: number): IntervalNode<T> | null {
        if (node === null) return null;

        if (start < node.start) {
            node.left = this._remove(node.left, start, end);
        } else if (start > node.start) {
            node.right = this._remove(node.right, start, end);
        } else {
            if (node.end === end) {
                return this._deleteNode(node);
            }
            node.right = this._remove(node.right, start, end);
        }

        if (node !== null) {
            this._update(node);
            node = this._balance(node);
        }
        return node;
    }

    private _deleteNode(node: IntervalNode<T>): IntervalNode<T> | null {
        if (node.left === null && node.right === null) return null;
        if (node.left === null) return node.right;
        if (node.right === null) return node.left;

        const succ = this._minNode(node.right);
        node.right = this._remove(node.right, succ.start, succ.end);
        node.start = succ.start;
        node.end = succ.end;
        node.value = succ.value;
        this._update(node);
        return node;
    }

    private _minNode(node: IntervalNode<T>): IntervalNode<T> {
        let cur = node;
        while (cur.left !== null) cur = cur.left;
        return cur;
    }

    // ========================================================================
    // Requête par point
    // ========================================================================

    private _query(node: IntervalNode<T> | null, point: number, results: T[]): void {
        if (node === null) return;

        const nodeContains = point >= node.start && point < node.end;

        // Sous-arbre gauche : peut contenir le point si maxEnd > point
        if (node.left !== null && node.left.maxEnd > point) {
            this._query(node.left, point, results);
        }

        // Nœud courant
        if (nodeContains) {
            results.push(node.value);
        }

        // Sous-arbre droit : exploration
        // - SI nodeContains : le nœud contient le point → ses descendants
        //   (qui commencent >= node.start) peuvent aussi le contenir → explorer
        // - SINON : le nœud ne contient PAS le point.
        //   SI node.start <= point ET right.maxEnd > point : le droit a un
        //   intervalle qui "dépasse" le point → explorer.
        //   SI node.start > point : tous les descendants ont start > point,
        //   donc aucun ne peut contenir le point → STOP.
        if (node.right !== null) {
            if (nodeContains) {
                this._query(node.right, point, results);
            } else if (node.start <= point && node.right.maxEnd > point) {
                this._query(node.right, point, results);
            }
        }
    }

    // ========================================================================
    // Helpers AVL
    // ========================================================================

    private _height(n: IntervalNode<T> | null): number {
        return n === null ? 0 : n.height;
    }

    private _update(node: IntervalNode<T>): void {
        node.height = 1 + Math.max(this._height(node.left), this._height(node.right));
        node.maxEnd = Math.max(
            node.end,
            node.left?.maxEnd ?? node.end,
            node.right?.maxEnd ?? node.end
        );
    }

    private _balanceFactor(node: IntervalNode<T>): number {
        return this._height(node.left) - this._height(node.right);
    }

    private _balance(node: IntervalNode<T>): IntervalNode<T> {
        const bf = this._balanceFactor(node);

        if (bf > 1) {
            if (this._balanceFactor(node.left!) < 0) {
                node.left = this._rotateLeft(node.left!);
            }
            return this._rotateRight(node);
        }

        if (bf < -1) {
            if (this._balanceFactor(node.right!) > 0) {
                node.right = this._rotateRight(node.right!);
            }
            return this._rotateLeft(node);
        }

        return node;
    }

    private _rotateRight(y: IntervalNode<T>): IntervalNode<T> {
        const x = y.left!;
        const t2 = x.right;

        x.right = y;
        y.left = t2;

        this._update(y);
        this._update(x);

        return x;
    }

    private _rotateLeft(x: IntervalNode<T>): IntervalNode<T> {
        const y = x.right!;
        const t2 = y.left;

        y.left = x;
        x.right = t2;

        this._update(x);
        this._update(y);

        return y;
    }

    // ========================================================================
    // Helpers divers
    // ========================================================================

    private _size(node: IntervalNode<T> | null): number {
        if (node === null) return 0;
        return 1 + this._size(node.left) + this._size(node.right);
    }

    private _inorder(node: IntervalNode<T> | null, out: { start: number; end: number; value: T }[]): void {
        if (node === null) return;
        this._inorder(node.left, out);
        out.push({ start: node.start, end: node.end, value: node.value });
        this._inorder(node.right, out);
    }
}

/**
 * IntervalTree - Arbre d'intervalles générique
 *
 * Architecture : BST (Binary Search Tree) augmenté avec suivi de maxEnd
 *
 * - Chaque nœud contient start, end, value et maxEnd (borne max du sous-arbre)
 * - Ordre d'insertion/suppression basé sur start (clé de tri)
 * - Lors des requêtes, on utilise maxEnd pour élaguer les branches inutiles
 *
 * Complexités moyennes :
 *   insert : O(log n)
 *   query  : O(log n + k)   (k = nombre de résultats)
 *   remove : O(log n)
 *
 * Copyright 2026 - DoudouClaw
 */

export class IntervalTree<T> {
  private root: Node<T> | null = null;

  /**
   * Insère un intervalle [start, end) avec une valeur associée
   * @param start Borne inférieure inclusive
   * @param end   Borne supérieure exclusive
   * @param value Valeur à stocker
   * @throws Si start >= end
   */
  insert(start: number, end: number, value: T): void {
    if (start >= end) {
      throw new Error(`Interval invalide: start(${start}) >= end(${end})`);
    }
    this.root = this._insert(this.root, start, end, value);
  }

  private _insert(
    node: Node<T> | null,
    start: number,
    end: number,
    value: T
  ): Node<T> {
    if (node === null) {
      return new Node(start, end, value);
    }

    if (start < node.start) {
      node.left = this._insert(node.left, start, end, value);
    } else {
      node.right = this._insert(node.right, start, end, value);
    }

    this.updateMaxEnd(node);
    return node;
  }

  /**
   * Recherche toutes les valeurs dont l'intervalle contient le point donné
   * @param point Point à tester (doit être >= start ET < end)
   * @returns Tableau des valeurs trouvées
   */
  query(point: number): T[] {
    const results: T[] = [];
    this._query(this.root, point, results);
    return results;
  }

  private _query(node: Node<T> | null, point: number, results: T[]): void {
    if (node === null) return;

    // Si le point est dans l'intervalle du nœud courant, ajouter la valeur
    if (point >= node.start && point < node.end) {
      results.push(node.value);
    }

    // Si le sous-arbre gauche pourrait contenir le point (maxEnd > point)
    if (node.left !== null && node.left.maxEnd > point) {
      this._query(node.left, point, results);
    }

    // Si le point est >= start du nœud courant, le sous-arbre droit pourrait contenir le point
    if (node.right !== null && point >= node.start) {
      this._query(node.right, point, results);
    }
  }

  /**
   * Supprime un intervalle spécifique (identifié par start et end)
   * @param start Borne inférieure de l'intervalle à supprimer
   * @param end   Borne supérieure de l'intervalle à supprimer
   * @returns true si l'intervalle a été trouvé et supprimé, false sinon
   * @throws Si start >= end
   */
  remove(start: number, end: number): boolean {
    if (start >= end) {
      throw new Error(`Interval invalide: start(${start}) >= end(${end})`);
    }
    const result = this._remove(this.root, start, end);
    this.root = result.node;
    return result.removed;
  }

  private _remove(
    node: Node<T> | null,
    start: number,
    end: number
  ): { node: Node<T> | null; removed: boolean } {
    if (node === null) {
      return { node: null, removed: false };
    }

    let removed = false;

    if (start < node.start) {
      const result = this._remove(node.left, start, end);
      node.left = result.node;
      removed = result.removed;
    } else if (start > node.start) {
      const result = this._remove(node.right, start, end);
      node.right = result.node;
      removed = result.removed;
    } else {
      // start == node.start, vérifier aussi end
      if (end === node.end) {
        // Trouvé! Supprimer ce nœud
        removed = true;
        if (node.left === null) {
          return { node: node.right, removed: true };
        } else if (node.right === null) {
          return { node: node.left, removed: true };
        } else {
          // Deux enfants: remplacer par le successeur (plus petit du sous-arbre droit)
          const successor = this._minNode(node.right);
          node.start = successor.start;
          node.end = successor.end;
          node.value = successor.value;
          const result = this._remove(node.right, successor.start, successor.end);
          node.right = result.node;
        }
      } else {
        // start identique mais end différent → continuer recherche
        const result = this._remove(node.right, start, end);
        node.right = result.node;
        removed = result.removed;
      }
    }

    if (removed) {
      this.updateMaxEnd(node);
    }

    return { node, removed };
  }

  private _minNode(node: Node<T>): Node<T> {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  private updateMaxEnd(node: Node<T>): void {
    let max = node.end;
    if (node.left !== null && node.left.maxEnd > max) {
      max = node.left.maxEnd;
    }
    if (node.right !== null && node.right.maxEnd > max) {
      max = node.right.maxEnd;
    }
    node.maxEnd = max;
  }

  /**
   * Retourne tous les intervalles de l'arbre (pour debugging/tests)
   * @returns Liste des {start, end, value} triés par start
   */
  toArray(): { start: number; end: number; value: T }[] {
    const arr: { start: number; end: number; value: T }[] = [];
    this._inorder(this.root, arr);
    return arr;
  }

  private _inorder(
    node: Node<T> | null,
    arr: { start: number; end: number; value: T }[]
  ): void {
    if (node === null) return;
    this._inorder(node.left, arr);
    arr.push({ start: node.start, end: node.end, value: node.value });
    this._inorder(node.right, arr);
  }
}

/**
 * Nœud interne de l'arbre
 */
class Node<T> {
  start: number;
  end: number;
  value: T;
  left: Node<T> | null = null;
  right: Node<T> | null = null;
  maxEnd: number; // maximum de end dans le sous-arbre (inclut ce nœud)

  constructor(start: number, end: number, value: T) {
    this.start = start;
    this.end = end;
    this.value = value;
    this.maxEnd = end;
  }
}

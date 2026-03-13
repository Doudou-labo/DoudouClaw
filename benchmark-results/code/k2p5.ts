/**
 * Interval Tree - Structure de données pour stocker et rechercher des intervalles
 * Complexité: O(log n) pour insertion et recherche
 */

export interface IntervalValue<T> {
  start: number;
  end: number;
  value: T;
}

interface TreeNode<T> {
  interval: IntervalValue<T>;
  max: number;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
  height: number;
}

export class IntervalTree<T> {
  private root: TreeNode<T> | null = null;
  private size: number = 0;

  /**
   * Retourne la hauteur d'un nœud
   */
  private height(node: TreeNode<T> | null): number {
    return node ? node.height : 0;
  }

  /**
   * Met à jour la hauteur et le max d'un nœud
   */
  private updateNode(node: TreeNode<T>): void {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
    node.max = Math.max(
      node.interval.end,
      Math.max(
        node.left ? node.left.max : -Infinity,
        node.right ? node.right.max : -Infinity
      )
    );
  }

  /**
   * Retourne le facteur d'équilibre d'un nœud
   */
  private balanceFactor(node: TreeNode<T>): number {
    return this.height(node.left) - this.height(node.right);
  }

  /**
   * Rotation droite
   */
  private rotateRight(y: TreeNode<T>): TreeNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateNode(y);
    this.updateNode(x);

    return x;
  }

  /**
   * Rotation gauche
   */
  private rotateLeft(x: TreeNode<T>): TreeNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateNode(x);
    this.updateNode(y);

    return y;
  }

  /**
   * Équilibre un nœud
   */
  private balance(node: TreeNode<T>): TreeNode<T> {
    const balance = this.balanceFactor(node);

    // Gauche lourd
    if (balance > 1) {
      if (this.balanceFactor(node.left!) < 0) {
        node.left = this.rotateLeft(node.left!);
      }
      return this.rotateRight(node);
    }

    // Droite lourd
    if (balance < -1) {
      if (this.balanceFactor(node.right!) > 0) {
        node.right = this.rotateRight(node.right!);
      }
      return this.rotateLeft(node);
    }

    return node;
  }

  /**
   * Compare deux intervalles pour l'ordre dans l'arbre (par start, puis par end)
   */
  private compareIntervals(a: IntervalValue<T>, b: IntervalValue<T>): number {
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return a.end - b.end;
  }

  /**
   * Compare une valeur à un intervalle pour la recherche
   */
  private compareValueToInterval(value: T, interval: IntervalValue<T>): boolean {
    return JSON.stringify(value) === JSON.stringify(interval.value);
  }

  /**
   * Insère un intervalle dans l'arbre
   * Complexité: O(log n)
   */
  insert(start: number, end: number, value: T): void {
    if (start > end) {
      throw new Error("L'intervalle est invalide: start doit être <= end");
    }

    const newInterval: IntervalValue<T> = { start, end, value };
    this.root = this.insertNode(this.root, newInterval);
    this.size++;
  }

  private insertNode(node: TreeNode<T> | null, interval: IntervalValue<T>): TreeNode<T> {
    // Insertion BST standard
    if (node === null) {
      return {
        interval,
        max: interval.end,
        left: null,
        right: null,
        height: 1
      };
    }

    const cmp = this.compareIntervals(interval, node.interval);
    if (cmp < 0) {
      node.left = this.insertNode(node.left, interval);
    } else {
      // Permet les doublons à droite
      node.right = this.insertNode(node.right, interval);
    }

    // Met à jour la hauteur et le max
    this.updateNode(node);

    // Équilibre l'arbre
    return this.balance(node);
  }

  /**
   * Vérifie si deux intervalles se chevauchent
   */
  private overlaps(a: IntervalValue<T>, point: number): boolean {
    return a.start <= point && point <= a.end;
  }

  /**
   * Vérifie si deux intervalles se chevauchent (intervalle vs intervalle)
   */
  private intervalsOverlap(a: IntervalValue<T>, b: IntervalValue<T>): boolean {
    return a.start <= b.end && b.start <= a.end;
  }

  /**
   * Recherche tous les intervalles qui chevauchent un point donné
   * Complexité: O(log n + k) où k est le nombre de résultats
   */
  search(point: number): IntervalValue<T>[] {
    const results: IntervalValue<T>[] = [];
    this.searchNode(this.root, point, results);
    return results;
  }

  private searchNode(node: TreeNode<T> | null, point: number, results: IntervalValue<T>[]): void {
    if (node === null) return;

    // Vérifier le nœud courant
    if (this.overlaps(node.interval, point)) {
      results.push(node.interval);
    }

    // Si le sous-arbre gauche existe et que son max >= point, chercher à gauche
    if (node.left && node.left.max >= point) {
      this.searchNode(node.left, point, results);
    }

    // Si le sous-arbre droit existe et que son max >= point, chercher à droite
    if (node.right && node.right.max >= point) {
      this.searchNode(node.right, point, results);
    }
  }

  /**
   * Recherche tous les intervalles qui chevauchent un intervalle donné
   */
  searchInterval(start: number, end: number): IntervalValue<T>[] {
    const results: IntervalValue<T>[] = [];
    const target: IntervalValue<T> = { start, end, value: undefined as T };
    this.searchIntervalNode(this.root, target, results);
    return results;
  }

  private searchIntervalNode(node: TreeNode<T> | null, target: IntervalValue<T>, results: IntervalValue<T>[]): void {
    if (node === null) return;

    // Si le max du sous-arbre gauche est >= au start de la cible, chercher à gauche
    if (node.left && node.left.max >= target.start) {
      this.searchIntervalNode(node.left, target, results);
    }

    // Vérifier le nœud courant
    if (this.intervalsOverlap(node.interval, target)) {
      results.push(node.interval);
    }

    // Si le start du nœud courant <= end de la cible, chercher à droite
    if (node.interval.start <= target.end && node.right) {
      this.searchIntervalNode(node.right, target, results);
    }
  }

  /**
   * Supprime un intervalle par sa valeur
   * Complexité: O(log n)
   */
  remove(value: T): boolean {
    const initialSize = this.size;
    this.root = this.removeNode(this.root, value);
    return this.size < initialSize;
  }

  private removeNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (node === null) return null;

    // Recherche du nœud à supprimer
    if (this.compareValueToInterval(value, node.interval)) {
      this.size--;

      // Cas 1: pas d'enfants ou un seul enfant
      if (node.left === null) return node.right;
      if (node.right === null) return node.left;

      // Cas 2: deux enfants - trouver le successeur in-order
      const successor = this.findMin(node.right);
      node.interval = successor.interval;
      node.right = this.removeMin(node.right);
    } else {
      // Chercher dans les sous-arbres
      // On doit chercher dans les deux car les intervalles peuvent avoir des valeurs identiques
      const leftResult = this.findAndRemove(node.left, value);
      if (leftResult.found) {
        node.left = leftResult.node;
        this.size--; // Déjà décrémenté dans findAndRemove
      } else {
        const rightResult = this.findAndRemove(node.right, value);
        if (rightResult.found) {
          node.right = rightResult.node;
          this.size--; // Déjà décrémenté dans findAndRemove
        }
      }
    }

    if (node === null) return null;

    this.updateNode(node);
    return this.balance(node);
  }

  private findAndRemove(node: TreeNode<T> | null, value: T): { found: boolean; node: TreeNode<T> | null } {
    if (node === null) return { found: false, node: null };

    if (this.compareValueToInterval(value, node.interval)) {
      return { found: true, node: this.removeNode(node, value) };
    }

    const leftResult = this.findAndRemove(node.left, value);
    if (leftResult.found) {
      return { found: true, node: this.updateAndBalance({ ...node, left: leftResult.node }) };
    }

    const rightResult = this.findAndRemove(node.right, value);
    if (rightResult.found) {
      return { found: true, node: this.updateAndBalance({ ...node, right: rightResult.node }) };
    }

    return { found: false, node };
  }

  private updateAndBalance(node: TreeNode<T> | null): TreeNode<T> | null {
    if (node === null) return null;
    this.updateNode(node);
    return this.balance(node);
  }

  private findMin(node: TreeNode<T>): TreeNode<T> {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  private removeMin(node: TreeNode<T>): TreeNode<T> | null {
    if (node.left === null) return node.right;
    node.left = this.removeMin(node.left!);
    this.updateNode(node);
    return this.balance(node);
  }

  /**
   * Retourne tous les intervalles triés par start puis end
   * Complexité: O(n)
   */
  getAll(): IntervalValue<T>[] {
    const results: IntervalValue<T>[] = [];
    this.inOrderTraversal(this.root, results);
    return results;
  }

  private inOrderTraversal(node: TreeNode<T> | null, results: IntervalValue<T>[]): void {
    if (node === null) return;
    this.inOrderTraversal(node.left, results);
    results.push(node.interval);
    this.inOrderTraversal(node.right, results);
  }

  /**
   * Retourne le nombre d'intervalles dans l'arbre
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Vérifie si l'arbre est vide
   */
  isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Vide l'arbre
   */
  clear(): void {
    this.root = null;
    this.size = 0;
  }
}

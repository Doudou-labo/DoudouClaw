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
export interface Interval<T = any> {
    start: number;
    end: number;
    value: T;
}
export declare class IntervalTree<T = any> {
    private root;
    /**
     * Insère un intervalle dans l'arbre
     * @param start - Début de l'intervalle (inclusif)
     * @param end - Fin de l'intervalle (exclusif)
     * @param value - Valeur associée à l'intervalle
     */
    insert(start: number, end: number, value: T): void;
    /**
     * Supprime un intervalle de l'arbre
     * @param start - Début de l'intervalle à supprimer
     * @param end - Fin de l'intervalle à supprimer
     * @param value - Valeur optionnelle pour cibler une suppression spécifique
     * @returns true si au moins un intervalle a été supprimé, false sinon
     */
    delete(start: number, end: number, value?: T): boolean;
    /**
     * Recherche tous les intervalles contenant un point
     * @param point - Point à tester
     * @returns Liste des intervalles contenant le point
     */
    search(point: number): Interval<T>[];
    /**
     * Retourne le nombre d'intervalles dans l'arbre
     */
    get size(): number;
    /**
     * Vérifie si l'arbre est vide
     */
    get isEmpty(): boolean;
    private insertNode;
    private deleteNode;
    private containsExact;
    private deleteMin;
    private minNode;
    private searchNode;
    private updateNode;
    private balance;
    private rotateRight;
    private rotateLeft;
    private getBalance;
    private countNodes;
    /**
     * Retourne tous les intervalles de l'arbre (parcours in-order)
     */
    getAll(): Interval<T>[];
    private inOrder;
    /**
     * Efface tous les intervalles
     */
    clear(): void;
}

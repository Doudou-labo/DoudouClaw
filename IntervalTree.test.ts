import { IntervalTree } from './IntervalTree';

// ============================================================================
// Tests unitaires - IntervalTree
// ============================================================================

describe('IntervalTree', () => {

    // ========================================================================
    // Tests de base : insert / count / isEmpty
    // ========================================================================

    it('doit être vide à l\'initialisation', () => {
        const tree = new IntervalTree<string>();
        expect(tree.isEmpty()).toBe(true);
        expect(tree.count()).toBe(0);
    });

    it('doit retourner un tableau vide sur query() d\'un arbre vide', () => {
        const tree = new IntervalTree<string>();
        expect(tree.query(5)).toEqual([]);
    });

    it('doit correctement compter après insertions', () => {
        const tree = new IntervalTree<string>();
        tree.insert(0, 10, 'a');
        tree.insert(20, 30, 'b');
        tree.insert(40, 50, 'c');
        expect(tree.count()).toBe(3);
        expect(tree.isEmpty()).toBe(false);
    });

    // ========================================================================
    // Tests de query : intervalle unique
    // ========================================================================

    it('doit trouver un intervalle qui contient le point', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'trouvé');
        expect(tree.query(15)).toContain('trouvé');
    });

    it('ne doit PAS trouver un intervalle qui ne contient PAS le point', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'hors bornes');
        expect(tree.query(5)).not.toContain('hors bornes');
        expect(tree.query(20)).not.toContain('hors bornes'); // end = 20, point = 20 → pas inclus
        expect(tree.query(25)).not.toContain('hors bornes');
    });

    // ========================================================================
    // Tests de query : plusieurs intervalles
    // ========================================================================

    it('doit retourner TOUS les intervalles qui contiennent le point (chevauchements)', () => {
        const tree = new IntervalTree<number>();
        tree.insert(0, 10, 1);   // contient 5 : 0<=5<10 ✓
        tree.insert(3, 8, 2);    // contient 5 : 3<=5<8 ✓
        tree.insert(7, 15, 3);   // NE contient PAS 5 : 5<7 (start exclusif en pratique)
        tree.insert(20, 30, 4); // ne contient PAS 5

        const results = tree.query(5);
        expect(results).toContain(1);
        expect(results).toContain(2);
        expect(results).not.toContain(3); // 5 < 7, intervalle [7,15) ne contient pas 5
        expect(results).not.toContain(4);
        expect(results.length).toBe(2);
    });

    it('doit retourner plusieurs résultats même si les intervalles ne se chevauchent pas au même point de début', () => {
        const tree = new IntervalTree<string>();
        tree.insert(0, 5, 'A');
        tree.insert(5, 10, 'B');
        tree.insert(10, 15, 'C');

        expect(tree.query(0)).toContain('A');
        expect(tree.query(4)).toContain('A');
        expect(tree.query(5)).toContain('B');
        expect(tree.query(9)).toContain('B');
        expect(tree.query(10)).toContain('C');
        expect(tree.query(14)).toContain('C');
    });

    // ========================================================================
    // Tests de remove
    // ========================================================================

    it('doit supprimer un intervalle et retourner true', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'cible');
        tree.insert(0, 5, 'autre');

        const removed = tree.remove(10, 20);
        expect(removed).toBe(true);
        expect(tree.count()).toBe(1);
        expect(tree.query(15)).not.toContain('cible');
    });

    it('doit retourner false si l\'intervalle à supprimer n\'existe pas', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'existant');

        const removed = tree.remove(0, 5); // n'existe pas
        expect(removed).toBe(false);
        expect(tree.count()).toBe(1);
    });

    it('doit ne PAS supprimer un intervalle avec même start mais end différent', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'original');

        const removed = tree.remove(10, 30); // même start, end différent
        expect(removed).toBe(false);
        expect(tree.count()).toBe(1);
        expect(tree.query(15)).toContain('original');
    });

    it('doit ne PAS supprimer un intervalle avec même end mais start différent', () => {
        const tree = new IntervalTree<string>();
        tree.insert(10, 20, 'original');

        const removed = tree.remove(5, 20); // même end, start différent
        expect(removed).toBe(false);
        expect(tree.count()).toBe(1);
    });

    // ========================================================================
    // Tests de remove + query combinés
    // ========================================================================

    it('après suppression, les autres intervalles doivent rester accessibles', () => {
        const tree = new IntervalTree<string>();
        tree.insert(0, 10, 'A');
        tree.insert(5, 15, 'B');
        tree.insert(10, 20, 'C');

        tree.remove(5, 15);

        expect(tree.query(2)).toContain('A');
        expect(tree.query(2)).not.toContain('B');
        expect(tree.query(12)).toContain('C');
        expect(tree.count()).toBe(2);
    });

    // ========================================================================
    // Tests de robustesse / erreurs
    // ========================================================================

    it('doit rejeter un intervalle avec start >= end', () => {
        const tree = new IntervalTree<string>();
        expect(() => tree.insert(10, 10, 'zéro')).toThrow();
        expect(() => tree.insert(20, 10, 'inverse')).toThrow();
    });

    // ========================================================================
    // Tests avec des valeurs de type générique
    // ========================================================================

    it('doit fonctionner avec des objets comme valeurs', () => {
        interface Event {
            id: number;
            name: string;
        }

        const tree = new IntervalTree<Event>();
        const ev1: Event = { id: 1, name: 'Réunion' };
        const ev2: Event = { id: 2, name: 'Pause' };

        tree.insert(9, 12, ev1);
        tree.insert(14, 16, ev2);

        const results = tree.query(10);
        expect(results.length).toBe(1);
        expect(results[0].id).toBe(1);
        expect(results[0].name).toBe('Réunion');
    });

    it('doit fonctionner avec des nombres comme valeurs (type T = number)', () => {
        const tree = new IntervalTree<number>();
        tree.insert(0, 10, 100);  // point=10 NON contenu : end=10 est EXCLUSIF
        tree.insert(5, 15, 200);  // contient 10 : 5<=10<15 ✓
        tree.insert(10, 20, 300); // contient 10 : 10<=10<20 ✓

        const results = tree.query(10);
        expect(results).not.toContain(100); // [0,10) n'inclut PAS 10 (end exclusif)
        expect(results).toContain(200);
        expect(results).toContain(300);
    });

    // ========================================================================
    // Tests d'équilibrage AVL (arbres de grande taille)
    // ========================================================================

    it('doit maintenir des performances acceptables sur 100 insertions séquentielles', () => {
        const tree = new IntervalTree<string>();

        // Insertion d'intervalles séquentiels non-chevauchants
        for (let i = 0; i < 100; i++) {
            tree.insert(i * 10, (i + 1) * 10, `int-${i}`);
        }

        expect(tree.count()).toBe(100);

        // Chaque query doit rester O(log n)
        const results = tree.query(55); // intervalle [50, 60)
        expect(results).toContain('int-5');
        expect(results.length).toBe(1);
    });

    it('doit gérer les chevauchements multiples sur insertions séquentielles', () => {
        const tree = new IntervalTree<number>();

        // 10 intervalles qui se chevauchent tous sur le point 5 : [0,10), [1,11), ..., [9,19)
        // Après équilibrage AVL, le tree n'est plus un right-spine.
        // Seuls les intervalles avec start <= 5 < end contiennent le point.
        // [0,10)✓ [1,11)✓ [2,12)✓ [3,13)✓ [4,14)✓ [5,15)✓ [6,16)✗ [7,17)✗ [8,18)✗ [9,19)✗
        for (let i = 0; i < 10; i++) {
            tree.insert(i, i + 10, i);
        }

        const results = tree.query(5);
        // 6 intervalles contiennent 5 (ceux avec start <= 5)
        expect(results.length).toBe(6);
        expect(results.sort()).toEqual([0, 1, 2, 3, 4, 5]);
    });

    // ========================================================================
    // Tests de cohérence (suppression complète + re-insertion)
    // ========================================================================

    it('doit permettre de vider l\'arbre par suppressions successives', () => {
        const tree = new IntervalTree<string>();

        const intervals = [
            [0, 10], [10, 20], [20, 30], [30, 40], [40, 50]
        ];

        intervals.forEach(([s, e]) => tree.insert(s, e, `int-${s}`));
        expect(tree.count()).toBe(5);

        intervals.forEach(([s, e]) => tree.remove(s, e));
        expect(tree.count()).toBe(0);
        expect(tree.isEmpty()).toBe(true);
        expect(tree.query(25)).toEqual([]);
    });

    it('doit permettre une re-insertion après suppression totale', () => {
        const tree = new IntervalTree<string>();
        tree.insert(0, 10, 'A');
        tree.remove(0, 10);
        tree.insert(0, 10, 'B');

        expect(tree.count()).toBe(1);
        expect(tree.query(5)).toContain('B');
        expect(tree.query(5)).not.toContain('A');
    });
});

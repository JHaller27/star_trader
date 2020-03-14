import { PortNode, Route } from './routeMap';
import { Commodity } from './commodity';
import { Ship } from './ship';

export class TreeNode {
    private readonly value: PortNode;
    private readonly childEdges: TreeEdge[];
    private parentEdge: TreeEdge | undefined;

    constructor(value: PortNode) {
        this.value = value;

        this.childEdges = [];
        this.parentEdge = undefined;
    }

    public addChild(edge: TreeEdge): void {
        this.childEdges.push(edge);
        edge.child.setParentEdge(edge);
    }

    public getFullEdgePath(): TradePath {
        if (this.parentEdge === undefined) {
            return new TradePath();
        }

        const path: TradePath = this.parentEdge.parent.getFullEdgePath();
        path.push(this.parentEdge);

        return path;
    }

    public setParentEdge(parentEdge: TreeEdge): void {
        if (this.parentEdge !== undefined) {
            throw new Error('Parent TreeEdge already set');
        }

        this.parentEdge = parentEdge;
    }

    public toPortString(): string {
        return this.value.toShallowString();
    }

    public equals(other: TreeNode): boolean {
        return this.value.equals(other.value);
    }
}

export class TreeEdge {
    public readonly parent: TreeNode;
    public readonly child: TreeNode;
    private readonly parentCommodity: Commodity;
    private readonly childCommodity: Commodity;

    constructor(parent: TreeNode, child: TreeNode, route: Route) {
        this.parent = parent;
        this.child = child;
        this.parentCommodity = route.sourceCommodity;
        this.childCommodity = route.destinationCommodity;
    }

    public trade(ship: Ship): void {
        ship.trade(this.parentCommodity, this.childCommodity);
    }

    public canMerge(other: TreeEdge): boolean {
        return this.childCommodity.isNothing() && other.parentCommodity.isNothing();
    }

    public mergedWith(other: TreeEdge): TreeEdge {
        const fakeNode: PortNode = undefined as unknown as PortNode;
        const tempRoute = new Route(fakeNode, this.parentCommodity, other.childCommodity);

        return new TreeEdge(this.parent, other.child, tempRoute);
    }

    public toString(): string {
        return `Buy ${this.parentCommodity} at '${this.parent.toPortString()}' -> Sell ${this.childCommodity} in '${this.child.toPortString()}'`;
    }
}

export class TradePath {
    private readonly edges: TreeEdge[];
    private netProfit: number;

    constructor() {
        this.edges = [];
        this.netProfit = 0;
    }

    public push(edge: TreeEdge): void {
        const lastEdge = this.edges[-1];

        if (lastEdge !== undefined && lastEdge.canMerge(edge)) {
            this.edges.pop();

            edge = lastEdge.mergedWith(edge);
        }

        this.edges.push(edge);
    }

    public traverse(ship: Ship): void {
        for (const edge of this.edges) {
            edge.trade(ship);
        }

        this.netProfit = ship.getProfit();

        ship.reset();
    }

    public hasProfit(): boolean {
        return this.netProfit !== 0;
    }

    public compareTo(other: TradePath): number {
        return this.netProfit - other.netProfit;
    }

    public toString(): string {
        return this.edges.map(e => e.toString()).join('\n') + `\nNet profit: ${Math.floor(this.netProfit)} UEC`;
    }
}

export class RouteTree {
    private readonly root: TreeNode;
    private readonly leaves: TreeNode[];
    private readonly ship: Ship;

    constructor(origin: PortNode, ship: Ship) {
        this.leaves = [];
        this.root = this.buildTree(origin, ship.getMaxHops());
        this.ship = ship;
    }

    public getPaths(): TradePath[] {
        const paths: TradePath[] = [];

        for (const leaf of this.leaves) {
            const path = leaf.getFullEdgePath();
            path.traverse(this.ship);
            if (path.hasProfit()) {
                paths.push(path);
            }
        }

        // Invert compareTo to sort descending instead of default ascending
        return paths.sort((p1: TradePath, p2: TradePath) => -1 * p1.compareTo(p2));
    }

    private addLeaf(leafNode: TreeNode): void {
        this.leaves.push(leafNode);
    }

    private buildTree(origin: PortNode, maxDepth: number): TreeNode {
        let root: TreeNode = new TreeNode(origin);

        if (maxDepth === 0) {
            this.addLeaf(root);

            return root;
        }

        for (const route of origin.getRoutes()) {
            const childTree = this.buildTree(route.destination, maxDepth - 1);
            const newEdge = new TreeEdge(root, childTree, route);

            root.addChild(newEdge);
        }

        return root;
    }
}

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

    public profit(ship: Ship): number {
        const currentCredits = ship.trade(this.parentCommodity, this.childCommodity);

        return currentCredits;
    }

    public toString(): string {
        return `Buy ${this.parentCommodity} at '${this.parent.toPortString()}' -> Sell ${this.childCommodity} in '${this.child.toPortString()}'`;
    }
}

export class TradePath {
    private readonly edges: TreeEdge[];

    constructor() {
        this.edges = [];
    }

    public push(edge: TreeEdge): void {
        this.edges.push(edge);
    }

    public traverse(ship: Ship): void {
        ship.reset();
    }

    public toString(): string {
        return this.edges.map(e => e.toString()).join('\n');
    }
}

export class RouteTree {
    private readonly root: TreeNode;
    private readonly leaves: TreeNode[];

    constructor(origin: PortNode) {
        this.leaves = [];
        this.root = this.buildTree(origin, 1);
    }

    public getPaths(): TradePath[] {
        const paths: TradePath[] = [];

        for (const leaf of this.leaves) {
            const path = leaf.getFullEdgePath();
            path.traverse(ship);
            paths.push(path);
        }

        return paths;
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

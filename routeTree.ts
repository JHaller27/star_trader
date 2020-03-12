import { PortNode, Route } from './routeMap';
import { Commodity } from './commodity';
import { Ship } from './ship';

class TreeNode {
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
    }

    public getFullEdgePath(): TreeEdge[] {
        if (this.parentEdge === undefined) {
            return [];
        }

        const path: TreeEdge[] = this.parentEdge.parent.getFullEdgePath();
        path.push(this.parentEdge);

        return path;
    }

    public setParentEdge(parentEdge: TreeEdge): void {
        if (parentEdge !== undefined) {
            throw new Error('Parent TreeEdge already set');
        }

        this.parentEdge = parentEdge;
    }
}

class TreeEdge {
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
}

export class RouteTree {
    private readonly root: TreeNode;
    private readonly leaves: TreeNode[];

    constructor(origin: PortNode) {
        this.leaves = [];
        this.root = this.buildTree(origin, 0);
    }

    public getBestPaths(): TreeEdge[][] {
        const paths: TreeEdge[][] = [];

        for (const leaf of this.leaves) {
            paths.push(leaf.getFullEdgePath());
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
            const childEdge = new TreeEdge(root, childTree, route);
            root.addChild(childEdge);
        }

        return root;
    }
}

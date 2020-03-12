import { PortNode } from './routeMap';
import { Commodity } from './commodity';

class TreeNode {
    private readonly value: PortNode;
    private readonly profit: number;
    private readonly childEdges: TreeEdge[];
    private parentEdge: TreeEdge | undefined;

    constructor(value: PortNode, profitSoFar: number) {
        this.value = value;
        this.profit = profitSoFar;

        this.childEdges = [];
        this.parentEdge = undefined;
    }

    public profitSoFar(): number {
        return this.profit;
    }

    public addChild(childNode: TreeNode, edge: TreeEdge): void {
        childNode.setParentEdge(edge);

        const insertIdx = this.childEdges.findIndex(childEdge => {
            return childEdge.profit() >= edge.profit();
        });

        this.childEdges.splice(insertIdx, 0, edge);
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
    private readonly commodity: Commodity;

    constructor(parent: TreeNode, child: TreeNode, commodity: Commodity) {
        this.parent = parent;
        this.child = child;
        this.commodity = commodity;
    }

    public profit(): number {
        return this.commodity.getPrice();
    }
}

export class RouteTree {
    private readonly root: TreeNode;
    private readonly leaves: TreeNode[];
    private readonly ship: Ship;

    constructor(origin: PortNode, ship: Ship) {
        this.leaves = [];
        this.root = this.buildTree(origin, 0);
        this.ship = ship;
    }

    public getBestPaths(): TreeEdge[][] {
        const paths: TreeEdge[][] = [];

        for (const leaf of this.leaves) {
            paths.push(leaf.getFullEdgePath());
        }

        return paths;
    }

    private addLeaf(leafNode: TreeNode): void {
        const insertIdx = this.leaves.findIndex(leaf => {
            return leaf.profitSoFar() >= leafNode.profitSoFar();
        });

        this.leaves.splice(insertIdx, 0, leafNode);
    }

    private buildTree(origin: PortNode, maxDepth: number, profitSoFar: number = 0): TreeNode {
        let root: TreeNode = new TreeNode(origin, profitSoFar);

        if (maxDepth === 0) {
            this.addLeaf(root);

            return root;
        }

        for (const route of origin.getRoutes()) {
            const childTree = this.buildTree(route.destination, maxDepth - 1, profitSoFar + route.profit());
            const childEdge = new TreeEdge(root, childTree, route.getProfitCommodity());
            root.addChild(childTree, childEdge);
        }

        return root;
    }
}

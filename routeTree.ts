import { PortNode } from './routeMap';
import { Commodity } from './commodity';

class TreeNode {
    private readonly value: PortNode;

    constructor(value: PortNode, profitSoFar: number) {
        this.value = value;
    }

    public profit(): number {
        return 0;
    }

    public addChild(childNode: TreeNode): void {
    }

    public getChildren(): TreeNode[] {
        return [];
    }

    public getParent(): TreeNode | undefined {
        return undefined;
    }

    public getDepth(): number {
        // Root = depth 0
        return 0;
    }
}

class RouteTree {
    private readonly root: TreeNode;

    constructor(origin: PortNode) {
        this.root = this.buildTree(origin, 0);
    }

    private buildTree(origin: PortNode, maxDepth: number, profitSoFar: number = 0): TreeNode {
        let root: TreeNode = new TreeNode(origin, profitSoFar);

        if (maxDepth === 0) {
            return root;
        }

        for (const childNode of origin.getRoutes()) {
            const childTree = this.buildTree(childNode.destination, maxDepth - 1, profitSoFar + childNode.profit());
            root.addChild(childTree);
        }

        return root;
    }
}

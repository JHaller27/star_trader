import { PortNode } from './routeMap';

class TreeNode {
    private readonly value: PortNode;
    private readonly profitSoFar: number;
    private readonly children: TreeNode[];

    constructor(value: PortNode, profitSoFar: number) {
        this.value = value;
        this.profitSoFar = profitSoFar;

        this.children = [];
    }

    public profit(): number {
        return this.profitSoFar;
    }

    public addChild(childNode: TreeNode): void {
        this.children.push(childNode);
    }

    public getChildren(): TreeNode[] {
        return this.children;
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

        for (const childRoute of origin.getRoutes()) {
            const childTree = this.buildTree(childRoute.destination, maxDepth - 1, profitSoFar + childRoute.profit());
            root.addChild(childTree);
        }

        return root;
    }
}

import { PortNode } from './routeMap';

class TreeNode {
    private readonly value: PortNode;

    constructor(value: PortNode) {
        this.value = value;
    }

    public profit(): number {
        return 0;
    }

    public addChild(childNode: TreeNode, profit: number): void {
    }

    public getChildren(): TreeNode[] {
        return [];
    }

    public getParent(): TreeNode | undefined {
        return undefined;
    }
}

class RouteTree {
    private readonly root: TreeNode;

    constructor(origin: PortNode) {
        this.root = new TreeNode(origin);
    }

    private buildTree(maxDepth: number): void {
        const nodeStack: TreeNode[] = [this.root];

        let node = nodeStack.pop();

        for (let depth = 0; depth < maxDepth && node !== undefined; depth += 1) {
            const children = node.getChildren();
            children.forEach(child => nodeStack.push(child));

            // Do something
        }
    }
}

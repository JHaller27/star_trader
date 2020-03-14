import { PortNode, Route } from './routeMap';
import { Commodity } from './commodity';
import { Ship, ShipMomento } from './ship';
import { Config } from './configuration';

export class TreeNode {
    private readonly value: PortNode;
    private readonly childEdges: TreeEdge[];
    private parentEdge: TreeEdge | undefined;

    private readonly shipMomento: ShipMomento;

    constructor(value: PortNode | Route, ship: Ship) {
        if (value instanceof Route) {
            value = value.destination;
        }

        this.value = value;

        this.childEdges = [];
        this.parentEdge = undefined;

        this.shipMomento = ship.createSnapshot();
    }

    public addChild(edge: TreeEdge): void {
        this.childEdges.push(edge);
        edge.child.setParentEdge(edge);
    }

    public getFullEdgePath(ship: Ship): TradePath {
        if (this.parentEdge === undefined) {
            return new TradePath();
        }

        const path: TradePath = this.parentEdge.parent.getFullEdgePath(ship);
        path.push(this.parentEdge, ship);

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

    public generateChildren(ship: Ship): TreeEdge[] {
        const childEdges = this.value.getRoutes().map(route => new TreeEdge(this, route, ship));
        childEdges.forEach(e => e.parent.addChild(e));

        return childEdges;
    }

    public newParentRoute(parentCommodity: Commodity, endCommodity: Commodity): Route {
        return new Route(this.value, parentCommodity, endCommodity);
    }

    public restoreShip(ship: Ship): void {
        ship.restore(this.shipMomento);
    }

    public getProfitSoFar(ship: Ship): number {
        this.restoreShip(ship);
        const profit = ship.getProfit();
        ship.reset();

        return profit;
    }
}

export class TreeEdge {
    public readonly parent: TreeNode;
    public readonly child: TreeNode;
    private readonly parentCommodity: Commodity;
    private readonly childCommodity: Commodity;

    constructor(parent: TreeNode, route: Route, ship: Ship) {
        this.parentCommodity = route.sourceCommodity;
        this.childCommodity = route.destinationCommodity;

        this.parent = parent;
        this.parent.restoreShip(ship);

        this.trade(ship);

        this.child = new TreeNode(route.destination, ship);

        ship.reset();
    }

    private trade(ship: Ship): void {
        ship.trade(this.parentCommodity, this.childCommodity);
    }

    public canMerge(other: TreeEdge): boolean {
        return this.childCommodity.isNothing() && other.parentCommodity.isNothing();
    }

    public mergedWith(other: TreeEdge, ship: Ship): TreeEdge {
        if (!this.childCommodity.equals(other.parentCommodity)) {
            throw new Error('Cannot merge TreeEdges with different commodities');
        }

        const tempRoute = other.child.newParentRoute(this.parentCommodity, other.childCommodity);

        return new TreeEdge(this.parent, tempRoute, ship);
    }

    public generateChildren(ship: Ship, limit?: number): TreeEdge[] {
        const children = this.child.generateChildren(ship);

        if (limit === undefined) {
            return children;
        }

        return children.sort((a: TreeEdge, b: TreeEdge) => -1 * a.compareTo(b, ship)).slice(0, limit);
    }

    public toString(): string {
        return `Buy ${this.parentCommodity} at '${this.parent.toPortString()}' -> Sell ${this.childCommodity} in '${this.child.toPortString()}'`;
    }

    public getProfitSoFar(ship: Ship): number {
        return this.child.getProfitSoFar(ship);
    }

    public compareTo(other: TreeEdge, ship: Ship): number {
        return this.child.getProfitSoFar(ship) - other.child.getProfitSoFar(ship);
    }
}

export class TradePath {
    private readonly edges: TreeEdge[];
    private netProfit: number;

    constructor() {
        this.edges = [];
        this.netProfit = 0;
    }

    public push(edge: TreeEdge, ship: Ship): void {
        const lastEdge = this.edges[-1];

        if (lastEdge !== undefined && lastEdge.canMerge(edge)) {
            this.edges.pop();

            edge = lastEdge.mergedWith(edge, ship);
        }

        this.edges.push(edge);

        this.netProfit = edge.getProfitSoFar(ship);
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
        this.root = this.buildTree(origin, ship);
        this.ship = ship;
    }

    public getPaths(): TradePath[] {
        const paths: TradePath[] = [];

        for (const leaf of this.leaves) {
            const path = leaf.getFullEdgePath(this.ship);
            if (path.hasProfit()) {
                paths.push(path);
            }
        }

        return paths;
    }

    private addLeaf(leafNode: TreeNode): void {
        this.leaves.push(leafNode);
    }

    private buildTree(origin: PortNode, ship: Ship): TreeNode {
        if (Config.getMaxHops() < 0) {
            throw new Error('Max depth may not be negative');
        }

        const rootNode = new TreeNode(origin, ship);

        if (Config.getMaxHops() === 0) {
            return rootNode;
        }

        // Only edges which are already attached to the root (at some depth) and whose
        //  children's depth will not exceed the max depth are allowed in the queue
        const edgeQueue: [TreeEdge, number][] = [];

        // Initialize edge queue
        for (const childRoute of origin.getRoutes()) {
            const edge = new TreeEdge(rootNode, childRoute, ship);

            rootNode.addChild(edge);

            const maxHops = Config.getMaxHops();
            if (maxHops > 1) {
                edgeQueue.push([edge, 1]);
            }
            else {
                this.addLeaf(edge.child);
            }
        }

        // Actual BFS
        for (let poppedValue = edgeQueue.shift(); poppedValue !== undefined; poppedValue = edgeQueue.shift()) {
            const [poppedEdge, poppedDepth] = poppedValue;
            const childDepth = poppedDepth + 1;

            // Generate, handle, and push next generation of children
            for (const newEdge of poppedEdge.generateChildren(ship, Config.getMaxChildren())) {
                if (childDepth === Config.getMaxHops()) {
                    // If the child is at the max depth, add it to the list of leaves
                    this.addLeaf(newEdge.child);
                }
                else {
                    // Otherwise, queue it to generate more children
                    edgeQueue.push([newEdge, childDepth]);
                }
            }
        }

        return rootNode;
    }
}

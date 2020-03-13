import { IReader, JSONReader } from "./reader";
import { RouteMapGenerator } from "./generator";
import { RouteMap } from "./routeMap";
import { RouteTree } from "./routeTree";
import { Port } from "./port";
import { Ship } from "./ship";

const reader: IReader = new JSONReader('./data/commodities.json');
const generator = new RouteMapGenerator(reader);
const routeMap: RouteMap = generator.getRouteMap();

const ship = new Ship(1000000, 66, 1);

console.log(ship.toString());
console.log();

const origin = new Port(['Stanton', 'Crusader', 'Port Olisar']);

const routeTree: RouteTree = routeMap.asRouteTree(origin, ship);
const paths = routeTree.getPaths();

for (const path of paths) {
    console.log(path.toString());
    console.log();
}

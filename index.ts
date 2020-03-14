import { IReader, JSONReader } from "./reader";
import { RouteMapGenerator } from "./generator";
import { RouteMap } from "./routeMap";
import { RouteTree, TradePath } from "./routeTree";
import { Port } from "./port";
import { Ship } from "./ship";
import { Config } from "./configuration";

Config.initialize({
    maxHops: 3,
    maxChildren: 10,
});
const ship = new Ship(1000000, 66);

console.log('Reading data...');
const reader: IReader = new JSONReader('./data/commodities.json');
console.log('done');

const generator = new RouteMapGenerator(reader);

console.log('Generating route map...');
const routeMap: RouteMap = generator.getRouteMap();
console.log('done');

const origin = new Port(['Stanton', 'Crusader', 'Port Olisar']);

console.log('Generating route tree...');
const routeTree: RouteTree = routeMap.asRouteTree(origin, ship);
console.log('done');

console.log('Traversing paths...');
const paths = routeTree.getPaths();
// Invert compareTo to sort descending instead of default ascending
paths.sort((p1: TradePath, p2: TradePath) => 1 * p1.compareTo(p2));
console.log('done');

console.log(ship.toString());
console.log();

for (const path of paths) {
    console.log(path.toString());
    console.log();
}

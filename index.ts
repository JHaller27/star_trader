import { IReader, JSONReader } from "./reader";
import { RouteMapGenerator } from "./generator";
import { RouteMap } from "./routeMap";
import { RouteTree, TradePath } from "./routeTree";
import { Port } from "./port";
import { Ship } from "./ship";
import { Config } from "./configuration";

import settings from "./data/config.json";

Config.initialize(settings);
Ship.initialize(settings.credits, settings.maxCargoSCU);

console.log('Reading data...');
const reader: IReader = new JSONReader('./data/commodities.json');
console.log('done');

const generator = new RouteMapGenerator(reader);

console.log('Generating route map...');
const routeMap: RouteMap = generator.getRouteMap();
console.log('done');


console.log('Generating route tree...');
const routeTree: RouteTree = routeMap.asRouteTree(Config.getOrigin());
console.log('done');

console.log('Traversing paths...');
const paths = routeTree.getPaths();

// Invert compareTo to sort descending instead of default ascending
paths.sort((p1: TradePath, p2: TradePath) => -1 * p1.compareTo(p2));
console.log('done');

console.log(Ship.getInstance().toString());
console.log();

for (const path of paths.slice(0, 5)) {
    console.log(path.toString());
    console.log();
}

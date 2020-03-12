import { IReader, JSONReader } from "./reader";
import { RouteMapGenerator } from "./generator";
import { RouteMap } from "./routeMap";
import { RouteTree } from "./routeTree";
import { Port } from "./port";

const reader: IReader = new JSONReader('./data/commodities.json');
const generator = new RouteMapGenerator(reader);
const routeMap: RouteMap = generator.getRouteMap();

const routeTree: RouteTree = routeMap.asRouteTree(new Port('Stanton', 'Crusader', 'Ollisar'));

console.log(routeMap.toString());

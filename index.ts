import { IReader, JSONReader } from "./reader";
import { RouteMapGenerator } from "./generator";
import { RouteMap } from "./routeMap";

const reader: IReader = new JSONReader('./data/commodities.json');
const generator = new RouteMapGenerator(reader);
const routeMap: RouteMap = generator.getRouteMap();

console.log(routeMap.toString());

import { HubsWorld } from "../app";
import { Fit, inflatePhysicsShape, PhysicsShapeParams, Shape } from "./physics-shape";

export function inflateTrimesh(world: HubsWorld, eid: number) {
  inflatePhysicsShape(world, eid, {
    shape: Shape.MESH,
    fit: Fit.ALL,
    includeInvisible: true,
    margin: 0.01
  } as PhysicsShapeParams);
}
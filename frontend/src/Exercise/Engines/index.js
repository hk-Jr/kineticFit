import { UpperBodyEngines } from "./UpperBody";
import { LowerBodyEngines } from "./LowerBody";
import { FullBodyEngines } from "./FullBody";

export const AllExercises = {
  ...UpperBodyEngines,
  ...LowerBodyEngines,
  ...FullBodyEngines,
};

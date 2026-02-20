import { calculateAngle } from "../../utils/math";

export const squat = {
  name: "Squats",
  category: "Lower Body",

  checkStatus: (landmarks) => {
    // Squats are flexible, but we want the user to be standing initially
    const kneeAngle = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );
    if (kneeAngle < 140)
      return { ok: false, msg: "START FROM A STANDING POSITION" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const kneeAngle = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );

    // Depth: Knee angle < 100 degrees
    if (kneeAngle < 100) return { newStage: "down", repIncrement: false };
    // Stand up: Knee angle > 160 degrees
    if (kneeAngle > 160 && stage === "down")
      return { newStage: "up", repIncrement: true };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ SQUAT LOW", up: "↑ STAND UP" },
  caloriesPerRep: 0.5,
};

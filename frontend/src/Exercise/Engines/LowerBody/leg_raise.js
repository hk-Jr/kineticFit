import { calculateAngle } from "../../utils/math";

export const leg_raise = {
  name: "Leg Raises",
  category: "Lower Body",

  checkStatus: (landmarks) => {
    // Check if user is lying down (Shoulder and Hip Y are close)
    const isLying = Math.abs(landmarks[12].y - landmarks[24].y) < 0.15;
    if (!isLying) return { ok: false, msg: "LIE DOWN ON THE FLOOR" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    // Angle at the Hip (Shoulder -> Hip -> Knee)
    const hipAngle = calculateAngle(
      landmarks[12],
      landmarks[24],
      landmarks[26],
    );

    // Legs at 90 degrees to torso
    if (hipAngle < 100) return { newStage: "up", repIncrement: true };
    // Legs flat on floor
    if (hipAngle > 160) return { newStage: "down", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ LOWER LEGS", up: "↑ LIFT LEGS" },
  caloriesPerRep: 0.3,
};

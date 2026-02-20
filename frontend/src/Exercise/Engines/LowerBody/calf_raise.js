import { calculateAngle } from "../../utils/math";

export const calf_raise = {
  name: "Calf Raises",
  category: "Lower Body",

  checkStatus: (landmarks) => {
    const isProfile = Math.abs(landmarks[11].x - landmarks[12].x) < 0.22;
    if (!isProfile) return { ok: false, msg: "TURN SIDEWAYS (PROFILE)" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    // Tracking the ankle extension (Knee -> Ankle -> Toe)
    const ankleAngle = calculateAngle(
      landmarks[26],
      landmarks[28],
      landmarks[32],
    );

    // When heels are up, the angle between leg and foot increases
    if (ankleAngle > 155) return { newStage: "up", repIncrement: true };
    if (ankleAngle < 135) return { newStage: "down", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ HEELS DOWN", up: "↑ GO ON TOES" },
  caloriesPerRep: 0.2,
};

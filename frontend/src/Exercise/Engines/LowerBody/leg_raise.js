import { calculateAngle } from "../../utils/math";

export const leg_raise = {
  name: "Leg Raises",
  category: "Lower Body",
  // YouTube Tutorial: Leg Raises
  videoEmbed: `<iframe src="https://www.youtube.com/embed/l4kQd9eWclE" title="Leg Raises Guide" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isLying = Math.abs(landmarks[12].y - landmarks[24].y) < 0.15;
    if (!isLying) return { ok: false, msg: "LIE DOWN ON THE FLOOR" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const hipAngle = calculateAngle(
      landmarks[12],
      landmarks[24],
      landmarks[26],
    );
    if (hipAngle < 100) return { newStage: "up", repIncrement: true };
    if (hipAngle > 160) return { newStage: "down", repIncrement: false };
    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ LOWER LEGS", up: "↑ LIFT LEGS" },
  user_tips: [
    "Lie flat on your back with hands under your glutes",
    "Keep your legs straight as you lift them to 90 degrees",
    "Lower your legs slowly without touching the floor",
  ],
  caloriesPerRep: 0.3,
};

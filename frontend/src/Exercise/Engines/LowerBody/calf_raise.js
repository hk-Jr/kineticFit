import { calculateAngle } from "../../utils/math";

export const calf_raise = {
  name: "Calf Raises",
  category: "Lower Body",
  // YouTube Tutorial: Calf Raises
  videoEmbed: `<iframe src="https://www.youtube.com/embed/gwLzBJYoWlI" title="Calf Raises Guide" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isProfile = Math.abs(landmarks[11].x - landmarks[12].x) < 0.22;
    if (!isProfile) return { ok: false, msg: "TURN SIDEWAYS (PROFILE)" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const ankleAngle = calculateAngle(
      landmarks[26],
      landmarks[28],
      landmarks[32],
    );
    if (ankleAngle > 155) return { newStage: "up", repIncrement: true };
    if (ankleAngle < 135) return { newStage: "down", repIncrement: false };
    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ HEELS DOWN", up: "↑ GO ON TOES" },
  user_tips: [
    "Stand with feet hip-width apart",
    "Press through the balls of your feet to lift heels",
    "Pause at the top for maximum contraction",
  ],
  caloriesPerRep: 0.2,
};

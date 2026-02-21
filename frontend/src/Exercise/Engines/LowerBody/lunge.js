import { calculateAngle } from "../../utils/math";

export const lunge = {
  name: "Lunges",
  category: "Lower Body",
  // YouTube Tutorial: Lunge Form
  videoEmbed: `<iframe src="https://www.youtube.com/embed/QOVaHwm-Q6U" title="How to Lunge" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isProfile = Math.abs(landmarks[11].x - landmarks[12].x) < 0.22;
    if (!isProfile) return { ok: false, msg: "TURN SIDEWAYS (PROFILE)" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const frontKnee = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );
    if (frontKnee < 100) return { newStage: "down", repIncrement: false };
    if (frontKnee > 150 && stage === "down")
      return { newStage: "up", repIncrement: true };
    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ STEP DOWN", up: "↑ PUSH BACK UP" },
  user_tips: [
    "Step forward and lower your hips",
    "Both knees should bend at about a 90-degree angle",
    "Keep your front knee directly above your ankle",
  ],
  caloriesPerRep: 0.5,
};

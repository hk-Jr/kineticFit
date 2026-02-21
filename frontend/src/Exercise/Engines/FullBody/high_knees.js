// high_knees.js
export const high_knees = {
  name: "High Knees",
  category: "Full Body",
  // YouTube Tutorial: High Knees Form
  videoEmbed: `<iframe src="https://www.youtube.com/embed/ZZZoCNMU48U" title="High Knees Guide" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isStanding = Math.abs(landmarks[12].y - landmarks[24].y) > 0.3;
    if (!isStanding) return { ok: false, msg: "STAND UP STRAIGHT" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const kneeY = Math.min(landmarks[25].y, landmarks[26].y);
    const hipY = landmarks[23].y;

    if (kneeY < hipY) return { newStage: "high", repIncrement: true };
    if (kneeY > hipY + 0.1) return { newStage: "low", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { low: "KNEES HIGHER!", high: "KEEP IT UP!" },
  user_tips: [
    "Lift your knees to at least hip height",
    "Stay on the balls of your feet for a quick rhythm",
    "Keep your chest upright and pump your arms",
  ],
  caloriesPerRep: 0.2,
};

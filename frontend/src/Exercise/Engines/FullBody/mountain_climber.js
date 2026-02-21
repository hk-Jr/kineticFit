// mountain_climber.js
export const mountain_climber = {
  name: "Mountain Climbers",
  category: "Full Body",
  // YouTube Tutorial: Mountain Climber Form
  videoEmbed: `<iframe src="https://www.youtube.com/embed/CQk4MHY2_Tc" title="Mountain Climber Guide" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isHorizontal = Math.abs(landmarks[12].y - landmarks[24].y) < 0.15;
    if (!isHorizontal) return { ok: false, msg: "GET INTO PLANK POSITION" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const leftKneeY = landmarks[25].y;
    const hipY = landmarks[23].y;

    if (leftKneeY < hipY + 0.05) return { newStage: "in", repIncrement: true };
    if (leftKneeY > hipY + 0.2) return { newStage: "out", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { out: "KNEE TO CHEST", in: "SWITCH LEGS" },
  user_tips: [
    "Keep your shoulders directly over your wrists",
    "Maintain a flat back and tight core",
    "Drive knees toward chest without touching the floor",
  ],
  caloriesPerRep: 0.3,
};

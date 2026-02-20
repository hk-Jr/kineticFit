export const mountain_climber = {
  name: "Mountain Climbers",
  category: "Full Body",

  checkStatus: (landmarks) => {
    const isHorizontal = Math.abs(landmarks[12].y - landmarks[24].y) < 0.15;
    if (!isHorizontal) return { ok: false, msg: "GET INTO PLANK POSITION" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    // Distance between knee and hip on Y-axis
    const leftKneeY = landmarks[25].y;
    const hipY = landmarks[23].y;

    // If knee is pulled high towards chest
    if (leftKneeY < hipY + 0.05) return { newStage: "in", repIncrement: true };
    if (leftKneeY > hipY + 0.2) return { newStage: "out", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { out: "KNEE TO CHEST", in: "SWITCH LEGS" },
  caloriesPerRep: 0.3,
};

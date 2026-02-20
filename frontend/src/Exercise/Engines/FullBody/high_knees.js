export const high_knees = {
  name: "High Knees",
  category: "Full Body",

  checkStatus: (landmarks) => {
    const isStanding = Math.abs(landmarks[12].y - landmarks[24].y) > 0.3;
    if (!isStanding) return { ok: false, msg: "STAND UP STRAIGHT" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const kneeY = Math.min(landmarks[25].y, landmarks[26].y);
    const hipY = landmarks[23].y;

    // Knee is above hip level
    if (kneeY < hipY) return { newStage: "high", repIncrement: true };
    if (kneeY > hipY + 0.1) return { newStage: "low", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { low: "KNEES HIGHER!", high: "KEEP IT UP!" },
  caloriesPerRep: 0.2,
};

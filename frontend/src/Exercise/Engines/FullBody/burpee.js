export const burpee = {
  name: "Burpees",
  category: "Full Body",

  checkStatus: (landmarks) => {
    return { ok: true }; // Burpees involve constant movement, no fixed start
  },

  evaluateForm: (landmarks, stage) => {
    const shoulderY = landmarks[12].y;
    const hipY = landmarks[24].y;
    const isHorizontal = Math.abs(shoulderY - hipY) < 0.15;

    // Stage 1: On floor (Plank)
    if (isHorizontal) return { newStage: "floor", repIncrement: false };

    // Stage 2: Standing up from floor
    if (!isHorizontal && shoulderY < 0.4 && stage === "floor") {
      return { newStage: "standing", repIncrement: true };
    }

    return { newStage: stage, repIncrement: false };
  },

  instructions: { floor: "JUMP UP!", standing: "DROP TO FLOOR" },
  caloriesPerRep: 1.2,
};

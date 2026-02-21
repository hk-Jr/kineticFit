// burpee.js
export const burpee = {
  name: "Burpees",
  category: "Full Body",
  // YouTube Tutorial: Perfect Burpee Form
  videoEmbed: `<iframe src="https://www.youtube.com/embed/xQdyIrSSFnE" title="How to do Burpees" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const shoulderY = landmarks[12].y;
    const hipY = landmarks[24].y;
    const isHorizontal = Math.abs(shoulderY - hipY) < 0.15;

    if (isHorizontal) return { newStage: "floor", repIncrement: false };

    if (!isHorizontal && shoulderY < 0.4 && stage === "floor") {
      return { newStage: "standing", repIncrement: true };
    }

    return { newStage: stage, repIncrement: false };
  },

  instructions: { floor: "JUMP UP!", standing: "DROP TO FLOOR" },
  user_tips: [
    "Drop into a squat and place hands firmly on the floor",
    "Jump feet back into a strong plank (no sagging hips)",
    "Jump feet forward and explode into a vertical jump",
  ],
  caloriesPerRep: 1.2,
};

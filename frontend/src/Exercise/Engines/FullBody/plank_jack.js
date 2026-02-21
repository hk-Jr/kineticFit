// plank_jack.js
export const plank_jack = {
  name: "Plank Jacks",
  category: "Full Body",
  // YouTube Tutorial: Plank Jacks Guide
  videoEmbed: `<iframe src="https://www.youtube.com/embed/cYsxfLckmPg" title="Plank Jacks Form" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const isHorizontal = Math.abs(landmarks[12].y - landmarks[24].y) < 0.15;
    if (!isHorizontal) return { ok: false, msg: "GET INTO PLANK POSITION" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const ankleDist = Math.abs(landmarks[27].x - landmarks[28].x);

    if (ankleDist > 0.3) return { newStage: "wide", repIncrement: true };
    if (ankleDist < 0.15) return { newStage: "narrow", repIncrement: false };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { narrow: "JUMP FEET OUT", wide: "JUMP FEET IN" },
  user_tips: [
    "Maintain a solid high plank position",
    "Keep your upper body still as you jump feet apart",
    "Avoid letting your hips bounce up and down",
  ],
  caloriesPerRep: 0.4,
};

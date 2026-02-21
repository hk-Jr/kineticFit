// squat.js
export const squat = {
  name: "Squats",
  category: "Lower Body",

  checkStatus: (landmarks) => {
    const kneeAngle = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );
    // Match this to the 'up' threshold in evaluateForm
    if (kneeAngle < 160)
      return { ok: false, msg: "STAND UP STRAIGHT TO START" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const kneeAngle = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );

    // Threshold for the bottom of the squat
    if (kneeAngle < 100) return { newStage: "down", repIncrement: false };

    // Threshold to complete the rep
    if (kneeAngle > 160 && stage === "down")
      return { newStage: "up", repIncrement: true };

    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "↓ SQUAT LOW", up: "↑ STAND UP" },
  caloriesPerRep: 0.5,
};

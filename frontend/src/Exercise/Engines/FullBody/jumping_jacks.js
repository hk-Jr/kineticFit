export const jumping_jacks = {
  name: "Jumping Jacks",
  category: "Full Body",

  checkStatus: (landmarks) => {
    // Front view check: Shoulders should be wide apart
    const isFront = Math.abs(landmarks[11].x - landmarks[12].x) > 0.2;
    if (!isFront) return { ok: false, msg: "FACE THE CAMERA (FRONT)" };
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const wristDist = Math.abs(landmarks[15].x - landmarks[16].x);
    const ankleDist = Math.abs(landmarks[27].x - landmarks[28].x);

    // "Up" stage: Hands above head (close together) and feet wide
    if (wristDist < 0.15 && ankleDist > 0.25) {
      return { newStage: "up", repIncrement: true };
    }
    // "Down" stage: Hands at sides and feet together
    if (wristDist > 0.4 && ankleDist < 0.15) {
      return { newStage: "down", repIncrement: false };
    }

    return { newStage: stage, repIncrement: false };
  },

  instructions: { down: "OUT & UP!", up: "IN & DOWN!" },
  caloriesPerRep: 0.2,
};

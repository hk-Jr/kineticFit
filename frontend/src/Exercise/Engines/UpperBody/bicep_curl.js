import { calculateAngle } from "../../utils/math";

export const bicep_curl = {
  name: "Bicep Curls",
  category: "Upper Body",
  // Embedded YouTube Shorts player for the platform
  videoEmbed: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/PuaJzTatIJM" title="Dumbbell Bicep Curls" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    const shoulderDist = Math.abs(landmarks[11].x - landmarks[12].x);
    if (shoulderDist > 0.18)
      return { ok: false, msg: "PLEASE TURN SIDEWAYS (PROFILE VIEW)" };
    return { ok: true };
  },

  evaluateForm: (landmarks, currentStage) => {
    const rightElbow = calculateAngle(
      landmarks[12],
      landmarks[14],
      landmarks[16],
    );
    const leftElbow = calculateAngle(
      landmarks[11],
      landmarks[13],
      landmarks[15],
    );

    // Select the arm with better visibility to avoid sensor jitter
    const elbowAngle =
      landmarks[14].visibility > landmarks[13].visibility
        ? rightElbow
        : leftElbow;

    // 170° ensures the arm is fully straightened
    if (elbowAngle > 170) {
      return { newStage: "down", repIncrement: false };
    }

    // 35° ensures a full contraction at the top
    if (elbowAngle < 35 && currentStage === "down") {
      return { newStage: "up", repIncrement: true };
    }

    return { newStage: currentStage, repIncrement: false };
  },

  instructions: { down: "LOWER ARM", up: "CURL UP" },
  caloriesPerRep: 0.4,
};

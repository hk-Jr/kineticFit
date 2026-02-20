import { calculateAngle } from "../../utils/math";

export const pushup = {
  name: "Push Ups",
  category: "Upper Body",
  videoEmbed: `<iframe width="100%" height="315" src="https://www.youtube.com/embed/IODxDxX7oi4" title="How To Push Up" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,

  checkStatus: (landmarks) => {
    // Check if shoulders and hips are visible for proper tracking
    if (landmarks[11].visibility < 0.5 || landmarks[23].visibility < 0.5) {
      return { ok: false, msg: "STEP BACK FOR FULL BODY VIEW" };
    }
    return { ok: true };
  },

  evaluateForm: (landmarks, currentStage) => {
    const angle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);

    // Thresholds: 160 for up, 90 for down
    if (angle > 160) return { newStage: "down", repIncrement: false };
    if (angle < 90 && currentStage === "down")
      return { newStage: "up", repIncrement: true };

    return { newStage: currentStage, repIncrement: false };
  },

  instructions: { down: "GO DOWN", up: "PUSH UP" },
  caloriesPerRep: 0.5,
};

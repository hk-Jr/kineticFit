// squat.js
import { calculateAngle } from "../../utils/math"; // Ensure you import your angle helper

export const squat = {
  name: "Squats",
  category: "Lower Body",

  checkStatus: (landmarks) => {
    const kneeAngle = calculateAngle(
      landmarks[24], // Hip
      landmarks[26], // Knee
      landmarks[28], // Ankle
    );

    // RELAXED THRESHOLD:
    // Only show the error if they are significantly bent (e.g., < 140).
    // This prevents the camera from "sticking" at the top of a rep.
    if (kneeAngle < 140) {
      return { ok: false, msg: "STAND UP STRAIGHT TO START" };
    }
    return { ok: true };
  },

  evaluateForm: (landmarks, stage) => {
    const kneeAngle = calculateAngle(
      landmarks[24],
      landmarks[26],
      landmarks[28],
    );

    // 1. Reached the bottom (Squat Low)
    if (kneeAngle < 100) {
      return { newStage: "down", repIncrement: false };
    }

    // 2. Returned to the top (Stand Up)
    // We keep this at 160 so the user has to stand mostly straight to count the rep
    if (kneeAngle > 160 && stage === "down") {
      return { newStage: "up", repIncrement: true };
    }

    return { newStage: stage, repIncrement: false };
  },

  instructions: {
    down: "↓ GO LOWER",
    up: "↑ STAND ALL THE WAY UP",
  },

  caloriesPerRep: 0.5,
  videoEmbed: "YOUR_VIDEO_URL_HERE", // Add your tutorial link
};

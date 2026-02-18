// ExerciseLogic.jsx

export const calculateAngle = (p1, p2, p3) => {
  const radians =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

export const ExerciseEngines = {
  bicep_curl: {
    name: "Bicep Curls",
    checkOrientation: (landmarks) =>
      Math.abs(landmarks[11].x - landmarks[12].x) < 0.18,
    evaluateForm: (landmarks, stage) => {
      const rAngle = calculateAngle(
        landmarks[12],
        landmarks[14],
        landmarks[16],
      );
      const lAngle = calculateAngle(
        landmarks[11],
        landmarks[13],
        landmarks[15],
      );
      const angle =
        landmarks[14].visibility > landmarks[13].visibility ? rAngle : lAngle;
      if (angle > 160) return { newStage: "down", repIncrement: false };
      if (angle < 35 && stage === "down")
        return { newStage: "up", repIncrement: true };
      return { newStage: stage, repIncrement: false };
    },
    instructions: { down: "↓ LOWER ARM", up: "↑ CURL UP" },
    caloriesPerRep: 0.4,
  },
  squat: {
    name: "Squats",
    checkOrientation: (landmarks) =>
      Math.abs(landmarks[11].x - landmarks[12].x) < 0.22,
    evaluateForm: (landmarks, stage) => {
      const kneeAngle = calculateAngle(
        landmarks[24],
        landmarks[26],
        landmarks[28],
      );
      if (kneeAngle < 100) return { newStage: "down", repIncrement: false };
      if (kneeAngle > 160 && stage === "down")
        return { newStage: "up", repIncrement: true };
      return { newStage: stage, repIncrement: false };
    },
    instructions: { down: "↓ GET LOW", up: "↑ STAND UP" },
    caloriesPerRep: 0.5,
  },
  pushup: {
    name: "Push-ups",
    checkOrientation: (landmarks) =>
      Math.abs(landmarks[11].x - landmarks[12].x) < 0.2,
    evaluateForm: (landmarks, stage) => {
      const angle = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);
      if (angle < 90) return { newStage: "down", repIncrement: false };
      if (angle > 155 && stage === "down")
        return { newStage: "up", repIncrement: true };
      return { newStage: stage, repIncrement: false };
    },
    instructions: { down: "↓ LOWER CHEST", up: "↑ PUSH UP" },
    caloriesPerRep: 0.6,
  },
  lunge: {
    name: "Lunges",
    checkOrientation: (landmarks) =>
      Math.abs(landmarks[11].x - landmarks[12].x) < 0.2,
    evaluateForm: (landmarks, stage) => {
      const kneeAngle = calculateAngle(
        landmarks[24],
        landmarks[26],
        landmarks[28],
      );
      if (kneeAngle < 100) return { newStage: "down", repIncrement: false };
      if (kneeAngle > 160 && stage === "down")
        return { newStage: "up", repIncrement: true };
      return { newStage: stage, repIncrement: false };
    },
    instructions: { down: "↓ LUNGE DOWN", up: "↑ STEP UP" },
    caloriesPerRep: 0.5,
  },
};

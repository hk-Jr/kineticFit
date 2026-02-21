export const tricep_extension = {
  name: "Tricep Extension",
  category: "Upper Body",
  caloriesPerRep: 0.3,
  videoEmbed:
    '<iframe src="https://www.youtube.com/embed/nRiJVZDpdL0" ...></iframe>',
  instructions: {
    down: "Bend elbows behind your head",
    up: "Extend arms straight up!",
  },
  checkStatus: (landmarks) => {
    return { ok: true, msg: "" };
  },
  evaluateForm: (landmarks, stage) => {
    const wrist = landmarks[16].y;
    const elbow = landmarks[14].y;

    let newStage = stage;
    let repIncrement = false;

    if (wrist < elbow - 0.2) newStage = "up";
    if (wrist > elbow && stage === "up") {
      newStage = "down";
      repIncrement = true;
    }
    return { newStage, repIncrement };
  },
};

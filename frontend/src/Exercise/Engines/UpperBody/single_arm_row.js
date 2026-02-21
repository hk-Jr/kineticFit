export const single_arm_row = {
  name: "Single Arm Row",
  category: "Upper Body",
  caloriesPerRep: 0.4,
  videoEmbed:
    '<iframe src="https://www.youtube.com/embed/pYcpY20QaE8" ...></iframe>',
  instructions: {
    down: "Lower the weight toward the floor",
    up: "Pull elbow back past your ribs!",
  },
  checkStatus: (landmarks) => {
    return { ok: true, msg: "" };
  },
  evaluateForm: (landmarks, stage) => {
    const elbow = landmarks[14].y;
    const shoulder = landmarks[12].y;

    let newStage = stage;
    let repIncrement = false;

    if (elbow < shoulder) newStage = "up";
    if (elbow > shoulder + 0.1 && stage === "up") {
      newStage = "down";
      repIncrement = true;
    }
    return { newStage, repIncrement };
  },
};

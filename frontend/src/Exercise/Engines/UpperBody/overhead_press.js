export const overhead_press = {
  name: "Overhead Press",
  category: "Upper Body",
  caloriesPerRep: 0.5,
  videoEmbed:
    '<iframe src="https://www.youtube.com/embed/-SkO7f_9hyA" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
  instructions: {
    down: "Bring weights to shoulder level",
    up: "Press all the way up!",
  },
  checkStatus: (landmarks) => {
    return { ok: true, msg: "" };
  },
  evaluateForm: (landmarks, stage) => {
    const leftWrist = landmarks[15].y;
    const leftShoulder = landmarks[11].y;
    let newStage = stage;
    let repIncrement = false;

    if (leftWrist < leftShoulder - 0.1) newStage = "up";
    if (leftWrist > leftShoulder && stage === "up") {
      newStage = "down";
      repIncrement = true;
    }
    return { newStage, repIncrement };
  },
};

import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import "./Exercise.css";
import { ExerciseEngines } from "./ExerciseLogic";

const Exercise = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const navigate = useNavigate();

  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState("down");
  const [exercise, setExercise] = useState("bicep_curl");
  const [isCorrectOrientation, setIsCorrectOrientation] = useState(true);
  const [goal, setGoal] = useState(10);

  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

  const handleExit = async () => {
    if (counter > 0 && user?._id) {
      try {
        const engine = ExerciseEngines[exercise];
        await axios.post("http://localhost:5000/api/workout/save", {
          userId: user._id,
          date: today,
          type: exercise,
          reps: counter,
          caloriesBurned: (counter * engine.caloriesPerRep).toFixed(1),
        });
      } catch (err) {
        console.error("Failed to save workout", err);
      }
    }
    navigate("/dashboard");
  };

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    pose.onResults(onResults);

    if (videoRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      pose.close();
    };
  }, [exercise]);

  const onResults = (results) => {
    if (!results.poseLandmarks || !canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    const { width, height } = canvasRef.current;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, width, height);
    canvasCtx.drawImage(results.image, 0, 0, width, height);

    const landmarks = results.poseLandmarks;
    const engine = ExerciseEngines[exercise];

    const oriented = engine.checkOrientation(landmarks);
    setIsCorrectOrientation(oriented);

    if (oriented) {
      const { newStage, repIncrement } = engine.evaluateForm(landmarks, stage);
      if (newStage !== stage) setStage(newStage);
      if (repIncrement) setCounter((prev) => prev + 1);
    }

    canvasCtx.restore();
  };

  return (
    <div className="exercise-container py-4">
      <div className="container">
        {/* Header Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-3 rounded-4 text-white shadow">
          <button
            className="btn btn-outline-light btn-sm px-3"
            onClick={handleExit}
          >
            <ArrowLeft size={18} className="me-2" /> Exit Gym
          </button>

          <div className="text-center">
            <h5 className="mb-0 fw-bold">
              TOTAL REPS:{" "}
              <span className="text-primary">
                {counter} / {goal}
              </span>
            </h5>
            {counter >= goal && (
              <small className="text-success">
                <CheckCircle size={14} /> Goal Reached!
              </small>
            )}
          </div>

          <div className="badge bg-primary px-3 py-2 text-uppercase">
            {ExerciseEngines[exercise].name}
          </div>
        </div>

        {/* Selection Tabs */}
        <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
          {Object.keys(ExerciseEngines).map((key) => (
            <button
              key={key}
              className={`btn btn-sm rounded-pill px-4 ${exercise === key ? "btn-primary" : "btn-outline-dark"}`}
              onClick={() => {
                setExercise(key);
                setCounter(0);
                setStage("down");
              }}
            >
              {ExerciseEngines[key].name}
            </button>
          ))}
        </div>

        {/* Camera View */}
        <div className="video-wrapper shadow-lg rounded-4 overflow-hidden border border-4 border-dark bg-black">
          <video ref={videoRef} className="d-none" />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="w-100 h-auto"
          />

          {!isCorrectOrientation && (
            <div className="orientation-alert-overlay">
              <div className="alert-box">
                <AlertCircle size={48} className="text-warning mb-3" />
                <h4 className="fw-bold text-white">PROFILE VIEW REQUIRED</h4>
                <p className="text-white-50">Turn 90° sideways to camera</p>
              </div>
            </div>
          )}

          <div className="rep-counter-overlay">
            <span className="fw-black">{counter}</span>
            <p>REPS</p>
          </div>

          <div
            className={`stage-indicator ${stage === "up" ? "bg-success" : "bg-primary"}`}
          >
            {ExerciseEngines[exercise].instructions[stage]}
          </div>
        </div>

        {/* Stats & Goal Settings */}
        <div className="mt-4 row g-3 text-center">
          <div className="col-md-4">
            <div className="p-3 bg-white rounded-4 shadow-sm">
              <span className="text-muted d-block small">Calories</span>
              <span className="fw-bold text-primary">
                {(counter * ExerciseEngines[exercise].caloriesPerRep).toFixed(
                  1,
                )}{" "}
                kcal
              </span>
            </div>
          </div>
          <div className="col-md-8">
            <div className="p-3 bg-white rounded-4 shadow-sm d-flex align-items-center justify-content-center">
              <span className="text-muted me-3">Adjust Target Reps:</span>
              <input
                type="number"
                className="form-control w-25 text-center fw-bold"
                value={goal}
                onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;

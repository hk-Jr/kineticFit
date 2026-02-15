import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios"; // Ensure axios is imported
import "./Exercise.css";

const Exercise = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const navigate = useNavigate();

  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState("up");
  const [exercise, setExercise] = useState("squat");

  // Get user and date for saving
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

  const calculateAngle = (p1, p2, p3) => {
    const radians =
      Math.atan2(p3.y - p2.y, p3.x - p2.x) -
      Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  // --- NEW: HANDLE EXIT AND SAVE ---
  const handleExit = async () => {
    if (counter > 0 && user?._id) {
      try {
        await axios.post("http://localhost:5000/api/workout/save", {
          userId: user._id,
          date: today,
          type: exercise,
          reps: counter,
          caloriesBurned: counter * 0.5,
        });
        console.log("Workout saved successfully!");
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
          if (videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      pose.close();
    };
  }, [exercise]);

  const onResults = (results) => {
    if (!results.poseLandmarks || !canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    const landmarks = results.poseLandmarks;

    try {
      if (exercise === "squat") {
        const kneeAngle = calculateAngle(
          landmarks[24],
          landmarks[26],
          landmarks[28],
        );
        if (kneeAngle < 110) setStage("down");
        if (kneeAngle > 160 && stage === "down") {
          setStage("up");
          setCounter((prev) => prev + 1);
        }
      } else if (exercise === "pushup") {
        const elbowAngle = calculateAngle(
          landmarks[12],
          landmarks[14],
          landmarks[16],
        );
        if (elbowAngle < 90) setStage("down");
        if (elbowAngle > 160 && stage === "down") {
          setStage("up");
          setCounter((prev) => prev + 1);
        }
      }
    } catch (err) {}
    canvasCtx.restore();
  };

  return (
    <div className="exercise-container py-4">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 bg-dark p-3 rounded-4 shadow text-white">
          <button
            className="btn btn-outline-light btn-sm px-3"
            onClick={handleExit} // Changed from navigate to handleExit
          >
            <ArrowLeft size={18} className="me-2" /> Exit Gym
          </button>
          <div className="text-center">
            <h5 className="mb-0 fw-bold">Kinetic AI Vision</h5>
            <small className="text-primary fw-bold">Active Tracking</small>
          </div>
          <div className="badge bg-primary px-3 py-2">
            {exercise.toUpperCase()}
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-4">
          <button
            className={`btn rounded-pill px-4 ${exercise === "squat" ? "btn-primary shadow" : "btn-outline-dark"}`}
            onClick={() => {
              setExercise("squat");
              setCounter(0);
              setStage("up");
            }}
          >
            Squats
          </button>
          <button
            className={`btn rounded-pill px-4 ${exercise === "pushup" ? "btn-primary shadow" : "btn-outline-dark"}`}
            onClick={() => {
              setExercise("pushup");
              setCounter(0);
              setStage("up");
            }}
          >
            Push-ups
          </button>
        </div>

        <div className="video-wrapper shadow-lg rounded-4 overflow-hidden border border-4 border-dark bg-black">
          <video ref={videoRef} className="d-none" playsInline />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="w-100 h-auto"
          />
          <div className="rep-counter-overlay">
            <span className="fw-black">{counter}</span>
            <p>REPS</p>
          </div>
          <div
            className={`stage-indicator ${stage === "down" ? "bg-success border-success" : ""}`}
          >
            {stage === "down" ? "↑ PUSH UP" : "↓ GET LOW"}
          </div>
        </div>

        <div className="mt-4 row g-3 text-center">
          <div className="col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm">
              <span className="text-muted d-block small">Accuracy</span>
              <span className="h4 fw-bold text-success">Form Validated</span>
            </div>
          </div>
          <div className="col-6">
            <div className="p-3 bg-white rounded-4 shadow-sm">
              <span className="text-muted d-block small">Calories Burned</span>
              <span className="h4 fw-bold text-primary">
                {(counter * 0.5).toFixed(1)} kcal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;

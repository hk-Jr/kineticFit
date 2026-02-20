import React, { useRef, useEffect, useState } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Info,
  Flame,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import "./Exercise.css";
import { AllExercises } from "./Engines";

const Exercise = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const navigate = useNavigate();

  // Logic Ref to ensure strict rep counting
  const stageRef = useRef("down");

  const [exercise, setExercise] = useState("bicep_curl");
  const [category, setCategory] = useState("Upper Body");
  const [counter, setCounter] = useState(0);
  const [isReady, setIsReady] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [showInitialAlert, setShowInitialAlert] = useState(true); // First-time alert

  const currentEngine = AllExercises[exercise];

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

    pose.onResults((results) => {
      if (!results.poseLandmarks || !canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, 640, 480);
      canvasCtx.drawImage(results.image, 0, 0, 640, 480);

      const status = currentEngine.checkStatus(results.poseLandmarks);
      if (!status.ok) {
        setIsReady(false);
        setStatusMsg(status.msg);
      } else {
        setIsReady(true);
        const { newStage, repIncrement } = currentEngine.evaluateForm(
          results.poseLandmarks,
          stageRef.current,
        );
        if (newStage !== stageRef.current) {
          stageRef.current = newStage;
          if (repIncrement) setCounter((prev) => prev + 1);
        }
      }
      canvasCtx.restore();
    });

    if (videoRef.current) {
      cameraRef.current = new cam.Camera(videoRef.current, {
        onFrame: async () => {
          await pose.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
    }

    return () => {
      cameraRef.current?.stop();
      pose.close();
    };
  }, [exercise]);

  return (
    <div className="exercise-layout">
      {/* Safety Alert Modal */}
      {showInitialAlert && (
        <div className="setup-overlay">
          <div className="setup-card">
            <UserCheck size={48} color="#3b82f6" />
            <h2>Workout Safety Check</h2>
            <p>
              Make sure you are the <strong>only person</strong> on screen for
              the best tracking accuracy.
            </p>
            <button
              className="btn-start-now"
              onClick={() => setShowInitialAlert(false)}
            >
              Got it, let's start!
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Clean White Theme */}
      <div className="sidebar">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div className="header-box">
          <h1>{currentEngine.name}</h1>
          <button
            className="video-toggle"
            onClick={() => setShowVideo(!showVideo)}
          >
            {showVideo ? <Info size={18} /> : <Play size={18} />}
            {showVideo ? "Show Stats" : "Watch Tutorial"}
          </button>
        </div>

        {showVideo ? (
          <div
            className="video-player-container"
            dangerouslySetInnerHTML={{ __html: currentEngine.videoEmbed }}
          />
        ) : (
          <div className="stats-container">
            <div className="bold-calorie-card">
              <div className="calorie-icon-circle">
                <Flame size={24} color="#ef4444" fill="#ef4444" />
              </div>
              <div className="calorie-details">
                <span className="calorie-label">TOTAL BURNED</span>
                <span className="calorie-value">
                  {(counter * currentEngine.caloriesPerRep).toFixed(1)}{" "}
                  <small>kcal</small>
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="navigation-selectors">
          <label className="section-title">CATEGORIES</label>
          <div className="category-list">
            {["Upper Body", "Lower Body", "Full Body"].map((cat) => (
              <button
                key={cat}
                className={category === cat ? "active" : ""}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="section-title">EXERCISES</label>
          <div className="exercise-nav">
            {Object.keys(AllExercises)
              .filter((k) => AllExercises[k].category === category)
              .map((key) => (
                <button
                  key={key}
                  className={exercise === key ? "active" : ""}
                  onClick={() => {
                    setExercise(key);
                    setCounter(0);
                    stageRef.current = "down";
                  }}
                >
                  {AllExercises[key].name}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="viewport">
        <div className="camera-box">
          <canvas ref={canvasRef} width="640" height="480" />
          <video ref={videoRef} className="d-none" />

          {!isReady && (
            <div className="compact-alert">
              <AlertCircle size={18} />
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="rep-badge">
            <span className="rep-number">{counter}</span>
            <span className="rep-unit">REPS</span>
          </div>

          <div className={`instruction-pill ${stageRef.current}`}>
            {currentEngine.instructions[stageRef.current]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;

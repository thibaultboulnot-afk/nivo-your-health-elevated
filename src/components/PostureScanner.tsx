import { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Camera as CameraIcon, 
  CameraOff, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Target,
  RotateCcw,
  User,
  ArrowRight
} from 'lucide-react';

interface PostureScannerProps {
  onScoreCapture: (score: number) => void;
  onFallback: () => void;
}

interface PostureMetrics {
  alignmentScore: number;
  neckScore: number;
  torsoScore: number;
  isForwardHead: boolean;
  isSlouching: boolean;
  headOffset: number;
  torsoAngle: number;
}

export default function PostureScanner({ onScoreCapture, onFallback }: PostureScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [showTutorial, setShowTutorial] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<PostureMetrics | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Calculate advanced posture metrics from landmarks (Neck + Torso)
  const calculatePostureMetrics = useCallback((landmarks: Results['poseLandmarks']): PostureMetrics => {
    if (!landmarks || landmarks.length < 25) {
      return { 
        alignmentScore: 0, 
        neckScore: 0, 
        torsoScore: 0, 
        isForwardHead: true, 
        isSlouching: true, 
        headOffset: 0, 
        torsoAngle: 0 
      };
    }

    // Key landmarks
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // Choose the side with better visibility
    const leftVisibility = (leftEar.visibility! + leftShoulder.visibility! + leftHip.visibility!) / 3;
    const rightVisibility = (rightEar.visibility! + rightShoulder.visibility! + rightHip.visibility!) / 3;
    
    const ear = leftVisibility > rightVisibility ? leftEar : rightEar;
    const shoulder = leftVisibility > rightVisibility ? leftShoulder : rightShoulder;
    const hip = leftVisibility > rightVisibility ? leftHip : rightHip;

    // === CHECK 1: Tech Neck (Ear vs Shoulder) ===
    const headOffset = (ear.x - shoulder.x) * 100;
    const FORWARD_HEAD_THRESHOLD = 8;
    const isForwardHead = headOffset > FORWARD_HEAD_THRESHOLD;
    
    // Neck score (0-100)
    const MAX_HEAD_OFFSET = 20;
    const normalizedHeadOffset = Math.min(Math.abs(headOffset), MAX_HEAD_OFFSET);
    const neckScore = Math.round(100 - (normalizedHeadOffset / MAX_HEAD_OFFSET) * 100);

    // === CHECK 2: Slouching/Torso Alignment (Shoulder vs Hip) ===
    // Calculate angle of torso - if shoulder is significantly forward of hip, it's slouching
    const shoulderHipOffsetX = (shoulder.x - hip.x) * 100;
    const shoulderHipOffsetY = (hip.y - shoulder.y); // Vertical distance (hip below shoulder)
    
    // Calculate angle in degrees (forward lean)
    const torsoAngle = Math.atan2(shoulderHipOffsetX, shoulderHipOffsetY * 100) * (180 / Math.PI);
    const SLOUCH_THRESHOLD = 10; // degrees
    const isSlouching = Math.abs(torsoAngle) > SLOUCH_THRESHOLD;
    
    // Torso score (0-100)
    const MAX_TORSO_ANGLE = 25;
    const normalizedTorsoAngle = Math.min(Math.abs(torsoAngle), MAX_TORSO_ANGLE);
    const torsoScore = Math.round(100 - (normalizedTorsoAngle / MAX_TORSO_ANGLE) * 100);

    // === COMBINED SCORE ===
    // Weighted average: 50% neck, 50% torso
    const alignmentScore = Math.round((neckScore * 0.5) + (torsoScore * 0.5));

    return {
      alignmentScore: Math.max(0, Math.min(100, alignmentScore)),
      neckScore: Math.max(0, Math.min(100, neckScore)),
      torsoScore: Math.max(0, Math.min(100, torsoScore)),
      isForwardHead,
      isSlouching,
      headOffset: Math.round(headOffset),
      torsoAngle: Math.round(torsoAngle)
    };
  }, []);

  // Draw skeleton on canvas with advanced feedback
  const drawSkeleton = useCallback((
    results: Results,
    canvas: HTMLCanvasElement,
    metrics: PostureMetrics
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !results.poseLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Mirror the canvas for selfie view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    const isGoodPosture = !metrics.isForwardHead && !metrics.isSlouching;
    const color = isGoodPosture ? '#22c55e' : '#ef4444';
    const highlightColor = isGoodPosture ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';

    // Draw connections
    drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
      color: color,
      lineWidth: 3
    });

    // Draw landmarks
    drawLandmarks(ctx, results.poseLandmarks, {
      color: highlightColor,
      fillColor: color,
      lineWidth: 1,
      radius: 4
    });

    // Highlight key posture points (ear, shoulder, hip)
    const keyPoints = [7, 8, 11, 12, 23, 24]; // ears, shoulders, hips
    keyPoints.forEach(idx => {
      const landmark = results.poseLandmarks[idx];
      if (landmark && landmark.visibility! > 0.5) {
        ctx.beginPath();
        ctx.arc(
          landmark.x * canvas.width,
          landmark.y * canvas.height,
          8,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    ctx.restore();
  }, []);

  // Handle pose results
  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const videoElement = webcamRef.current?.video;
    
    if (videoElement) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    }

    if (results.poseLandmarks) {
      const newMetrics = calculatePostureMetrics(results.poseLandmarks);
      setMetrics(newMetrics);
      
      // Add to score history for averaging
      setScoreHistory(prev => {
        const updated = [...prev, newMetrics.alignmentScore];
        // Keep last 90 frames (~3 seconds at 30fps)
        return updated.slice(-90);
      });

      drawSkeleton(results, canvas, newMetrics);
    }
  }, [calculatePostureMetrics, drawSkeleton]);

  // Initialize MediaPipe Pose
  const initializePose = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      // Wait for webcam to be ready
      const checkWebcam = setInterval(() => {
        if (webcamRef.current?.video?.readyState === 4) {
          clearInterval(checkWebcam);
          
          const camera = new Camera(webcamRef.current.video, {
            onFrame: async () => {
              if (poseRef.current && webcamRef.current?.video) {
                await poseRef.current.send({ image: webcamRef.current.video });
              }
            },
            width: 640,
            height: 480
          });
          
          camera.start();
          cameraRef.current = camera;
          setIsLoading(false);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkWebcam);
        if (isLoading) {
          setCameraError('Timeout: impossible d\'initialiser la caméra');
          setIsLoading(false);
        }
      }, 10000);

    } catch (error) {
      console.error('Error initializing pose:', error);
      setCameraError('Erreur lors de l\'initialisation de MediaPipe');
      setIsLoading(false);
    }
  }, [onResults, isLoading]);

  // Enable camera
  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user' 
        } 
      });
      stream.getTracks().forEach(track => track.stop()); // Just testing access
      setCameraEnabled(true);
      setCameraError(null);
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraError('Accès à la caméra refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.');
    }
  };

  // Start scanning after tutorial
  const startScanning = async () => {
    setShowTutorial(false);
    await enableCamera();
  };

  // Capture average score from last 3 seconds
  const captureScore = () => {
    if (scoreHistory.length === 0) {
      onScoreCapture(50); // Default score if no data
      return;
    }

    setIsCapturing(true);
    
    // Calculate average of last 3 seconds
    const avgScore = Math.round(
      scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length
    );

    // Convert 0-100 alignment score to 0-3 wall angel score
    let wallAngelScore: number;
    if (avgScore >= 80) {
      wallAngelScore = 3;
    } else if (avgScore >= 50) {
      wallAngelScore = 1.5;
    } else {
      wallAngelScore = 0;
    }

    setTimeout(() => {
      setIsCapturing(false);
      onScoreCapture(wallAngelScore);
    }, 500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  // Initialize pose when camera is enabled
  useEffect(() => {
    if (cameraEnabled && !poseRef.current) {
      initializePose();
    }
  }, [cameraEnabled, initializePose]);

  // Reset scanner
  const resetScanner = () => {
    setScoreHistory([]);
    setMetrics(null);
  };

  // Get status message based on metrics
  const getStatusMessage = () => {
    if (!metrics) return '';
    if (metrics.isForwardHead && metrics.isSlouching) return 'Cou + Dos à optimiser';
    if (metrics.isForwardHead) return 'Tête avancée';
    if (metrics.isSlouching) return 'Dos arrondi';
    return 'Bon alignement';
  };

  return (
    <div className="space-y-4">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-[4/3] bg-gradient-to-br from-black/80 to-black/60 rounded-2xl overflow-hidden border border-border"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              {/* Animated Profile Icon */}
              <div className="relative w-32 h-32 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-2 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotateY: [0, -30, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <User className="w-16 h-16 text-primary" />
                  </motion.div>
                </div>
                {/* Profile arrow indicator */}
                <motion.div
                  className="absolute -right-4 top-1/2 -translate-y-1/2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-6 h-6 text-primary" />
                </motion.div>
              </div>

              {/* Instructions */}
              <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                Positionnez-vous de Profil
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
                Placez-vous de <span className="text-primary font-semibold">profil</span> par rapport à la caméra. 
                Votre <span className="text-primary">oreille</span>, <span className="text-primary">épaule</span> et <span className="text-primary">hanche</span> doivent être visibles.
              </p>

              {/* Checklist */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-foreground/60">
                  ✓ Corps entier visible
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-foreground/60">
                  ✓ Vue de profil
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-foreground/60">
                  ✓ Bien éclairé
                </span>
              </div>

              {/* Start Button */}
              <Button
                onClick={startScanning}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8"
              >
                <CameraIcon className="w-4 h-4 mr-2" />
                Je suis prêt
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera View (hidden during tutorial) */}
      {!showTutorial && (
        <>
          <div className="relative aspect-[4/3] bg-black/50 rounded-2xl overflow-hidden border border-border">
            {!cameraEnabled ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <CameraIcon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-center text-muted-foreground text-sm mb-4">
                  Chargement de la caméra...
                </p>
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  mirrored
                  className="absolute inset-0 w-full h-full object-cover"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: 'user'
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Loading Overlay */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"
                    >
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-3" />
                      <p className="text-sm text-muted-foreground font-mono">
                        Chargement de MediaPipe...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Real-time Score Overlay with detailed metrics */}
                {metrics && !isLoading && (
                  <div className="absolute top-3 left-3 right-3 flex flex-col gap-2">
                    {/* Main score badge */}
                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1.5 rounded-lg ${
                        metrics.isForwardHead || metrics.isSlouching
                          ? 'bg-destructive/80 text-white' 
                          : 'bg-emerald-500/80 text-white'
                      }`}>
                        <div className="flex items-center gap-2">
                          {metrics.isForwardHead || metrics.isSlouching ? (
                            <AlertTriangle className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span className="font-mono text-sm font-bold">
                            {metrics.alignmentScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="px-3 py-1.5 rounded-lg bg-black/60">
                        <span className="font-mono text-xs text-white/80">
                          {getStatusMessage()}
                        </span>
                      </div>
                    </div>

                    {/* Detailed breakdown */}
                    <div className="flex gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-mono ${
                        metrics.isForwardHead ? 'bg-red-500/60' : 'bg-emerald-500/60'
                      } text-white`}>
                        Cou: {metrics.neckScore}%
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-mono ${
                        metrics.isSlouching ? 'bg-red-500/60' : 'bg-emerald-500/60'
                      } text-white`}>
                        Dos: {metrics.torsoScore}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Capture Animation */}
                <AnimatePresence>
                  {isCapturing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                    >
                      <div className="w-24 h-24 rounded-full border-4 border-primary animate-ping" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Error State */}
          {cameraError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <div className="flex items-start gap-3">
                <CameraOff className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-sans text-sm text-destructive mb-2">{cameraError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onFallback}
                    className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  >
                    Saisie manuelle
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {cameraEnabled && !cameraError && !isLoading && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={resetScanner}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Réinitialiser
              </Button>
              <Button
                onClick={captureScore}
                disabled={scoreHistory.length < 30 || isCapturing}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Target className="w-4 h-4 mr-2" />
                Capturer le Score
              </Button>
            </div>
          )}

          {/* Instructions */}
          {cameraEnabled && !cameraError && !isLoading && scoreHistory.length < 30 && (
            <p className="text-center text-xs text-muted-foreground font-mono">
              Maintenez votre position de profil pendant 1 seconde...
            </p>
          )}

          {/* Fallback Button */}
          {cameraEnabled && !cameraError && (
            <button
              onClick={onFallback}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
            >
              Préférer la saisie manuelle →
            </button>
          )}

          {/* Legal Disclaimer */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-[10px] text-muted-foreground text-center font-mono">
              NIVO est un outil d'hygiène de vie. En cas de douleur, consultez un médecin.
            </p>
          </div>
        </>
      )}
    </div>
  );
}


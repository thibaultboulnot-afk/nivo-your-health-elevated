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
  RotateCcw
} from 'lucide-react';

interface PostureScannerProps {
  onScoreCapture: (score: number) => void;
  onFallback: () => void;
}

interface PostureMetrics {
  alignmentScore: number;
  isForwardHead: boolean;
  headOffset: number;
}

export default function PostureScanner({ onScoreCapture, onFallback }: PostureScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<PostureMetrics | null>(null);
  const [scoreHistory, setScoreHistory] = useState<number[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Calculate posture metrics from landmarks
  const calculatePostureMetrics = useCallback((landmarks: Results['poseLandmarks']): PostureMetrics => {
    if (!landmarks || landmarks.length < 12) {
      return { alignmentScore: 0, isForwardHead: true, headOffset: 0 };
    }

    // Key landmarks (using right side for profile detection)
    const nose = landmarks[0];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    // Use the ear that's more visible (higher visibility score)
    const ear = leftEar.visibility! > rightEar.visibility! ? leftEar : rightEar;
    const shoulder = leftShoulder.visibility! > rightShoulder.visibility! ? leftShoulder : rightShoulder;

    // Calculate forward head offset (ear X relative to shoulder X)
    // In a good posture, ear should be roughly above shoulder
    const headOffset = (ear.x - shoulder.x) * 100; // Convert to percentage
    
    // Threshold: if ear is more than 8% forward of shoulder, it's forward head
    const FORWARD_HEAD_THRESHOLD = 8;
    const isForwardHead = headOffset > FORWARD_HEAD_THRESHOLD;

    // Calculate alignment score (0-100)
    // Perfect alignment = 100, max forward offset (20%) = 0
    const MAX_OFFSET = 20;
    const normalizedOffset = Math.min(Math.abs(headOffset), MAX_OFFSET);
    const alignmentScore = Math.round(100 - (normalizedOffset / MAX_OFFSET) * 100);

    return {
      alignmentScore: Math.max(0, Math.min(100, alignmentScore)),
      isForwardHead,
      headOffset: Math.round(headOffset)
    };
  }, []);

  // Draw skeleton on canvas
  const drawSkeleton = useCallback((
    results: Results,
    canvas: HTMLCanvasElement,
    isGoodPosture: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !results.poseLandmarks) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    
    // Mirror the canvas for selfie view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

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

    // Highlight key posture points (ear and shoulder)
    const keyPoints = [0, 7, 8, 11, 12]; // nose, ears, shoulders
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

      drawSkeleton(results, canvas, !newMetrics.isForwardHead);
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
    // 80-100% = 3 (success)
    // 50-79% = 1.5 (partial)
    // 0-49% = 0 (fail)
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

  return (
    <div className="space-y-4">
      {/* Camera View */}
      <div className="relative aspect-[4/3] bg-black/50 rounded-2xl overflow-hidden border border-border">
        {!cameraEnabled ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
              <CameraIcon className="w-8 h-8 text-primary" />
            </div>
            <p className="text-center text-muted-foreground text-sm mb-4">
              Activez votre caméra pour l'analyse posturale en temps réel
            </p>
            <Button
              onClick={enableCamera}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <CameraIcon className="w-4 h-4 mr-2" />
              Activer la caméra
            </Button>
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

            {/* Real-time Score Overlay */}
            {metrics && !isLoading && (
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className={`px-3 py-1.5 rounded-lg backdrop-blur-sm ${
                  metrics.isForwardHead 
                    ? 'bg-destructive/80 text-white' 
                    : 'bg-emerald-500/80 text-white'
                }`}>
                  <div className="flex items-center gap-2">
                    {metrics.isForwardHead ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    <span className="font-mono text-sm font-bold">
                      {metrics.alignmentScore}%
                    </span>
                  </div>
                </div>
                
                <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                  <span className="font-mono text-xs text-white/80">
                    {metrics.isForwardHead ? 'Tête avancée' : 'Bonne posture'}
                  </span>
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
    </div>
  );
}


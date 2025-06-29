import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Mic, Check, ArrowRight, RotateCcw, Play, Pause, Upload, Loader } from 'lucide-react';

const MediaCapture = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: Photo, 2: Audio, 3: Upload
  const [photoTaken, setPhotoTaken] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const streamRef = useRef(null);
  
  const navigate = useNavigate();

  // Initialize camera
  useEffect(() => {
    if (currentStep === 1) {
      initializeCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [currentStep]);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 60) { // 60 seconds max
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Flip the image horizontally (mirror effect)
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      
      // Convert to blob and create file
      canvas.toBlob((blob) => {
        const file = new File([blob], 'profile_photo.jpg', { type: 'image/jpeg' });
        setPhotoFile(file);
        setPhotoTaken(true);
        
        // Stop camera stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setPhotoFile(null);
    initializeCamera();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioBlob(audioBlob);
        setAudioRecorded(true);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && photoTaken) {
      setCurrentStep(2);
    } else if (currentStep === 2 && audioRecorded) {
      setCurrentStep(3);
    }
  };


  const uploadToServer = async () => {
  if (!photoFile || !audioBlob || recordingTime < 15) {
    alert('Please ensure you have both a photo and at least 15 seconds of audio recorded.');
    return;
  }
  
  setIsUploading(true);
  setUploadProgress(0);
  
  try {
    const uid = sessionStorage.getItem('uid');
    if (!uid) {
      throw new Error('User not authenticated');
    }
    
    // Convert audio blob to file
    const audioFile = new File([audioBlob], 'voice_sample.wav', { 
      type: 'audio/wav' // Use wav format for better compatibility
    });
    
    // First, upload the photo separately if needed, or save it locally
    const photoUrl = URL.createObjectURL(photoFile);
    
    // Create FormData for voice cloning (only audio files)
    const formData = new FormData();
    formData.append('user_id', uid);
    formData.append('name', 'UserVoice');
    formData.append('description', 'Cloned voice with noise removal');
    
    // Only append audio file to 'files' - backend expects only audio files here
    formData.append('files', audioFile);
    
    // Add metadata as labels
    formData.append('labels', JSON.stringify({
      audio_duration: recordingTime,
      photo_captured: true,
      timestamp: new Date().toISOString()
    }));
    
    // Pass photo URL/path separately
    formData.append('img_path', photoUrl);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    // Upload to API
    const response = await fetch('https://rz7fp2tv-8006.inc1.devtunnels.ms/voice/ivc/create', {
      method: 'POST',
      body: formData,
    });
    
    clearInterval(progressInterval);
    setUploadProgress(100);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Save the image to local storage (in a real app, you'd want to upload this to your server)
      localStorage.setItem('userProfileImage', photoUrl);
      
      setTimeout(() => {
        navigate('/wizard/1');
      }, 1000);
    } else {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }
    
  } catch (error) {
    console.error('Upload error:', error);
    alert(`Upload failed: ${error.message}. Please try again.`);
    setUploadProgress(0);
  } finally {
    setIsUploading(false);
  }
};

  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const renderPhotoStep = () => (
    <div className="text-center animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <Camera className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
        Capture Your Photo
      </h1>
      <p className="text-xl text-gray-400 mb-12">
        This helps us create a more personalized AI clone
      </p>

      <div className="relative max-w-md mx-auto mb-8">
        {!photoTaken ? (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-2xl shadow-2xl transform scale-x-[-1]"
              style={{ maxHeight: '400px' }}
            />
            <div className="absolute inset-0 rounded-2xl border-4 border-white/20 pointer-events-none" />
          </div>
        ) : (
          <div className="relative">
            <img
              src={photoFile ? URL.createObjectURL(photoFile) : ''}
              alt="Captured"
              className="w-full h-auto rounded-2xl shadow-2xl"
              style={{ maxHeight: '400px' }}
            />
            <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center space-x-4">
        {!photoTaken ? (
          <button
            onClick={takePhoto}
            className="w-16 h-16 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          >
            <Camera className="w-8 h-8 text-black" />
          </button>
        ) : (
          <>
            <button
              onClick={retakePhoto}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>
            
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-medium transition-all duration-300 flex items-center space-x-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderAudioStep = () => (
    <div className="text-center animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
        <Mic className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
        Record Your Voice
      </h1>
      <p className="text-xl text-gray-400 mb-12">
        Speak for 15-60 seconds to capture your unique voice
      </p>

      <div className="max-w-md mx-auto mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600">
          {/* Recording Visualizer */}
          <div className="flex justify-center items-center h-32 mb-6">
            {isRecording ? (
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 bg-red-500 rounded-full animate-pulse"
                    style={{
                      height: `${20 + Math.random() * 40}px`,
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            ) : audioRecorded ? (
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="text-3xl font-mono text-white mb-6">
            {formatTime(recordingTime)} / 1:00
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(recordingTime / 60) * 100}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            {!audioRecorded ? (
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-white hover:bg-gray-100'
                }`}
              >
                <Mic className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-black'}`} />
              </button>
            ) : (
              <button
                onClick={playAudio}
                className="w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {audioRecorded && recordingTime >= 15 && (
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-white hover:bg-gray-100 text-black rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {audioRecorded && recordingTime < 15 && (
        <p className="text-yellow-400 text-sm">
          Please record at least 15 seconds of audio to continue
        </p>
      )}

      <audio ref={audioRef} className="hidden" />
    </div>
  );

  const renderUploadStep = () => (
    <div className="text-center animate-fade-in">
      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
        {isUploading ? (
          <Loader className="w-8 h-8 text-white animate-spin" />
        ) : (
          <Upload className="w-8 h-8 text-white" />
        )}
      </div>

      <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
        {isUploading ? 'Creating Your Clone...' : 'Ready to Create'}
      </h1>
      <p className="text-xl text-gray-400 mb-12">
        {isUploading 
          ? 'Processing your photo and voice sample' 
          : 'Your photo and voice sample are ready to be processed'
        }
      </p>

      {/* Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
        {/* Photo Preview */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-4">Your Photo</h3>
          <img
            src={photoFile ? URL.createObjectURL(photoFile) : ''}
            alt="Captured"
            className="w-full h-32 object-cover rounded-xl"
          />
        </div>

        {/* Audio Preview */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-medium text-white mb-4">Voice Sample</h3>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <button
                onClick={playAudio}
                className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 mx-auto mb-2"
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
              </button>
              <p className="text-sm text-gray-400">{formatTime(recordingTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white">Uploading...</span>
              <span className="text-white">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {!isUploading && (
        <button
          onClick={uploadToServer}
          className="px-12 py-4 bg-white hover:bg-gray-100 text-black rounded-2xl font-medium text-lg transition-all duration-300 flex items-center space-x-2 mx-auto hover:scale-105"
        >
          <span>Create My AI Clone</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                step === currentStep
                  ? 'bg-white w-8'
                  : step < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto">
        {currentStep === 1 && renderPhotoStep()}
        {currentStep === 2 && renderAudioStep()}
        {currentStep === 3 && renderUploadStep()}
      </div>
    </div>
  );
};

export default MediaCapture;

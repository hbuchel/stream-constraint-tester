import { useEffect, useLayoutEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const videoEl = useRef(null);
  const isMobileDevice =
    // Test Android/iPhone/iPad
    /Android|iPhone|iPad/i.test(navigator.userAgent) ||
    // Test some versions of iPad that return as if desktop
    (/Macintosh/i.test(navigator.userAgent) &&
      navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 1);

  const isIOS =
      (/Macintosh/i.test(navigator.userAgent) &&
        navigator.maxTouchPoints &&
        navigator.maxTouchPoints > 1) ||
      navigator.userAgent.indexOf('like Mac') != -1;

  const isPortrait = screen.orientation?.type?.includes('portrait');
  const [errorMessage, setErrorMessage] = useState('');
  const [videoWidth, setVideoWidth] = useState(320);
  const [videoHeight, setVideoHeight] = useState(240);
  const [videoSettings, setVideoSettings] = useState({})

  let width = isPortrait ? window.innerWidth : window.innerHeight
  let height = isPortrait ? window.innerHeight : window.innerWidth
  

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const [constraints, setConstraints] = useState({
    audio: false,
    video: {
      width: {
        min: 320,
        ideal: !isMobileDevice ? 640 : (isIOS ? screenWidth : screenHeight),
        max: !isMobileDevice ? 640 : (isIOS ? screenWidth : screenHeight),
      },
      height: {
        min: 240,
        ideal: !isMobileDevice ? 480 : (isIOS ? screenHeight : screenWidth),
        max: !isMobileDevice ? 480 : (isIOS ? screenHeight : screenWidth),
      },
    },
    frameRate: { min: 15, ideal: 30, max: 30 },
    facingMode: 'user',
  });
  
  const isAndroid = navigator.userAgent.indexOf('Android') != -1
  const isFirefox = navigator.userAgent.indexOf('Firefox') != -1
  const shouldFlipValues = isAndroid && isFirefox;
  

  useEffect(() => {
    const video = videoEl.current;
    console.log('this is happening');

    
    navigator.mediaDevices.getUserMedia(constraints)
      .then((mediaStream) => {
        video.srcObject = mediaStream;
        const { height, width } = mediaStream
          .getTracks()[0]
          .getSettings();
        setVideoSettings(mediaStream
          .getTracks()[0]
          .getSettings());

        const videoWidth = width;
        const videoHeight = height;
        
        setVideoWidth(shouldFlipValues ? videoHeight : videoWidth);
        setVideoHeight(shouldFlipValues ? videoWidth : videoHeight);
        video.onloadedmetadata = () => {
          video.play();
        };
        
      })
      .catch((err) => {
        // always check for errors at the end.
        setErrorMessage(`${err.name}: ${err.message}`);
      });

    

      
  }, [constraints, shouldFlipValues]);

  return (
    <div className="app">
      <div className="videoWrapper">
        <video style={{transform: 'scaleX(-1)'}} width={isMobileDevice ? '100%' : videoWidth} height={isMobileDevice ? 'auto' : videoHeight} ref={videoEl} className="video"></video>
        <span className="videoDims">{videoWidth}x{videoHeight}</span>
      </div>
      { errorMessage ? <div className="error"><div className="errorMessage">{errorMessage}</div></div> : null }
      <div className="debug">
        <pre>
        { JSON.stringify(constraints, undefined, 2) }
        </pre>
        <pre>
        { JSON.stringify(videoSettings, undefined, 2) }
        </pre>
      </div>
    </div>
    
  )
}

export default App

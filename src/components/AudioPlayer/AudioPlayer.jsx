import { useState, useEffect, useRef } from 'react';

const AudioPlayer = ({ recordBlob, onClose }) => {
  const [recordUrl, setRecordUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (recordBlob) {
      const url = URL.createObjectURL(recordBlob);
      setRecordUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [recordBlob]);

  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (!isPlaying) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (e) => {
    if (!isDragging) {
      setCurrentTime(e.target.currentTime);
    }
  };

  const handleLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  const handleProgressClick = (e) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const progressBar = progressBarRef.current;
      const rect = progressBar.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newTime = Math.min(Math.max((offsetX / rect.width) * duration, 0), duration);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const hoverTime = (offsetX / rect.width) * duration;
    if (!isHovering) {
      setIsHovering(true);
    }
    setHoverTime(hoverTime);
  };

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <div className="bg-[#EAF0FA] rounded-3xl flex items-center px-5 py-3 w-[352px]">
      {recordUrl && (
        <>
          <span className="text-gray-800 mr-3 text-[15px]">{formatTime(currentTime)}</span>
          <audio
            ref={audioRef}
            src={recordUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          ></audio>
          <div className="flex items-center w-full">
            <button onClick={togglePlay} className="focus:outline-none">
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-lg">
                {isPlaying ? (
                  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1 0H3V10H1V0ZM5 0H7V10H5V0Z" fill="#002CFB" />
                  </svg>
                ) : (
                  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.287422 0.0693819C0.376104 0.0231631 0.475355 0 0.574754 0C0.673886 0 0.773106 0.0231631 0.862176 0.0693819L7.71255 4.55186C7.89006 4.64422 8 4.81521 8 5.00008C8 5.18493 7.89036 5.3559 7.71255 5.44814L0.862176 9.93081C0.684394 10.0231 0.465233 10.0231 0.287571 9.93081C0.109759 9.83824 0 9.6672 0 9.48246V0.51755C0 0.332781 0.10958 0.16182 0.287422 0.0693819Z"
                      fill="#002CFB"
                    />
                  </svg>
                )}
              </div>
            </button>
            <div
              ref={progressBarRef}
              className="w-full bg-gray-500 rounded-lg relative cursor-pointer ml-5"
              onClick={handleProgressClick}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsHovering(false)}
            >
              {isHovering && (
                <div className="absolute top-[-25px] left-[50%] transform -translate-x-1/2 text-black rounded">
                  {formatTime(hoverTime)}
                </div>
              )}
              <div className="h-1 bg-[#ADBFDF] rounded-lg absolute w-[164px] -top-[1px]"></div>
              <div
                className="h-1 bg-purple-600 rounded-lg absolute -top-[1px]"
                style={{
                  width: `${(currentTime / duration) * 100}%`,
                  zIndex: 1,
                }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-300 rounded-full absolute -top-[3px]"
                style={{
                  left: `${(currentTime / duration) * 100}%`,
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                }}
              ></div>
            </div>
            <a href={recordUrl} download="recording.mp3" className="ml-3">
              <svg
                width="13"
                height="16"
                className="fill-current text-[#ADBFDF] hover:text-purple-600 transition duration-300"
                viewBox="0 0 13 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 16H13V14.1176H0V16ZM13 5.64706H9.28571V0H3.71429V5.64706H0L6.5 12.2353L13 5.64706Z" />
              </svg>
            </a>
            <button onClick={handleClose} className="ml-3">
              <svg
                width="14"
                height="14"
                className="fill-current text-[#ADBFDF] hover:text-purple-600 transition duration-300"
                viewBox="0 0 14 14"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AudioPlayer;

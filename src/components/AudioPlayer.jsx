import React, { useState, useEffect } from "react";

const AudioPlayer = ({ recordBlob }) => {
  const [recordUrl, setRecordUrl] = useState("");

  useEffect(() => {
    if (recordBlob) {
      const url = URL.createObjectURL(recordBlob);
      setRecordUrl(url);

      // Функция очистки URL при размонтировании компонента
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [recordBlob]);

  return (
    <div>
      {recordUrl && (
        <audio controls>
          <source src={recordUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;

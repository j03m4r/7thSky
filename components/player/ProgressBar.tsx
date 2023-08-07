import { Ref } from "react";
import { TypeReference } from "typescript";

interface ProgressBarProps {
    progressBarRef: any;
    audioRef: any;
    timeProgress: number;
    duration: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    progressBarRef,
    audioRef,
    timeProgress,
    duration,
}) => {
    const handleProgressChange = () => {
        audioRef.current.currentTime = Number(progressBarRef.current.value);
    };

    const formatTime = (time: number) => {
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            const formatMinutes =
            minutes < 10 ? `0${minutes}` : `${minutes}`;
            const seconds = Math.floor(time % 60);
            const formatSeconds =
            seconds < 10 ? `0${seconds}` : `${seconds}`;
            return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };
    
    return (
        <div className="flex items-center w-full gap-x-3">
          <span className="text-blue-600 text-sm">{formatTime(timeProgress)}</span>
          <input
            type="range"
            ref={progressBarRef}
            defaultValue="0"
            onChange={handleProgressChange}
            className="h-2"
          />
          <span className="text-sm text-neutral-700">{formatTime(duration)}</span>
        </div>
    );
}

export default ProgressBar;
'use client';

import { Track } from "@/types";
import { BsPauseFill, BsPlayFill } from 'react-icons/bs';
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import PlayerItem from "../items/PlayerItem";

interface PlayerContentProps {
    track: Track;
    songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({
    track, songUrl
}) => {
    const { ids, activeId, setId, isPlaying: GLOBAL_isPlaying, setIsPlaying: GLOBAL_setIsPlaying } = usePlayer();
    const [volume, setVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const [timeProgress, setTimeProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // reference
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLInputElement>(null);
    const playAnimationRef = useRef<any>(null);

    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
        GLOBAL_setIsPlaying(!GLOBAL_isPlaying);
    };

    const onLoadedMetadata = () => {
        const seconds = audioRef.current?.duration || 0;
        setDuration(seconds);
        if (progressBarRef.current) {
            progressBarRef.current.max = String(seconds);
        }
    };

    const repeat = useCallback(() => {
        const currentTime = audioRef.current ? audioRef.current.currentTime : 0;
        setTimeProgress(currentTime);
        progressBarRef.current ? progressBarRef.current.value = String(currentTime) : null;
        progressBarRef.current? progressBarRef.current.style.setProperty(
          '--range-progress',
          `${(Number(progressBarRef.current.value) / duration) * 100}%`
        ) : null;
    
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [audioRef, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if (isPlaying) {
          audioRef.current?.play();
        } else {
          audioRef.current?.pause();
        }
        playAnimationRef.current = requestAnimationFrame(repeat);
    }, [isPlaying, audioRef, repeat]);

    useEffect(() => {
        setIsPlaying(true);
        GLOBAL_setIsPlaying(true);
    }, [track, GLOBAL_setIsPlaying])
    
    useEffect(() => {
        setIsPlaying(GLOBAL_isPlaying);
    }, [GLOBAL_isPlaying])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume, audioRef])

    const onPlayNext = () => {
        if (ids.length === 0) {
            return;
        }

        const currentIndex = ids.findIndex((id) => id === activeId);
        const nextTrack = ids[currentIndex + 1];

        if (!nextTrack) {
            return setId(ids[0]);
        }

        setId(nextTrack);
    };

    const onPlayPrevious = () => {
        if (ids.length === 0) {
            return;
        }

        const currentIndex = ids.findIndex((id) => id === activeId);
        const previousTrack = ids[currentIndex - 1];

        if (!previousTrack) {
            return setId(ids[0]);
        }

        setId(previousTrack);
    };

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(1);
        } else {
            setVolume(0);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 h-full">
            <div className="flex w-full justify-start">
                <div className="flex items-center">
                    <PlayerItem data={track} />
                </div>
                <audio src={songUrl} ref={audioRef} onLoadedMetadata={onLoadedMetadata} onEnded={onPlayNext} />
            </div>
            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <Icon size={30} onClick={togglePlayPause} className="text-black cursor-pointer" />
            </div>
            <div className="flex flex-col justify-center items-center my-1">
                <div className="h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-3">
                    <AiFillStepBackward onClick={onPlayPrevious} size={28} className="text-black cursor-pointer" />
                    <Icon size={36} onClick={togglePlayPause} className="text-black cursor-pointer" />
                    <AiFillStepForward onClick={onPlayNext} size={28} className="text-black cursor-pointer" />
                </div>
                <ProgressBar {...{ progressBarRef, audioRef, timeProgress, duration }} />
            </div>
            <div className="hidden md:flex w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[150px]">
                    <VolumeIcon onClick={toggleMute} className="cursor-pointer" size={30} />
                    <Slider value={volume} onChange={(value) => setVolume(value)} />
                </div>
            </div>
        </div>
    );
}

export default PlayerContent;
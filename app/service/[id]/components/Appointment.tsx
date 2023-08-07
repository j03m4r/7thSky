'use client';

import Avatar from "@/components/Avatars/Avatar";
import useLoadAvatar from "@/hooks/useLoadAvatar";
import { AvailableDate } from "@/types";
import { twMerge } from "tailwind-merge";

interface AppointmentProps {
    data: AvailableDate;
    onSelect: (id: number) => void;
    selected: boolean;
};

const formatTime = (date: Date) => {
    let time = '';
    let aOrP = 'AM';

    let hour = date.getHours() - 5;
    if (hour > 13) {
        hour -= 12;
        aOrP = 'PM';
    }

    let minutes = date.getMinutes();
    let minutesString = minutes.toString();
    if (minutes === 0) {
        minutesString += '0'
    }
    
    time += `${hour.toString()}:${minutesString} ${aOrP}`;

    return time;
};

const Appointment: React.FC<AppointmentProps> = ({ data, onSelect, selected }) => {
    const startTimestamp = new Date(data.start_time);
    const endTimestamp = new Date(data.end_time);

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div onClick={() => onSelect(data.id)} className={twMerge(`p-5 shadow-md hover:shadow-lg flex transition justify-between 
        items-center cursor-pointer hover:bg-blue-50`, selected&&'bg-blue-50 shadow-lg hover:shadow-md')}>
            <div className="flex gap-x-5 justify-between items-center">
                <div className="hidden md:block">
                    <Avatar size={100} src={data.users.avatar_url?.indexOf('avatar')===0 ? useLoadAvatar(data.users.avatar_url) : data.users.avatar_url} />
                </div>
                <div className="text-xl md:text-4xl font-medium">{data.users.full_name}</div>
            </div>
            <div className="flex gap-x-2 items-center text-lg md:text-2xl font-medium">
                <div>{formatTime(startTimestamp)}</div>
                <div>to</div>
                <div>{formatTime(endTimestamp)}</div>
            </div>
            <div className="flex gap-x-5 items-center text-lg md:text-2xl font-medium">
                <div>{months[startTimestamp.getMonth()]}</div>
                <div>{startTimestamp.getDate()}</div>
                <div>{startTimestamp.getFullYear()}</div>
            </div>
        </div>
    );
};

export default Appointment;
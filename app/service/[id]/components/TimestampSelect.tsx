'use client';

import { useEffect, useState } from "react";
import Select from "./Select";
import { Time } from "@/types";
import { twMerge } from "tailwind-merge";
import { IoMdClose } from "react-icons/io";
import { toast } from "react-hot-toast";

interface TimestampSelectProps {
    handleStartTimestampSet: (timestamp: string) => void;
    handleEndTimestampSet: (timestamp: string) => void;
    isLoading: boolean;
};

const TimestampSelect: React.FC<TimestampSelectProps> = ({ handleStartTimestampSet, handleEndTimestampSet, isLoading }) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = [[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]];
    const years = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const availableTimes: Time[] = [{hour: 8, minute: 0}, {hour: 8, minute: 15}, {hour: 8, minute: 30}, {hour: 8, minute: 45},
        {hour: 9, minute: 0}, {hour: 9, minute: 15}, {hour: 9, minute: 30}, {hour: 9, minute: 45},
        {hour: 10, minute: 0}, {hour: 10, minute: 15}, {hour: 10, minute: 30}, {hour: 10, minute: 45},
        {hour: 11, minute: 0}, {hour: 11, minute: 15}, {hour: 11, minute: 30}, {hour: 11, minute: 45},
        {hour: 12, minute: 0}, {hour: 12, minute: 15}, {hour: 12, minute: 30}, {hour: 12, minute: 45},
        {hour: 13, minute: 0}, {hour: 13, minute: 15}, {hour: 13, minute: 30}, {hour: 13, minute: 45},
        {hour: 14, minute: 0}, {hour: 14, minute: 15}, {hour: 14, minute: 30}, {hour: 14, minute: 45},
        {hour: 15, minute: 0}, {hour: 15, minute: 15}, {hour: 15, minute: 30}, {hour: 15, minute: 45},
        {hour: 16, minute: 0}, {hour: 16, minute: 15}, {hour: 16, minute: 30}, {hour: 16, minute: 45},
        {hour: 17, minute: 0}, {hour: 17, minute: 15}, {hour: 17, minute: 30}, {hour: 17, minute: 45},
        {hour: 18, minute: 0}, {hour: 18, minute: 15}, {hour: 18, minute: 30}, {hour: 18, minute: 45},
        {hour: 19, minute: 0}, {hour: 19, minute: 15}, {hour: 19, minute: 30}, {hour: 19, minute: 45},]

    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [month, setMonth] = useState<string>(months[new Date().getMonth()]);
    const [day, setDay] = useState<number>(new Date().getDate());
    const [startTime, setStartTime] = useState<Time>({hour: 0, minute: 0});
    const [endTime, setEndTime] = useState<Time>({hour: 23, minute: 59});

    useEffect(() => {
        const startTimestamp = new Date(year, months.indexOf(month), day, startTime.hour, startTime.minute);
        const endTimestamp = new Date(year, months.indexOf(month), day, endTime.hour, endTime.minute);

        console.log('start time', startTimestamp);
        console.log('start time ISO', startTimestamp.toISOString())
        console.log('end time', endTimestamp);

        handleStartTimestampSet(startTimestamp.toISOString());
        handleEndTimestampSet(endTimestamp.toISOString());
    }, [year, day, month, startTime, endTime, handleEndTimestampSet, handleStartTimestampSet]);

    return (
        <div className="flex flex-col gap-y-10 justify-center items-center">
            <div className="grid grid-cols-3 w-full gap-x-10">
                <Select options={months} defaultValue={month} onSelect={(value: any) => !isLoading ? (year*10000+months.indexOf(value)*100+day)>=(new Date().getFullYear()*10000+new Date().getMonth()*100+new Date().getDate()) ? setMonth(value) : toast.error('Please set a valid date') : null} />
                <Select options={days[months.indexOf(month)]} defaultValue={day} onSelect={(value: any) => !isLoading ? (year*10000+months.indexOf(month)*100+value)>=(new Date().getFullYear()*10000+new Date().getMonth()*100+new Date().getDate()) ? setDay(value) : toast.error('Please set a valid date') : null} />
                <Select options={years} defaultValue={year} onSelect={(value: any) => !isLoading ? (value*10000+months.indexOf(month)*100+day)>=(new Date().getFullYear()*10000+new Date().getMonth()*100+new Date().getDate()) ? setYear(value) : toast.error('please set a valid date') : null} />
            </div>
            <div className="grid grid-cols-2 w-full gap-x-10 gap-y-4">
                <div className="text-2xl">Start Time</div>
                <div className="text-2xl">End Time</div>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {availableTimes.map((item, index) => (
                        <div key={index} onClick={() => (item.hour===startTime.hour&&item.minute===startTime.minute&&!isLoading) ? setStartTime({hour: 0, minute: 0}) : (item.hour*100+item.minute<endTime.hour*100+endTime.minute)&&!isLoading ? setStartTime(item) : {}} 
                        className={twMerge(`group flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full cursor-pointer 
                        justify-center items-center text-sm text-center hover:bg-blue-600 hover:text-white transition`, 
                        (item.hour===startTime.hour&&item.minute===startTime.minute)&&`bg-blue-600 text-white hover:bg-white hover:text-black`,
                        (item.hour*100+item.minute>=endTime.hour*100+endTime.minute)&&'opacity-40 cursor-not-allowed')}>
                            {`${item.hour>12 ? item.hour-12 : item.hour}:${item.minute===0 ? '00': item.minute}`}
                            {(item.hour===startTime.hour&&item.minute===startTime.minute)&&(
                                <IoMdClose />
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                    {availableTimes.map((item, index) => (
                        <div key={index} onClick={() => (item.hour===endTime.hour&&item.minute===endTime.minute&&!isLoading) ? setEndTime({hour: 999, minute: 999}) : (item.hour*100+item.minute>startTime.hour*100+startTime.minute)&&!isLoading ? setEndTime(item) : {}} 
                        className={twMerge(`group flex gap-x-2 px-2 py-1 border border-neutral-300 rounded-full cursor-pointer 
                        justify-center items-center text-sm text-center hover:bg-blue-600 hover:text-white transition`,
                        (item.hour===endTime.hour&&item.minute===endTime.minute)&&`bg-blue-600 text-white hover:bg-white hover:text-black`,
                        (item.hour*100+item.minute<=startTime.hour*100+startTime.minute)&&'opacity-40 cursor-not-allowed')}>
                            {`${item.hour>12 ? item.hour-12 : item.hour}:${item.minute===0 ? '00': item.minute}`}
                            {(item.hour===endTime?.hour&&item.minute===endTime.minute)&&(
                                <IoMdClose />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TimestampSelect;
'use client';

import usePlayer from "@/hooks/usePlayer";
import { useUser } from "@/hooks/useUser";
import { AvailableDate, Service } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import TimestampSelect from "./TimestampSelect";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Appointment from "./Appointment";
import { BsFillBookmarkFill, BsFillBookmarkPlusFill } from "react-icons/bs";
import useAuthModal from "@/hooks/useAuthModal";
import { toast } from "react-hot-toast";

interface PageContentProps {
    service: Service;
    availableDates: AvailableDate[];
};

export const revalidate = 0;

const formatTime = (date: Date) => {
    let time = '';
    let aOrP = 'AM';

    let hour = date.getHours();
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

const PageContent: React.FC<PageContentProps> = ({ service, availableDates }) => {
    const player = usePlayer();
    const { user, userDetails } = useUser();
    const authModal = useAuthModal();

    const [isLoading, setIsLoading] = useState(false);
    const [filteredDates, setFilteredDates] = useState<AvailableDate[]>(availableDates);
    const [selectedAppointment, setSelectedAppointment] = useState<number>();
    const [seeAll, setSeeAll] = useState(false);

    const defaultStart = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0).toISOString();
    const defaultEnd = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59).toISOString();
    const { supabaseClient: supabase } = useSessionContext();

    if (!service) {
        return (
            <div className="pt-28 flex flex-col h-full justify-center items-center">
                <div className="font-semibold">Uh oh. No Service!</div>
                <Link href='/services' className="text-blue-600 hover:text-blue-500">Explore Services</Link>
            </div>
        );
    }

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm<FieldValues>({
        defaultValues: {
            customer_id: '',
            producer_id: '',
            start_time: new Date().toISOString(),
            end_time: new Date().toISOString() + 1,
        }
    });

    const start_time = watch('start_time');
    const end_time = watch('end_time');

    useEffect(() => {
        const getAvailableDatesInRange = async () => {
            const { data, error } = await supabase.from('available_dates')
            .select('id, service_id, users!available_dates_user_id_fkey(id, full_name, avatar_url), start_time, end_time').eq('service_id', service.id)
            .is('customer_id', null).gte('start_time', start_time).lte('end_time', end_time)
            .order('start_time', { ascending: true });

            if (error) console.log(error);
            // @ts-ignore
            if (data) { setFilteredDates(data) }
        };

        getAvailableDatesInRange();
    }, [start_time, end_time]);

    const scrollIntoTheView = (id: string) => {
        let element = document.getElementById(id) as HTMLElement;
        if (!element) return;
    
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });
    };

    const handleBooking = async () => {
        if (!user || !userDetails) { return authModal.onOpen(); }

        setIsLoading(true);

        const { error } = await supabase.from('available_dates').update({ customer_id: user.id }).eq('id', selectedAppointment);

        if (error) console.log(error)
        else toast.success('Successfully booked! Check email for confirmation'), setIsLoading(false)

        setSelectedAppointment(undefined);
    };

    const handleAppointmentCreation = async () => {
        if (!user || !userDetails) { return authModal.onOpen(); }

        setIsLoading(true);

        const { error } = await supabase.from('available_dates')
        .insert({ service_id: service.id, user_id: user.id, start_time: start_time, end_time: end_time  });

        if (error) console.log(error)
        else toast.success('Appointment successfully created!'), setIsLoading(false)
    };

    return (
        <div className={twMerge(`pt-24 pb-4 flex flex-col gap-y-[12vh]`, player.ids.length>0 && 'pb-28')}>
            <div className="flex flex-col gap-y-20">
                <div className="font-semibold text-7xl">{service.title}</div>
                <div className="flex flex-col gap-y-10">
                    <div className="text-3xl text-neutral-600 flex items-center justify-between">First... Choose a date and time<div onClick={() => { setFilteredDates(availableDates), setSeeAll(true) }} className="rounded-full cursor-pointer text-sm border border-transparent hover:border-blue-600 p-2 text-blue-600">See all available appointments</div></div>
                    <TimestampSelect isLoading={isLoading} handleStartTimestampSet={(timestamp: string) => setValue('start_time', timestamp, { 
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true
                    })} handleEndTimestampSet={(timestamp: string) => setValue('end_time', timestamp, { 
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true})} />
                </div>
                {((start_time!==defaultStart&&end_time!==defaultEnd)||seeAll)&&(
                    <div onClick={() => scrollIntoTheView('specific-service-option-select')} 
                    className="text-xl p-2 border-b-2 transition cursor-pointer text-center w-fit 
                    rounded-full hover:bg-neutral-50">
                        <AiOutlineArrowDown size={30} />
                    </div>
                )}
            </div>
            {((start_time!==defaultStart&&end_time!==defaultEnd)||(seeAll))&&(
                <div className="flex flex-col gap-y-10 w-full pb-10" id="specific-service-option-select">
                    {filteredDates.length ? (
                        <>
                            <div className="text-3xl text-neutral-600">Now... Choose a team member and available appointment</div>
                            <div className="flex flex-col gap-y-2">
                                {filteredDates.map((appointment) => (
                                    <Appointment key={appointment.id} data={appointment} onSelect={(id: number) => !isLoading ? selectedAppointment===appointment.id ? setSelectedAppointment(undefined) : setSelectedAppointment(id) : null} selected={selectedAppointment===appointment.id}/>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-3xl flex items-center justify-between">No available appointments at this time :(<div onClick={() => setFilteredDates(availableDates)} className="rounded-full cursor-pointer text-sm border border-transparent hover:border-blue-600 p-2 text-blue-600">See all available appointments</div></div>
                    )}
                </div>
            )}
            {selectedAppointment&&!userDetails?.is_admin&&(
                <div onClick={() => !isLoading ? handleBooking() : null} className={twMerge(`rounded-full flex justify-center items-center p-10 fixed bottom-10 right-10 z-50 bg-blue-600 hover:bg-blue-500 cursor-pointer`, isLoading&&'cursor-not-allowed opacity-40')}>
                    <BsFillBookmarkFill size={40} className="text-white"/>
                </div>
            )}
            {userDetails?.is_admin&&(start_time!==defaultStart&&end_time!==defaultEnd)&&(
                <div onClick={() => !isLoading ? handleAppointmentCreation() : null} className={twMerge(`rounded-full flex justify-center items-center p-10 fixed bottom-10 left-10 z-50 bg-blue-600 hover:bg-blue-500 cursor-pointer`, isLoading&&'cursor-not-allowed opacity-40')}>
                    <BsFillBookmarkPlusFill size={40} className="text-white"/>
                </div>
            )}
        </div>
    );
};

export default PageContent;

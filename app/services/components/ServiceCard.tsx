'use client';

import { Service } from "@/types";
import { useRouter } from "next/navigation";
import { IoIosArrowForward } from 'react-icons/io'

interface ServiceCardProps {
    data: Service;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ data }) => {
    const router = useRouter();

    return (
        <div onClick={() => router.push(`/service/${data.id}`)} className="group flex flex-col w-[400px] h-[400px] justify-center gap-y-10 py-10 px-15
        items-center shadow-md hover:-translate-y-1 transition cursor-pointer hover:shadow-lg">
            <div className="font-semibold text-3xl max-w-[300px]">
                {data.title}
            </div>
            <div className="border-t border-neutral-400 max-w-[150px] w-full"></div>
            <div className="text-xl flex group-hover:border-b pb-2">
                ${data.price} <div className="text-neutral-400 mx-2">/ hour</div>
                <IoIosArrowForward size={22} className="relative opacity-0 transition -bottom-1
                group-hover:opacity-100 duration-300 hover:text-neutral-400"/>
            </div>
        </div>
    );
}

export default ServiceCard;
'use client'

import { AiOutlineMenu } from 'react-icons/ai'
import Avatar from '../Avatars/Avatar';
import { useCallback, useEffect, useState } from 'react';
import useAuthModal from '@/hooks/useAuthModal';
import MenuItem from './MenuItem';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUser } from '@/hooks/useUser';
import { twMerge } from 'tailwind-merge';
import useUploadModal from '@/hooks/useUploadModal';
import useUpdateProfileModal from '@/hooks/useUpdateProfileModal';
import useLoadAvatar from '@/hooks/useLoadAvatar';

const UserMenu = () => {
    const { user, userDetails } = useUser();
    const authModal = useAuthModal();
    const [isOpen, setIsOpen] = useState(false);
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const uploadModal = useUploadModal();
    const updateProfileModal = useUpdateProfileModal();
    const avatar_url = useLoadAvatar(userDetails?.avatar_url || '');

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        toggleOpen();
        router.refresh();
    
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Successfully logged out')
        }
    };

    const handleAuthOpen = () => {
        authModal.onOpen();
    };

    return (
        <div className="relative">
            {user ? (
                <div onClick={toggleOpen} className='group p-4 md:py-1 md:px-2 flex flex-row items-center
                gap-3 rounded-full hover:shadow-md transition cursor-pointer'>
                    <AiOutlineMenu className={twMerge(`md:group-hover:translate-x-0.5 ease-linear duration-150`, isOpen ? 'md:translate-x-0.5' : 'translate-x-0')}/>
                    <div className={twMerge(`hidden md:block group-hover:-translate-x-0.5 transition ease-linear duration-150`, isOpen ? '-translate-x-0.5' : 'translate-x-0')}>
                        <Avatar src={avatar_url} />
                    </div>
                </div>
            ) : (
                <div className="flex flex-row items-center gap-2">
                    <div onClick={handleAuthOpen} className="font-semibold py-3 px-4 rounded-full border border-transparent hover:border-neutral-100 
                    hover:shadow-md transition cursor-pointer">
                        Sign Up
                    </div>
                    <div onClick={handleAuthOpen} className="font-semibold py-3 px-4 rounded-full border border-neutral-300
                    hover:border-neutral-100 hover:shadow-md transition cursor-pointer">
                        Log In
                    </div>
                </div>
            )}
            {isOpen && (
                <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[10vw] bg-white overflow-hidden right-0 top-12 text-sm'>
                    <div className='flex flex-col cursor-pointer'>
                        <>
                        <div className="md:hidden">
                            <MenuItem onClick={() => { toggleOpen(), router.push('/tracks') }} label='Explore Tracks'/>
                            <MenuItem onClick={() => { toggleOpen(), router.push('/services') }} label='Services'/>
                            <MenuItem onClick={() => { toggleOpen(), router.push('/creators') }} label='Creators'/>
                        </div>
                        <hr className='md:hidden'/>
                        <MenuItem onClick={() => { toggleOpen(), router.push(`/profile/${user?.id}`) }} label='Profile'/>
                        <MenuItem onClick={() => { toggleOpen(), router.push('/favorites') }} label='Favorited Tracks'/>
                        {userDetails?.is_admin && (<MenuItem onClick={() => { toggleOpen(), uploadModal.onOpen()}} label='Upload Track'/>)}
                        <hr />
                        <MenuItem onClick={() => { toggleOpen(), updateProfileModal.onOpen() }} label='Update Profile'/>
                        <hr />
                        <MenuItem onClick={handleLogout} label='Logout'/>
                        </>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
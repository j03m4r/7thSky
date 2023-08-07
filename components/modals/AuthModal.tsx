'use client';

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import Modal from "./Modal";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const { user } = useUser();
    const { onClose, isOpen } = useAuthModal();

    const setUserFullName = async () => {
        if (session?.user.id!==undefined) {
            const { data, error: error0 } = await supabaseClient.from('users').select('full_name').eq('id', session.user.id);
            if (data) {
                // @ts-ignore
                if (data[0].full_name===null) {
                    const { error: error1 } = await supabaseClient
                    .from('users')
                    .update({ full_name: session?.user.id })
                    .eq('id', session?.user.id);
    
                    if (error1) {
                        toast.error(error1.message);
                    }
                    router.refresh();
                } else if (error0) {
                    toast.error(error0);
                }
            }
        }
    };

    useEffect(() => {
        if (session) {
            router.refresh();
            setUserFullName();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    }
    
    return (
        <Modal title="Welcome back" description="Login to your account" isOpen={isOpen} onChange={onChange}>
            <Auth supabaseClient={supabaseClient} magicLink providers={['google', 'spotify', 'discord']} appearance={{
                theme: ThemeSupa,
                variables: {
                    default: {
                        colors: {
                            brand: '#2563eb',
                            brandAccent: '#3b82f6'
                        },
                    }
                },
                className: {
                    input: 'my-1'
                }
            }}/>
        </Modal>
    );
}

export default AuthModal;
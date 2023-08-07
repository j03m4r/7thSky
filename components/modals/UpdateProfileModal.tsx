'use client';

import Modal from "./Modal";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { toast } from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useUpdateProfileModal from "@/hooks/useUpdateProfileModal";
import { useRouter } from "next/navigation";
import uniqid from 'uniqid';
import Button from "../buttons/Button";
import Input from "../inputs/Input";

const UpdateProfileModal = () => {
    const updateProfileModal = useUpdateProfileModal();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { user, isLoading, userDetails } = useUser();

    const onChange = (open: boolean) => {
        if (!open) {
            updateProfileModal.onClose();
        }
    };

    const {
        register,
        handleSubmit,
        reset,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            image: null,
            username: '',
        }
    });

    const image = watch('image');
    const username = watch('username');

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            console.log('started submit')
            setLoading(true);

            let updateObject: any = {};
            const imageFile = values.image?.[0];

            if (!user) {
                toast.error('Not logged in');
                return;
            }

            if (imageFile) {
                console.log('is image file')
                const uniqueID = uniqid();

                // UPLOAD IMAGE
                const {
                    data: imageData,
                    error: imageError
                } = await supabaseClient.storage.from('images').upload(`avatar-${values.username}-${uniqueID}`, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });

                if (imageError) {
                    setLoading(false);
                    return toast.error('Failed image upload.');
                }

                if (imageData) {
                    updateObject.avatar_url = imageData.path
                }
            }

            if (values.username!=='') { console.log('is new username'), updateObject.full_name = values.username}

            if (Object.keys(updateObject).length) {
                console.log('updating user');

                // UPDATING USER
                const {
                    error: supabaseError
                } =  await supabaseClient.from('users')
                .update(updateObject)
                .eq('id', user.id);

                if (supabaseError) {
                    setLoading(false);
                    return toast.error(supabaseError.message);
                } else {
                    toast.success('Profile updated!');
                }
            }

            router.refresh();
            setLoading(false);
            reset();
            updateProfileModal.onClose();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    let content = (
        <div className="flex gap-y-4 flex-col">
            <Input id="title" disabled={isLoading} value={username || ""} {...register('username', { required: false })} placeholder="Username" />
            <Input type="file" accept="image/*" className="p-20 hover:bg-neutral-100 transition cursor-pointer border-transparent shadow-md" 
            {...register('image', { required: false })} />
        </div>
    );

    let footer = (
        <div className="flex flex-col gap-y-6 mt-6">
            <hr />
            <Button disabled={ isLoading || (!image && !username) } onClick={handleSubmit(onSubmit)} className="rounded-md">
                Update Profile
            </Button>
        </div>
    );

    return (
        <Modal title="Update Profile" description="Change the appearance of your profile" isOpen={updateProfileModal.isOpen} onChange={onChange}>
            {content}
            {footer}
        </Modal>
    );
};

export default UpdateProfileModal;
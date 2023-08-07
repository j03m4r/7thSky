'use client';

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "../inputs/Input";
import Button from "../buttons/Button";
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from 'uniqid';
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { Genre, Key } from "@/types";
import SingleGenreSelection from "../inputs/SingleGenreSelection";
import { twMerge } from "tailwind-merge";

interface UploadModalProps {
    allGenres: Genre[];
    keys: Key[];
};

enum STEPS {
    FILES = 0,
    DESCRIPTION = 1,
    GENRES = 2,
    PREVIEW = 3
}

const UploadModal: React.FC<UploadModalProps> = ({
    allGenres, keys
}) => {
    const uploadModal = useUploadModal();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(STEPS.FILES);
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue
    } = useForm<FieldValues>({
        defaultValues: {
            author: '',
            title: '',
            track: null,
            image: null,
            bpm: 1,
            key: 1,
            genres: []
        }
    });

    const track = watch('track');
    const image = watch('image');
    const title = watch('title');
    const bpm = watch('bpm');
    const key = watch('key');
    const genres = watch('genres');

    const setGenres = (id: string) => {
        let localGenres = [];
        if (genres.includes(id)) {
            localGenres = genres.filter(function (genre: string) { return genre !== id});
        } else {
            localGenres = [...genres, id];
        }
        setValue('genres', localGenres, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const handleKeySelection = (id: string) => {
        setValue('key', id, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    };

    const onBack = () => {
        setStep((value) => value - 1);
    };

    const onNext = () => {
        setStep((value) => value + 1);
    };

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            uploadModal.onClose();
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const trackFile = values.track?.[0];

            if (!imageFile || !trackFile || !user) {
                toast.error('Missing fields');
                return;
            }

            const uniqueID = uniqid();

            // UPLOAD SONG
            const {
                data: trackData,
                error: trackError
            } = await supabaseClient.storage.from('tracks').upload(`track-${values.title}-${uniqueID}`, trackFile, {
                cacheControl: '3600',
                upsert: false
            });

            if (trackError) {
                setIsLoading(false);
                return toast.error('Failed song upload.');
            }

            // UPLOAD IMAGE
            const {
                data: imageData,
                error: imageError
            } = await supabaseClient.storage.from('images').upload(`image-${values.title}-${uniqueID}`, imageFile, {
                cacheControl: '3600',
                upsert: false
            });

            if (imageError) {
                setIsLoading(false);
                return toast.error('Failed image upload.');
            }

            const {
                error: supabaseError
            } =  await supabaseClient.from('tracks')
            .insert({user_id: user.id, title: values.title, author: user.email, image_path: imageData.path, track_path: trackData.path,
            key: Number(key), bpm: Number(bpm)});

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            const { data, error } = await supabaseClient.from('tracks').select('*').eq('title', values.title).single();

            if (error) {
                setIsLoading(false);
                return toast.error('Genre linking failed');
            }

            for (let i = 0; i < genres.length; i++) {
                const { error: error1 } = await supabaseClient.from('genre_tracks').insert({track_id: data.id, genre_id: genres[i]});

                if (error1) {
                    toast.error(error1.message);
                }
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Song created!');
            reset();
            setStep(STEPS.FILES);
            uploadModal.onClose();
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    let modalLabel = "Upload track files"

    let bodyContent = (
        <div className="flex flex-col justify-center gap-y-4">
            <div>
                <div className="pb-4 text-xl font-semibold">
                    Audio file
                </div>
                <Input type="file" accept="audio/*" className="p-20 hover:-translate-y-1 hover:shadow-md hover:bg-neutral-100 transition cursor-pointer border-transparent rounded-none" {...register('track', { required: true })} />
            </div>
            <div>
                <div className="pb-4 text-xl font-semibold">
                    Cover image
                </div>
                <Input type="file" accept="image/*" className="p-20 hover:-translate-y-1 hover:shadow-md hover:bg-neutral-100 transition cursor-pointer border-transparent rounded-none" {...register('image', { required: true })} />
            </div>
        </div>
    );

    let footerContent = (
        <div className="flex flex-row gap-x-2 w-full items-center mt-4">
            {step !== STEPS.FILES ? (
                <Button disabled={isLoading} onClick={onBack} className="border-blue-600 bg-white rounded-md text-black hover:text-opacity-80">
                    Back
                </Button>
            ) : null}
            {step !== STEPS.PREVIEW ? (
                <Button disabled={isLoading} onClick={onNext} className="rounded-md">Continue</Button>
            ) : (
                <Button disabled={isLoading || !image || !track || !title || !bpm || !key || !genres} onClick={handleSubmit(onSubmit)} className="rounded-md">Create</Button>
            )}
        </div>
    );

    if (step === STEPS.DESCRIPTION) {
        modalLabel = "Describe the track";
        bodyContent = (
            <div className="flex flex-col gap-y-4">
                <Input id="title" disabled={isLoading} value={title || ""} {...register('title', { required: true })} placeholder="Track title" />
                <div className="flex flex-row w-full px-1 items-center">
                    <div className="flex flex-col w-1/4">
                        <div className="font-medium">
                            BPM
                        </div>
                        <div className="font-light text-gray-600">
                            Track bpm
                        </div>
                    </div>
                    <Input id="bpm" disabled={isLoading} value={bpm} {...register('bpm', { required: true })} placeholder="123" />
                </div>
                <div className="flex flex-row gap-x-1 w-full overflow-x-auto">
                    {keys.map((localKey) => (
                        <div key={localKey.id} onClick={() => handleKeySelection(localKey.id)} className={twMerge(`flex justify-center items-center hover:-translate-y-1 hover:shadow-md 
                        hover:bg-neutral-100 p-4 transition cursor-pointer`, localKey.id===key&&'shadow-md bg-neutral-100 hover:-translate-y-1')}>
                            {localKey.title}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    if (step === STEPS.GENRES) {
        modalLabel = "Which genres apply to the track?";
        bodyContent = (
            <div className="grid grid-cols-2 gap-2">
                {allGenres.map((genre) => (
                    <SingleGenreSelection key={genre.title} data={genre} onClick={(id: string) => setGenres(id)} selected={genres.includes(genre.id)} />
                ))}
            </div>
        );
    }

    if (step === STEPS.PREVIEW) {
        modalLabel = "Preview";
        if (!image || !track || !title || !bpm || !key || !genres) {
            bodyContent = (
                <div className="flex justify-center items-center w-full-h-full font-semibold text-2xl p-20">
                    Missing Fields
                </div>
            )
        } else if (isNaN(bpm)) {
            bodyContent = (
                <div className="flex justify-center items-center w-full-h-full font-semibold text-2xl p-20">
                    BPM is not a number
                </div>
            )
        } else {
            bodyContent = (
                <div className="grid grid-cols-2 gap-y-4 justify-center">
                    <div className="col-span-2 flex flex-col gap-y-2 items-start justify-center">
                        {/* <div className="font-bold text-2xl">Files</div> */}
                        <div className="border border-neutral-200 py-10 px-2 w-full text-center">
                            {track?.[0].name}
                        </div>
                        <div className="border border-neutral-200 py-10 px-2 w-full text-center">
                            {image?.[0].name}
                        </div>
                    </div>
                    <hr className="col-span-2" />
                    <div className="flex justify-center items-center p-16 text-2xl font-bold">
                        Description
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                        <div className="col-span-2 flex justify-center items-center border border-neutral-200 font-semibold">{title}</div>
                        <div className="flex justify-center items-center border-neutral-200 border font-medium">{keys.find((localKey) => localKey.id===key)?.title}</div>
                        <div className="flex justify-center items-center border-neutral-200 border font-medium">
                            {bpm}
                            <div className="font-light ml-1">bpm</div>
                        </div>
                    </div>
                    <hr className="col-span-2" />
                    <div className="flex justify-center items center p-4 text-2xl font-bold col-span-2">Genres</div>
                    <div className="col-span-2 grid grid-cols-2 gap-1">
                        {allGenres.filter(function (genre: Genre) { return genres.includes(genre.id)}).map((genre) => (
                            <div key={genre.id} className="flex flex-row justify-center items-center w-full p-4 font-light border border-neutral-200">
                                {genre.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }

    return (
        <div>
            <Modal title="Add a track" description={modalLabel} isOpen={uploadModal.isOpen} onChange={onChange}>
                {/* Feels kind of like a hacky solution but things were getting really cramped on the preview step */}
                <div className="max-h-[65vh] overflow-y-auto">
                    {bodyContent}
                </div>
                {footerContent}
            </Modal>
        </div>
    );
}

export default UploadModal;
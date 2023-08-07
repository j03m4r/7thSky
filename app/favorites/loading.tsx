'use client';

import { BounceLoader } from 'react-spinners';

const Loading = () => {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <BounceLoader color="#2563eb" size={35} />
        </div>
    );
};

export default Loading;
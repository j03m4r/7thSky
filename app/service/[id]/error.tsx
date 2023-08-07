'use client';

const error = () => {
    return (
        <div className="flex h-full w-full justify-center items-center">
            <div className="flex justify-center items-center w-1/2 h-1/2 shadow-md">
                <div className="font-semibold text-2xl">Something went wrong.</div>
            </div>
        </div>
    );
}

export default error;
import React from 'react';

const Skeleton = () => {
    return (
        <div className="bg-[linear-gradient(135deg,_#0b0b1a_47%,_#a855f7_50%,_#0b0b1a_53%)] h-screen pt-28 px-4 md:px-16">
            <div className="bg-black/30 animate-pulse backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 md:p-12 w-full max-w-4xl mx-auto shadow-xl flex flex-col items-center gap-10">
                <h1 className="text-white text-3xl md:text-4xl font-bold text-center bg-gray-700 h-8 w-2/3 rounded-md"></h1>

                <div className="w-full flex flex-col gap-6">

                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
                        <div className="flex-1">
                            <div className="text-white h-5 w-32 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                        </div>
                        <div className="flex-1">
                            <div className="text-white h-5 w-32 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
                        <div className="flex-1">
                            <div className="text-white h-5 w-24 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                        </div>
                        <div className="flex-1">
                            <div className="text-white h-5 w-24 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
                        <div className="flex-1">
                            <div className="text-white h-5 w-28 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                        </div>
                        <div className="flex-1">
                            <div className="text-white h-5 w-28 bg-gray-700 rounded-md mb-2"></div>
                            <div className="w-full h-24 bg-gray-700 rounded-xl"></div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <div className="text-white h-5 w-28 bg-gray-700 rounded-md"></div>
                        <div className="w-14 h-8 bg-gray-700 rounded-full"></div>
                    </div>

                    <div className="mt-4 text-sm h-5 bg-gray-700 rounded-md w-2/3"></div>

                    <div className="w-full mt-4">
                        <div className="w-full h-12 bg-gray-700 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;

import React, { useState, useEffect, use } from "react";
import Image from "next/image";

//INTERNAL IMPORT
import images from "../Images/index";

export default ({
  openProfile,
  setOpenProfile,
  currentUser,
  getShipmentsCount,
}) => {
  const [count, setCount] = useState();
  useEffect(() => {
    const getShipmentData = getShipmentsCount();

    return async () => {
      const allData = await getShipmentData;
      setCount(allData);
    };
  }, []);
  return openProfile ? (
    <div className="fixed inset-0 z-0 overflow-y-auto">
    <div className="fixed inset-0 w-full h-full bg-black opacity-40"
    onClick={() => setOpenProfile(false)}></div>
    <div className="flex items-center min-h-screen px-4 py-8">
        <div className="relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg">
            <div className="flex justify-end">
                <button
                   className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
                   onClick={() => setOpenProfile(false)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 mx-auto"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
                <div className="flex flex-col items-center justify-center pb-10">
                    <Image
                      className="w-20 h-20 mb-4 justify-center rounded-full shadow-lg"
                      src={images.avatar}
                      alt="User"
                    />
                    <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                      Welcome Trader
                    </h5>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {currentUser}
                    </span>
                    <div class="flex mt-4 gap-3">
                      <a href="#" 
                         class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-black rounded-lg border-2 hover:bg-gray-100 transition">
                         Balance: 345 ETH
                      </a>
                      <a href="#" 
                         class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-black rounded-lg border-2 hover:bg-gray-100 transition">
                        Total Shipments: {count}
                      </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  ) : (
    ""
  )
}
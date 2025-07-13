/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FiShare2 } from "react-icons/fi";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GobalApi";




function InfoSection({ trip }) {

  const [photoUrl,setPhotoUrl] = useState();

  useEffect(()=>{
    trip&&GetPlacephotos();
  },[trip])

  const GetPlacephotos=async()=>{
    const data={
    textQuery:trip?.userSelection?.location?.label
  }
    const result = await GetPlaceDetails(data).then(resp=>{
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
      setPhotoUrl(PhotoUrl);
    })
  }

  const location =
    trip?.userSelection?.location?.label || "Unknown Destination";
  const noOfDays = trip?.userSelection?.noOfDays || "N/A";
  const budget = trip?.userSelection?.budget || "N/A";
  const travellers = trip?.userSelection?.traveller || "N/A";

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mt-5">
      <img
        src={photoUrl}
        className="h-[340px] w-full object-cover rounded-xl"
        alt="Trip Location"
      />

      <div className="my-5 flex flex-col gap-4">
        <h2 className="font-black text-2xl text-gray-800">🌍 {location}</h2>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div className="flex flex-wrap gap-3">
            <span className="text-sm p-2 px-4 bg-blue-100 text-blue-600 rounded-full shadow-sm">
              📅 {noOfDays} Day{noOfDays > 1 ? "s" : ""}
            </span>
            <span className="text-sm p-2 px-4 bg-green-100 text-green-600 rounded-full shadow-sm">
              💸 {budget}
            </span>
            <span className="text-sm p-2 px-4 bg-purple-100 text-purple-600 rounded-full shadow-sm">
              🧍 {travellers}
            </span>
          </div>

          <Button className="bg-black text-white hover:bg-neutral-900 flex items-center gap-2 px-4 py-2 rounded-md">
            <FiShare2 />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;

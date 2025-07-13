/* eslint-disable no-unused-vars */
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';

function UserTripCardItem({ trip }) {

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

  return (
    <Link to={'/view-trip/'+trip?.id}>
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-blue-400 group cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={photoUrl?photoUrl:"/placeholder.jpg"} 
          alt="Trip" 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-1 text-gray-700 transition-colors duration-200">
        <h2 className="font-bold text-2xl text-gray-900 group-hover:text-blue-700">
          {trip?.userSelection?.location?.label || 'Unknown Location'}
        </h2>
        <p className="text-lg">{trip?.userSelection?.noOfDays} Days trip with <span className="font-medium">{trip?.userSelection?.budget}</span> budget</p>
        <p className="text-lg">Travelling with <span className="font-medium">{trip?.userSelection?.traveller}</span></p>
      </div>
    </div>
    </Link>
  );
}

export default UserTripCardItem;

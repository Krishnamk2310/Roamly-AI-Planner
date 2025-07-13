/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button } from '../.././components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from 'react-router';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GobalApi';

function PlaceCarditem({ place }) {

      const [photoUrl,setPhotoUrl] = useState();
    
      useEffect(()=>{
        place&&GetPlacephotos();
      },[place])
    
      const GetPlacephotos=async()=>{
        const data={
        textQuery:place?.placeName
      }
        const result = await GetPlaceDetails(data).then(resp=>{
    
          const PhotoUrl=PHOTO_REF_URL.replace('{NAME}',resp.data.places[0].photos[3].name);
          setPhotoUrl(PhotoUrl);
        })
      }

  return (
    <Link to={"https://www.google.com/maps/search/?api=1&query="+ place?.placeName} target='_blank'>
    <div className='relative hover:scale-105 transition-all border border-gray-200 rounded-xl p-4 mb-4 shadow-sm hover:shadow-md transition-shadow bg-white'>
      <div className='flex gap-4'>
        <img
          src={photoUrl || '/placeholder.jpg'}
          alt={place.placeName}
          className="w-[100px] h-[100px] object-cover rounded-xl shadow-sm"
        />
        <div className='flex-1 pr-20'> {/* add right padding so text doesn't go under button */}
          {/* 📍 Place Name */}
          <h2 className='text-xl font-extrabold text-gray-900 mb-2'>
            📍 {place.placeName}
          </h2>

          {/* 🕒 Best Time */}
          {place.best_time_to_visit && (
            <p className='text-base mb-1'>
              <span className='font-semibold text-gray-700'>🕒 Best Time: </span>
              <span className='text-orange-600 font-bold'>{place.best_time_to_visit}</span>
            </p>
          )}

          {/* 📝 Description */}
          {place.Place_Details && (
            <p className='text-gray-700 text-sm font-medium mb-1 leading-snug'>
              📝 {place.Place_Details}
            </p>
          )}

          {/* 🧭 Time Travel Info */}
          {place.Time_travel && (
            <p className='text-gray-600 text-sm font-semibold mb-1'>
              🧭 {place.Time_travel}
            </p>
          )}

          {/* 🎟️ Ticket Pricing */}
          {place.ticket_Pricing && (
            <p className='text-gray-800 text-sm font-semibold mb-2'>
              🎟️ {place.ticket_Pricing}
            </p>
          )}
        </div>

        {/* 🌍 Location Button - absolutely positioned */}
        <Button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white hover:bg-gray-800 rounded-md px-4 py-2 flex items-center justify-center gap-2"
          aria-label={`Location of ${place.placeName}`}
        >
          <FaMapLocationDot size={18} />
          {/* Optional text: <span>Location</span> */}
        </Button>
      </div>
    </div>
    </Link>
  );
}

export default PlaceCarditem;

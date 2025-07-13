/* eslint-disable no-unused-vars */
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GobalApi";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    hotel && GetPlacephotos();
  }, [hotel]);

  const GetPlacephotos = async () => {
    const data = {
      textQuery: hotel?.HotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      console.log(resp.data.places[0].photos[3].name);

      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[3].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };

  return (
    <Link
      key={hotel}
      to={
        "https://www.google.com/maps/search/?api=1&query="+hotel?.HotelName
      }
      target="_blank"
      className="max-w-xs mx-auto rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-shadow block"
    >
      <div className="hover:scale-105 transition-all">
        <img
          src={photoUrl || "./placeholder.jpg"}
          alt=""
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="p-3 space-y-1">
          <h2 className="font-extrabold text-lg">{hotel?.HotelName}</h2>
          <h2 className="text-sm text-gray-500">📍 {hotel?.Hotel_address}</h2>
          <h2 className="text-sm font-bold text-gray-700">💰 {hotel?.Price}</h2>
          <h2 className="text-sm font-bold text-gray-700">
            🌟 {hotel?.rating} stars
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;

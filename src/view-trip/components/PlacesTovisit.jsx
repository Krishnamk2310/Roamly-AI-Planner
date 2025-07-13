import PlaceCarditem from './PlaceCarditem';
import PropTypes from 'prop-types';

function PlacesToVisit({ trip }) {
  const itinerary = trip?.tripData?.tripData?.itinerary;

  if (!itinerary || !Array.isArray(itinerary)) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">No itinerary available or itinerary data is invalid.</p>
      </div>
    );
  }

  const formatTravelTime = (timeObj) => {
    if (!timeObj) return 'Travel info not available';
    return [
      timeObj.from_previous_location && `From: ${timeObj.from_previous_location}`,
      timeObj.suggested_duration && `Duration: ${timeObj.suggested_duration}`,
      timeObj.to_airport && timeObj.to_airport !== 'N/A' && `To Airport: ${timeObj.to_airport}`
    ].filter(Boolean).join(' | ');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mt-5 text-gray-800">Places to Visit</h2>
      
      {itinerary.map((day) => (
        <div key={`day-${day.day}`} className="day-section">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-semibold text-lg">Day {day.day}</h3>
            {day.theme && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {day.theme}
              </span>
            )}
          </div>

          {day.daily_plan?.length > 0 ? (
            <div className="space-y-4 pl-4">
              {day.daily_plan.map((activity, index) => (
                <div key={`activity-${day.day}-${index}`} className="pl-4">
                  <PlaceCarditem 
                    place={{
                      placeName: activity.placeName,
                      Place_Details: activity.Place_Details,
                      ticket_Pricing: activity.ticket_Pricing,
                      best_time_to_visit: activity.best_time_to_visit,
                      Time_travel: formatTravelTime(activity.Time_travel),
                      Geo_Coordinates: activity.Geo_Coordinates
                    }} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic pl-4">No activities planned for this day.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;
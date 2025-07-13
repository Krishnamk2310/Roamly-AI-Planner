import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingBudget: -1,
  },
  responseMimeType: 'application/json',
};

const model = 'gemini-2.5-pro';

export const generateTripPlan = async function* (finalPrompt) {
  const strictFormatPrompt = `
    ${finalPrompt}
    
    STRICT OUTPUT REQUIREMENTS:
    1. Must use EXACTLY this JSON structure:
    {
      "id": "auto-generated-timestamp",
      "tripData": {
        "hotel_options": [{
          "HotelName": "",
          "Hotel_address": "",
          "Price": "",
          "descriptions": "",
          "geo_coordinates": {
            "latitude": 0.0,
            "longitude": 0.0
          },
          "hotel_image_url": "",
          "rating": 0.0
        }],
        "itinerary": [{
          "day": 1,
          "theme": "",
          "daily_plan": [{
            "placeName": "",
            "Place_Details": "",
            "ticket_Pricing": "",
            "Time_travel": {
              "from_previous_location": "",
              "suggested_duration": "",
              "to_airport": ""
            },
            "best_time_to_visit": "",
            "Geo_Coordinates": {
              "latitude": 0.0,
              "longitude": 0.0
            },
            "Place_Image_Url": ""
          }]
        }],
        "plan_details": {
          "budget_level": "",
          "currency_info": {
            "code": "INR",
            "symbol": "₹",
            "note": "1 USD ≈ 83.5 INR"
          },
          "group_size": "",
          "location": "",
          "totalDays": 0,
          "userEmail": ""
        }
      },
      "userSelection": {
        "budget": "",
        "location": {
          "label": "",
          "value": {
            "description": "",
            "place_id": "",
            "structured_formatting": {
              "main_text": "",
              "secondary_text": ""
            }
          }
        },
        "noOfDays": "",
        "traveller": ""
      }
    }

    2. Field requirements:
       - Keep ALL field names EXACTLY as shown (case-sensitive)
       - Never change nesting levels
       - Never add or remove fields
       - All prices must be in INR (₹) using 1 USD = 83.5 INR
       - "itinerary" must be an ARRAY (not object)
       - Each day must have "daily_plan" array
       - Time_travel must contain the 3 specified fields

    3. Example of valid output (partial):
       "itinerary": [{
         "day": 1,
         "theme": "Arrival Day",
         "daily_plan": [{
           "placeName": "Hotel Check-in",
           "Place_Details": "Check into your hotel",
           "ticket_Pricing": "₹10,000",
           "Time_travel": {
             "from_previous_location": "Airport",
             "suggested_duration": "1 hour",
             "to_airport": "N/A"
           },
           "Geo_Coordinates": {"latitude": 36.12, "longitude": -115.17},
           "Place_Image_Url": "https://example.com/image.jpg"
         }]
       }]

    4. Violations will cause the trip planning to fail.
  `;

  const contents = [
    {
      role: 'user',
      parts: [{ text: strictFormatPrompt }]
    },
    {
      role: 'model',
      parts: [{
        text: `Understood. I will strictly follow these rules:
        1. Maintain EXACT field names and structure
        2. Keep "itinerary" as array with "daily_plan"
        3. Include ALL required fields every time
        4. Never modify nesting levels
        5. Always use specified Time_travel structure
        6. Format all prices in INR (₹)`
      }]
    },
    {
      role: 'user',
      parts: [{
        text: `Here's another example of valid structure:
        "hotel_options": [{
          "HotelName": "Example Hotel",
          "Hotel_address": "123 Main St",
          "Price": "₹20,000 per night",
          "descriptions": "Luxury hotel description",
          "geo_coordinates": {"latitude": 36.12, "longitude": -115.17},
          "hotel_image_url": "https://example.com/hotel.jpg",
          "rating": 4.5
        }]`
      }]
    }
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  for await (const chunk of response) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
};
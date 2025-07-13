export const selectTravelersList = [
  {
    id: 1,
    title: 'Solo',
    desc: 'A solo traveler in exploration',
    icon: '👤', 
    people: '1'
  },
  {
    id: 2,
    title: 'Couple',
    desc: 'Two travelers in tandem',
    icon: '👥', 
    people: '2 People'
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adv',
    icon: '👨‍👩‍👧‍👦', 
    people: '3 to 5 People'
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A group of friends',
    icon: '👯', 
    people: 'Multiple People'
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: 'Low',
    desc: 'Stay conscious of costs',
    icon: '💸', 
  },
  {
    id: 2,
    title: 'Medium',
    desc: 'Comfortable experiences', 
    icon: '💰', 
  },
  {
    id: 3,
    title: 'High',
    desc: 'Indulge in premium experiences',
    icon: '💎', 
  },
];

export const AI_Prompt = 'Generate Travel Plan for Location : {location}, for {totalDays} Days for {traveler} people with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo Coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format'
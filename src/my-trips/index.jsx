import { db } from '@/service/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function Index() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      if (!user) {
        navigate('/'); 
        return;
      }

      
      setUserTrips([]);
      const q = query(collection(db, 'AItrips'), where('userEmail', '==', user.email));
      const querySnapshot = await getDocs(q);
      
      
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUserTrips(trips);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-20 text-center">
      <h2 className='font-bold text-3xl mb-5'>My Trips</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 gap-5 mt-10'>
        {userTrips.map((trip, index) => (
          <UserTripCardItem key={trip.id || index} trip={trip} />
        ))}
      </div>
    </div>
  );
}

export default Index;
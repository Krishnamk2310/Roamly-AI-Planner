import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc,getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';
import PlacesTovisit from './components/PlacesTovisit';
import Footer from './components/Footer';

function Viewtrip() {
    const {tripId} = useParams();
    const [trip,setTrip] = useState([]);

    useEffect(()=>{
        tripId && GetTripdata();
    },[tripId])

    const GetTripdata=async()=>{
        const docRef = doc(db,'AItrips',tripId);
        const docSnap = await getDoc(docRef);

        if(docSnap.exists()){
            console.log("Document:", docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No such document");
            toast('No trip found');
            
        }
    }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>

      {/* Information */}
        <InfoSection trip={trip} />
      {/* Recommended Hotels */}
        <Hotels trip={trip} />
      {/* Daily Plans  */}
        <PlacesTovisit trip={trip} />
      {/* Footer */}
        <Footer trip={trip}/>
    </div>
  )
}

export default Viewtrip

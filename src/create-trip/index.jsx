import React, { useState } from "react";
import { Input } from "../components/ui/input";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  AI_Prompt,
  SelectBudgetOptions,
  selectTravelersList,
} from "@/constants/options";
import { Button } from "../components/ui/button";
import { ToastContainer, toast } from "react-toastify";
import { generateTripPlan } from "../service/AIModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router";

function CreateTripPage() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  const SaveAiTrip = async (TripData) => {
    const docId = Date.now().toString();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await setDoc(doc(db, "AItrips", docId), {
        userSelection: formData,
        tripData: TripData,
        userEmail: user?.email,
        id: docId,
      });
      navigate('/view-trip/'+ docId)
    } catch (e) {
      console.error("Failed to save trip:", e);
      toast.error("Could not save trip to database.");
    }
  };

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    const { location, noOfDays, budget, traveller } = formData;

    if (!location || !noOfDays || !budget || !traveller) {
      toast.error("Please fill every detail!");
      return;
    }

    if (noOfDays > 7) {
      toast.error("Please enter days less than or equal to 7");
      return;
    }

    setIsGenerating(true);

    try {
      const FINAL_PROMPT = AI_Prompt.replace(
        "{location}",
        formData.location.label
      )
        .replace("{totalDays}", formData.noOfDays)
        .replace("{traveler}", formData.traveller)
        .replace("{budget}", formData.budget);

      const generator = generateTripPlan(FINAL_PROMPT);
      let fullResponse = "";

      for await (const chunk of generator) {
        fullResponse += chunk;
      }

      try {
        const parsed = JSON.parse(fullResponse);
        toast.success("Trip generated successfully!");
        console.log("AI Trip JSON:", parsed);
        await SaveAiTrip(parsed);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        toast.error("Failed to parse trip data.");
      }
    } catch (error) {
      console.error("Trip generation failed:", error);
      toast.error("Trip generation failed. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-20 text-center">
      <ToastContainer />
      <h2 className="font-bold text-3xl">🧭 Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl max-w-2xl mx-auto">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          <div className="w-full border border-black rounded-md p-2">
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
              selectProps={{
                value: place,
                onChange: (v) => {
                  setPlace(v);
                  handleInputChange("location", v);
                },
                styles: {
                  control: (base) => ({
                    ...base,
                    width: "100%",
                    border: "none",
                    boxShadow: "none",
                  }),
                  container: (base) => ({
                    ...base,
                    width: "100%",
                  }),
                  menu: (base) => ({
                    ...base,
                    zIndex: 100,
                  }),
                },
              }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex. 3"}
            type="number"
            min="1"
            max="7"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is your budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("budget", item.title)}
                className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${
                  formData?.budget === item.title
                    ? "shadow-lg border-amber-200"
                    : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {selectTravelersList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("traveller", item.people)}
                className={`p-4 cursor-pointer border rounded-lg hover:shadow-lg ${
                  formData?.traveller === item.people
                    ? "shadow-lg border-amber-200"
                    : ""
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
  <Button
    onClick={onGenerateTrip}
    disabled={isGenerating}
    className="!bg-black !text-white text-lg font-semibold px-6 py-3 rounded-lg hover:!bg-[#1a1a1a] shadow-md transition-all duration-200 flex items-center justify-center gap-2"
  >
    {isGenerating ? (
      <>
        <AiOutlineLoading3Quarters className="animate-spin" />
        Generating...
      </>
    ) : (
      "Generate Trip"
    )}
  </Button>
</div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogDescription className="text-gray-600 text-left mt-2">
              <img src="/logo.svg" alt="" />
              <h2 className="font-bold text-lg mt-7">Sign In with Google</h2>
              <p>Sign in to the web with Google authentication</p>
              <Button
                onClick={login}
                className="w-full mt-5 bg-black text-white hover:bg-gray-900 font-medium rounded-md py-2 px-4 shadow-sm"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </div>
              </Button>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => setOpenDialog(false)}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTripPage;

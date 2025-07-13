import React, { useEffect, useState } from 'react'
import {Button} from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import axios from 'axios';

function Header() {

  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(()=>{
    console.log(user)
  },[])

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
        window.location.reload();
      });
  };


  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-3'>
      <img src="/logo.svg" alt="" />
      <div>
        {user ?
        <div className='flex items-center gap-5'>
          <a href="/create-trip">
          <Button variant="outlind" className="rounded-full">+ Create Trip</Button>
          </a>
          <a href="/my-trips">
          <Button variant="outlind" className="rounded-full">My Trips</Button>
          </a>
          <Popover>
          <PopoverTrigger>
          <img src={user?.picture || '/placeholder.jpg'} alt="" className="h-10 w-10 object-cover border border-gray-300"/>
          </PopoverTrigger>
          <PopoverContent><h2 
          onClick={()=>{
            googleLogout();
            localStorage.clear();
            window.location.reload();
          }}
          className='font-bold cursor-pointer'>Logout</h2></PopoverContent>
        </Popover>
        </div>
        :
        <Button onClick={()=>setOpenDialog(true)}
        className=" !bg-black !text-white text-sm font-semibold hover:!bg-[#1a1a1a] transition-all duration-200">Sign In</Button>
      }
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
  )
}

export default Header

import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAllUsers, GetCurrentUser } from "../apicalls/users";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../redux/loaderSlice";
import { SetUser, setAllUsers } from "../redux/userSlice";


function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userReducer);
  const getCurrentUser = async () => {
    try {
      dispatch(ShowLoader());
      const response = await GetCurrentUser();
      const allUsersResponse=await GetAllUsers()
      dispatch(HideLoader());
      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(setAllUsers(allUsersResponse.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getCurrentUser();
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-100 p-2">
        {/* header */}
        <div className="flex justify-between p-5">
            
            <div className="flex items-center gap-1">
              <i class="ri-message-2-line text-2xl"></i>
              <h1 className="text-primary text-2xl uppercase font-semibold ">CHATLY</h1>
            </div>
            <div className="flex gap-1 text-md items-center">
              <i class="ri-user-3-fill"></i>
              <h1 className="underline">{user?.name}</h1>
              <i class="ri-logout-circle-r-line ml-5 text-xl cursor-pointer"
                onClick={()=>{
                  localStorage.removeItem("token");
                  navigate("/login")
                }}
                ></i>
            </div>
         </div>
          

          {/* main */}
          <div>{children}</div>
    </div>
  );
}

export default ProtectedRoute;

import moment from "moment";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";
import { SetUser } from "../../redux/userSlice";
import { UpdateProfilePicture } from "../../apicalls/users";


function Profile() {
    const { user } = useSelector((state) => state.userReducer);
    const [image = "", setImage] = React.useState(user?.profilePic||"");
    const dispatch = useDispatch();

    const onFileSelect = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader(file);
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        console.log(reader.result);
        setImage(reader.result);
      };
        // console.log(file);
    };
    useEffect(() => {
        if (user?.profilePic) {
          setImage(user.profilePic);
        }
      }, [user]);
      const updateProfilePic = async () => {
        try {
          dispatch(ShowLoader());
          const response = await UpdateProfilePicture(image);
          dispatch(HideLoader());
          if (response.success) {
            toast.success("Profile Pic Updated");
            dispatch(SetUser(response.data));
          } else {
            toast.error(response.error);
          }
        } catch (error) {
          dispatch(HideLoader());
          toast.error(error.message);
        }
      };
  return (
    user && <div  className="text-xl font-semibold text-gray-500 flex flex-col gap-2">
        <h1>{user?.name}</h1>
          <h1>{user?.email}</h1>
          <h1>
            Created At:{" "}
            {moment(user?.createdAt).format("Do MMMM YYYY, h:mm:ss a")}
          </h1>
          {image && (
            <img
              src={image}
              alt="profile pic"
              className="w-32 h-32 rounded-full"
            />
          )}

          <div className="flex gap-2">
            <label htmlFor="file-input" className="cursor-pointer">
              Update Profile Pic
            </label>
            <input
              type="file"
              onChange={onFileSelect}
              className="file-input border-0"
              id="file-input"
            />
            <button className="contained-btn" onClick={updateProfilePic}>
              Update
            </button>
          </div>

    </div>
  )
}

export default Profile


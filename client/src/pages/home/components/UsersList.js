import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CreateNewChat } from "../../../apicalls/chats";
import { HideLoader, ShowLoader } from "../../../redux/loaderSlice";
import { SetAllChats,SetSelectedChat } from "../../../redux/userSlice";


function UsersList({searchKey}) {
    const {allUsers,allChats,user,selectedChat}=useSelector((state)=>state.userReducer)
    const dispatch=useDispatch();


    const createNewChat = async (receipentUserId) => {
        try {
          dispatch(ShowLoader());
          const response = await CreateNewChat([user._id, receipentUserId]);
          dispatch(HideLoader());
          if (response.success) {
            toast.success(response.message);
            const newChat = response.data;
            const updatedChats = [...allChats, newChat];
            dispatch(SetAllChats(updatedChats));
            dispatch(SetSelectedChat(newChat));
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          dispatch(HideLoader());
          toast.error(error.message);
        }
      };

      const openChat = (receipentUserId) => {
        const chat = allChats.find(
          (chat) =>
            chat.members.map((mem)=>mem._id).includes(user._id) &&
            chat.members.map((mem)=>mem._id).includes(receipentUserId)
        );
        if (chat) {
          dispatch(SetSelectedChat(chat));
        }
      };

      const getData = () => {
        return allUsers.filter( (userObj)=>
        (userObj.name.toLowerCase().includes(searchKey.toLowerCase()) && searchKey) ||
        allChats.some((chat)=>chat.members.map((mem)=>mem._id).includes(userObj._id))
        )
      };

	  const getIsSelctedChatOrNot = (userObj) => {
		if (selectedChat) {
		  return selectedChat.members.map((mem) => mem._id).includes(userObj._id);
		}
		return false;
	  };

  return (
    <div className="flex flex-col gap-3 mt-5">
      {getData()
        .map((userObj)=>{
        return (
            <div className={`shadow-sm border p-3 rounded-xl bg-white flex justify-between items-center cursor-pointer
				${getIsSelctedChatOrNot(userObj) && 'border-primary border-2'}
            `}
              key={userObj._id}
              onClick={()=>openChat(userObj._id)}
            >
               <div className="flex gap-5 items-center">
                    {userObj.profilePic && (
                        <img src={userObj.profilePic} alt="profilePic" className="w-10 h-10 rounded-full" />
                    )}
                    
                    {!userObj.profilePic && (
                        <div className="bg-gray-400 rounded-full h-10 w-10 flex items-center justify-center">
                            <h1 className="text-2xl uppercase font-bold text-black">{userObj.name[0]}</h1>
                        </div>
                    )}
                    <h1>{userObj.name}</h1>
               </div>
               <div onClick={() => createNewChat(userObj._id)}>
              {!allChats.find((chat) =>
                chat.members.map((mem)=>mem._id).includes(userObj._id)
              ) && (
                <button className="border-primary border text-primary bg-white p-1 rounded">
                  Create Chat
                </button>
              )}
            </div>
            </div>
        );
      })}
    </div>
  )
}

export default UsersList

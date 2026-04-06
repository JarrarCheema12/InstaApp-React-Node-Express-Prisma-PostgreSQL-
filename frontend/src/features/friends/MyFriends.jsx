import React from 'react'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeUserFriend, fetchUserFriendsWithUnread } from '../../store/friendSlice';


const MyFriends = () => {
  const dispatch = useDispatch()
  const authUser = useSelector((state) => state.auth.user)
  const users = useSelector((state) => state.friends.friends)
  const loaded = useSelector((state) => state.friends.loading)


  useEffect(() => {
    const getUsers = async () => {
      await dispatch(fetchUserFriendsWithUnread(authUser.uid))
    };
    getUsers();
  }, []);

  const handleFriendDelete = async (theIdoFCurrentAuthUserfriendIdToBeDeleted, usernameOFCurrentAuthUserfriendIdToBeDeleted) => {


    const res = await dispatch(removeUserFriend({ user: authUser.id, friendId: theIdoFCurrentAuthUserfriendIdToBeDeleted }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(`Unfriended:  ${usernameOFCurrentAuthUserfriendIdToBeDeleted}!`);
    }

  }
  return loaded ? (
    <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-white/40 text-base tracking-widest uppercase">Loading</span>
      </div>
    </div>
  ) : (
    <div className="w-full min-h-screen bg-[#0a0a0a] flex justify-center px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-2xl flex flex-col gap-1">

        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-6 bg-white/80 rounded-full" />
          <h1 className="text-white/80 text-base md:text-lg font-medium tracking-widest uppercase">My Friends</h1>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-24 text-white/20 text-lg tracking-wider">
            No friends yet
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {users.map((elem, index) => (
              <div
                key={elem.id}
                className="opacity-0 animate-fadeIn bg-[#111111] border border-white/[0.07] rounded-xl px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 hover:border-white/[0.14] transition-all duration-200"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-base md:text-lg font-semibold uppercase">
                      {elem.username?.[0]}
                    </div>
                    {elem.hasUnread && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#111111]" />
                    )}
                  </div>
                  <span className="text-white/80 text-base md:text-xl font-medium truncate">{elem.username}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/chatFriend/${elem.id}`}
                    className={`text-sm md:text-base font-medium px-4 py-2 rounded-lg transition-all duration-200 ${elem.hasUnread
                        ? 'bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30'
                        : 'text-white/50 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/6'
                      }`}
                  >
                    {elem.hasUnread ? '● Chat' : 'Chat'}
                  </Link>
                  <button
                    onClick={() => handleFriendDelete(elem.id, elem.username)}
                    className="text-white/20 hover:text-red-400 hover:bg-red-400/10 border border-transparent hover:border-red-400/20 transition-all duration-200 px-3 py-2 rounded-lg text-sm md:text-base font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease forwards; }
      `}</style>
    </div>
  )
}

export default MyFriends

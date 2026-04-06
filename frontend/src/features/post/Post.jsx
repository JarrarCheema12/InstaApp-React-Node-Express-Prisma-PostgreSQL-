import { useState } from "react"
import { createComment, fetchCommentsByPost, deleteComment, toggleLikeComment } from "../../services/commentService"
import toast from "react-hot-toast"
import { EditUserPost, DeleteUserPost, togglePostLike } from "../../store/postSlice"
import { useDispatch } from "react-redux"
const Post = ({ elem, authUser }) => {


  const dispatch = useDispatch()

  const [isEditing, setIsEditing] = useState(false)
  const [EditText, setEditText] = useState("")
  const [likes, setLikes] = useState(Number(elem.likes_count) || 0)
  const [comment, setComment] = useState(false)
  const [CommentEditText, setCommentEditText] = useState("")
  const [isLiked, setIsLiked] = useState(!!elem.isLiked)

  const [display, setDisplay] = useState(false)
  const [displayComment, setDisplayComment] = useState([])
  const [commentLoaded, setCommentLoaded] = useState(false)


  const handlePostDelete = async () => {
    try {
      await dispatch(DeleteUserPost({ postId: elem.id }));
      toast.success("Post deleted Successfully")

    } catch (error) {
      console.log(error);
    }
  }
  const handlePost = () => {
    setIsEditing(true)
    setEditText(elem.text)
  }
  const handleEditPostSave = async () => {
    try {
      await dispatch(EditUserPost({
        postId: elem.id,
        newText: EditText
      }));

      toast.success("Post edited successfully");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async () => {
    if (!authUser) return

    const nextLiked = !isLiked;
    const nextLikes = nextLiked ? likes + 1 : likes - 1;

    setIsLiked(nextLiked);
    setLikes(nextLikes);

    try {
      await dispatch(togglePostLike(elem.id))
    } catch (error) {

      setIsLiked(isLiked);
      setLikes(likes);
      console.log(error)
    }
  }
  const handleComment = () => {
    setComment(true)
  }
  const handlePostComment = async () => {
    if (!CommentEditText.trim()) return

    try {
      const tempId = `temp-${Date.now()}`
      const optimistic = {
        id: tempId,
        postId: elem.id,
        userId: authUser?.uid,
        username: authUser?.username,
        text: CommentEditText,
        createdAt: Date.now(),
        likes_count: 0,
        isLiked: false,
      }
      setDisplayComment(prev => [...prev, optimistic])
      setDisplay(true)
      setCommentLoaded(true)

      const saved = await createComment({ postId: elem.id, text: CommentEditText })
      setDisplayComment(prev => prev.map(c => c.id === tempId ? { ...optimistic, id: saved.id } : c))

      toast.success("comment added successfully")
      setCommentEditText("")
      setComment(false)
    } catch (error) {
      console.log(error);

    }

  }
  const handleDisplayComments = async () => {
    if (display) {
      setDisplay(false)
      return
    }
    if (!commentLoaded) {
      try {
        const result = await fetchCommentsByPost(elem.id)
        setDisplayComment(result)
        setDisplay(true)
        setCommentLoaded(true)
      } catch (error) {
        console.log(error);
      }
    }
    setDisplay(true)
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const prev = displayComment
      setDisplayComment(prev => prev.filter(comment => comment.id !== commentId))
      await deleteComment(commentId)
      toast.success("Comment deleted successfully")

    } catch (error) {
      console.log(error);

    }
  }
  const handleCommentLike = async (commentId, currentlyLiked) => {
    try {
      setDisplayComment(prev =>
        prev.map(comment => {
          if (comment.id !== commentId) return comment
          const currentLikes = Number(comment.likes_count) || 0
          return {
            ...comment,
            isLiked: !currentlyLiked,
            likes_count: currentlyLiked ? currentLikes - 1 : currentLikes + 1
          }
        })
      )
      const res = await toggleLikeComment(commentId);
      res.is_liked ? toast.success("comment liked successfully") : toast.success("comment unliked successfully")
    } catch (error) {
      console.log(error);

    }
  }
  return (
    <div className="bg-[#111111] border border-white/[0.07] rounded-xl p-5 md:p-6 flex flex-col gap-4 transition-all duration-200 hover:border-white/[0.14]">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-base md:text-lg font-semibold uppercase">
            {elem.username?.[0]}
          </div>
          <span className="text-white/80 text-base md:text-lg font-medium">{elem.username}</span>
        </div>

        {authUser && Number(authUser.uid) === Number(elem.userId) && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePost}
              className="text-sm md:text-base text-white/40 hover:text-blue-400 transition-colors px-3 py-1.5 rounded hover:bg-blue-400/10 font-medium"
            >
              Edit
            </button>
            <button
              onClick={handlePostDelete}
              className="text-sm md:text-base text-white/40 hover:text-red-400 transition-colors px-3 py-1.5 rounded hover:bg-red-400/10 font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-white/85 text-base md:text-lg leading-relaxed">{elem.text}</p>

      {elem.image_url && (
        <img
          src={elem.image_url}
          alt="Post"
          className="w-full max-h-120 object-cover rounded-lg border border-white/[0.07]"
        />
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-base md:text-lg font-medium transition-colors ${isLiked ? "text-red-400" : "text-white/30 hover:text-white/60"
              }`}
          >
            <span>{isLiked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>

          <button
            onClick={handleDisplayComments}
            className="text-base md:text-lg text-white/30 hover:text-white/60 transition-colors font-medium"
          >
            {display ? "Hide" : "Comments"}
          </button>
        </div>

        {authUser && (
          <button
            onClick={handleComment}
            className="text-sm md:text-base text-white/30 hover:text-white/60 transition-colors font-medium px-3 py-1.5 rounded hover:bg-white/5"
          >
            + Comment
          </button>
        )}
      </div>

      {comment && (
        <div className="flex flex-col gap-3 mt-1">
          <textarea
            value={CommentEditText}
            onChange={(e) => setCommentEditText(e.target.value)}
            placeholder="Write a comment..."
            className="bg-white/4 border border-white/8 rounded-lg p-3 md:p-4 text-white/80 text-base md:text-lg resize-none focus:outline-none focus:border-white/20 transition-colors placeholder:text-white/20 h-24"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setComment(false)}
              className="text-sm md:text-base text-white/30 hover:text-white/60 px-4 py-2 rounded hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePostComment}
              className="text-sm md:text-base text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="flex flex-col gap-3 mt-1">
          <textarea
            value={EditText}
            onChange={(e) => setEditText(e.target.value)}
            className="bg-white/4 border border-white/8 rounded-lg p-3 md:p-4 text-white/80 text-base md:text-lg resize-none focus:outline-none focus:border-white/20 transition-colors h-24"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm md:text-base text-white/30 hover:text-white/60 px-4 py-2 rounded hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEditPostSave}
              className="text-sm md:text-base text-white bg-white/10 hover:bg-white/15 px-4 py-2 rounded transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {display && (
        <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
          {displayComment.map((e) => {
            const postOwner = authUser && authUser.uid === elem.userId
            const commentOwner = authUser && authUser.uid === e.userId
            const commentLiked = !!e.isLiked

            return (
              <div key={e.id} className="flex items-start justify-between gap-3 py-3 border-b border-white/4 last:border-0">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/[0.07] flex items-center justify-center text-white/40 text-sm font-semibold uppercase shrink-0 mt-0.5">
                    {e.username?.[0]}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white/40 text-sm md:text-base font-medium">{e.username}</span>
                    <p className="text-white/75 text-base md:text-lg leading-snug wrap-break-word">{e.text}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {authUser && (
                    <button
                      onClick={() => handleCommentLike(e.id, commentLiked)}
                      className={`flex items-center gap-1.5 text-sm md:text-base transition-colors ${commentLiked ? "text-red-400" : "text-white/25 hover:text-white/50"}`}
                    >
                      <span>{commentLiked ? "❤️" : "🤍"}</span>
                      <span>{Number(e.likes_count) || 0}</span>
                    </button>
                  )}
                  {(postOwner || commentOwner) && (
                    <button
                      onClick={() => handleDeleteComment(e.id)}
                      className="text-white/20 hover:text-red-400 transition-colors text-sm md:text-base px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default Post
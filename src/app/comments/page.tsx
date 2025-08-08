"use client";

import { useState } from "react";

type CommentType = {
  id: string;
  text: string;
  replies: CommentType[];
};

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  // Add top-level comment
  const addComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newComment.trim(), replies: [] },
    ]);
    setNewComment("");
  };

  // Add reply to specific comment (recursive)
  const addReply = (parentId: string, replyText: string) => {
    if (!replyText.trim()) return;

    const updateTree = (nodes: CommentType[]): CommentType[] =>
      nodes.map((node) =>
        node.id === parentId
          ? {
              ...node,
              replies: [
                ...node.replies,
                { id: Date.now().toString(), text: replyText.trim(), replies: [] },
              ],
            }
          : { ...node, replies: updateTree(node.replies) }
      );

    setComments((prev) => updateTree(prev));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6">💬 Comment Section</h1>

        {/* Add new comment */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-black dark:text-white"
          />
          <button
            onClick={addComment}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            Post
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              addReply={addReply}
              level={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type CommentNodeProps = {
  comment: CommentType;
  addReply: (parentId: string, replyText: string) => void;
  level: number;
};

function CommentNode({ comment, addReply, level }: CommentNodeProps) {
  const [replyText, setReplyText] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  return (
    <div style={{ marginLeft: level * 20 }}>
      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-700">
        <p className="mb-2">{comment.text}</p>
        <button
          onClick={() => setShowReplyBox((prev) => !prev)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showReplyBox ? "Cancel" : "Reply"}
        </button>

        {showReplyBox && (
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1 bg-white dark:bg-gray-900 text-black dark:text-white"
            />
            <button
              onClick={() => {
                addReply(comment.id, replyText);
                setReplyText("");
                setShowReplyBox(false);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg"
            >
              Reply
            </button>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((child) => (
            <CommentNode
              key={child.id}
              comment={child}
              addReply={addReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

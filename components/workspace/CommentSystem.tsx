import React, { useState } from 'react';
import { AnalysisComment, User } from '../../types';
import { FileTextIcon, LinkIcon, ClipboardCopyIcon, TrashIcon } from '../icons/Icons';

interface CommentSystemProps {
  comments: AnalysisComment[];
  currentUser: User;
  onAddComment: (content: string, parentId?: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentSystem: React.FC<CommentSystemProps> = ({
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim(), parentId);
      setNewComment('');
      setReplyingTo(null);
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    onEditComment(commentId, content);
    setEditingComment(null);
    setEditContent('');
  };

  const startEditing = (comment: AnalysisComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const topLevelComments = comments.filter(comment => !comment.parentId);

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <h4 className="font-medium text-neutral-800 dark:text-white mb-3 flex items-center">
          <FileTextIcon className="h-5 w-5 mr-2" />
          Add Comment
        </h4>
        <form onSubmit={(e) => handleSubmitComment(e)}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white resize-none focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal focus:border-transparent"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-trust-blue dark:bg-ai-teal text-white rounded-lg hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Comment
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {topLevelComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            allComments={comments}
            currentUser={currentUser}
            onReply={setReplyingTo}
            onEdit={startEditing}
            onDelete={onDeleteComment}
            replyingTo={replyingTo}
            editingComment={editingComment}
            editContent={editContent}
            setEditContent={setEditContent}
            onSubmitEdit={handleEditComment}
            onCancelEdit={cancelEditing}
            onSubmitReply={handleSubmitComment}
          />
        ))}
        {topLevelComments.length === 0 && (
          <div className="text-center py-8">
            <FileTextIcon className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-500 dark:text-neutral-400">
              No comments yet. Start the conversation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface CommentThreadProps {
  comment: AnalysisComment;
  allComments: AnalysisComment[];
  currentUser: User;
  onReply: (commentId: string | null) => void;
  onEdit: (comment: AnalysisComment) => void;
  onDelete: (commentId: string) => void;
  replyingTo: string | null;
  editingComment: string | null;
  editContent: string;
  setEditContent: (content: string) => void;
  onSubmitEdit: (commentId: string, content: string) => void;
  onCancelEdit: () => void;
  onSubmitReply: (e: React.FormEvent, parentId: string) => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({
  comment,
  allComments,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  replyingTo,
  editingComment,
  editContent,
  setEditContent,
  onSubmitEdit,
  onCancelEdit,
  onSubmitReply,
}) => {
  const [replyComment, setReplyComment] = useState('');

  const replies = allComments.filter(c => c.parentId === comment.id);
  const isAuthor = comment.author.id === currentUser.id;
  const isEditing = editingComment === comment.id;

  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-trust-blue dark:bg-ai-teal flex items-center justify-center text-white font-medium">
              {comment.author.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-medium text-neutral-800 dark:text-white">
                {comment.author.name}
              </span>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
              {comment.updatedAt && comment.updatedAt > comment.createdAt && (
                <span className="text-xs text-neutral-400 dark:text-neutral-500">(edited)</span>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white resize-none focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal focus:border-transparent"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSubmitEdit(comment.id, editContent)}
                    disabled={!editContent.trim()}
                    className="px-3 py-1 bg-trust-blue dark:bg-ai-teal text-white rounded hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 disabled:opacity-50 text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-neutral-700 dark:text-neutral-300 mb-3">
                {comment.content}
              </p>
            )}

            {!isEditing && (
              <div className="flex items-center space-x-4 text-sm">
                <button
                  onClick={() => onReply(replyingTo === comment.id ? null : comment.id)}
                  className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Reply</span>
                </button>
                {isAuthor && (
                  <>
                    <button
                      onClick={() => onEdit(comment)}
                      className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      <ClipboardCopyIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDelete(comment.id)}
                      className="flex items-center space-x-1 text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {replyingTo === comment.id && (
        <div className="ml-8 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600 p-4">
          <form onSubmit={(e) => onSubmitReply(e, comment.id)}>
            <textarea
              value={replyComment}
              onChange={(e) => setReplyComment(e.target.value)}
              placeholder={`Reply to ${comment.author.name}...`}
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-800 dark:text-white resize-none focus:ring-2 focus:ring-trust-blue dark:focus:ring-ai-teal focus:border-transparent"
              rows={2}
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={() => onReply(null)}
                className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!replyComment.trim()}
                className="px-3 py-1 bg-trust-blue dark:bg-ai-teal text-white rounded hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 disabled:opacity-50 text-sm"
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-8 space-y-3">
          {replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              allComments={allComments}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              replyingTo={replyingTo}
              editingComment={editingComment}
              editContent={editContent}
              setEditContent={setEditContent}
              onSubmitEdit={onSubmitEdit}
              onCancelEdit={onCancelEdit}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSystem;

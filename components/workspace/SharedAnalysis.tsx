import React, { useState, useEffect } from 'react';
import { SharedAnalysis, AnalysisComment, AnalysisVote, User, BiasAnalysisResult } from '../../types';
import { FileTextIcon, ThumbUpIcon, ThumbDownIcon, LinkIcon, FileCheckIcon } from '../icons/Icons';

interface SharedAnalysisProps {
  analysis: SharedAnalysis;
  currentUser: User;
  onComment: (analysisId: string, content: string, parentId?: string) => void;
  onVote: (analysisId: string, vote: 'up' | 'down') => void;
  onStatusChange: (analysisId: string, status: 'open' | 'resolved' | 'archived') => void;
}

const SharedAnalysisComponent: React.FC<SharedAnalysisProps> = ({
  analysis,
  currentUser,
  onComment,
  onVote,
  onStatusChange,
}) => {
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(analysis.id, newComment.trim());
      setNewComment('');
    }
  };

  const handleVote = (vote: 'up' | 'down') => {
    onVote(analysis.id, vote);
  };

  const userVote = analysis.votes.find(v => v.userId === currentUser.id);
  const upVotes = analysis.votes.filter(v => v.vote === 'up').length;
  const downVotes = analysis.votes.filter(v => v.vote === 'down').length;

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-2">
            {analysis.title}
          </h3>
          {analysis.description && (
            <p className="text-neutral-600 dark:text-neutral-400 mb-3">
              {analysis.description}
            </p>
          )}
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>By {analysis.author.name}</span>
            <span className="mx-2">•</span>
            <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              analysis.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              analysis.status === 'resolved' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
              'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200'
            }`}>
              {analysis.status}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStatusChange(analysis.id, analysis.status === 'open' ? 'resolved' : 'open')}
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            title={analysis.status === 'open' ? 'Mark as resolved' : 'Reopen'}
          >
            <FileCheckIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            title="Share analysis"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-neutral-800 dark:text-white mb-2">Analysis Summary</h4>
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          <p>Findings: {analysis.originalAnalysis.findings.length}</p>
          <p>Sources: {analysis.originalAnalysis.findings.reduce((acc, f) => acc + (f.sources?.length || 0), 0)}</p>
        </div>
      </div>

      {/* Voting */}
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={() => handleVote('up')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
            userVote?.vote === 'up'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
        >
          <ThumbUpIcon className="h-4 w-4" />
          <span className="text-sm">{upVotes}</span>
        </button>
        <button
          onClick={() => handleVote('down')}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors ${
            userVote?.vote === 'down'
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
          }`}
        >
          <ThumbDownIcon className="h-4 w-4" />
          <span className="text-sm">{downVotes}</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <FileTextIcon className="h-4 w-4" />
          <span className="text-sm">{analysis.comments.length}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <h4 className="font-medium text-neutral-800 dark:text-white mb-3">Comments</h4>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-800 dark:text-white resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="mt-2 px-4 py-2 bg-trust-blue dark:bg-ai-teal text-white rounded-lg hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-3">
            {analysis.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {analysis.comments.length === 0 && (
              <p className="text-neutral-500 dark:text-neutral-400 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: AnalysisComment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-trust-blue dark:bg-ai-teal flex items-center justify-center text-white text-sm font-medium">
          {comment.author.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-neutral-800 dark:text-white text-sm">
            {comment.author.name}
          </span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default SharedAnalysisComponent;

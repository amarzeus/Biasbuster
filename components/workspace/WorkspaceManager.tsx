import React, { useState, useEffect } from 'react';
import { Workspace, User, SharedAnalysis } from '../../types';
import { CheckIcon, UsersIcon, FileTextIcon, ServerCogIcon } from '../icons/Icons';

interface WorkspaceManagerProps {
  currentUser: User;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
}

const WorkspaceManager: React.FC<WorkspaceManagerProps> = ({
  currentUser,
  onWorkspaceSelect,
  onCreateWorkspace,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load workspaces from localStorage or API
    const loadWorkspaces = () => {
      try {
        const stored = localStorage.getItem('biasbuster_workspaces');
        if (stored) {
          const parsedWorkspaces = JSON.parse(stored);
          setWorkspaces(parsedWorkspaces);
        } else {
          // Create default workspace
          const defaultWorkspace: Workspace = {
            id: 'default',
            name: 'My Workspace',
            description: 'Personal workspace for bias analysis',
            members: [currentUser],
            settings: {
              isPublic: false,
              allowGuestComments: false,
              requireApproval: false,
            },
            analyses: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setWorkspaces([defaultWorkspace]);
          localStorage.setItem('biasbuster_workspaces', JSON.stringify([defaultWorkspace]));
        }
      } catch (error) {
        console.error('Failed to load workspaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaces();
  }, [currentUser]);

  const handleWorkspaceClick = (workspace: Workspace) => {
    onWorkspaceSelect(workspace);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trust-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white">Workspaces</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Collaborate on bias analysis with your team
          </p>
        </div>
        <button
          onClick={onCreateWorkspace}
          className="flex items-center px-4 py-2 bg-trust-blue dark:bg-ai-teal text-white rounded-lg hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 transition-colors"
        >
          <CheckIcon className="h-5 w-5 mr-2" />
          Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onClick={() => handleWorkspaceClick(workspace)}
          />
        ))}
      </div>

      {workspaces.length === 0 && (
        <div className="text-center py-12">
          <FileTextIcon className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 mb-2">
            No workspaces yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-500 mb-6">
            Create your first workspace to start collaborating
          </p>
          <button
            onClick={onCreateWorkspace}
            className="px-6 py-3 bg-trust-blue dark:bg-ai-teal text-white rounded-lg hover:bg-trust-blue/90 dark:hover:bg-ai-teal/90 transition-colors"
          >
            Create Workspace
          </button>
        </div>
      )}
    </div>
  );
};

interface WorkspaceCardProps {
  workspace: Workspace;
  onClick: () => void;
}

const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace, onClick }) => {
  const memberCount = workspace.members.length;
  const analysisCount = workspace.analyses.length;

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
              {workspace.name}
            </h3>
            {workspace.description && (
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {workspace.description}
              </p>
            )}
          </div>
          <ServerCogIcon className="h-5 w-5 text-neutral-400" />
        </div>

      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center">
          <UsersIcon className="h-4 w-4 mr-1" />
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </div>
        <div>
          {analysisCount} analysis{analysisCount !== 1 ? 'es' : ''}
        </div>
      </div>

      <div className="mt-4 flex -space-x-2">
        {workspace.members.slice(0, 3).map((member) => (
          <div
            key={member.id}
            className="w-8 h-8 rounded-full bg-trust-blue dark:bg-ai-teal flex items-center justify-center text-white text-xs font-medium"
            title={member.name}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {memberCount > 3 && (
          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium text-neutral-600 dark:text-neutral-400">
            +{memberCount - 3}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspaceManager;

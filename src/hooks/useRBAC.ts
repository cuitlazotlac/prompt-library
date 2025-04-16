import { useAuth } from '@/contexts/AuthContext';

export function useRBAC() {
  const { user, isAdmin, isCreator, canEditPrompt } = useAuth();

  const can = {
    createPrompt: () => !!user,
    editPrompt: (creatorId: string) => canEditPrompt(creatorId),
    deletePrompt: (creatorId: string) => canEditPrompt(creatorId),
    accessAdminDashboard: () => isAdmin(),
    manageUsers: () => isAdmin(),
    viewPrompt: (isPublic: boolean, creatorId: string) => {
      if (isPublic) return true;
      if (!user) return false;
      return isAdmin() || user.uid === creatorId;
    }
  };

  return { can };
} 
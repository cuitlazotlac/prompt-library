import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Stack,
  Chip,
  IconButton,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ContentCopy,
  Edit,
  Delete,
  Flag,
  Star,
} from '@mui/icons-material';
import { doc, getDoc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Prompt } from '../types';
import toast from 'react-hot-toast';

export default function PromptDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!id) return;
      
      try {
        const docRef = doc(db, 'prompts', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPrompt({ id: docSnap.id, ...docSnap.data() } as Prompt);
          
          // Check if user has favorited or voted
          if (user) {
            const favoriteRef = doc(db, 'favorites', `${user.uid}_${id}`);
            const favoriteSnap = await getDoc(favoriteRef);
            setIsFavorite(favoriteSnap.exists());
            
            const voteRef = doc(db, 'votes', `${user.uid}_${id}`);
            const voteSnap = await getDoc(voteRef);
            setHasVoted(voteSnap.exists());
          }
        } else {
          toast.error('Prompt not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching prompt:', error);
        toast.error('Failed to load prompt');
        navigate('/');
      }
    };

    fetchPrompt();
  }, [id, user, navigate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy prompt');
    }
  };

  const handleFavorite = async () => {
    if (!user || !prompt) return;

    try {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${prompt.id}`);
      if (isFavorite) {
        await deleteDoc(favoriteRef);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await updateDoc(favoriteRef, {
          userId: user.uid,
          promptId: prompt.id,
          createdAt: new Date(),
        });
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleVote = async () => {
    if (!user || !prompt || hasVoted) return;

    try {
      const voteRef = doc(db, 'votes', `${user.uid}_${prompt.id}`);
      await updateDoc(voteRef, {
        userId: user.uid,
        promptId: prompt.id,
        vote: 1,
        createdAt: new Date(),
      });
      
      await updateDoc(doc(db, 'prompts', prompt.id), {
        upvotes: increment(1),
      });
      
      setHasVoted(true);
      setPrompt(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
      toast.success('Vote recorded!');
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleDelete = async () => {
    if (!prompt || !user || prompt.authorId !== user.uid) return;

    try {
      await deleteDoc(doc(db, 'prompts', prompt.id));
      toast.success('Prompt deleted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  if (!prompt) {
    return <div>Loading...</div>;
  }

  const isAuthor = user?.uid === prompt.authorId;
  const isAdmin = user?.isAdmin;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {prompt.title}
          </Typography>
        </Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" spacing={1}>
            {user && (
              <IconButton onClick={handleFavorite} title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
            )}
            {!hasVoted && user && (
              <IconButton onClick={handleVote} title="Upvote">
                <Star />
              </IconButton>
            )}
            {isAuthor && (
              <>
                <IconButton onClick={() => navigate(`/edit/${prompt.id}`)} title="Edit">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => setDeleteDialogOpen(true)} title="Delete">
                  <Delete />
                </IconButton>
              </>
            )}
            {isAdmin && (
              <IconButton title="Flag content">
                <Flag />
              </IconButton>
            )}
          </Stack>
        </Stack>

        <Typography variant="body1" color="text.secondary" paragraph>
          {prompt.description}
        </Typography>

        <Stack direction="row" spacing={1} mb={2}>
          <Chip label={prompt.category} color="primary" />
          {prompt.modelType.map((model) => (
            <Chip key={model} label={model} />
          ))}
          {prompt.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" />
          ))}
        </Stack>

        <Typography variant="body2" color="text.secondary">
          By {prompt.authorName} • {prompt.upvotes} upvotes
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Prompt Content
            </Typography>
            <Tooltip title="Copy prompt">
              <IconButton 
                onClick={handleCopy} 
                size="small"
                sx={{ 
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ContentCopy />
              </IconButton>
            </Tooltip>
          </Box>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                m: 0,
              }}
            >
              {prompt.content}
            </Typography>
          </Paper>
        </Box>

        {prompt.usageTips && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Usage Tips
            </Typography>
            <Typography variant="body1">
              {prompt.usageTips}
            </Typography>
          </Box>
        )}

        {prompt.recommendedModels && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Recommended Models
            </Typography>
            <Stack direction="row" spacing={1}>
              {prompt.recommendedModels.map((model) => (
                <Chip key={model} label={model} variant="outlined" />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Prompt</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prompt? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
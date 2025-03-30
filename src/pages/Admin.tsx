import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Flag,
  Star,
  StarBorder,
  Delete,
  Edit,
  ContentCopy,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Prompt } from '../types';
import toast from 'react-hot-toast';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [flagReason, setFlagReason] = useState('');

  if (!user?.isAdmin) {
    navigate('/');
    return null;
  }

  const { data: flaggedPrompts, isLoading: flaggedLoading } = useQuery({
    queryKey: ['flaggedPrompts'],
    queryFn: async () => {
      const q = query(collection(db, 'prompts'), where('isFlagged', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];
    }
  });

  const { data: allPrompts, isLoading: allLoading } = useQuery({
    queryKey: ['allPrompts'],
    queryFn: async () => {
      const q = query(collection(db, 'prompts'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Prompt[];
    }
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ promptId, updates }: { promptId: string; updates: Partial<Prompt> }) => {
      await updateDoc(doc(db, 'prompts', promptId), updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedPrompts'] });
      queryClient.invalidateQueries({ queryKey: ['allPrompts'] });
      toast.success('Prompt updated successfully');
    },
    onError: () => {
      toast.error('Failed to update prompt');
    },
  });

  const deletePromptMutation = useMutation({
    mutationFn: async (promptId: string) => {
      await deleteDoc(doc(db, 'prompts', promptId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flaggedPrompts'] });
      queryClient.invalidateQueries({ queryKey: ['allPrompts'] });
      toast.success('Prompt deleted successfully');
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error('Failed to delete prompt');
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Prompt copied to clipboard!');
  };

  const handleToggleFeatured = (prompt: Prompt) => {
    updatePromptMutation.mutate({
      promptId: prompt.id,
      updates: { isFeatured: !prompt.isFeatured }
    });
  };

  const handleUnflag = (prompt: Prompt) => {
    updatePromptMutation.mutate({
      promptId: prompt.id,
      updates: { isFlagged: false }
    });
  };

  const handleDelete = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPrompt) {
      deletePromptMutation.mutate(selectedPrompt.id);
    }
  };

  const handleFlagPrompt = (prompt: Prompt) => {
    if (!flagReason.trim()) {
      toast.error('Please provide a reason for flagging');
      return;
    }

    updatePromptMutation.mutate({
      promptId: prompt.id,
      updates: { 
        isFlagged: true,
        flagReason: flagReason
      }
    });
    setFlagReason('');
  };

  const PromptCard = ({ prompt, showActions = true }: { prompt: Prompt; showActions?: boolean }) => (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6">{prompt.title}</Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={() => handleCopyToClipboard(prompt.content)} title="Copy to clipboard">
              <ContentCopy />
            </IconButton>
            {showActions && (
              <>
                <IconButton onClick={() => handleToggleFeatured(prompt)} title={prompt.isFeatured ? "Remove from featured" : "Add to featured"}>
                  {prompt.isFeatured ? <Star color="primary" /> : <StarBorder />}
                </IconButton>
                <IconButton onClick={() => handleDelete(prompt)} title="Delete">
                  <Delete />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" paragraph>
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
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Flagged Content" />
          <Tab label="All Prompts" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {flaggedLoading ? (
          <div>Loading...</div>
        ) : flaggedPrompts?.length === 0 ? (
          <Typography variant="h6" color="text.secondary" align="center">
            No flagged content
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {flaggedPrompts?.map((prompt) => (
              <Grid item xs={12} sm={6} md={4} key={prompt.id}>
                <Card>
                  <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6">{prompt.title}</Typography>
                      <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => handleCopyToClipboard(prompt.content)} title="Copy to clipboard">
                          <ContentCopy />
                        </IconButton>
                        <IconButton onClick={() => handleUnflag(prompt)} title="Unflag">
                          <Flag color="error" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(prompt)} title="Delete">
                          <Delete />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {prompt.description}
                    </Typography>
                    <Typography variant="body2" color="error" paragraph>
                      Flagged for: {prompt.flagReason}
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
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {allLoading ? (
          <div>Loading...</div>
        ) : (
          <Grid container spacing={3}>
            {allPrompts?.map((prompt) => (
              <Grid item xs={12} sm={6} md={4} key={prompt.id}>
                <PromptCard prompt={prompt} />
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Prompt</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prompt? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={tabValue === 1} onClose={() => setTabValue(0)}>
        <DialogTitle>Flag Prompt</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for flagging"
            fullWidth
            multiline
            rows={3}
            value={flagReason}
            onChange={(e) => setFlagReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTabValue(0)}>Cancel</Button>
          <Button onClick={() => selectedPrompt && handleFlagPrompt(selectedPrompt)} color="error" variant="contained">
            Flag
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 
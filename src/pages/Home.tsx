import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { PlusIcon } from "@heroicons/react/24/outline";
import { db } from "@/lib/firebase";
import { Prompt } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { ModelIcon } from "@/components/ModelIcon";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import "@/styles/model-colors.css";

const categories = [
  "All",
  "Writing",
  "Coding",
  "Analysis",
  "Creative",
  "Business",
];
const modelTypes = [
  "All AI Models",
  "ChatGPT",
  "Claude",
  "Gemini",
  "Mistral",
  "Grok",
  "LLaMA",
  "Midjourney",
];

interface HomeProps {
  searchQuery: string;
}

export function Home({ searchQuery }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedModel, setSelectedModel] = useState("All");
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts"],
    queryFn: async () => {
      const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        modelType: Array.isArray(doc.data().modelType)
          ? doc.data().modelType
          : [doc.data().modelType].filter(Boolean),
        tags: doc.data().tags || [],
      })) as Prompt[];
    },
  });

  const { data: favorites } = useQuery({
    queryKey: ["favorites", user?.uid],
    queryFn: async () => {
      if (!user) return new Set<string>();
      const favoritesRef = collection(db, "favorites", user.uid, "prompts");
      const querySnapshot = await getDocs(favoritesRef);
      return new Set(querySnapshot.docs.map((doc) => doc.id));
    },
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({
      promptId,
      isFavorite,
    }: {
      promptId: string;
      isFavorite: boolean;
    }) => {
      if (!user) throw new Error("User not authenticated");

      // Ensure the parent document exists
      const userFavoritesRef = doc(db, "favorites", user.uid);
      await setDoc(
        userFavoritesRef,
        { lastUpdated: new Date() },
        { merge: true }
      );

      const favoriteRef = doc(db, "favorites", user.uid, "prompts", promptId);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, {
          promptId,
          timestamp: new Date(),
        });
      }

      // Return the action for the success handler
      return { isFavorite };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["favorites", user?.uid] });
      toast.success(
        data.isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    },
    onError: (error) => {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    },
  });

  const handleFavorite = (promptId: string, isCurrentlyFavorite: boolean) => {
    if (!user) {
      toast.error("You must be logged in to favorite prompts");
      return;
    }
    toggleFavoriteMutation.mutate({
      promptId,
      isFavorite: isCurrentlyFavorite,
    });
  };

  const filteredPrompts = prompts?.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || prompt.category === selectedCategory;
    const matchesModel =
      selectedModel === "All" || prompt.modelType.includes(selectedModel);
    return matchesSearch && matchesCategory && matchesModel;
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Prompt Library</h1>
        <p className="text-muted-foreground">Browse and discover AI prompts</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="rounded-full"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {modelTypes.map((model) => {
          const modelKey = model.toLowerCase().replace(/\s+/g, "-");
          return (
            <Button
              key={model}
              variant="outline"
              onClick={() =>
                setSelectedModel(model === "All AI Models" ? "All" : model)
              }
              className={`rounded-full gap-2 ${
                model === "All AI Models"
                  ? "model-button-all-ai-models"
                  : `model-button model-button-${modelKey}`
              }`}
              data-state={
                selectedModel === (model === "All AI Models" ? "All" : model)
                  ? "active"
                  : undefined
              }
            >
              <ModelIcon
                model={model}
                className={model === "All AI Models" ? "icon" : ""}
              />
              <span>{model}</span>
            </Button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts?.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onFavorite={handleFavorite}
            isFavorite={favorites?.has(prompt.id) ?? false}
          />
        ))}
      </div>
    </div>
  );
}

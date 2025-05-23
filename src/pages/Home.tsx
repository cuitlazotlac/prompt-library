import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  limit,
  startAfter,
  DocumentData,
} from "firebase/firestore";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { db } from "@/lib/firebase";
import { Prompt } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/PromptCard";
import { ModelIcon } from "@/components/ModelIcon";
import { AdUnit } from "@/components/AdUnit";
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
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const ITEMS_PER_PAGE = 10;

type SortOption = "newest" | "oldest" | "top" | "bottom";

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "All",
  ]);
  const [selectedModels, setSelectedModels] = useState<string[]>([
    "All AI Models",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ["prompts", currentPage, sortBy],
    queryFn: async () => {
      let q;
      const promptsRef = collection(db, "prompts");

      // Set up the base query with sorting
      switch (sortBy) {
        case "newest":
          q = query(promptsRef, orderBy("createdAt", "desc"));
          break;
        case "oldest":
          q = query(promptsRef, orderBy("createdAt", "asc"));
          break;
        case "top":
          q = query(promptsRef, orderBy("score", "desc"));
          break;
        case "bottom":
          q = query(promptsRef, orderBy("score", "asc"));
          break;
        default:
          q = query(promptsRef, orderBy("createdAt", "desc"));
      }

      // Add pagination
      if (currentPage > 1 && lastVisible) {
        q = query(q, startAfter(lastVisible), limit(ITEMS_PER_PAGE));
      } else {
        q = query(q, limit(ITEMS_PER_PAGE));
      }

      const querySnapshot = await getDocs(q);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

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

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1); // Reset to first page when changing sort
    setLastVisible(null); // Reset pagination cursor
  };

  // Get unique categories from prompts
  const categories = useMemo(() => {
    if (!prompts) return ["All"];
    const uniqueCategories = new Set(prompts.map((prompt) => prompt.category));
    const allCategories = ["All", ...Array.from(uniqueCategories).sort()];
    // Initialize with all categories selected
    if (selectedCategories.length === 0 || selectedCategories[0] === "All") {
      setSelectedCategories(allCategories);
    }
    return allCategories;
  }, [prompts]);

  // Initialize models with all selected
  React.useEffect(() => {
    if (selectedModels.length === 0 || selectedModels[0] === "All AI Models") {
      setSelectedModels(modelTypes);
    }
  }, []);

  const getFilterLabel = (
    selected: string[],
    all: string[],
    allLabel: string
  ) => {
    if (
      selected.length === 0 ||
      selected.length === all.length ||
      (selected.length === 1 && selected[0] === allLabel)
    ) {
      return allLabel;
    }
    return `${selected.length} selected`;
  };

  const handleCategoryChange = (values: string[]) => {
    if (values.includes("All")) {
      // If "All" is selected, select all categories
      setSelectedCategories(categories);
    } else if (values.length === 0) {
      // If nothing is selected, select "All"
      setSelectedCategories(["All"]);
    } else if (selectedCategories.includes("All") && !values.includes("All")) {
      // If "All" was previously selected and now it's not, clear all selections
      setSelectedCategories([]);
    } else {
      setSelectedCategories(values);
    }
    setCurrentPage(1);
    setLastVisible(null);
  };

  const handleModelChange = (values: string[]) => {
    if (values.includes("All AI Models")) {
      // If "All" is selected, select all models
      setSelectedModels(modelTypes);
    } else if (values.length === 0) {
      // If nothing is selected, select "All"
      setSelectedModels(["All AI Models"]);
    } else if (
      selectedModels.includes("All AI Models") &&
      !values.includes("All AI Models")
    ) {
      // If "All" was previously selected and now it's not, clear all selections
      setSelectedModels([]);
    } else {
      setSelectedModels(values);
    }
    setCurrentPage(1);
    setLastVisible(null);
  };

  const filteredPrompts =
    prompts?.filter((prompt) => {
      const matchesSearch = prompt.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.includes("All") ||
        selectedCategories.includes(prompt.category);
      const matchesModel =
        selectedModels.includes("All AI Models") ||
        prompt.modelType.some((model) => selectedModels.includes(model));
      return matchesSearch && matchesCategory && matchesModel;
    }) || [];

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Prompt Lab</h1>
          <p className="text-muted-foreground">
            Browse, discover and share AI prompts
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-wrap gap-4 justify-between items-center w-full">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Most Upvoted</SelectItem>
                    <SelectItem value="bottom">Least Upvoted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Categories:
                </span>
                <MultiSelect
                  options={categories.filter((c) => c !== "All")}
                  value={selectedCategories}
                  onValueChange={handleCategoryChange}
                  allOptionLabel="All"
                />
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  AI Models:
                </span>
                <MultiSelect
                  options={modelTypes.filter((m) => m !== "All AI Models")}
                  value={selectedModels}
                  onValueChange={setSelectedModels}
                  allOptionLabel="All AI Models"
                />
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSortBy("newest");
                setSelectedCategories(["All"]);
                setSelectedModels(["All AI Models"]);
                setSearchQuery("");
              }}
              className="h-10"
            >
              Clear Filters
            </Button>
          </div>
        </div>
        <br />
        <div className="text-sm text-gray-500">
          {filteredPrompts.length} prompts found
        </div>

        <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[300px] w-full rounded-lg bg-muted animate-pulse"
              />
            ))
          ) : filteredPrompts.length > 0 ? (
            filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isFavorite={favorites?.has(prompt.id) || false}
                onFavorite={handleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No prompts found
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-4 justify-center items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex gap-2 items-center"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={filteredPrompts.length < ITEMS_PER_PAGE}
            className="flex gap-2 items-center"
          >
            Next
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}

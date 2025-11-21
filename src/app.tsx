import {
  type CollectionConfig,
  CollectionContextProvider,
  createCommentsCollection,
  createEntriesCollection,
  useCollections,
} from "@/lib/collections";
import { useEntries, useEntriesOnDate } from "@/lib/hooks";
import type { Entry } from "@/lib/schemas";
import {
  AsideLayout,
  EntryCreateDialog,
  EntryDetailDialog,
  EntryList,
  EntryPreviewList,
} from "@/components";
import { useCurrentDate } from "@/lib/utils-hooks";
import { createIdbStorage } from "@/lib/storage-adapters";
import { PenIcon } from "@phosphor-icons/react";
import { isSameDay } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

// Storage setup
const storage = createIdbStorage();

const collectionConfig: CollectionConfig = {
  entriesCollection: createEntriesCollection(storage),
  commentsCollection: createCommentsCollection(storage),
};

// Dialog state types
type DialogMode =
  | { type: "none" }
  | { type: "create-entry" }
  | { type: "view-entry"; entry: Entry };

// Past entries component
function PastEntries({ onEntryClick }: { onEntryClick: (entry: Entry) => void }) {
  const today = useCurrentDate();
  const { data: allEntries } = useEntries();

  const pastEntries = useMemo(() => {
    if (!allEntries) return [];

    const grouped = allEntries
      .filter((e) => !isSameDay(today, e.createdAt))
      .reduce(
        (acc, entry) => {
          const date = entry.createdAt.split("T")[0]!;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push({
            id: entry.id,
            content: entry.content,
            createdAt: entry.createdAt,
          });
          return acc;
        },
        {} as Record<string, { id: string; content: string; createdAt: string }[]>,
      );

    return Object.entries(grouped).map(([date, entries]) => ({
      date,
      entries,
    }));
  }, [allEntries, today]);

  return <EntryPreviewList data={pastEntries} onEntryClick={onEntryClick} />;
}

// Today's entries component
function TodayEntries({ onEntryClick }: { onEntryClick: (entry: Entry) => void }) {
  const today = useCurrentDate();
  const { data: entries } = useEntriesOnDate(today);

  return entries.length > 0 ? (
    <EntryList entries={entries} onEntryClick={onEntryClick} />
  ) : (
    <p className="text-center p-10 text-lg text-lightgray/70">
      No entries yet today
    </p>
  );
}

// Today header
function TodayHeader() {
  const today = useCurrentDate();

  const formatted = useMemo(() => {
    return new Date(today).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [today]);

  return (
    <header className="mb-6">
      <h1 className="text-2xl font-semibold text-yellow">Today</h1>
      <p className="text-lightgray/70">{formatted}</p>
    </header>
  );
}

// Main journal content
function JournalContent() {
  const [dialogMode, setDialogMode] = useState<DialogMode>({ type: "none" });
  const { entriesCollection, commentsCollection } = useCollections();

  const handleEntryClick = useCallback((entry: Entry) => {
    setDialogMode({ type: "view-entry", entry });
  }, []);

  const handleCreateEntry = useCallback(
    (content: string) => {
      entriesCollection.insert({ content });
      setDialogMode({ type: "none" });
    },
    [entriesCollection],
  );

  const handleAddComment = useCallback(
    (comment: string) => {
      if (dialogMode.type !== "view-entry") return;
      commentsCollection.insert({
        entryId: dialogMode.entry.id,
        content: comment,
      });
    },
    [dialogMode, commentsCollection],
  );

  const handleCloseDialog = useCallback(() => {
    setDialogMode({ type: "none" });
  }, []);

  return (
    <>
      <AsideLayout.Root>
        <AsideLayout.Aside>
          <header className="mb-6">
            <h2 className="text-xl font-semibold text-lightgray/70">Past Entries</h2>
          </header>
          <PastEntries onEntryClick={handleEntryClick} />
        </AsideLayout.Aside>
        <AsideLayout.Main>
          <TodayHeader />
          <TodayEntries onEntryClick={handleEntryClick} />
          <div className="fixed bottom-6 right-6">
            <button
              type="button"
              className="size-14 flex items-center bg-yellow text-black rounded-full justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
              onClick={() => setDialogMode({ type: "create-entry" })}
            >
              <PenIcon className="size-6" />
            </button>
          </div>
        </AsideLayout.Main>
      </AsideLayout.Root>

      <EntryCreateDialog
        open={dialogMode.type === "create-entry"}
        onSubmit={handleCreateEntry}
        onClose={handleCloseDialog}
      />

      <EntryDetailDialog
        entry={dialogMode.type === "view-entry" ? dialogMode.entry : undefined}
        isOpen={dialogMode.type === "view-entry"}
        onClose={handleCloseDialog}
        onComment={handleAddComment}
      />
    </>
  );
}

// App root
function App() {
  return (
    <CollectionContextProvider config={collectionConfig}>
      <JournalContent />
    </CollectionContextProvider>
  );
}

// Mount
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);

import { useState, useEffect } from "react";
import {
  List,
  ActionPanel,
  Action,
  Icon,
  useNavigation,
  showToast,
  Toast,
  confirmAlert,
  LocalStorage,
} from "@raycast/api";
import AddStreak from "./addStreak";
import EditStreak from "./editStreak";
import { Streak } from "./types";

export default function Command() {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const { push } = useNavigation();

  useEffect(() => {
    (async () => {
      const storedStreaks = await LocalStorage.getItem<string>("streaks");
      if (storedStreaks) {
        setStreaks(JSON.parse(storedStreaks));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("streaks", JSON.stringify(streaks));
  }, [streaks]);

  return (
    <List>
      <List.Item
        title="Add New Streak"
        icon={Icon.Plus}
        actions={
          <ActionPanel>
            <Action title="Add Streak" onAction={() => push(<AddStreak onSave={handleAddStreak} />)} />
          </ActionPanel>
        }
      />
      {streaks.map((streak) => (
        <List.Item
          key={streak.id}
          title={streak.name}
          subtitle={`Progress: ${streak.progress} / ${streak.goal}`}
          icon={Icon.Star}
          actions={
            <ActionPanel>
              <Action title="Increment Streak" onAction={() => handleIncrementStreak(streak.id)} />
              <Action title="Decrement Streak" onAction={() => handleDecrementStreak(streak.id)} />
              <Action
                title="Edit Streak"
                onAction={() => push(<EditStreak streak={streak} onSave={handleEditStreak} />)}
              />
              <Action title="Delete Streak" onAction={() => handleDeleteStreak(streak.id)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );

  function handleAddStreak(newStreak: Streak) {
    setStreaks([...streaks, newStreak]);
  }

  function handleIncrementStreak(id: string) {
    setStreaks(streaks.map((streak) => (streak.id === id ? { ...streak, progress: streak.progress + 1 } : streak)));
  }

  function handleDecrementStreak(id: string) {
    setStreaks(
      streaks.map((streak) => (streak.id === id ? { ...streak, progress: Math.max(streak.progress - 1, 0) } : streak)),
    );
  }

  function handleEditStreak(updatedStreak: Streak) {
    setStreaks(streaks.map((streak) => (streak.id === updatedStreak.id ? updatedStreak : streak)));
  }

  async function handleDeleteStreak(id: string) {
    const confirmed = await confirmAlert({
      title: "Delete Streak",
      message: "Are you sure you want to delete this streak?",
      primaryAction: {
        title: "Delete",
      },
    });

    if (confirmed) {
      setStreaks(streaks.filter((streak) => streak.id !== id));
      showToast(Toast.Style.Success, "Streak deleted successfully");
    }
  }
}

import { useState } from "react";
import { List, ActionPanel, Action, Icon, useNavigation } from "@raycast/api";
import AddStreak from "./add-streak";
import { Streak } from "./types";

const initialStreaks: Streak[] = [];

export default function Command() {
  const [streaks, setStreaks] = useState<Streak[]>(initialStreaks);
  const { push } = useNavigation();

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
              <Action title="Check In" onAction={() => handleCheckIn(streak.id)} />
              <Action title="Edit Streak" onAction={() => handleEditStreak(streak.id)} />
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

  function handleCheckIn(id: string) {
    setStreaks(
      streaks.map((streak) =>
        streak.id === id
          ? { ...streak, progress: streak.progress + 1, lastCheckInDate: new Date().toISOString() }
          : streak,
      ),
    );
  }

  function handleEditStreak(id: string) {
    // Logic to edit streak
  }

  function handleDeleteStreak(id: string) {
    setStreaks(streaks.filter((streak) => streak.id !== id));
  }
}

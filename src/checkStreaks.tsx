import { useState } from "react";
import { List, ActionPanel, Action, Icon } from "@raycast/api";
import { Streak } from "./types";

const initialStreaks: Streak[] = []; // Fetch from storage or state

export default function CheckStreaks() {
  const [streaks, setStreaks] = useState<Streak[]>(initialStreaks);

  return (
    <List>
      {streaks.map((streak) => (
        <List.Item
          key={streak.id}
          title={streak.name}
          subtitle={`Progress: ${streak.progress} / ${streak.goal}`}
          icon={Icon.Star}
          actions={
            <ActionPanel>
              <Action title="Log Streak" onAction={() => handleCheckIn(streak.id)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );

  function handleCheckIn(id: string) {
    setStreaks(
      streaks.map((streak) =>
        streak.id === id
          ? { ...streak, progress: streak.progress + 1, lastCheckInDate: new Date().toISOString() }
          : streak,
      ),
    );
  }
}

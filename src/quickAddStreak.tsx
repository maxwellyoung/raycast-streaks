import { useState, useEffect } from "react";
import { ActionPanel, Action, Form, showToast, Toast, LocalStorage } from "@raycast/api";
import { Streak } from "./types";

export default function QuickAddStreak() {
  const [streaks, setStreaks] = useState<Streak[]>([]);
  const [selectedStreakId, setSelectedStreakId] = useState<string>("");
  const [streakToUpdate, setStreakToUpdate] = useState<Streak | null>(null);

  useEffect(() => {
    (async () => {
      const storedStreaks = await LocalStorage.getItem<string>("streaks");
      if (storedStreaks) {
        const streaksList = JSON.parse(storedStreaks);
        setStreaks(streaksList);
        setSelectedStreakId(streaksList[0]?.id || "");
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedStreakId) {
      const streak = streaks.find((streak) => streak.id === selectedStreakId);
      setStreakToUpdate(streak || null);
    }
  }, [selectedStreakId, streaks]);

  function handleQuickAdd() {
    if (streakToUpdate) {
      const updatedStreaks = streaks.map((streak) =>
        streak.id === streakToUpdate.id ? { ...streak, progress: streak.progress + 1 } : streak,
      );
      setStreaks(updatedStreaks);
      LocalStorage.setItem("streaks", JSON.stringify(updatedStreaks));
      showToast(Toast.Style.Success, "Streak progress updated");
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action title="Quick Add" onAction={handleQuickAdd} />
        </ActionPanel>
      }
    >
      <Form.Dropdown id="streak" title="Select Streak" value={selectedStreakId} onChange={setSelectedStreakId}>
        {streaks.map((streak) => (
          <Form.Dropdown.Item key={streak.id} value={streak.id} title={streak.name} />
        ))}
      </Form.Dropdown>
    </Form>
  );
}

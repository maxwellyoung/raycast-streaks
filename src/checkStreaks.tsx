import { useState, useEffect } from "react";
import { List, Icon, LocalStorage } from "@raycast/api";
import { Streak } from "./types";

export default function CheckStreaks() {
  const [streaks, setStreaks] = useState<Streak[]>([]);

  useEffect(() => {
    (async () => {
      const storedStreaks = await LocalStorage.getItem<string>("streaks");
      if (storedStreaks) {
        setStreaks(JSON.parse(storedStreaks));
      }
    })();
  }, []);

  return (
    <List>
      {streaks.map((streak) => (
        <List.Item
          key={streak.id}
          title={streak.name}
          subtitle={`Progress: ${streak.progress} / ${streak.goal}`}
          icon={Icon.Star}
        />
      ))}
    </List>
  );
}

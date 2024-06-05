import { useState } from "react";
import { Form, ActionPanel, Action, popToRoot, showToast, Toast } from "@raycast/api";
import { Streak } from "./types";

type EditStreakProps = {
  streak: Streak;
  onSave: (updatedStreak: Streak) => void;
};

export default function EditStreak({ streak, onSave }: EditStreakProps) {
  const [name, setName] = useState<string>(streak?.name ?? "");
  const [frequency, setFrequency] = useState<string>(streak?.frequency ?? "daily");
  const [customFrequency, setCustomFrequency] = useState<number>(
    streak?.frequency === "custom" ? parseInt(streak.frequency.split(" ")[0]) : 1,
  );
  const [goal, setGoal] = useState<number>(streak?.goal ?? 1);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save Changes" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Streak Name" value={name} onChange={setName} />
      <Form.Dropdown id="frequency" title="Frequency" value={frequency} onChange={setFrequency}>
        <Form.Dropdown.Item value="daily" title="Daily" />
        <Form.Dropdown.Item value="3 times a week" title="3 times a week" />
        <Form.Dropdown.Item value="weekly" title="Weekly" />
        <Form.Dropdown.Item value="custom" title="Custom" />
      </Form.Dropdown>
      {frequency === "custom" && (
        <Form.TextField
          id="customFrequency"
          title="Custom Frequency (days per week)"
          value={customFrequency.toString()}
          onChange={(newFrequency) => setCustomFrequency(Number(newFrequency))}
        />
      )}
      <Form.TextField
        id="goal"
        title="Goal (per week)"
        value={goal.toString()}
        onChange={(newGoal) => setGoal(Number(newGoal))}
      />
    </Form>
  );

  function handleSubmit() {
    if (name.trim() === "") {
      showToast(Toast.Style.Failure, "Name is required");
      return;
    }

    const updatedStreak: Streak = {
      ...streak,
      name,
      frequency: frequency === "custom" ? `${customFrequency} times a week` : frequency,
      goal,
    };

    onSave(updatedStreak);
    showToast(Toast.Style.Success, "Streak updated successfully");
    popToRoot();
  }
}

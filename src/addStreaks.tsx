import { useState } from "react";
import { Form, ActionPanel, Action, popToRoot, showToast, Toast } from "@raycast/api";
import { Streak } from "./types";

const frequencyOptions = ["daily", "weekly", "custom"];

export default function AddStreak({ onSave }: { onSave: (newStreak: Streak) => void }) {
  const [name, setName] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("daily");
  const [customFrequency, setCustomFrequency] = useState<number>(1);
  const [goal, setGoal] = useState<number>(1);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Streak" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Streak Name" value={name} onChange={setName} />
      <Form.Dropdown id="frequency" title="Frequency" value={frequency} onChange={setFrequency}>
        {frequencyOptions.map((option) => (
          <Form.Dropdown.Item key={option} value={option} title={option} />
        ))}
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

    const newStreak: Streak = {
      id: Math.random().toString(36).substring(2),
      name,
      frequency: frequency === "custom" ? `${customFrequency} times a week` : frequency,
      progress: 0,
      goal,
    };

    onSave(newStreak);
    showToast(Toast.Style.Success, "Streak added successfully");
    popToRoot();
  }
}

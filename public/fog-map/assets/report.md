# Fog Map ambiguity report

Live api: three independent model requests

Severity = differing agent pairs (0–3) × maximum impact (1–3). Textual comparison; semantically equivalent phrasing can be overflagged.

## 1. team habit ownership — severity 9/9
Line 2: Build a habit-tracking app with streaks and teams.

- **backend engineer:** A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak.
- **frontend engineer:** The team owner is the user who created the habit, and their completion counts are tracked.
- **QA engineer:** The owner of a shared habit is the user who created it, and completion counts are tracked by the owner.

## 2. team habit ownership — severity 9/9
Line 5: Team members share habits and see team progress.

- **backend engineer:** A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak.
- **frontend engineer:** The team owner is the user who created the habit, and their completion counts are tracked.
- **QA engineer:** The owner of a shared habit is the user who created it, and completion counts are tracked by the owner.

## 3. missed-day grace — severity 6/9
Line 4: A missed day can be forgiven with a grace period.

- **backend engineer:** The grace period is 7 days, and it is available once per team.
- **frontend engineer:** The grace period is 7 days, and it is available once per missed day.
- **QA engineer:** The grace period is 7 days, and it is available once per missed day.

## 4. notification delivery — severity 4/9
Line 7: Notify people when their streak is at risk.

- **backend engineer:** Notifications are sent via email, to all team members, and triggered at 23:59:59 UTC-8.
- **frontend engineer:** Notifications are delivered via email, and are triggered 24 hours before a streak is at risk.
- **QA engineer:** Notifications are delivered via email, and are triggered 24 hours before a streak is at risk.

## 5. day boundary — severity 3/9
Line 3: Users can complete each habit daily and keep their streak alive.

- **backend engineer:** The day ends at 23:59:59 UTC-8, and the default timezone is set to UTC-8.
- **frontend engineer:** The day boundary is set to 23:59, and the app uses the user's timezone.
- **QA engineer:** The day ends at 23:59:59 UTC-8, and the app uses the user's timezone for time calculations.

## 6. historical edits — severity 3/9
Line 6: Users should be able to edit past check-ins.

- **backend engineer:** The edit time limit is 30 days, and edits recompute streaks if they are within the grace period.
- **frontend engineer:** The edit time limit is 30 days, and edits recompute streaks.
- **QA engineer:** The edit time limit is 30 days, and edits do not recompute streaks.

## Full interpretations

### backend engineer
```json
{
  "data_model": {
    "user": [
      "user_id",
      "username",
      "email",
      "timezone"
    ],
    "habit": [
      "habit_id",
      "name",
      "team_id",
      "completed_days",
      "last_complete_date"
    ],
    "edit": [
      "edit_id",
      "habit_id",
      "user_id",
      "timestamp",
      "is_recompute"
    ]
  },
  "endpoints": [
    "/api/users",
    "/api/habits",
    "/api/edit"
  ],
  "decisions": [
    {
      "line": 2,
      "topic": "team habit ownership",
      "question": "Who owns a shared habit, and whose completion counts?",
      "impact": 3,
      "assumption": "A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak."
    },
    {
      "line": 3,
      "topic": "day boundary",
      "question": "Exactly when does the day end, and in which timezone?",
      "impact": 1,
      "assumption": "The day ends at 23:59:59 UTC-8, and the default timezone is set to UTC-8."
    },
    {
      "line": 4,
      "topic": "missed-day grace",
      "question": "How long is the grace period, and how often is it available?",
      "impact": 2,
      "assumption": "The grace period is 7 days, and it is available once per team."
    },
    {
      "line": 5,
      "topic": "team habit ownership",
      "question": "Who owns a shared habit, and whose completion counts?",
      "impact": 3,
      "assumption": "A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak."
    },
    {
      "line": 6,
      "topic": "historical edits",
      "question": "What is the edit time limit, and do edits recompute streaks?",
      "impact": 1,
      "assumption": "The edit time limit is 30 days, and edits recompute streaks if they are within the grace period."
    },
    {
      "line": 7,
      "topic": "notification delivery",
      "question": "Which channel, recipients, and trigger time?",
      "impact": 2,
      "assumption": "Notifications are sent via email, to all team members, and triggered at 23:59:59 UTC-8."
    }
  ],
  "persona": "backend engineer",
  "provider_evidence": {
    "model": "Qwen3-1.7B-Q4_K_M",
    "usage": {
      "prompt_tokens": 481,
      "completion_tokens": 571,
      "total_tokens": 1052
    },
    "elapsed_seconds": 84.215,
    "raw_content": "{\n  \"data_model\": {\n    \"user\": [\n      \"user_id\",\n      \"username\",\n      \"email\",\n      \"timezone\"\n    ],\n    \"habit\": [\n      \"habit_id\",\n      \"name\",\n      \"team_id\",\n      \"completed_days\",\n      \"last_complete_date\"\n    ],\n    \"edit\": [\n      \"edit_id\",\n      \"habit_id\",\n      \"user_id\",\n      \"timestamp\",\n      \"is_recompute\"\n    ]\n  },\n  \"endpoints\": [\n    \"/api/users\",\n    \"/api/habits\",\n    \"/api/edit\"\n  ],\n  \"decisions\": [\n    {\n      \"line\": 2,\n      \"topic\": \"team habit ownership\",\n      \"question\": \"Who owns a shared habit, and whose completion counts?\",\n      \"impact\": 3,\n      \"assumption\": \"A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak.\"\n    },\n    {\n      \"line\": 3,\n      \"topic\": \"day boundary\",\n      \"question\": \"Exactly when does the day end, and in which timezone?\",\n      \"impact\": 1,\n      \"assumption\": \"The day ends at 23:59:59 UTC-8, and the default timezone is set to UTC-8.\"\n    },\n    {\n      \"line\": 4,\n      \"topic\": \"missed-day grace\",\n      \"question\": \"How long is the grace period, and how often is it available?\",\n      \"impact\": 2,\n      \"assumption\": \"The grace period is 7 days, and it is available once per team.\"\n    },\n    {\n      \"line\": 5,\n      \"topic\": \"team habit ownership\",\n      \"question\": \"Who owns a shared habit, and whose completion counts?\",\n      \"impact\": 3,\n      \"assumption\": \"A shared habit is owned by the team leader, and only the team leader's completion counts toward the team streak.\"\n    },\n    {\n      \"line\": 6,\n      \"topic\": \"historical edits\",\n      \"question\": \"What is the edit time limit, and do edits recompute streaks?\",\n      \"impact\": 1,\n      \"assumption\": \"The edit time limit is 30 days, and edits recompute streaks if they are within the grace period.\"\n    },\n    {\n      \"line\": 7,\n      \"topic\": \"notification delivery\",\n      \"question\": \"Which channel, recipients, and trigger time?\",\n      \"impact\": 2,\n      \"assumption\": \"Notifications are sent via email, to all team members, and triggered at 23:59:59 UTC-8.\"\n    }\n  ]\n}"
  }
}
```

### frontend engineer
```json
{
  "data_model": {
    "user": [
      "userId",
      "email",
      "timezone"
    ],
    "habit": [
      "habitId",
      "name",
      "teamId",
      "completedAt"
    ],
    "edit": [
      "editId",
      "habitId",
      "userId",
      "timestamp"
    ]
  },
  "endpoints": [
    "/api/users",
    "/api/habits",
    "/api/edit-history"
  ],
  "decisions": [
    {
      "line": 2,
      "topic": "team habit ownership",
      "impact": 2,
      "assumption": "The team owner is the user who created the habit, and their completion counts are tracked."
    },
    {
      "line": 3,
      "topic": "day boundary",
      "impact": 1,
      "assumption": "The day boundary is set to 23:59, and the app uses the user's timezone."
    },
    {
      "line": 4,
      "topic": "missed-day grace",
      "impact": 3,
      "assumption": "The grace period is 7 days, and it is available once per missed day."
    },
    {
      "line": 5,
      "topic": "team habit ownership",
      "impact": 2,
      "assumption": "The team owner is the user who created the habit, and their completion counts are tracked."
    },
    {
      "line": 6,
      "topic": "historical edits",
      "impact": 1,
      "assumption": "The edit time limit is 30 days, and edits recompute streaks."
    },
    {
      "line": 7,
      "topic": "notification delivery",
      "impact": 2,
      "assumption": "Notifications are delivered via email, and are triggered 24 hours before a streak is at risk."
    }
  ],
  "persona": "frontend engineer",
  "provider_evidence": {
    "model": "Qwen3-1.7B-Q4_K_M",
    "usage": {
      "prompt_tokens": 481,
      "completion_tokens": 405,
      "total_tokens": 886
    },
    "elapsed_seconds": 131.791,
    "raw_content": "{\n  \"data_model\": {\n    \"user\": [\"userId\", \"email\", \"timezone\"],\n    \"habit\": [\"habitId\", \"name\", \"teamId\", \"completedAt\"],\n    \"edit\": [\"editId\", \"habitId\", \"userId\", \"timestamp\"]\n  },\n  \"endpoints\": [\n    \"/api/users\", \n    \"/api/habits\", \n    \"/api/edit-history\"\n  ],\n  \"decisions\": [\n    {\n      \"line\": 2,\n      \"topic\": \"team habit ownership\",\n      \"impact\": 2,\n      \"assumption\": \"The team owner is the user who created the habit, and their completion counts are tracked.\"\n    },\n    {\n      \"line\": 3,\n      \"topic\": \"day boundary\",\n      \"impact\": 1,\n      \"assumption\": \"The day boundary is set to 23:59, and the app uses the user's timezone.\"\n    },\n    {\n      \"line\": 4,\n      \"topic\": \"missed-day grace\",\n      \"impact\": 3,\n      \"assumption\": \"The grace period is 7 days, and it is available once per missed day.\"\n    },\n    {\n      \"line\": 5,\n      \"topic\": \"team habit ownership\",\n      \"impact\": 2,\n      \"assumption\": \"The team owner is the user who created the habit, and their completion counts are tracked.\"\n    },\n    {\n      \"line\": 6,\n      \"topic\": \"historical edits\",\n      \"impact\": 1,\n      \"assumption\": \"The edit time limit is 30 days, and edits recompute streaks.\"\n    },\n    {\n      \"line\": 7,\n      \"topic\": \"notification delivery\",\n      \"impact\": 2,\n      \"assumption\": \"Notifications are delivered via email, and are triggered 24 hours before a streak is at risk.\"\n    }\n  ]\n}"
  }
}
```

### QA engineer
```json
{
  "data_model": {
    "user": [
      "user_id",
      "name",
      "email",
      "timezone"
    ],
    "habit": [
      "habit_id",
      "name",
      "team_id",
      "user_id",
      "created_at",
      "last_updated"
    ],
    "edit": [
      "edit_id",
      "habit_id",
      "user_id",
      "timestamp"
    ]
  },
  "endpoints": [
    "/api/users",
    "/api/habits",
    "/api/edit-history"
  ],
  "decisions": [
    {
      "line": 2,
      "topic": "team habit ownership",
      "impact": 2,
      "assumption": "The owner of a shared habit is the user who created it, and completion counts are tracked by the owner."
    },
    {
      "line": 3,
      "topic": "day boundary",
      "impact": 1,
      "assumption": "The day ends at 23:59:59 UTC-8, and the app uses the user's timezone for time calculations."
    },
    {
      "line": 4,
      "topic": "missed-day grace",
      "impact": 3,
      "assumption": "The grace period is 7 days, and it is available once per missed day."
    },
    {
      "line": 5,
      "topic": "team habit ownership",
      "impact": 2,
      "assumption": "The owner of a shared habit is the user who created it, and completion counts are tracked by the owner."
    },
    {
      "line": 6,
      "topic": "historical edits",
      "impact": 1,
      "assumption": "The edit time limit is 30 days, and edits do not recompute streaks."
    },
    {
      "line": 7,
      "topic": "notification delivery",
      "impact": 2,
      "assumption": "Notifications are delivered via email, and are triggered 24 hours before a streak is at risk."
    }
  ],
  "persona": "QA engineer",
  "provider_evidence": {
    "model": "Qwen3-1.7B-Q4_K_M",
    "usage": {
      "prompt_tokens": 482,
      "completion_tokens": 456,
      "total_tokens": 938
    },
    "elapsed_seconds": 183.033,
    "raw_content": "{\n  \"data_model\": {\n    \"user\": [\n      \"user_id\",\n      \"name\",\n      \"email\",\n      \"timezone\"\n    ],\n    \"habit\": [\n      \"habit_id\",\n      \"name\",\n      \"team_id\",\n      \"user_id\",\n      \"created_at\",\n      \"last_updated\"\n    ],\n    \"edit\": [\n      \"edit_id\",\n      \"habit_id\",\n      \"user_id\",\n      \"timestamp\"\n    ]\n  },\n  \"endpoints\": [\n    \"/api/users\",\n    \"/api/habits\",\n    \"/api/edit-history\"\n  ],\n  \"decisions\": [\n    {\n      \"line\": 2,\n      \"topic\": \"team habit ownership\",\n      \"impact\": 2,\n      \"assumption\": \"The owner of a shared habit is the user who created it, and completion counts are tracked by the owner.\"\n    },\n    {\n      \"line\": 3,\n      \"topic\": \"day boundary\",\n      \"impact\": 1,\n      \"assumption\": \"The day ends at 23:59:59 UTC-8, and the app uses the user's timezone for time calculations.\"\n    },\n    {\n      \"line\": 4,\n      \"topic\": \"missed-day grace\",\n      \"impact\": 3,\n      \"assumption\": \"The grace period is 7 days, and it is available once per missed day.\"\n    },\n    {\n      \"line\": 5,\n      \"topic\": \"team habit ownership\",\n      \"impact\": 2,\n      \"assumption\": \"The owner of a shared habit is the user who created it, and completion counts are tracked by the owner.\"\n    },\n    {\n      \"line\": 6,\n      \"topic\": \"historical edits\",\n      \"impact\": 1,\n      \"assumption\": \"The edit time limit is 30 days, and edits do not recompute streaks.\"\n    },\n    {\n      \"line\": 7,\n      \"topic\": \"notification delivery\",\n      \"impact\": 2,\n      \"assumption\": \"Notifications are delivered via email, and are triggered 24 hours before a streak is at risk.\"\n    }\n  ]\n}"
  }
}
```

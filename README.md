# Update Set Naming Validator

This script ensures that all **ServiceNow Update Sets** conform to instance's established naming conventions, helping enforce consistency, traceability, and project governance—especially when working with external contributors.

## Purpose

To automatically validate the naming of Update Sets in ServiceNow. The validator ensures that:

- Internal and external developers follow distinct, predefined patterns.
- External contributors include a valid project ID and Jira/Story reference.
- Update sets created by the **system user**, **Catalog Builder**, or ServiceNow system processes (e.g., "Unified update set") are **excluded** from validation.

If the naming does not match the expected format, the update is blocked and a helpful error message is displayed.

## Naming Convention Pattern

The naming pattern should follow this format:

```
CINTO; BRO; 27-12-24; STRY123456; Story title
│      │     │          │
│      │     │          └── Jira Issue ID or Story ID
│      │     └──────────── Creation Date (dd-mm-yy)
│      └────────────────── Developer initials (2–3 letters)
└───────────────────────── (Optional) Project ID – Required for external contributors
```


## Configuration

The validator relies on a system property `development.projects` that should contain vendor-specific JSON rules in the following format:

```json
{
  "vendor.com": [
    {
      "regex": "^CINTO;\s*[A-Z]{2,3};\s*\d{2}-\d{2}-\d{2};\s*STRY\d{5};\s*.+$",
      "status": "active"
    }
  ]
}
```

- Replace `vendor.com` with the domain of the contributor's email address.
- Update the `regex` to reflect the proper naming rules for each vendor.
- Only patterns with `"status": "active"` will be enforced.

## Behavior

- **Pass:** The Update Set is named correctly → save proceeds normally.
- **Fail:** Incorrect format → save is aborted with an informative error message and a link to the documentation.
- **No Match:** No pattern found for the user's email domain → save is aborted and the user is prompted to contact the Project Manager.

## Ignored Cases

Update Set validation is skipped when:

- The Update Set is created by the **system user**.
- The name begins with **CB_** (Catalog Builder generated).
- The name is **"Unified update set"** (system auto-generated during batch updates).



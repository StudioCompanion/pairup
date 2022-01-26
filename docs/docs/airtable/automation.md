---
title: Automating Emails 📨
sidebar_position: 3
---

Airtable provides an automation feature. We can create **trigger - action** pairs to simulate repeated actions and be more time efficient when managing the records.

### Sending email to reporter upon case completion ⚡️

- We find `Automations` in the top right of our table page
- From the `Suggested Automations`, we choose `Create a custom automation`
- First we have to create a `TRIGGER`:
  - in the `Trigger Type` we choose `When record matches conditions`
  - in the configuration, we select our working table and we fill in the conditions that have to be met for the trigger to happen.
- Then we move on to `ACTIONS`:
  - in the `Action Type` we choose `Send Email`
  - in the configuration we write a template, which we fill with the report specifics that come from our record. `Airtable` let us dynamically manage email addresses and pass fields from the table record into our fields. To do this we simply have to click on the `+` button and select `Record (from Step 1: ...)`

That's it! We have now successfully created an automation that allows us to automatically send email to a reporter after their case has been marked as `Completed` in their record ✨

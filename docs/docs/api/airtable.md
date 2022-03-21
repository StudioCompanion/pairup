---
title: Airtable
sidebar_position: 7
---

We are using `Airtable` to store and manage the abuse reports sent by app users.

Our table for abuse reports is [here](https://airtable.com/appt58t6XthcfoN5i/tblYNGUfquRPtfXuq/viwOSFStjUrprDpNo?blocks=hide).

Airtable provides a flexible interface that can help users refine their data view. In the Abuse Reports table, we have a complete overview of a report submitted by a user, as well as extra fields for the admin to manage them.

## Every report submitted by a user creates a new record in our table 📥

![New Record](/img/new-record.png)

The fields currently submitted by the user are:

- Name
- Email
- Reporter identity (pairer or pairee?)
- Nature of the abuse
- Is the abuser a pairer?
- Incident description
- Attachments

### Admin record fields 🧰

![Admin Fields](/img/admin-fields.png)

- We attach some extra fields to each record for admin purposes. These are:
  - Record creation date
  - Created by
  - Admin comments
  - Severity
  - Status
  - Reply for reporter upon completion

## Sending an email to the reporter upon case completion ⚡️

Airtable provides an [automation feature](https://www.airtable.com/product/automations). We can create `trigger - action` pairs to simulate repeated actions and be more efficient in managing the records.

- We find `Automations` in the top right of our table page
- From the `Suggested Automations`, we choose `Create a custom automation`
- First we have to choose and create a `TRIGGER`:
  - in the `Trigger Type` we choose `When record matches conditions`
  - in the configuration, we select our working table and we fill in the conditions that have to be met for the trigger to happen.
- Then we move on to `ACTIONS`:
  - in the `Action Type` we choose `Send Email`
  - in the configuration we write a template, which we fill with the report specifics that come from our record. `Airtable` let us dynamically manage email addresses and pass fields from the table record into our fields. To do this we simply have to click on the `+` button and select `Record (from Step 1: ...)`

That's it! We have now successfully created an automation that allows us to send email to a reporter after their case has been marked as `Completed` in their record ✨

In the following screenshots you can see that the user with `Completed` status has received an email with our template text and all the information we provide them as admin.

![Case Completed](/img/case-completed.png)
![Email Completed](/img/email-completed.png)

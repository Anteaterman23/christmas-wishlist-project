# Christmas Wishlist Application

## What is this project?
In 2025, my extended family was running into a problem around the holiday season. All of us had our own separate "wishlists" and we all needed to share them with each other. But we needed a centralized place to do so, and with some specific quality-of-life features. Specifically, we needed to resolve two issues:

1. The **owner** of a wishlist should not be able to tell when an item has been bought off of their list
2. All **buyers** should know whether or not an item has already been bought so nobody buys duplicates

## Features
When users hit the [website URL](https://christmas-wishlist-project.vercel.app), they will first see a login page with a password.

<img width="458" height="266" alt="image" src="https://github.com/user-attachments/assets/ef7b0c61-7354-4fe4-9b18-15196c862953" />

When they enter the password, they can choose which family member to log in as, or they can log in as "Guest." _(This is mostly for extended family members who do not need their own lists but would like to view and purchase from users' lists.)_

<img width="389" height="450" alt="image" src="https://github.com/user-attachments/assets/bc380254-d1ee-494f-a966-f5059832d6d2" />

#### If logging in as user:
- Items can be added on the “My Wishlist” tab
  - Items can include a hyperlink and additional comments
  - Use additional comments to specify things like size (for clothing), color, or other details you want buyers to know
- You can view other wishlists on the “Buy for Others” tab
  - If you purchase any item off of someone’s wishlist, click “Mark as Purchased”
  - Any other user who views this item will see that it's been purchased and that you are the one who bought it

#### If logging in as guest:
- You will not be able to create your own wishlist
- However, you can still view others’ wishlists and mark items as purchased

#### If logging in as admin:
- You can add or remove members from the group on the “Manage Your Group” tab
- You can update the website passwords on the “Update Passwords” tab

_(Admin privileges require an admin password, reserved only for site maintainers)_

## Current Limitations

#### Data is not encrypted at rest
TODO: Fill in limitations

## AI Disclosure

React components and backend code partially generated with Claude Sonnet. Initial prompt can be found [here](https://docs.google.com/document/d/1ppbutXd-JdTOSsvXGrD1cEDLBoFvb2FWu_Xzy6m7McE/edit).

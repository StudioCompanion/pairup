---
title: Contributing
sidebar_position: 3
---

Contributing to this project is fairly simple. A standard workflow might look something like this:

![contributing flow](/img/contributing-flow.png)

It's important that if you're going to contribute that you've read the [House Rules](/getting-started/house-rules). The repo is set up to only allow squashing from PRs and will automatically delete your branch after it has been squashed, because `messy branches = sad developer`.

:::caution
You can directly commit to main. However, you should only do so if you know what you're doing and confident your commit will not break anything.
Pushing a commit to main will run the workflow but also run any deployments to hosting providers so if the workflow flags an issue e.g e2e tests dont pass, the deployment does not stop.

Someone will probably be upset, so be safe kids.
:::

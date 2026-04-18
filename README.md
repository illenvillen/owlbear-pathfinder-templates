# Pathfinder 2R and Starfinder 2 AOE Template Tools

A set of grid-aligned Pathfinder 2 and Starfinder 2 area of effect templating tools for Owlbear Rodeo

Supports:

- Emenations
- Bursts
- Cones
- Lines
- Template removal

The tool draws accurate, customizable, grid-aligned AOE templates with a single click.

## Installation

### Public Installation
<!-- <manifest url> -->
WORK IN PROGRESS

## Private Installation

There is currently no published version of this extension. Local installation is required for evaluation and testing. The local server must remain running while the extension is in use.

### Requirements

- **Node.js 18 or newer** — [nodejs.org](https://nodejs.org/) (select the LTS version)
- **npm** — included with Node.js
- **Chrome**, **Edge**, or **Firefox**
- An **Owlbear Rodeo** account with GM access to a room

### Opening a terminal in the project folder

In File Explorer, open the project folder, click the address bar, type `cmd`, and press **Enter**.

Alternatively, hold **Shift** and right-click inside the folder and choose **Open PowerShell window here** or **Open in Terminal**.

---

### Steps

#### 1. Download the project

**Via ZIP:**

1. Click the green **Code** button on the repository page
2. Select **Download ZIP**
3. Extract the archive and open the extracted folder

**Via Git:**

```sh
git clone https://github.com/illenvillen/owlbear-pathfinder-templates.git
cd owlbear-pathfinder-templates
```

#### 2. Install dependencies

Open a terminal in the project folder and run:

```sh
npm install
```

This only needs to be run once. If `npm` is not recognized, install Node.js from [nodejs.org](https://nodejs.org/), then reopen the terminal and try again.

#### 3. Start the server

```sh
npm run dev
```

Keep this terminal open. The server must stay running while you use the extension.

When ready, the terminal will show:

```
  ➜  Local:   http://localhost:5173/
```

If Windows shows a firewall prompt, click **Allow**.

#### 4. Confirm the server is running

Open this URL in your browser:

```
http://localhost:5173/manifest.json
```

If the page displays JSON, the server is running correctly.

#### 5. Add the extension in Owlbear Rodeo

1. Go to [owlbear.rodeo](https://www.owlbear.rodeo/) and sign in
2. Open **Extensions → Manage**
3. Click the **+** icon
4. Paste the URL:

```
http://localhost:5173/manifest.json
```

5. Click **Add**
6. Enable **Pathfinder/Starfinder AOE Templates Tool** and activate it in a room you own

> **Each session:** Run `npm run dev` again after restarting your computer or closing the terminal.

## Features
- Emanations based on creature size and effect size
- Bursts based on grid intersection and effect size
- Cones based on 8 point compass and effect size
- Lines based on a compass and effect size
- Player customizable color
- Pathfinder 2R and Starfinder 2 sizing logic
- Several options for removing templates (WIP)

## Status

Currently in active development. Metadata and interfaces are subject to change.

## License

MIT License

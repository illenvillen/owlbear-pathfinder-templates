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

This private installation method is intended for developers and testers only. There is currently no published version of this extension, so local installation is required for evaluation and testing

### Requirements

Before you begin, make sure you have:

- **Node.js (version 18 or newer)** installed
- **npm** installed (included with Node.js)
- A modern desktop browser such as **Chrome**, **Edge**, or **Firefox**
- An **Owlbear Rodeo** account
- Access to a room you own in Owlbear Rodeo, so you can enable the extension there

This project uses a local development server and serves the extension manifest from that server.

---

### Installation Steps

#### 1. Download the project

Clone this repository with Git, or download and extract the ZIP.

If you are cloning this repository:

1. Run:
``git clone https://github.com/illenvillen/owlbear-pathfinder-templates.git``

2. Then move into the project folder:
``cd owlbear-pathfinder-templates``

If you downloaded a ZIP instead:

1. Extract the archive
2. Open the extracted project folder
3. Open a terminal inside that folder


#### 2. Install dependencies

Install required project dependencies using npm:

``npm install``

This downloads everything needed for the local development server.

If this step fails, confirm Node.js and npm are installed:

``node -v`
``npm -v`

Both commands should return version numbers. If they do not, install Node.js before continuing.


#### 3. Start the local development server

Run:

``npm run dev``

This starts the local development server used to host the extension.

After starting successfully, the terminal should display something similar to:

Local: http://localhost:5173/

The extension manifest will be available at:

http://localhost:5173/manifest.json

Open that address in your browser to confirm the server is running correctly before continuing.


#### 4. Verify the manifest is reachable

Open the following address in your browser:

http://localhost:5173/manifest.json

If the page loads JSON content, the development server is running correctly.

If it does not load, return to the previous step and confirm the server is still running.


#### 5. Open Owlbear Rodeo

Navigate to:

https://www.owlbear.rodeo/

Sign in to your account.


#### 6. Add and enable the extension

Inside Owlbear Rodeo:

1. Open **Extensions**
2. Select **Manage**
3. Click the **+** icon in the top-right corner
4. Paste the manifest URL:

http://localhost:5173/manifest.json

5. Click **Add**
6. Enable **Pathfinder/Starfinder AOE Templates Tool**
7. Activate the extension inside a room that you own

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
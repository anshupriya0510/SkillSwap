# SkillSwap – Skill Exchange Platform 🚀

A modern, responsive peer-to-peer skill exchange web application built with **React.js**, **Vite**, and **Tailwind CSS v4**, inspired by premium dark dashboard aesthetics (mauve gradients, translucent glassmorphism).

---

## 🌟 Key Features

1. **Responsive Navigation & Layout:**
   - Desktop left sidebar navigation with active route highlights & icons.
   - Mobile top header bar with collapsible hamburger drawer.

2. **Interactive Home Page:**
   - Hero section (*"Learn. Teach. Exchange."*).
   - Global skill search bar.
   - Popular trending skills grid with instant filtering redirection.

3. **Discover Skill Directory:**
   - Real-time community mentor directory with profile cards.
   - Combined search by name, title, bio, or skills.
   - Category filtering (*All, Programming, Cloud, DevOps, Design, Data, Other*).
   - Specific skill dropdown filter.

4. **Detailed User Profiles (`/profile/:id`):**
   - Individual mentor pages detailing skills taught, skills desired, experience level, location, and availability.

5. **Interactive Skill Exchange Modal:**
   - Send custom 1-on-1 skill exchange proposals.
   - Select specific skills to offer and learn.
   - Instant state & `localStorage` synchronization.

6. **Requests Management Dashboard (`/requests`):**
   - **Received Requests:** Review incoming invitations with Accept/Reject actions.
   - **Sent Requests:** Monitor live status (*Pending, Accepted, Rejected*).

7. **Editable Profile Dashboard (`/my-profile`):**
   - Edit personal bio, title, location, experience, availability, and comma-separated skills.
   - Persistent storage across browser sessions via `localStorage`.

---

## 🛠️ Tech Stack

- **Frontend Core:** React.js (Functional components, hooks)
- **Routing:** React Router v7 (`react-router-dom`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Build Tool:** Vite
- **Data Persistence:** Local React State + `localStorage`
- **Design System:** Helios dark glassmorphism (`#0b090e`, translucent cards, mauve gradient highlights)

---

## 📁 Folder Structure

```
src/
  assets/         # Static visual assets
  components/     # Reusable UI components (Button, SkillBadge, SearchBar, UserCard, Sidebar, ExchangeModal)
  data/           # Initial mock data (users.js, requests.js)
  pages/          # Application views (Home, Discover, UserProfile, MyProfile, Requests)
  App.jsx         # Root router & persistent state provider
  main.jsx        # React application entry point
  index.css       # Tailwind CSS v4 configuration & theme utilities
```

---

## 💻 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/skillswap.git
   cd skillswap
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

---

## 🚀 Git Commands to Push to GitHub

Execute the following commands in your terminal when you are ready to publish your repository:

```bash
# 1. Initialize Git (already done)
git add .

# 2. Commit changes
git commit -m "Complete SkillSwap Web Application MVP"

# 3. Rename default branch to main
git branch -M main

# 4. Add your GitHub remote repository link (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/skillswap.git

# 5. Push code to GitHub
git push -u origin main
```

---

## 🌐 Deployment Guide (MongoDB Atlas + Render + Vercel)

> **Note:** The project is a monorepo. The frontend (`src/`, `vite.config.js`) and backend (`server/`) live in the same repository root. Deploy them separately as described below.

---

### Step 1 — MongoDB Atlas

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com).
2. **Database Access** → Add a DB user (e.g. `skillswap-admin`). Save the password.
3. **Network Access** → Add IP `0.0.0.0/0` (allow all — required for Render).
4. **Connect** → Drivers → copy the connection string and replace `<password>` and `<dbname>`:
   ```
   mongodb+srv://skillswap-admin:<password>@cluster0.xxxxx.mongodb.net/skillswap?retryWrites=true&w=majority
   ```
   > ⚠️ URL-encode special characters in the password: `@` → `%40`, `#` → `%23`, `!` → `%21`

---

### Step 2 — Render (Backend)

1. Go to [render.com](https://render.com) → New → **Web Service**.
2. Connect your GitHub repo.
3. Set the following:
   | Setting | Value |
   |---|---|
   | **Root Directory** | *(leave blank — project root)* |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server/server.js` |
4. Add **Environment Variables**:
   | Key | Value |
   |---|---|
   | `MONGO_URI` | Your Atlas connection string |
   | `NODE_ENV` | `production` |
   | `CLIENT_URL` | *(fill in after Vercel deploy, Step 3)* |
5. Click **Deploy**. Copy the service URL: `https://skillswap-xxxx.onrender.com`

> ⚠️ **Render free tier sleeps after 15 min of inactivity. The first request after sleep takes 30–60 seconds.**

---

### Step 3 — Vercel (Frontend)

1. Go to [vercel.com](https://vercel.com) → New Project → import your GitHub repo.
2. Set the following:
   | Setting | Value |
   |---|---|
   | **Framework Preset** | Vite |
   | **Root Directory** | *(leave blank — project root)* |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
3. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://skillswap-xxxx.onrender.com/api` |
4. Click **Deploy**. Copy your Vercel URL: `https://skillswap-xxxx.vercel.app`

---

### Step 4 — Wire frontend URL back to Render

In your Render service → **Environment** → set:
```
CLIENT_URL = https://skillswap-xxxx.vercel.app
```
Then click **Manual Deploy → Deploy latest commit** to pick up the CORS change.

---

### Step 5 — Seed the production database (optional)

```bash
SEED_CONFIRM=yes MONGO_URI="mongodb+srv://..." node server/seed.js
```
> ⚠️ This **drops and recreates** all users and requests. Only run on a fresh DB.

---

### 6-Point Live Test

| # | Test | Expected |
|---|---|---|
| 1 | `GET https://your-render-url.onrender.com/api/health` | `{"status":"ok"}` |
| 2 | Open the Vercel URL — community cards load | Users visible in Discover |
| 3 | Click a user card → **Request Exchange** | Modal opens, form works |
| 4 | Submit request → go to **Requests** tab → Sent | New card with Pending badge |
| 5 | Refresh — request persists in MongoDB | Card still there after reload |
| 6 | Accept a pending received request | 🎉 panel + contact details revealed |

---

## 🔮 Future Enhancements

- **Firebase Authentication:** Sign up/Login with Google or Email/Password.
- **Cloud Firestore Database:** Real-time cloud data sync.
- **Firebase Storage:** Custom profile picture upload.
- **Real-Time Chat:** 1-on-1 messaging between accepted skill partners.

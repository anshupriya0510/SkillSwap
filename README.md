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

## 🌐 Deployment to Vercel (Phase 14)

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New Project**.
3. Import your `skillswap` repository from GitHub.
4. Leave build settings as default:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Vercel will automatically host your live application! The included `vercel.json` ensures all React Router routes work perfectly on page refresh.

---

## 🔮 Future Enhancements (Phase 15 Suggestion)

- **Firebase Authentication:** Sign up/Login with Google or Email/Password.
- **Cloud Firestore Database:** Store user profiles and exchange requests in a real-time cloud database.
- **Firebase Storage:** Allow users to upload custom profile picture avatars.
- **Real-Time Chat:** 1-on-1 messaging between accepted skill partners.

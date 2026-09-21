# Bangla News Portal — Project Plan

**Reference site:** daily-bangladesh.com (layout/design/font inspiration only — কোনো copyrighted asset/লোগো/আর্টিকেল কপি হবে না)
**Stack:** Laravel 11 (REST API only) + Next.js (Public site) + React/Vite (Admin+Super Admin SPA) + MySQL
**Deployment strategy:** Phase A = Vercel (free, demo/approval) → Phase B = নিজের VPS + Domain (production)
**Prepared as:** Senior Developer + SEO Specialist roadmap

---

## 1. Architecture Overview (Decoupled — Vercel-first, VPS-later)

```
┌──────────────────────────┐       ┌───────────────────────────┐
│   NEXT.JS (Public Site)   │       │  REACT/VITE (Admin Panel)   │
│   - Home/Category/News    │       │  - Admin + Super Admin       │
│   - SSR = SEO friendly     │       │  - Login protected, no SEO   │
│   Deploy: VERCEL (free)   │       │  Deploy: VERCEL (free)       │
└─────────────┬──────────────┘       └──────────────┬────────────┘
              │  fetch (REST API)                    │  axios (REST API)
              └───────────────────┬────────────────────┘
                                  │
                     ┌────────────▼─────────────┐
                     │   LARAVEL 11 — API ONLY    │
                     │   Sanctum auth, Policies    │
                     │   Deploy Phase A: Railway/  │
                     │     Render (free, demo)     │
                     │   Deploy Phase B: own VPS   │
                     └────────────┬─────────────┘
                                  │
                          ┌───────▼────────┐
                          │  MySQL Database  │
                          │ Phase A: Railway/ │
                          │  free MySQL       │
                          │ Phase B: VPS MySQL│
                          └───────────────────┘
```

**কেন এই architecture (justification):**

- Vercel PHP/Laravel/MySQL সরাসরি হোস্ট করে না — তাই backend (Laravel API) আলাদা রাখা **বাধ্যতামূলক**, এটা কোনো optional choice না।
- Next.js React-ই (আপনার React রিকোয়ারমেন্ট পূরণ) + SSR থাকায় SEO Blade-এর সমান বা ভালো, আর **Vercel-এ ১ ক্লিকে ফ্রি ডিপ্লয়** হয়।
- Admin/Super Admin প্যানেল লগইন-প্রোটেক্টেড, SEO দরকার নেই → React (Vite) SPA, এটাও Vercel-এ ফ্রি ডিপ্লয় হয়।
- Backend + Frontend সম্পূর্ণ **decoupled** থাকায় Phase B-তে (নিজের ডোমেইন/সার্ভার কেনার পর) শুধু Laravel+MySQL VPS-এ move করলেই হবে — Vercel-এর env variable-এ নতুন API URL বসিয়ে দিলে ফ্রন্টএন্ড কোডে **কোনো পরিবর্তন লাগবে না**।
- Phase A ডিপ্লয়মেন্টে (Railway/Render ফ্রি টিয়ার) demo ডেটা দিয়ে সব ফিচার টেস্ট/approve করা যাবে — production DB আলাদা থাকবে যখন VPS-এ move করবেন।

---

## 2. User Roles & Permissions

| Role             | Capabilities                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Super Admin**  | সব Admin-এর তালিকা দেখা, নতুন Admin তৈরি, Admin ব্যান/আনব্যান (active/inactive টগল), Admin-এর তথ্য এডিট, যেকোনো Admin-এর পোস্ট করা যেকোনো নিউজ এডিট/ডিলিট, সব Admin-এর activity log দেখা, ক্যাটাগরি ম্যানেজমেন্ট, সাইট সেটিংস, সব নিউজ দেখা/ম্যানেজ করা |
| **Admin**        | নিউজ পোস্ট করা (create), নিজের পোস্ট করা নিউজ এডিট/ডিলিট করা, **অন্য কারো নিউজ দেখা যাবে কিন্তু এডিট করা যাবে না**, নিজের প্রোফাইল এডিট, নিজের ড্যাশবোর্ড স্ট্যাটস দেখা                                                                                 |
| **Banned Admin** | Login করতে পারবে না (login attempt এ "Your account has been suspended" মেসেজ)                                                                                                                                                                           |

**Rule enforcement:** এটা শুধু UI-তে hide করলে হবে না — Laravel **Policy/Gate** দিয়ে backend-এ enforce করা হবে (`NewsPolicy::update()` চেক করবে `news.author_id === auth()->id() || auth()->user()->isSuperAdmin()`), যাতে কেউ API সরাসরি হিট করেও bypass করতে না পারে।

---

## 3. Database Schema (MySQL)

### `users`

| Field                   | Type                                   | Note |
| ----------------------- | -------------------------------------- | ---- |
| id                      | bigint PK                              |      |
| name                    | varchar                                |      |
| email                   | varchar unique                         |      |
| password                | varchar (hashed)                       |      |
| role                    | enum('super_admin','admin')            |      |
| status                  | enum('active','banned') default active |      |
| avatar                  | varchar nullable                       |      |
| phone                   | varchar nullable                       |      |
| last_login_at           | timestamp nullable                     |      |
| created_at / updated_at |                                        |      |

### `categories`

id, name, slug (unique), icon, order, is_active, timestamps

### `news`

| Field            | Type                                  | Note                                |
| ---------------- | ------------------------------------- | ----------------------------------- |
| id               | bigint PK                             |                                     |
| title            | varchar                               |                                     |
| slug             | varchar unique                        | SEO friendly URL                    |
| excerpt          | text                                  |                                     |
| content          | longtext                              |                                     |
| featured_image   | varchar                               |                                     |
| category_id      | FK → categories                       |                                     |
| author_id        | FK → users                            | কে পোস্ট করেছে                      |
| status           | enum('draft','published','scheduled') |                                     |
| published_at     | timestamp nullable                    |                                     |
| views_count      | int default 0                         |                                     |
| is_breaking      | boolean default false                 | breaking news ticker-এ দেখানোর জন্য |
| is_featured      | boolean default false                 | হোমপেজ স্লাইডারে                    |
| meta_title       | varchar nullable                      | SEO                                 |
| meta_description | varchar nullable                      | SEO                                 |
| meta_keywords    | varchar nullable                      | SEO                                 |
| og_image         | varchar nullable                      | social share preview                |
| timestamps       |                                       |                                     |

### `tags` + `news_tag` (pivot)

many-to-many

### `activity_logs`

id, user_id (কে করেছে), action (created/updated/deleted/banned/activated…), subject_type, subject_id, description, ip_address, created_at
→ **Super Admin এর "সব admin এর কার্যক্রম দেখা" ফিচারের মূল টেবিল**

### `comments` (Phase পরে optional)

id, news_id, name, email, comment, status(pending/approved), timestamps

### `settings`

key, value (site_name, logo, footer_text, social_links, google_analytics_id, ads_code…)

### `media` (image library, optional but recommended)

id, uploaded_by, path, type, size, timestamps

---

## 4. Feature List

### A. Public Website (Blade, SEO-first)

- [ ] Homepage — Breaking news ticker, featured slider, category-wise news blocks, most-read sidebar
- [ ] Category page (paginated, SEO meta per category)
- [ ] Single News page — full content, author, publish date, related news, share buttons (FB/Twitter/WhatsApp), JSON-LD `NewsArticle` schema
- [ ] Search page (full-text search on title/content)
- [ ] Tag page
- [ ] Author page (list of news by an admin)
- [ ] Responsive design — মোবাইল ফার্স্ট (বাংলাদেশে বেশিরভাগ ট্রাফিক মোবাইল)
- [ ] Bangla font (SolaimanLipi / Hind Siliguri / Noto Sans Bengali via Google Fonts / self-hosted for speed)
- [ ] RSS Feed
- [ ] XML Sitemap (auto-generated, news-sitemap আলাদা — Google News submission এর জন্য)
- [ ] robots.txt
- [ ] 404 custom page

### B. Admin Panel (React SPA — `/admin`)

- [ ] Login (Sanctum auth, banned হলে block)
- [ ] Dashboard — নিজের পোস্ট করা নিউজের stats (total, published, draft, total views)
- [ ] News list (নিজেরটা edit/delete করতে পারবে, অন্যেরটা শুধু দেখতে পারবে — edit বাটন disabled/hidden)
- [ ] News create/edit — Rich text editor (TipTap বা Jodit), image upload, category/tag select, SEO fields (meta title/desc), schedule publish
- [ ] Profile edit (নাম, পাসওয়ার্ড, avatar)

### C. Super Admin Panel (React SPA — extra routes, role-guarded)

- [ ] Admin management — list সব admin, নতুন admin তৈরি, **Ban/Activate toggle**, edit info, delete
- [ ] Global news management — সব admin এর সব নিউজ দেখা + edit/delete করার ক্ষমতা
- [ ] **Activity Log viewer** — কোন admin কবে কী করেছে (filter by admin, date, action type)
- [ ] Category management (CRUD)
- [ ] Site settings (logo, site name, social links, analytics code, ads)
- [ ] Overview dashboard (total news, total admins, total views — site-wide)

---

## 5. SEO Strategy (এই অংশটা miss করা যাবে না বলেই আলাদা করে লিখছি)

1. **Server-side rendering** (Blade) — সব public পেজ crawlable।
2. **Per-article meta tags** — title, description, canonical URL, OG tags, Twitter Card।
3. **JSON-LD structured data** — `NewsArticle` schema প্রতিটা আর্টিকেলে (headline, image, datePublished, author) → Google News/Discover এ আসার জন্য critical।
4. **News Sitemap** (news-sitemap.xml, আলাদা আর্টিকেল sitemap সাধারণ sitemap থেকে) + Google Search Console submit।
5. **URL structure**: `/category/news-slug` — clean, keyword-rich, বাংলা slug transliteration handle করা হবে।
6. **Core Web Vitals**: lazy-loaded images, WebP conversion, Laravel response caching, Redis (optional) for popular pages, minified CSS/JS।
7. **Breadcrumb schema** + visible breadcrumb UI।
8. **AMP** (Accelerated Mobile Pages) — Phase পরে optional, নিউজ সাইটে ট্রাফিক অনেক বাড়ায়।
9. **Internal linking** — related news, tag cloud, "most read" — crawl depth কমায়।
10. **hreflang/canonical** ঠিকভাবে বসানো যাতে duplicate content issue না হয়।

---

## 6. Security Checklist

- Laravel Sanctum token-based auth (React SPA ↔ API)
- Role & Ban middleware — প্রতিটা protected route এ চেক
- Policy-based authorization (news edit শুধু owner/super_admin)
- CSRF protection, rate limiting on login
- Image upload validation (mime type, size limit, filename sanitize)
- SQL injection safe (Eloquent ORM ব্যবহার, raw query এড়ানো)
- XSS protection — rich text content sanitize (HTMLPurifier) করে store হবে
- `.env` কখনো git এ push হবে না (`.gitignore`)

---

## 7. Repository Structure (Monorepo — একটাই git repo: github.com/faysalmina/newspaper-website, লোকাল পাথ: D:\newspaper2)

> ৩টা app-ই একই repo-তে আলাদা সাবফোল্ডারে থাকবে। Vercel/Railway ডিপ্লয়ের সময় প্রতিটা প্রজেক্টে "Root Directory" সেটিং দিয়ে বলে দেওয়া হবে কোন সাবফোল্ডার বিল্ড করতে হবে (news-backend / news-public / news-admin) — এটা এই তিনটা প্ল্যাটফর্মই সাপোর্ট করে।

```
1) news-backend/            (Laravel — Railway/Render → পরে VPS)
   ├── app/
   │   ├── Http/Controllers/Api/  (News, Category, Auth, Admin, SuperAdmin controllers)
   │   ├── Models/
   │   ├── Policies/ (NewsPolicy, UserPolicy)
   │   └── Http/Middleware/ (CheckBanned, CheckRole)
   ├── database/migrations/
   ├── database/seeders/ (SuperAdminSeeder)
   ├── routes/api.php   (সব রুট এখন এখানে, web.php প্রায় খালি)
   └── config/cors.php  (Vercel domain allow করতে হবে)

2) news-public/              (Next.js — Vercel)
   ├── app/ (App Router: page.js=home, [category]/page.js, [category]/[slug]/page.js)
   ├── components/ (Header, Footer, NewsCard, BreakingTicker...)
   ├── lib/api.js  (Laravel API fetch helper)
   └── next-sitemap.config.js

3) news-admin/                (React + Vite — Vercel)
   ├── src/
   │   ├── pages/admin/        (News CRUD - own only)
   │   ├── pages/super-admin/  (Admin mgmt, Activity log, Settings)
   │   ├── components/
   │   ├── context/AuthContext.jsx
   │   └── api/axios.js
   └── vite.config.js
```

**.env ব্যবস্থাপনা (৩ জায়গায়):**

- `news-backend/.env` → DB credentials, `SANCTUM_STATEFUL_DOMAINS`, `FRONTEND_URLS` (CORS)
- `news-public` → Vercel Project Settings → Environment Variable: `NEXT_PUBLIC_API_URL`
- `news-admin` → Vercel Project Settings → Environment Variable: `VITE_API_URL`

VPS-এ move করার দিন শুধু এই ৩টা env variable আপডেট করলেই পুরো সিস্টেম নতুন সার্ভারে পয়েন্ট করবে।

---

## 8. Phase-wise Roadmap (Git branch per phase suggested)

| Phase | নাম                                       | Deliverable                                                                                        |
| ----- | ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| ✅ 0  | Planning                                  | এই ডকুমেন্ট                                                                                        |
| 1     | Laravel API Setup + DB                    | Fresh Laravel install (API-only), migrations, models, relationships, SuperAdminSeeder, CORS config |
| 1.5   | Backend Deploy (Demo)                     | Railway/Render-এ Laravel + MySQL ডিপ্লয় → একটা লাইভ API URL পাবেন                                 |
| 2     | Auth System                               | Sanctum auth (SPA token), Role middleware, Ban-check middleware, Login/Logout API                  |
| 3     | React Admin Panel Skeleton                | Vite React app, routing, login page, protected layout, sidebar (role-based menu)                   |
| 4     | Admin — News CRUD                         | Create/Edit(own only)/Delete/List news, image upload, category/tag select, rich editor             |
| 5     | Super Admin — Admin Management            | Admin list, create admin, Ban/Activate, edit, Activity Log viewer                                  |
| 6     | Super Admin — Global News + Settings      | সব নিউজ manage, Category CRUD, Site settings                                                       |
| 6.5   | Admin Panel Deploy                        | `news-admin` → Vercel-এ ডিপ্লয়                                                                    |
| 7     | Public Site — Layout & Homepage (Next.js) | Header/nav/footer/fonts (reference site স্টাইলে), breaking ticker, homepage sections               |
| 8     | Public Site — Category & Single News      | Category page, single news page (SSR/ISR) + related news + share buttons                           |
| 9     | SEO Layer                                 | Meta tags, JSON-LD schema, sitemap.xml, news-sitemap, robots.txt, RSS (next-sitemap)               |
| 9.5   | Public Site Deploy                        | `news-public` → Vercel-এ ডিপ্লয় → **এই পয়েন্টে পুরো সাইট লাইভ, demo/approval দেওয়া যাবে**       |
| 10    | Performance + Security Hardening          | Caching, image optimization, policy tests, final security pass                                     |
| 11    | VPS Migration Guide                       | ডোমেইন+VPS কেনার পর: Laravel+MySQL VPS-এ move, SSL, cron/queue, Vercel env variable আপডেট          |

**প্রতি ফেজ শেষে:** আমি ফাইল নাম + কোড দেব → আপনি বসাবেন → রান করে দেখবেন → git push করবেন → পরের মেসেজে বললে আমি সেই phase এর output রিভিউ/bug-check করে পরের phase এ যাব।

---

## 9. Ground Rules (যাতে bug কম হয়)

1. প্রতিটা phase এর কোড **আগেরটার উপর নির্ভরশীল** — তাই ধারাবাহিকভাবে করতে হবে, স্কিপ করা যাবে না।
2. প্রতি phase শেষে আমি একটা **"টেস্ট চেকলিস্ট"** দেব (যেমন: "এই ৩টা জিনিস চেক করুন")। সেগুলো pass করলে তবেই পরের ধাপে যাব।
3. `.env.example` আমি দেব, আপনি নিজের DB credential দিয়ে `.env` বানাবেন (এটা কখনো শেয়ার করার দরকার নেই)।
4. কোনো ধাপে error পেলে সরাসরি error message কপি করে পাঠাবেন — আমি ফিক্স দেব।

---

**পরবর্তী পদক্ষেপ:** আপনি এই ডকুমেন্ট রিভিউ করে কনফার্ম করুন (অথবা কোনো ফিচার/টেবিল চেঞ্জ লাগলে বলুন) — কনফার্ম করলেই আমি **Phase 1 (Laravel Setup + Database)** এর ফাইল ও কোড দেওয়া শুরু করব।

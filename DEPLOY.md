# Deploy Guide — GitHub + Vercel (5 minutes)

Yeh guide tumhein exactly wohi steps deta hai jo assignment maang raha hai: public GitHub repo +
live public URL. In sab commands ko apne computer ke terminal mein chalao (is folder ke andar).

## Step 1 — Gemini API key lo (agar nahi hai)

1. https://aistudio.google.com/apikey par jaao, apne Google account se sign in karo (**free hai,
   credit card nahi chahiye**).
2. **"Create API key"** dabao.
3. Key copy karlo (starts with `AIza...`) — yeh baad mein Vercel mein daalni hai.

## Step 2 — GitHub par public repo banao

1. https://github.com/new par jaao.
2. Repository name: `padhaipal` (ya jo bhi chaho).
3. **Public** select karo (zaroori hai — private repo grade nahi hogi).
4. "Add README" **uncheck** rakho (hamare paas pehle se hai).
5. **Create repository** dabao.

## Step 3 — Apna code push karo

Terminal mein is project folder ke andar:

```bash
git init
git add .
git commit -m "PadhaiPal — final project"
git branch -M main
git remote add origin https://github.com/<your-username>/padhaipal.git
git push -u origin main
```

`<your-username>` ki jagah apna GitHub username likho.

✅ Check: apni repo ka link **incognito/private window** mein khol kar dekho — login na maangay,
tabhi theek hai.

## Step 4 — Vercel par deploy karo

**Option A — Website se (sabse aasan):**
1. https://vercel.com par jaao, GitHub se sign in karo.
2. **Add New → Project** dabao, apni `padhaipal` repo select karo.
3. Framework preset: **Other** (ya "None") — koi build command nahi chahiye.
4. **Environment Variables** section mein yeh add karo:
   - `GEMINI_API_KEY` = `<apni copied key yahan paste karo>`
   - `AI_MODEL` = `gemini-2.5-flash` *(optional — agar na do to yeh default use hoga)*
5. **Deploy** dabao. 1-2 minute mein live URL mil jayega (e.g. `https://padhaipal.vercel.app`).

**Option B — Terminal se:**
```bash
npm i -g vercel
vercel login
vercel --prod
```
Deploy hone ke baad Vercel dashboard mein jaake **Settings → Environment Variables** mein
`GEMINI_API_KEY` add karo, phir dobara `vercel --prod` chalao taake variable apply ho jaye.

## Step 5 — Test karo

1. Apna live URL incognito window mein kholo.
2. Home page load ho, koi login na maangay.
3. **AI Study Buddy** page par ek sawal poocho — jawab aana chahiye.
4. **Quiz Generator** par ek topic likho — quiz banna chahiye.
5. **Study Tracker** par ek session log karo — table mein show hona chahiye.

Agar AI Study Buddy ya Quiz Generator error de rahe hain, sabse pehle check karo ke
`GEMINI_API_KEY` Vercel ke environment variables mein sahi se set hai.

## Step 6 — Screenshots aur README complete karo

1. Har page ke screenshots lo (Home, AI Study Buddy with a conversation, Quiz Generator with a
   graded quiz, Study Tracker with sessions logged).
2. Unko is folder ke andar `screenshots/` naam ke folder mein daal do.
3. `README.md` mein:
   - `[PASTE YOUR LIVE VERCEL URL HERE]` ki jagah apna asli live URL daalo.
   - Screenshot image tags mein apni actual filenames confirm karo.
4. Dobara commit-push karo:
   ```bash
   git add .
   git commit -m "Add live URL and screenshots"
   git push
   ```

## Submit

Portal par apni **public GitHub repo link** submit karo — bas wohi link chahiye, kuch aur nahi.

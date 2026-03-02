# TODAY'S ACTION PLAN — Do This Exact Order

## YOUR MANUAL WORK (30 minutes total)

### 1. Review proof-points.md (5 min)
- Open proof-points.md
- Are these real students? If not, replace with real ones
- If you don't have 20+ real examples, use fewer but make them real
- FAKE proof points will destroy trust if anyone checks
- At minimum, make sure the names, cities, and universities are real placements

### 2. Verify external links (10 min)
- Open external-links.md
- Spot-check 5-6 URLs by clicking them — do they still work?
- If any are dead (especially scholarship sites), find the current URL
- Cornell Tata scholarship URL is the one most likely to have changed

### 3. Review internal-links.md (5 min)
- Confirm the URL structure matches your actual website
- Is it bluocean.education/blog/pillar/... or a different structure?
- Adjust all paths if your site uses a different URL pattern
- If unsure, decide NOW and stick with it

### 4. Update TEMPLATE.html (5 min)
- The template attached to this chat is your starting point
- Save it as TEMPLATE.html in the blog-generator folder
- Check: does the nav link structure match your live site?
- Check: is the footer info (phone, email) current?
- Check: is the pricing (₹4,500 consultation, ₹45,000 crossed out) still accurate?

### 5. Optional but recommended: SEMrush/Ahrefs PAA export (5 min per keyword)
- For each primary keyword, go to Ahrefs → SERP Overview → People Also Ask
- Copy the top 4-6 PAA questions
- Add them to the relevant BRIEF.md file, replacing the FAQs I've written
- WHY: My FAQs are educated guesses. Real PAA data = better Featured Snippet chances
- IF YOU SKIP THIS: The FAQs I've written are solid enough to publish. You can update later.

---

## CLAUDE CODE WORK (the rest of the day)

### Session 1: Load the System
Open Claude Code. Paste:

```
I need you to generate SEO blog posts for my education consulting company. 
I have a complete system with a master prompt, HTML template, internal links map, 
external links database, proof points, and individual briefs for each post.

Please read these files in order and confirm you understand:
1. [path]/blog-generator/MASTER-PROMPT.md
2. [path]/blog-generator/TEMPLATE.html  
3. [path]/blog-generator/internal-links.md
4. [path]/blog-generator/external-links.md
5. [path]/blog-generator/proof-points.md

Tell me when you've read all 5 and understand the voice, rules, and template.
```

### Session 2: Generate Batch 1 (Quick Wins)
One post at a time. After each, quick-check in browser.

**Post 1:**
```
Read [path]/blog-generator/pillars/scholarships-indian-students/clusters/ALL-SCHOLARSHIP-BRIEFS.md
Generate the "Ratan Tata Scholarship for Engineering Students" post.
Primary keyword: ratan tata scholarship for engineering students (880 vol, 14% KD)
Follow all MASTER-PROMPT rules and TEMPLATE.html structure.
Output to: [path]/blog-generator/pillars/scholarships-indian-students/clusters/ratan-tata-scholarship.html
Run the post-generation checklist and fix any issues before outputting.
```

**Post 2:**
```
Now generate the "Narotam Sekhsaria Scholarship" post from the same brief file.
Use DIFFERENT proof points than the Ratan Tata post.
Output to: [path]/blog-generator/pillars/scholarships-indian-students/clusters/narotam-sekhsaria-scholarship.html
```

**Post 3:**
```
Read [path]/blog-generator/pillars/study-abroad-consultants/clusters/chennai-BRIEF.md
Generate the Chennai study abroad consultants post.
Primary keyword: study abroad consultants in chennai (3,600 vol, 18% KD)
Output to: [path]/blog-generator/pillars/study-abroad-consultants/clusters/study-abroad-consultants-chennai.html
```

**Post 4:**
```
Read [path]/blog-generator/pillars/study-abroad-consultants/clusters/ALL-CITY-BRIEFS.md
Generate the "College Counselor Guide" post.
Primary keyword: college counselor (1,000 vol, 18% KD)
Output to: [path]/blog-generator/pillars/study-abroad-consultants/clusters/college-counselor-guide.html
```

**Post 5:**
```
Read [path]/blog-generator/pillars/scholarships-indian-students/clusters/ALL-SCHOLARSHIP-BRIEFS.md
Generate the "Reach Oxford Scholarship" post.
Primary keyword: reach oxford scholarship (720 vol, 21% KD)
Output to: [path]/blog-generator/pillars/scholarships-indian-students/clusters/reach-oxford-scholarship.html
```

**Post 6:**
```
Read [path]/blog-generator/pillars/study-abroad-consultants/clusters/ALL-CITY-BRIEFS.md
Generate the "Study Abroad Consultants in Delhi" post.
Primary keyword: study abroad consultants in delhi (2,400 vol, 22% KD)
Output to: [path]/blog-generator/pillars/study-abroad-consultants/clusters/study-abroad-consultants-delhi.html
```

### Session 3: Core Content
Continue with posts 7-14 from the generation order in CLAUDE-CODE-INSTRUCTIONS.md.

### Session 4: Pillar Posts
Generate each pillar AFTER its clusters exist. The pillar needs to link to the cluster files.

---

## AFTER GENERATION: Publishing Checklist

For EACH post before uploading to your site:

1. [ ] Open in browser — renders correctly, no broken layout
2. [ ] Ctrl+F "QUESTION 1", "KEYWORD 1", "SOURCE NAME" — no placeholders
3. [ ] Ctrl+F banned words: "delve", "navigate", "landscape", "unlock"
4. [ ] Meta title under 60 characters
5. [ ] Meta description 150-160 characters
6. [ ] FAQPage schema matches visible FAQs
7. [ ] Canonical URL is correct for your live domain
8. [ ] OG image path makes sense (you'll need to create these images)
9. [ ] Internal links point to URLs that will exist on your live site
10. [ ] Upload to your CMS/hosting

## IMAGES YOU NEED TO CREATE (do after posts are written)
- Each post needs an OG image (1200x630px) for social sharing
- Use Canva or similar: post title + Blue Ocean branding on dark background
- Name format: og-[slug].jpg
- Upload to /blog/ directory on your site

## WHAT TO DO NEXT WEEK
1. Submit all URLs to Google Search Console for indexing
2. Create XML sitemap including all new posts
3. Set up internal linking from your homepage/service pages to the new pillar posts
4. Start the backlink strategy from the original SEO plan
5. Monitor rankings in Ahrefs/SEMrush for your primary keywords
6. Update any posts that need real PAA data if you skipped it today

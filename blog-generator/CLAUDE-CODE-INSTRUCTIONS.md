# CLAUDE CODE INSTRUCTIONS — Blue Ocean Blog Generator

## HOW TO USE THIS

### To generate a SINGLE post:
Paste this into Claude Code:

```
Read these files in order:
1. /path/to/blog-generator/MASTER-PROMPT.md
2. /path/to/blog-generator/TEMPLATE.html
3. /path/to/blog-generator/internal-links.md
4. /path/to/blog-generator/external-links.md
5. /path/to/blog-generator/proof-points.md
6. /path/to/blog-generator/pillars/[PILLAR-FOLDER]/BRIEF.md (for pillar posts)
   OR /path/to/blog-generator/pillars/[PILLAR-FOLDER]/clusters/[POST]-BRIEF.md (for cluster posts)

Then generate the complete HTML blog post following MASTER-PROMPT.md rules and TEMPLATE.html structure.
Output the file to: /path/to/blog-generator/pillars/[PILLAR-FOLDER]/index.html (pillar)
OR: /path/to/blog-generator/pillars/[PILLAR-FOLDER]/clusters/[slug].html (cluster)
```

### To generate ALL posts in a pillar:
```
Read these files in order:
1. /path/to/blog-generator/MASTER-PROMPT.md
2. /path/to/blog-generator/TEMPLATE.html
3. /path/to/blog-generator/internal-links.md
4. /path/to/blog-generator/external-links.md
5. /path/to/blog-generator/proof-points.md
6. /path/to/blog-generator/pillars/[PILLAR-FOLDER]/BRIEF.md
7. ALL files in /path/to/blog-generator/pillars/[PILLAR-FOLDER]/clusters/

Generate the pillar post first (index.html), then generate each cluster post.
For each cluster, read its specific BRIEF section and generate the full HTML.
Output each file to the correct location in the folder structure.
After generating all posts, verify all internal cross-links between posts are correct.
```

### To generate EVERYTHING:
```
Read MASTER-PROMPT.md, TEMPLATE.html, internal-links.md, external-links.md, and proof-points.md.
Then iterate through each pillar folder in /pillars/:
  1. Read the pillar BRIEF.md
  2. Generate the pillar index.html
  3. Read all cluster briefs
  4. Generate each cluster post
  5. Verify all internal links work across the pillar

Generate in this order (priority):
1. pillars/scholarships-indian-students/ (easiest KDs)
2. pillars/us-universities-from-india/ (core money content)
3. pillars/study-abroad-consultants/ (commercial intent)
4. pillars/uk-universities-from-india/ (secondary market)
5. pillars/college-application-essentials/ (top of funnel, last)
```

---

## EXAMPLE CLAUDE CODE SESSION

### Step 1: Give Claude Code the context
```
I'm generating SEO blog posts for Blue Ocean Education. 
Read /path/to/blog-generator/MASTER-PROMPT.md first.
Then read TEMPLATE.html — this is the HTML template every post must follow.
Then read internal-links.md, external-links.md, and proof-points.md.
Confirm you've understood the writing voice, SEO rules, and template structure.
```

### Step 2: Generate first post
```
Now read /path/to/blog-generator/pillars/scholarships-indian-students/clusters/ALL-SCHOLARSHIP-BRIEFS.md
Generate the Ratan Tata Scholarship post (ratan-tata-scholarship.html) — it's the easiest keyword (14% KD).
Follow all MASTER-PROMPT rules. Use TEMPLATE.html structure exactly.
Output to: /path/to/blog-generator/pillars/scholarships-indian-students/clusters/ratan-tata-scholarship.html
After generating, run the post-generation checklist from MASTER-PROMPT.md and fix any issues.
```

### Step 3: Continue with next post
```
Now generate narotam-sekhsaria-scholarship.html using the same brief file.
Use different proof points from what you used in the Ratan Tata post.
Output to the same clusters folder.
```

### Step 4: Generate the pillar
```
Now read /path/to/blog-generator/pillars/scholarships-indian-students/BRIEF.md
Generate the pillar post (index.html). This should be 3,000-4,000 words.
It must link to every cluster post you've generated.
Link to cluster posts using their actual filenames in the clusters/ subfolder.
```

---

## GENERATION ORDER (RECOMMENDED)

### Batch 1: Quick Wins (publish today)
1. ratan-tata-scholarship.html (880 vol, 14% KD) ← START HERE
2. narotam-sekhsaria-scholarship.html (880 vol, 17% KD)
3. study-abroad-consultants-chennai.html (3,600 vol, 18% KD)
4. college-counselor-guide.html (1,000 vol, 18% KD)
5. reach-oxford-scholarship.html (720 vol, 21% KD)
6. study-abroad-consultants-delhi.html (2,400 vol, 22% KD)

### Batch 2: Core Money Content (publish this week)
7. mit-admission-requirements-indian-students.html (390 vol, 25% KD)
8. how-to-get-into-mit-from-india.html (390 vol, 25% KD)
9. how-to-get-into-oxford-from-india.html (1,000 vol, 26% KD)
10. oxford-university-admission.html (480 vol, 27% KD)
11. inlaks-scholarship.html (3,600 vol, 29% KD)
12. how-to-get-into-harvard-from-india.html (1,600 vol, 30% KD)
13. cornell-tata-scholarship.html (1,000 vol, 33% KD)
14. how-to-get-into-harvard-business-school.html (1,000 vol, 33% KD)

### Batch 3: Pillar Posts (publish after clusters are live)
15. scholarships-indian-students/index.html (pillar)
16. us-universities-from-india/index.html (pillar)
17. study-abroad-consultants/index.html (pillar)
18. uk-universities-from-india/index.html (pillar)

### Batch 4: Medium Difficulty (next 2 weeks)
19-30. Remaining clusters (35-57% KD range)

### Batch 5: Hard Keywords (month 2-3, after authority builds)
31+. Pillar 5 clusters and remaining high-KD posts

---

## QUALITY CONTROL

After Claude Code generates each post, quickly check:
1. Open the HTML file in a browser — does it render correctly?
2. Ctrl+F for "QUESTION 1" or "KEYWORD 1" — any template placeholders left?
3. Ctrl+F for "delve", "navigate", "landscape" — any banned words?
4. Are the FAQ schema questions matching the visible FAQs?
5. Click internal links — do they point to real files?
6. Is the word count in range? (right-click → view source → rough count)

If anything fails, paste the issue back to Claude Code:
```
The post [filename] has these issues: [list]. Fix them and output the corrected file.
```

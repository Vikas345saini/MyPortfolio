# Personal Portfolio Website
Updated portfolio using a feature branch.

A responsive personal portfolio website built with **HTML5, CSS3, Bootstrap 5, and JavaScript**.

## Features
- Responsive navigation bar with scroll effects
- Hero section with typing animation
- About Me section with personal details
- Skills section with animated progress bars
- Projects section with category filters
- Contact form with validation
- Back-to-top button
- Dark theme with smooth animations

## Technologies Used
- HTML5
- CSS3
- Bootstrap 5
- JavaScript (Vanilla)
- Bootstrap Icons

## Git & GitHub Workflow

### Step 1: Initialize Local Repository
```bash
git init
```

### Step 2: Add Files and Commit
```bash
git add .
git commit -m "Initial commit: Add portfolio website with all sections"
```

### Step 3: Create a Feature Branch
```bash
git checkout -b feature/contact-form
# Make changes to the contact form section
git add .
git commit -m "feat: Add contact form with validation"
```

### Step 4: Merge Feature Branch
```bash
git checkout main
git merge feature/contact-form
```

### Step 5: Push to GitHub
```bash
git remote add origin https://github.com/yourusername/portfolio-website.git
git branch -M main
git push -u origin main
```

### Step 6: Clone and Pull
```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-website.git

# Pull latest changes
git pull origin main
```

### Step 7: View Commit History
```bash
git log
git log --oneline --graph
```

### Step 8: Deploy with GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select **main** branch
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io/portfolio-website/`

## License
MIT License

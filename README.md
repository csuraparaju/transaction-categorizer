# Transaction Categorizer

A Next.js web app to help categorize credit card transactions for Splitwise and personal expenses. Upload your CSV file, categorize transactions with a simple click interface, and export the results.

## Features

- 📁 CSV file upload with drag & drop
- 🏷️ Easy one-click categorization (Splitwise vs Personal)
- 📊 Real-time summary statistics
- 🔍 Search and filter transactions
- 📋 Multiple sorting options
- 💾 Export categorized data as CSV
- 📱 Responsive design for mobile and desktop

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Local Development

1. **Clone or create the project directory:**
   ```bash
   mkdir transaction-categorizer
   cd transaction-categorizer
   ```

2. **Create all the project files** (copy the content from each artifact):
   - `package.json`
   - `next.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`
   - `.gitignore`
   - `app/layout.tsx`
   - `app/page.tsx`
   - `app/globals.css`

3. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### CSV Format

Your CSV file should have the following format:
```csv
Posted Date,Reference Number,Payee,Address,Amount
01/15/2024,REF123,Restaurant Name,123 Main St,45.67
01/16/2024,REF124,Gas Station,456 Oak Ave,-32.45
```

## Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/transaction-categorizer.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project
   - Click "Deploy"

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? (Select your account)
   - Link to existing project? No
   - Project name? (Press enter for default or type a name)
   - In which directory is your code located? (Press enter for current directory)

### Option 3: Manual Upload

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Go to [vercel.com](https://vercel.com) and drag the project folder to deploy**

## Usage

1. **Upload your CSV file** using the drag & drop area or click to browse
2. **Review the summary** showing counts and totals for each category
3. **Categorize transactions** by clicking "Splitwise" or "Personal" buttons
4. **Use search and filters** to find specific transactions quickly
5. **Sort transactions** by date, amount, or payee name
6. **Export the results** as a new CSV file with categories included

## Tips for Efficient Categorization

- **Start with larger amounts** - Sort by amount (highest first) to tackle the big-ticket items
- **Use search** - Type restaurant names, stores, or locations to find similar transactions
- **Filter by uncategorized** - Focus only on transactions you haven't categorized yet
- **Look for patterns** - Group dinners, shared Ubers, joint grocery trips, etc.

## Technologies Used

- [Next.js 14](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Deployment platform

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
# FluentFusion - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd fluentfusion

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser
# Navigate to http://localhost:5173
```

## 🎯 Project Structure

```
fluentfusion/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main app with routing
│   │   ├── components/          # Reusable components
│   │   │   ├── Logo.tsx         # Logo component
│   │   │   ├── figma/          # Figma utilities
│   │   │   └── ui/             # UI library components
│   │   └── hooks/
│   │       └── useFluentNavigation.ts  # Navigation helper
│   ├── imports/                 # Figma-imported screens
│   │   ├── 01Welcome.tsx
│   │   ├── 02Signup.tsx
│   │   ├── 03Login.tsx
│   │   └── ...
│   ├── styles/
│   │   ├── fonts.css           # Font imports
│   │   ├── theme.css           # CSS variables & theme
│   │   ├── tailwind.css        # Tailwind config
│   │   └── index.css           # Global styles
│   └── main.tsx                # Entry point
├── public/                     # Static assets
├── README.md                   # Project documentation
├── IMPLEMENTATION.md           # Implementation status
└── package.json
```

## 📱 Available Pages

| Route | Page | Status |
|-------|------|--------|
| `/` | Welcome Page | ✅ Complete |
| `/signup` | Sign Up | ✅ Complete |
| `/login` | Login | ✅ Complete |
| `/forgot-password` | Forgot Password | ✅ Complete |
| `/verify-email` | Email Verification | ✅ Complete |
| `/onboard/native-language` | Select Native Language | ✅ Complete |
| `/onboard/learn-language` | Select Target Language | ✅ Complete |
| `/onboard/goal` | Learning Goal | ✅ Complete |
| `/onboard/level` | Proficiency Level | ✅ Complete |
| `/dashboard` | Dashboard | ✅ Complete |

## 🎨 Design System

### Colors (CSS Variables)
```css
--neon-primary: #BFFF00    /* Primary neon green */
--neon-alt: #8FEF00        /* Alternative green */
--ff-background: #0A0A0A   /* Dark background */
--ff-card: #151515         /* Card background */
--ff-border: #2A2A2A       /* Border color */
--ff-muted-text: #888888   /* Muted text */
--ff-success: #00FF7F      /* Success green */
--ff-warning: #FFB800      /* Warning yellow */
--ff-danger: #FF4444       /* Error red */
--ff-info: #00CFFF         /* Info blue */
```

### Typography
- **Headings**: Syne (ExtraBold 800)
- **Body**: DM Sans (Regular 400)
- **Labels**: JetBrains Mono (Medium 500)
- **Icons**: Noto Color Emoji

### Components

#### Using the Logo
```tsx
import { Logo } from './components/Logo';

// Default (medium)
<Logo />

// Small
<Logo size="sm" />

// Large with custom click
<Logo size="lg" onClick={() => console.log('clicked')} />
```

#### Using Navigation Hook
```tsx
import { useFluentNavigation } from './hooks/useFluentNavigation';

function MyComponent() {
  const nav = useFluentNavigation();
  
  return (
    <button onClick={nav.toLogin}>Login</button>
    <button onClick={nav.toSignup}>Sign Up</button>
    <button onClick={nav.toDashboard}>Dashboard</button>
    <button onClick={nav.goBack}>Back</button>
  );
}
```

## 🔧 Development

### Adding a New Page

1. **Create Component**
```tsx
// src/app/pages/NewPage.tsx
import { useFluentNavigation } from '../hooks/useFluentNavigation';

export default function NewPage() {
  const nav = useFluentNavigation();
  
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Your content */}
    </div>
  );
}
```

2. **Add Route**
```tsx
// src/app/App.tsx
import NewPage from './pages/NewPage';

<Route path="/new-page" element={<NewPage />} />
```

3. **Add to Navigation Hook**
```tsx
// src/app/hooks/useFluentNavigation.ts
export const useFluentNavigation = () => {
  return {
    // ... existing
    toNewPage: () => navigate('/new-page'),
  };
};
```

### Styling Guidelines

#### Use Tailwind Classes
```tsx
// Good
<div className="bg-[#151515] rounded-[14px] border border-[#2a2a2a] p-6">

// Avoid inline styles unless necessary
<div style={{ background: '#151515' }}>
```

#### Follow Design System
```tsx
// Buttons
<button className="bg-[#bfff00] text-[#0a0a0a] px-6 py-3 rounded-lg hover:bg-[#a8e600]">
  Primary Button
</button>

<button className="border border-[#333] text-white px-6 py-3 rounded-lg hover:bg-[#1a1a1a]">
  Secondary Button
</button>

// Cards
<div className="bg-[#151515] border border-[#2a2a2a] rounded-[14px] p-6">
  Card Content
</div>

// Inputs
<input 
  className="bg-[#1f1f1f] border border-[#2a2a2a] rounded-lg px-4 py-3 text-white"
  placeholder="Enter text"
/>
```

## 📦 Key Dependencies

### UI & Styling
- `react` - UI library
- `react-router` - Routing
- `tailwindcss` - Styling
- `clsx` - Class name management
- `lucide-react` - Icons

### Forms & Validation
- `react-hook-form` - Form management
- (TODO: add `zod` for validation)

### Data Visualization
- `recharts` - Charts and graphs

### Animation
- `motion` - Animations (Framer Motion)

## 🐛 Common Issues

### Fonts Not Loading
Make sure fonts.css is imported in your main entry file.

### Routing Not Working
Ensure BrowserRouter wraps your App component.

### Styles Not Applying
Check that Tailwind is properly configured and CSS files are imported.

### TypeScript Errors
Run `pnpm check` to verify type errors.

## 🧪 Testing

```bash
# Run tests (when configured)
pnpm test

# Type check
pnpm tsc --noEmit

# Lint
pnpm lint
```

## 📦 Building for Production

```bash
# Build
pnpm build

# Preview production build
pnpm preview
```

## 🔥 Hot Reloading

The development server supports hot module replacement (HMR). Changes to components will update instantly without losing state.

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 💬 Need Help?

- Check IMPLEMENTATION.md for current status
- Review component examples in `/src/imports`
- Look at the README.md for feature documentation

---

**Happy Coding! 🚀**

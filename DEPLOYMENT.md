# 🚀 Deployment Guide - FluentFusion

This guide provides step-by-step instructions for deploying FluentFusion to various platforms.

## Table of Contents
1. [Quick Deploy (Recommended)](#quick-deploy-vercel)
2. [Netlify Deployment](#netlify-deployment)
3. [AWS Deployment](#aws-deployment)
4. [Backend Deployment](#backend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Quick Deploy (Vercel) ⚡

Vercel is the recommended platform for deploying the FluentFusion frontend.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Git repository pushed to GitHub

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Method A: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? fluentfusion
# - In which directory? ./
# - Override settings? No
```

#### Method B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build` or `pnpm build`
   - **Output Directory**: `dist`
4. Click "Deploy"

### Step 3: Configure Domain (Optional)
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Deployment Time
- **Initial Build**: 1-2 minutes
- **Subsequent Builds**: 30-60 seconds

### Vercel Configuration File (Optional)

Create `vercel.json` in root:
```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

---

## Netlify Deployment 🌐

Alternative deployment platform with similar ease of use.

### Method A: Drag and Drop
```bash
# Build the project locally
pnpm build

# The `dist` folder is created
# Go to https://app.netlify.com/drop
# Drag and drop the `dist` folder
```

### Method B: Git Integration
1. Go to https://app.netlify.com/
2. Click "New site from Git"
3. Connect to GitHub
4. Select fluentfusion repository
5. Configure:
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Netlify Configuration File

Create `netlify.toml` in root:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## AWS Deployment ☁️

For production-grade deployment with full control.

### Architecture
- **S3**: Static file hosting
- **CloudFront**: CDN for fast global delivery
- **Route 53**: DNS management
- **Certificate Manager**: SSL/TLS certificates

### Step 1: Build the Application
```bash
pnpm build
# Output in `dist/` directory
```

### Step 2: Create S3 Bucket
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://fluentfusion-app --region us-east-1

# Enable static website hosting
aws s3 website s3://fluentfusion-app --index-document index.html --error-document index.html
```

### Step 3: Upload Files
```bash
# Sync dist folder to S3
aws s3 sync dist/ s3://fluentfusion-app --delete

# Set public read access
aws s3api put-bucket-policy --bucket fluentfusion-app --policy file://bucket-policy.json
```

**bucket-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::fluentfusion-app/*"
    }
  ]
}
```

### Step 4: Create CloudFront Distribution
```bash
aws cloudfront create-distribution \
  --origin-domain-name fluentfusion-app.s3.amazonaws.com \
  --default-root-object index.html
```

### Step 5: Configure SSL Certificate
1. Go to AWS Certificate Manager
2. Request public certificate
3. Add domain name
4. Verify domain ownership
5. Attach to CloudFront distribution

---

## Backend Deployment 🔧

When you implement the FastAPI backend:

### Option 1: Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Option 2: Render.com
1. Create account on Render
2. New > Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Option 3: AWS EC2 + RDS
```bash
# Launch EC2 instance
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t2.micro \
  --key-name fluentfusion-key

# Connect to instance
ssh -i fluentfusion-key.pem ec2-user@<instance-ip>

# Install dependencies
sudo yum update -y
sudo yum install python3 pip3 nginx -y

# Clone repository
git clone https://github.com/yourusername/fluentfusion.git
cd fluentfusion/backend

# Install Python dependencies
pip3 install -r requirements.txt

# Set up Nginx reverse proxy
sudo nano /etc/nginx/conf.d/fluentfusion.conf
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.fluentfusion.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### PostgreSQL Database (AWS RDS)
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier fluentfusion-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourPassword123! \
  --allocated-storage 20
```

---

## Environment Configuration 🔑

### Frontend Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://api.fluentfusion.com
VITE_APP_NAME=FluentFusion
VITE_ENABLE_ANALYTICS=true
```

### Backend Environment Variables

Create `.env` on server:
```env
DATABASE_URL=postgresql://user:password@host:5432/fluentfusion
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-change-this
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
CORS_ORIGINS=https://fluentfusion.com,https://www.fluentfusion.com
ENVIRONMENT=production
```

---

## Post-Deployment Checklist ✅

### Frontend
- [ ] Application loads successfully
- [ ] All pages render correctly
- [ ] Navigation works properly
- [ ] Forms submit correctly
- [ ] Images and assets load
- [ ] Responsive design works on mobile
- [ ] Performance is acceptable (< 3s load time)
- [ ] Console has no errors
- [ ] LocalStorage works correctly

### Backend (When Implemented)
- [ ] API responds to requests
- [ ] Authentication works
- [ ] Database connections successful
- [ ] HTTPS is enabled
- [ ] CORS is configured correctly
- [ ] Rate limiting is active
- [ ] Logging is configured
- [ ] Error handling works
- [ ] Health check endpoint responds

### Domain & SSL
- [ ] Custom domain configured
- [ ] SSL certificate is valid
- [ ] HTTPS redirect is working
- [ ] www redirect configured (if applicable)
- [ ] DNS propagated globally

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable analytics (Google Analytics)

---

## Continuous Deployment (CI/CD) 🔄

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Rollback Strategy 🔙

### Vercel
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Netlify
1. Go to Deploys tab
2. Find previous successful deployment
3. Click "Publish deploy"

### AWS S3
```bash
# Versioning enabled - restore previous version
aws s3api list-object-versions --bucket fluentfusion-app
aws s3api copy-object --copy-source fluentfusion-app/index.html?versionId=VERSION_ID
```

---

## Troubleshooting 🔧

### Build Fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
pnpm install

# Check Node version
node --version  # Should be 18+

# Verify build locally
pnpm build
```

### 404 Errors on Refresh
- **Vercel**: Should work automatically
- **Netlify**: Add `netlify.toml` with redirects
- **S3**: Set error document to `index.html`

### Slow Load Times
- Enable compression (gzip/brotli)
- Use CDN (CloudFront, Vercel Edge Network)
- Optimize images
- Code splitting
- Tree shaking

### CORS Errors (When Backend is Added)
```python
# FastAPI backend
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://fluentfusion.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Cost Estimation 💰

### Free Tier (Recommended for MVP)
- **Vercel**: Free (Hobby plan)
- **GitHub**: Free
- **Total**: $0/month

### Paid Options
- **Vercel Pro**: $20/month
- **Netlify Pro**: $19/month
- **AWS (Small scale)**:
  - S3: $1/month
  - CloudFront: $5/month
  - Route 53: $0.50/month
  - **Total**: ~$6.50/month

### Production Scale
- **AWS Full Stack**:
  - EC2 (t3.small): $15/month
  - RDS (db.t3.micro): $15/month
  - S3 + CloudFront: $10/month
  - Load Balancer: $20/month
  - **Total**: ~$60/month

---

## Performance Optimization 🚀

### Build Optimization
```javascript
// vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          charts: ['recharts'],
        },
      },
    },
  },
};
```

### Caching Headers (Vercel)
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Security Best Practices 🔒

### Production Checklist
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Content Security Policy set
- [ ] Rate limiting enabled
- [ ] Input validation active
- [ ] XSS protection enabled
- [ ] CSRF protection implemented

### Security Headers (Vercel)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Monitoring & Maintenance 📊

### Recommended Tools
- **Uptime**: UptimeRobot (free)
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Lighthouse CI
- **Logs**: Vercel Logs / CloudWatch

### Health Check Endpoint
```typescript
// Add to backend when implemented
app.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});
```

---

## Support & Resources 📚

- **Vercel Documentation**: https://vercel.com/docs
- **Netlify Documentation**: https://docs.netlify.com
- **AWS Documentation**: https://docs.aws.amazon.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**Happy Deploying! 🚀**

*For issues or questions, refer to the main README or create an issue on GitHub.*

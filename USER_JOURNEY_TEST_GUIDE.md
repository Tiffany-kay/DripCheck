# 🌟 DripCheck: Complete User Journey Test Guide

## 🚀 **Setup Instructions**

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- Clerk account for authentication
- M-PESA Daraja API credentials (for production)
- Gemini API key

### 2. Environment Setup

**Frontend (.env in drip-check-client/):**
```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000
```

**Backend (.env in drip-check-server/):**
```bash
MONGODB_URI=mongodb://localhost:27017/dripcheck
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
```

### 3. Installation & Startup
```bash
# Backend
cd drip-check-server
npm install
npm start

# Frontend (new terminal)
cd drip-check-client
npm install
npm run dev
```

---

## 🎯 **Complete User Journey Test Flow**

### **Phase 1: Landing & Authentication**

1. **Visit Landing Page** (`http://localhost:5173/`)
   - ✅ See vaporwave hero section with floating outfits
   - ✅ View featured drip of the week
   - ✅ Check current leaderboard preview
   - ✅ See "This Week Supports Climate Justice" donation CTA
   - ✅ Click "Step Into The Dripverse" → Clerk signup modal

2. **Sign Up Flow** (Clerk handles this)
   - ✅ Enter name, email, username
   - ✅ Verify email if needed
   - ✅ Auto-redirect to onboarding

### **Phase 2: Onboarding Experience**

3. **AI Profile Generation** (`/onboarding`)
   - ✅ See "Analyzing your vibe..." with animated loading
   - ✅ AI assigns vibe tag (e.g., "NeoStreetwear Goddess")
   - ✅ Get "Fresh Dropper" badge
   - ✅ Click "Enter the Dripverse" → redirect to `/home`

### **Phase 3: Core App Experience**

4. **Home Feed** (`/home`)
   - ✅ See outfit carousel with real images
   - ✅ View AI drip scores on outfits
   - ✅ Click outfit cards to see AI features panel
   - ✅ Try purchasing outfits (opens M-PESA modal)
   - ✅ Upload new outfit with AI feedback

### **Phase 4: Drip Battles & Donations**

5. **Battle Page** (`/battle`)
   - ✅ See current battle with two outfits
   - ✅ Notice "This week supports Climate Justice" banner
   - ✅ Click "Vote & Donate" → opens M-PESA donation modal
   - ✅ Enter phone (254XXXXXXXXX) and amount (10, 50, 100 bob)
   - ✅ Submit donation → see success animation
   - ✅ View AI judge commentary

### **Phase 5: Profile & Social Features**

6. **Profile Management** (`/profile`)
   - ✅ Check profile stats (followers, AI rating, earnings)
   - ✅ Browse "My Fits" tab with uploaded outfits
   - ✅ View "Sold Looks" transaction history
   - ✅ Check "Battles" win/loss record
   - ✅ See "Comments" from other users
   - ✅ Review "Donations" impact metrics

7. **Leaderboard** (`/leaderboard`)
   - ✅ See top dripsters with AI scores
   - ✅ View trending hashtags
   - ✅ Check weekly donation totals

---

## 🔥 **Key Features to Test**

### **AI Integration (Gemini)**
- [ ] Upload outfit → get AI drip score (0-100)
- [ ] Generate style tips from AI
- [ ] Get caption suggestions
- [ ] Battle AI judge picks winner

### **M-PESA Payments**
- [ ] Buy outfit → STK push to phone
- [ ] Donate to cause → payment processed
- [ ] View transaction history
- [ ] WhatsApp seller contact after purchase

### **Social Features**
- [ ] Like/vote on outfits
- [ ] Battle participation
- [ ] Profile customization
- [ ] Achievement system

### **NeoDripWave Aesthetic**
- [ ] Glassmorphism cards throughout
- [ ] Neon text effects and animations
- [ ] Vaporwave color palette
- [ ] Smooth Framer Motion transitions

---

## 🛠 **Testing Checklist**

### **Authentication Flow**
- [ ] Landing page loads correctly
- [ ] Clerk signup/signin works
- [ ] Onboarding completes and updates user metadata
- [ ] Protected routes redirect properly
- [ ] User session persists on refresh

### **API Integrations**
- [ ] Gemini AI calls return responses
- [ ] Image uploads to Cloudinary work
- [ ] M-PESA STK push simulates correctly
- [ ] MongoDB saves user/outfit data

### **User Experience**
- [ ] All animations smooth and performant
- [ ] Mobile responsive design
- [ ] No console errors
- [ ] Fast loading times
- [ ] Intuitive navigation

### **Business Logic**
- [ ] Vote counting works correctly
- [ ] Purchase flow completes end-to-end
- [ ] Donation tracking updates totals
- [ ] AI scores influence rankings

---

## 📱 **Mobile Testing**

Test on mobile devices to ensure:
- [ ] Touch interactions work smoothly
- [ ] M-PESA STK push appears on phone
- [ ] Responsive layout adapts properly
- [ ] Performance remains smooth

---

## 🎉 **Demo Script for Judges**

**"Welcome to DripCheck - where Gen Z fashion meets AI and social impact!"**

1. **"Here's our landing page showcasing the vaporwave aesthetic"** 
   - Show floating animations, featured outfits

2. **"Let me sign up and show the AI onboarding"**
   - Complete signup → demonstrate AI vibe assignment

3. **"Now I'm in the main app - let me upload an outfit"**
   - Upload image → show real-time AI feedback

4. **"Here's our killer feature - Drip Battles for a cause"**
   - Navigate to battle → vote with M-PESA donation

5. **"Every purchase supports local sellers"**
   - Buy outfit → show WhatsApp seller connection

6. **"Check out my profile with full transaction history"**
   - Show earnings, donations, battle stats

**"This is fashion commerce that actually creates positive impact in Kenya!"**

---

## 🔧 **Troubleshooting**

### Common Issues:
- **Clerk auth not working:** Check publishable key in .env
- **M-PESA failing:** Verify phone number format (254XXXXXXXXX)
- **AI not responding:** Check Gemini API key and quotas
- **Images not uploading:** Verify Cloudinary credentials
- **Database errors:** Ensure MongoDB is running

### Quick Fixes:
```bash
# Clear browser cache and localStorage
# Restart both servers
# Check all environment variables
# Verify API endpoints are accessible
```

---

## 💫 **What Makes This Special**

✨ **Complete Gen Z Experience:** Vaporwave aesthetic + modern UX
🤖 **Real AI Integration:** Gemini powers every interaction  
💰 **Actual Commerce:** M-PESA enables real transactions
❤️ **Social Impact:** Every purchase/vote supports causes
🚀 **Scalable Architecture:** Ready for production deployment

**This isn't just a demo - it's a production-ready social commerce platform that could genuinely impact Kenya's youth fashion scene!**

# Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Setup Complete

- [x] Environment variables configured (`.env.local`)
- [x] Database seeded with demo data
- [x] Duplicate headers fixed
- [x] All APIs wired
- [x] Error boundaries in place

## 🔐 Authentication Tests

### Player Login
- [ ] Navigate to `/player/login`
- [ ] Login with `player@demo.com` / `demo123`
- [ ] Should redirect to `/player/dashboard`
- [ ] Check header shows correct user info

### Agent Login
- [ ] Navigate to `/agent/login`
- [ ] Login with `agent@demo.com` / `demo123`
- [ ] Should redirect to `/agent/dashboard`
- [ ] Verify sidebar shows all agent routes

### Academy Login
- [ ] Navigate to `/academy/login`
- [ ] Login with `academy@demo.com` / `demo123`
- [ ] Should redirect to `/academy/dashboard`
- [ ] Verify sidebar shows all academy routes

## 👤 Player Features

### Profile Management
- [ ] Navigate to `/player/profile`
- [ ] Profile data should load from database
- [ ] Edit profile fields (name, age, position, stats)
- [ ] Click "Save" - should show success toast
- [ ] Refresh page - changes should persist
- [ ] Add YouTube video link - thumbnail should appear

### Explore Opportunities
- [ ] Navigate to `/explore-opportunities`
- [ ] Should see 3 seeded trials
- [ ] Click "Apply" on a trial
- [ ] Check notification appears
- [ ] Application status should show "PENDING"
- [ ] Refresh page - application persists

### Messages
- [ ] Navigate to `/player/messages`
- [ ] Should see conversation with "Elite Football Agency"
- [ ] Open conversation - should see 2 messages
- [ ] Send a new message
- [ ] Message should appear immediately
- [ ] Wait 5 seconds - should auto-refresh

### Notifications
- [ ] Navigate to `/notifications`
- [ ] Should see 2 notifications
- [ ] Click a notification - should mark as read
- [ ] Unread indicator should disappear
- [ ] Notifications should refresh every 30s

## 🏢 Agent Features

### Player Search
- [ ] Navigate to `/agent/players`
- [ ] Should see 2 players (Sophia, Alex)
- [ ] Search by name - filters work
- [ ] Filter by position - filters work
- [ ] Click "Shortlist" - persists in localStorage
- [ ] Shortlist counter updates

### Messages
- [ ] Navigate to `/agent/messages`
- [ ] Should see conversation with "Sophia Carter"
- [ ] Send reply message
- [ ] Message should appear
- [ ] Real-time polling works (5s)

### Trials
- [ ] Navigate to `/agent/trials`
- [ ] Should see trial management interface
- [ ] Create new trial (if implemented)

## 🎓 Academy Features

### Player Management
- [ ] Navigate to `/academy/players`
- [ ] Should see all players
- [ ] Click "Add New Player"
- [ ] Fill form and submit
- [ ] Player should appear in list
- [ ] Search functionality works

### Tournaments
- [ ] Navigate to `/academy/tournaments`
- [ ] Should see 3 tournaments from database
- [ ] Click "Create New Tournament"
- [ ] Fill form and submit
- [ ] Tournament should appear in list
- [ ] Register team - should work

### Analytics
- [ ] Navigate to `/academy/analytics`
- [ ] Should show exposure stats
- [ ] Should show recent interests
- [ ] Data should update every 30s

## 🔄 Real-time Features

### Notifications Polling
- [ ] Open notifications page
- [ ] Create notification via API or another user action
- [ ] Wait 30 seconds
- [ ] Notification should appear automatically

### Messages Polling
- [ ] Open messages page
- [ ] Send message from another account
- [ ] Wait 5 seconds
- [ ] Message should appear automatically

## 🛡️ Error Handling

### API Errors
- [ ] Disconnect internet
- [ ] Try to load profile
- [ ] Should show error toast
- [ ] Error boundary should catch crashes

### Invalid Login
- [ ] Try wrong password
- [ ] Should show "Invalid credentials" error
- [ ] Should not redirect

## 🎨 UI/UX Checks

### Navigation
- [ ] Only ONE header visible on all pages
- [ ] Header shows correct logo
- [ ] Navigation links work
- [ ] Sidebar appears on dashboard pages
- [ ] Sidebar links navigate correctly

### Loading States
- [ ] Pages show loading indicators
- [ ] Skeleton screens appear while loading
- [ ] No blank screens

### Responsive Design
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Layout adapts correctly

## 📊 Database Verification

### Check Seeded Data
Run in database console or check via API:
- [ ] 3 users exist (player, agent, academy)
- [ ] 3 trials exist
- [ ] 2 applications exist
- [ ] 2 messages exist
- [ ] 3 notifications exist

### Data Persistence
- [ ] Create new trial application
- [ ] Refresh page
- [ ] Application should still exist
- [ ] Data persists across sessions

## 🚀 Performance

### Page Load
- [ ] Initial page load < 2 seconds
- [ ] API calls complete quickly
- [ ] No console errors

### Real-time Updates
- [ ] Polling doesn't cause lag
- [ ] Multiple tabs can be open
- [ ] No memory leaks

---

## 🐛 Common Issues

### Issue: Can't login
**Solution:** Check `.env.local` has `NEXTAUTH_SECRET` set

### Issue: Database errors
**Solution:** Run `npm run db:push` then `npm run db:seed`

### Issue: Duplicate headers
**Solution:** Already fixed - should only see one header

### Issue: API not working
**Solution:** Check dev server is running, verify database is connected

---

## ✅ Final Verification

Before considering complete, verify:
- [ ] All three roles can login
- [ ] All major features work
- [ ] Real-time updates work
- [ ] No duplicate headers
- [ ] Error handling works
- [ ] Data persists correctly

---

**Testing completed on:** _____________
**Issues found:** _____________
**Notes:** _____________





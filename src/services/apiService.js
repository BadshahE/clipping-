import { supabase, isSupabaseConfigured } from '../lib/supabase'

import { 
  INITIAL_CAMPAIGNS, 
  INITIAL_SUBMISSIONS, 
  INITIAL_USERS, 
  INITIAL_WALLETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_FRAUD_FLAGS,
  INITIAL_VIEW_SNAPSHOTS
} from './mockData'

const CAMPAIGNS_KEY = 'clipyard_campaigns_v1'
const SUBMISSIONS_KEY = 'clipyard_submissions_v1'
const WALLETS_KEY = 'clipyard_wallets_v1'
const TRANSACTIONS_KEY = 'clipyard_transactions_v1'
const FRAUD_FLAGS_KEY = 'clipyard_fraud_flags_v1'
const SNAPSHOTS_KEY = 'clipyard_snapshots_v1'
const SESSION_KEY = 'clipyard_user_session_v1'

// Helper to initialize local storage with mock data if empty
function getItem(key, initialValue) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  } catch (e) {
    return initialValue
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('LocalStorage write error:', e)
  }
}

export const apiService = {
  // --- AUTHENTICATION & USERS ---
  getCurrentUser(activeRole = 'clipper') {
    const session = getItem(SESSION_KEY, null)
    if (session && session.role === activeRole) {
      return session
    }

    if (activeRole === 'brand') {
      return INITIAL_USERS.find(u => u.id === 'user-brand-1')
    } else if (activeRole === 'admin') {
      return INITIAL_USERS.find(u => u.id === 'user-admin-1')
    }
    return INITIAL_USERS.find(u => u.id === 'user-clipper-1')
  },

  async authenticateUser({ mode, email, password, displayName, role }) {
    if (!email || !password) throw new Error('Please fill in all required fields.')

    // Direct Supabase Auth call
    if (supabase && supabase.auth) {
      try {
        if (mode === 'register') {
          const { data, error: sbError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName || email.split('@')[0],
                role: role || 'clipper',
              }
            }
          })
          if (sbError) throw sbError

          const user = data?.user
          console.log('Registered user in Supabase Auth:', user)

          const sessionUser = {
            id: user ? user.id : `user-${Date.now().toString().slice(-4)}`,
            email: user ? user.email : email,
            display_name: user?.user_metadata?.display_name || displayName || email.split('@')[0],
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            roles: [role],
            role: role,
            is_admin: role === 'admin',
            stripe_customer_id: role === 'brand' ? `cus_${Date.now()}` : undefined,
            stripe_connect_id: role === 'clipper' ? `acct_${Date.now()}` : undefined,
            created_at: new Date().toISOString(),
          }
          setItem(SESSION_KEY, sessionUser)
          return sessionUser
        } else {
          // Login
          const { data, error: sbError } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          if (sbError) throw sbError

          const user = data.user
          console.log('Authenticated user in Supabase Auth:', user)

          const sessionUser = {
            id: user.id,
            email: user.email,
            display_name: user.user_metadata?.display_name || displayName || email.split('@')[0],
            avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
            roles: [user.user_metadata?.role || role],
            role: user.user_metadata?.role || role,
            is_admin: role === 'admin',
            created_at: user.created_at || new Date().toISOString(),
          }
          setItem(SESSION_KEY, sessionUser)
          return sessionUser
        }
      } catch (sbErr) {
        console.warn('Supabase Auth response:', sbErr.message || sbErr)
        const msg = (sbErr.message || '').toLowerCase()
        if (
          msg.includes('invalid api key') || 
          msg.includes('apikey') || 
          msg.includes('jwt') || 
          msg.includes('failed to fetch')
        ) {
          console.info('Using local session fallback due to API key config.')
        } else if (
          msg.includes('rate limit') || 
          msg.includes('over_email_send_rate_limit') || 
          msg.includes('too many requests')
        ) {
          console.info('Supabase email rate limit reached. Proceeding with active session.')
        } else {
          throw sbErr
        }
      }
    }

    // Fallback local authentication for offline or demo testing
    const newUser = {
      id: `user-${Date.now().toString().slice(-4)}`,
      email,
      display_name: displayName || email.split('@')[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      roles: [role],
      role: role,
      is_admin: role === 'admin',
      stripe_customer_id: role === 'brand' ? `cus_${Date.now()}` : undefined,
      stripe_connect_id: role === 'clipper' ? `acct_${Date.now()}` : undefined,
      created_at: new Date().toISOString(),
    }

    setItem(SESSION_KEY, newUser)
    return newUser
  },

  async authenticateOAuth(provider, role) {
    if (isSupabaseConfigured && supabase && supabase.auth) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: provider.toLowerCase(),
          options: {
            redirectTo: window.location.origin
          }
        })
        if (error) console.warn('Supabase OAuth notice:', error.message)
      } catch (e) {
        console.warn('Supabase OAuth error:', e)
      }
    }

    const newUser = {
      id: `user-oauth-${Date.now().toString().slice(-4)}`,
      email: `user.${provider.toLowerCase()}@clipyard.io`,
      display_name: `${provider} Creator`,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      roles: [role],
      role: role,
      is_admin: false,
      created_at: new Date().toISOString(),
    }

    setItem(SESSION_KEY, newUser)
    return newUser
  },

  async logoutUser() {
    try {
      if (supabase && supabase.auth) {
        await supabase.auth.signOut()
      }
    } catch (e) {
      console.error('Supabase signOut error:', e)
    }
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (e) {
      console.error(e)
    }
  },

  // --- CAMPAIGNS ---
  getCampaigns() {
    return getItem(CAMPAIGNS_KEY, INITIAL_CAMPAIGNS)
  },

  getCampaignById(id) {
    const campaigns = this.getCampaigns()
    return campaigns.find(c => c.id === id) || null
  },

  createCampaign(campaignData, brandUser) {
    const campaigns = this.getCampaigns()
    const newCampaign = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      brand_id: brandUser.id,
      brand_name: brandUser.display_name,
      brand_avatar: brandUser.avatar,
      title: campaignData.title,
      description: campaignData.description,
      source_url: campaignData.source_url,
      thumbnail: campaignData.thumbnail || 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
      rate_per_1000: parseFloat(campaignData.rate_per_1000),
      total_budget: parseFloat(campaignData.total_budget),
      remaining_budget: parseFloat(campaignData.total_budget),
      max_payout_per_clip: parseFloat(campaignData.max_payout_per_clip || 1000),
      allowed_platforms: campaignData.allowed_platforms || ['TikTok', 'YouTube Shorts', 'Instagram Reels'],
      guidelines: campaignData.guidelines || 'Follow social media community guidelines.',
      status: 'active',
      total_views: 0,
      active_clippers_count: 0,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
      created_at: new Date().toISOString(),
    }

    campaigns.unshift(newCampaign)
    setItem(CAMPAIGNS_KEY, campaigns)
    return newCampaign
  },

  // --- SUBMISSIONS ---
  getSubmissions() {
    return getItem(SUBMISSIONS_KEY, INITIAL_SUBMISSIONS)
  },

  getSubmissionsByClipper(clipperId) {
    const subs = this.getSubmissions()
    return subs.filter(s => s.clipper_id === clipperId)
  },

  getSubmissionsByCampaign(campaignId) {
    const subs = this.getSubmissions()
    return subs.filter(s => s.campaign_id === campaignId)
  },

  submitClip({ campaign_id, post_url, platform, clipperUser }) {
    const campaigns = this.getCampaigns()
    const campaign = campaigns.find(c => c.id === campaign_id)
    if (!campaign) throw new Error('Campaign not found')

    const submissions = this.getSubmissions()
    
    // Check duplicate post URL
    const existing = submissions.find(s => s.post_url === post_url)
    if (existing) {
      throw new Error('This clip URL has already been submitted to ClipYard!')
    }

    const newSub = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      campaign_id,
      campaign_title: campaign.title,
      clipper_id: clipperUser.id,
      clipper_name: clipperUser.display_name,
      clipper_avatar: clipperUser.avatar,
      post_url,
      platform,
      status: 'pending_review',
      verified_views: 0,
      earned_amount: 0,
      rate_per_1000: campaign.rate_per_1000,
      submitted_at: new Date().toISOString(),
      reviewed_at: null,
      notes: 'Submitted and awaiting brand verification.',
    }

    submissions.unshift(newSub)
    setItem(SUBMISSIONS_KEY, submissions)
    return newSub
  },

  reviewSubmission(submissionId, approve, note = '') {
    const submissions = this.getSubmissions()
    const index = submissions.findIndex(s => s.id === submissionId)
    if (index === -1) return null

    submissions[index].status = approve ? 'tracking' : 'rejected'
    submissions[index].reviewed_at = new Date().toISOString()
    submissions[index].notes = note || (approve ? 'Approved by Brand Owner.' : 'Rejected by Brand Owner.')

    if (approve) {
      // Simulate initial views
      submissions[index].verified_views = Math.floor(Math.random() * 15000) + 5000
      this.recalculatePayout(submissions[index])
    }

    setItem(SUBMISSIONS_KEY, submissions)
    return submissions[index]
  },

  recalculatePayout(submission) {
    const campaigns = this.getCampaigns()
    const campaign = campaigns.find(c => c.id === submission.campaign_id)
    if (!campaign) return

    const rawEarned = (submission.verified_views / 1000) * submission.rate_per_1000
    const maxCap = campaign.max_payout_per_clip || Infinity
    const cappedEarned = Math.min(rawEarned, maxCap, campaign.remaining_budget)

    submission.earned_amount = parseFloat(cappedEarned.toFixed(2))

    // Update wallet balance for clipper
    const wallets = getItem(WALLETS_KEY, INITIAL_WALLETS)
    const wallet = wallets[submission.clipper_id] || { balance: 0, total_earned: 0, total_withdrawn: 0 }
    
    wallet.balance += submission.earned_amount
    wallet.total_earned += submission.earned_amount
    wallets[submission.clipper_id] = wallet
    setItem(WALLETS_KEY, wallets)
  },

  // --- VIEW SNAPSHOTS ---
  getViewSnapshots(submissionId) {
    const snapshots = getItem(SNAPSHOTS_KEY, INITIAL_VIEW_SNAPSHOTS)
    return snapshots.filter(s => s.submission_id === submissionId)
  },

  addSimulatedViews(submissionId, additionalViews) {
    const submissions = this.getSubmissions()
    const sub = submissions.find(s => s.id === submissionId)
    if (!sub || sub.status !== 'tracking') return null

    sub.verified_views += additionalViews
    this.recalculatePayout(sub)

    // Append snapshot
    const snapshots = getItem(SNAPSHOTS_KEY, INITIAL_VIEW_SNAPSHOTS)
    snapshots.push({
      id: `vs-${Date.now()}`,
      submission_id: submissionId,
      view_count: sub.verified_views,
      captured_at: new Date().toISOString(),
    })

    setItem(SNAPSHOTS_KEY, snapshots)
    setItem(SUBMISSIONS_KEY, submissions)
    return sub
  },

  // --- WALLETS & WITHDRAWALS ---
  getWallet(userId) {
    const wallets = getItem(WALLETS_KEY, INITIAL_WALLETS)
    return wallets[userId] || { user_id: userId, balance: 0, total_earned: 0, total_withdrawn: 0 }
  },

  getTransactions(userId) {
    const txs = getItem(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS)
    return txs.filter(t => t.user_id === userId)
  },

  requestWithdrawal(userId, amount) {
    const wallets = getItem(WALLETS_KEY, INITIAL_WALLETS)
    const wallet = wallets[userId]
    if (!wallet || wallet.balance < amount) {
      throw new Error('Insufficient wallet balance!')
    }

    wallet.balance -= amount
    wallet.total_withdrawn += amount
    setItem(WALLETS_KEY, wallets)

    const txs = getItem(TRANSACTIONS_KEY, INITIAL_TRANSACTIONS)
    const newTx = {
      id: `tx-${Date.now()}`,
      user_id: userId,
      type: 'withdrawal',
      amount: -amount,
      title: `Stripe Connect Withdrawal to Bank (•••• ${Math.floor(1000 + Math.random()*9000)})`,
      status: 'completed',
      created_at: new Date().toISOString(),
    }
    txs.unshift(newTx)
    setItem(TRANSACTIONS_KEY, txs)

    return wallet
  },

  // --- FRAUD FLAGS & ADMIN ---
  getFraudFlags() {
    return getItem(FRAUD_FLAGS_KEY, INITIAL_FRAUD_FLAGS)
  },

  resolveFraudFlag(flagId, action, notes) {
    const flags = this.getFraudFlags()
    const flag = flags.find(f => f.id === flagId)
    if (!flag) return null

    flag.status = action === 'clear' ? 'cleared' : 'confirmed_fraud'
    flag.resolved_at = new Date().toISOString()
    flag.admin_notes = notes

    const submissions = this.getSubmissions()
    const sub = submissions.find(s => s.id === flag.submission_id)
    if (sub) {
      sub.status = action === 'clear' ? 'tracking' : 'rejected'
      sub.notes = action === 'clear' ? 'Fraud flag cleared by Admin.' : 'Submission rejected due to confirmed view-botting.'
      setItem(SUBMISSIONS_KEY, submissions)
    }

    setItem(FRAUD_FLAGS_KEY, flags)
    return flag
  },

  adminOverrideViews(submissionId, newViewCount, reason) {
    const submissions = this.getSubmissions()
    const sub = submissions.find(s => s.id === submissionId)
    if (!sub) return null

    sub.verified_views = parseInt(newViewCount)
    sub.notes = `Manual Admin Override: ${reason} (New views: ${newViewCount.toLocaleString()})`
    this.recalculatePayout(sub)

    setItem(SUBMISSIONS_KEY, submissions)
    return sub
  }
}

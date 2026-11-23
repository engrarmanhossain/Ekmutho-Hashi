import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  initialCampaigns,
  initialDonors,
  initialBeneficiaries,
  initialInventory,
  initialPackages,
  initialExpenses,
  initialStaff,
  initialOrgSettings
} from '../data/initialData';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  saveSupabaseConfig,
  clearSupabaseConfig,
  getSupabaseCredentials
} from '../lib/supabase';

const CharityContext = createContext(null);

export const CharityProvider = ({ children }) => {
  // Local storage state
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem('ekmutho_campaigns');
    return saved ? JSON.parse(saved) : initialCampaigns;
  });

  const [donors, setDonors] = useState(() => {
    const saved = localStorage.getItem('ekmutho_donors');
    return saved ? JSON.parse(saved) : initialDonors;
  });

  const [beneficiaries, setBeneficiaries] = useState(() => {
    const saved = localStorage.getItem('ekmutho_beneficiaries');
    return saved ? JSON.parse(saved) : initialBeneficiaries;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('ekmutho_inventory');
    return saved ? JSON.parse(saved) : initialInventory;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('ekmutho_packages');
    return saved ? JSON.parse(saved) : initialPackages;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('ekmutho_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('ekmutho_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  // Organization Profile & Branding
  const [orgSettings, setOrgSettings] = useState(() => {
    const saved = localStorage.getItem('ekmutho_org_settings');
    return saved ? JSON.parse(saved) : initialOrgSettings;
  });

  const [selectedCampaign, setSelectedCampaign] = useState(() => {
    return localStorage.getItem('ekmutho_selected_campaign') || 'all';
  });

  // Cloud & Auth State
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ekmutho_active_user') || sessionStorage.getItem('ekmutho_active_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [supabaseCreds, setSupabaseCreds] = useState(getSupabaseCredentials);

  // View Mode: 'admin' | 'staff' | 'public'
  // When admin is logged in, they can preview 'admin', 'staff', or 'public'
  const [adminPreviewMode, setAdminPreviewMode] = useState(() => {
    return localStorage.getItem('ekmutho_admin_preview_mode') || 'admin';
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('ekmutho_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('ekmutho_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('ekmutho_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('ekmutho_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('ekmutho_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('ekmutho_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('ekmutho_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('ekmutho_org_settings', JSON.stringify(orgSettings));
  }, [orgSettings]);

  useEffect(() => {
    localStorage.setItem('ekmutho_admin_preview_mode', adminPreviewMode);
  }, [adminPreviewMode]);

  useEffect(() => {
    localStorage.setItem('ekmutho_selected_campaign', selectedCampaign);
  }, [selectedCampaign]);

  // Transform helpers: DB snake_case <-> App camelCase
  const mapDbCampaign = (r) => ({
    id: r.id,
    name: r.name,
    banglaName: r.bangla_name,
    description: r.description,
    targetAmount: Number(r.target_amount) || 0,
    targetFamilies: Number(r.target_families) || 0,
    startDate: r.start_date,
    endDate: r.end_date,
    status: r.status,
    category: r.category
  });

  const mapAppCampaignToDb = (c) => ({
    id: c.id,
    name: c.name,
    bangla_name: c.banglaName || null,
    description: c.description || null,
    target_amount: c.targetAmount || 0,
    target_families: c.targetFamilies || 0,
    start_date: c.startDate || null,
    end_date: c.endDate || null,
    status: c.status || 'active',
    category: c.category || null
  });

  const mapDbDonor = (r) => ({
    id: r.id,
    receiptId: r.receipt_id,
    donorName: r.donor_name,
    phone: r.phone,
    reference: r.reference,
    campaignId: r.campaign_id,
    contributionType: r.contribution_type,
    amount: Number(r.amount) || 0,
    productDetails: r.product_details,
    paymentMethod: r.payment_method,
    transactionId: r.transaction_id,
    date: r.date,
    note: r.note,
    recordedBy: r.recorded_by
  });

  const mapAppDonorToDb = (d) => ({
    id: d.id,
    receipt_id: d.receiptId,
    donor_name: d.donorName,
    phone: d.phone,
    reference: d.reference,
    campaign_id: d.campaignId,
    contribution_type: d.contributionType,
    amount: d.amount || 0,
    product_details: d.productDetails || null,
    payment_method: d.paymentMethod,
    transaction_id: d.transactionId || null,
    date: d.date,
    note: d.note || null,
    recorded_by: user?.user_metadata?.full_name || user?.email || 'Volunteer'
  });

  const mapDbBeneficiary = (r) => ({
    id: r.id,
    familyId: r.family_id,
    tokenNumber: r.token_number,
    headName: r.head_name,
    guardianName: r.guardian_name,
    mobile: r.mobile,
    area: r.area,
    nid: r.nid,
    familyMembers: Number(r.family_members) || 1,
    priorityCategory: r.priority_category,
    status: r.status,
    approvalStatus: r.approval_status || (r.status === 'Pending Approval' ? 'pending' : 'approved'),
    approvedBy: r.approved_by || (r.status !== 'Pending Approval' ? 'Engr. Arman Hossain (Admin)' : null),
    approvedAt: r.approved_at || null,
    submittedBy: r.submitted_by || 'Volunteer Field Survey',
    submittedAt: r.submitted_at || null,
    distributionSlot: r.distribution_slot || '',
    tokenNotes: r.token_notes || '',
    notes: r.notes,
    aidHistory: r.aid_history || []
  });

  const mapAppBeneficiaryToDb = (b) => ({
    id: b.id,
    family_id: b.familyId,
    token_number: b.tokenNumber,
    head_name: b.headName,
    guardian_name: b.guardianName || null,
    mobile: b.mobile,
    area: b.area,
    nid: b.nid || null,
    family_members: b.familyMembers || 1,
    priority_category: b.priorityCategory,
    status: b.status || 'Pending',
    approval_status: b.approvalStatus || 'approved',
    approved_by: b.approvedBy || null,
    approved_at: b.approvedAt || null,
    submitted_by: b.submittedBy || null,
    submitted_at: b.submittedAt || null,
    distribution_slot: b.distributionSlot || null,
    token_notes: b.tokenNotes || null,
    notes: b.notes || null,
    aid_history: b.aidHistory || []
  });

  const mapDbInventory = (r) => ({
    id: r.id,
    name: r.name,
    category: r.category,
    unit: r.unit,
    qtyPurchased: Number(r.qty_purchased) || 0,
    qtyDonated: Number(r.qty_donated) || 0,
    qtyDistributed: Number(r.qty_distributed) || 0,
    unitCost: Number(r.unit_cost) || 0,
    minAlertStock: Number(r.min_alert_stock) || 10,
    notes: r.notes
  });

  const mapAppInventoryToDb = (i) => ({
    id: i.id,
    name: i.name,
    category: i.category,
    unit: i.unit,
    qty_purchased: i.qtyPurchased || 0,
    qty_donated: i.qtyDonated || 0,
    qty_distributed: i.qtyDistributed || 0,
    unit_cost: i.unitCost || 0,
    min_alert_stock: i.minAlertStock || 10,
    notes: i.notes || null
  });

  const mapDbPackage = (r) => ({
    id: r.id,
    name: r.name,
    banglaName: r.bangla_name,
    campaignId: r.campaign_id,
    description: r.description,
    items: r.items || []
  });

  const mapAppPackageToDb = (p) => ({
    id: p.id,
    name: p.name,
    bangla_name: p.banglaName || null,
    campaign_id: p.campaignId || null,
    description: p.description || null,
    items: p.items || []
  });

  const mapDbExpense = (r) => ({
    id: r.id,
    date: r.date,
    campaignId: r.campaign_id,
    type: r.type,
    category: r.category,
    amount: Number(r.amount) || 0,
    paymentMethod: r.payment_method,
    handledBy: r.handled_by,
    linkedBeneficiaryId: r.linked_beneficiary_id,
    linkedBeneficiaryName: r.linked_beneficiary_name,
    note: r.note,
    items: r.items || [],
    isDistribution: Boolean(r.is_distribution)
  });

  const mapAppExpenseToDb = (e) => ({
    id: e.id,
    date: e.date,
    campaign_id: e.campaignId || null,
    type: e.type,
    category: e.category || null,
    amount: e.amount || 0,
    payment_method: e.paymentMethod,
    handled_by: e.handledBy,
    linked_beneficiary_id: e.linkedBeneficiaryId || null,
    linked_beneficiary_name: e.linkedBeneficiaryName || null,
    note: e.note || null,
    items: e.items || [],
    is_distribution: Boolean(e.isDistribution)
  });

  const mapDbStaff = (r) => ({
    id: r.id,
    staffId: r.staff_id,
    fullName: r.full_name,
    email: r.email,
    password: r.password || null,
    phone: r.phone,
    role: r.role,
    area: r.area,
    status: r.status,
    joinedDate: r.joined_date,
    approvedBy: r.approved_by,
    approvedAt: r.approved_at,
    notes: r.notes,
    avatarUrl: r.avatar_url || null
  });

  const mapAppStaffToDb = (s) => ({
    id: s.id,
    staff_id: s.staffId || null,
    full_name: s.fullName,
    email: s.email,
    password: s.password || null,
    phone: s.phone || null,
    role: s.role || 'Field Volunteer',
    area: s.area || null,
    status: s.status || 'pending',
    joined_date: s.joinedDate || null,
    approved_by: s.approvedBy || null,
    notes: s.notes || null,
    avatar_url: s.avatarUrl || null
  });

  // Pull data from Supabase Cloud
  const pullFromSupabase = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setIsCloudSyncing(true);
    try {
      const [
        { data: campData, error: campErr },
        { data: donorData, error: donorErr },
        { data: benData, error: benErr },
        { data: invData, error: invErr },
        { data: pkgData, error: pkgErr },
        { data: expData, error: expErr },
        { data: staffData }
      ] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('donors').select('*').order('created_at', { ascending: false }),
        supabase.from('beneficiaries').select('*').order('created_at', { ascending: false }),
        supabase.from('inventory').select('*').order('created_at', { ascending: false }),
        supabase.from('packages').select('*').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('created_at', { ascending: false }),
        supabase.from('staff_members').select('*').order('created_at', { ascending: false })
      ]);

      if (campErr) throw campErr;

      if (campData && campData.length > 0) setCampaigns(campData.map(mapDbCampaign));
      if (donorData && donorData.length > 0) setDonors(donorData.map(mapDbDonor));
      if (benData && benData.length > 0) setBeneficiaries(benData.map(mapDbBeneficiary));
      if (invData && invData.length > 0) setInventory(invData.map(mapDbInventory));
      if (pkgData && pkgData.length > 0) setPackages(pkgData.map(mapDbPackage));
      if (expData && expData.length > 0) setExpenses(expData.map(mapDbExpense));
      if (staffData && staffData.length > 0) setStaff(staffData.map(mapDbStaff));

      addToast('Data synced from Supabase cloud!', 'success');
    } catch (err) {
      console.error('Supabase pull error:', err);
      addToast(`Sync notice: ${err.message || 'Check database permissions'}`, 'info');
    } finally {
      setIsCloudSyncing(false);
    }
  }, []);

  // Upload all local data to Supabase (Initial Cloud Seeding)
  const syncLocalToSupabase = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      addToast('Please connect to Supabase first.', 'error');
      return;
    }

    setIsCloudSyncing(true);
    try {
      if (campaigns.length > 0) {
        await supabase.from('campaigns').upsert(campaigns.map(mapAppCampaignToDb));
      }
      if (inventory.length > 0) {
        await supabase.from('inventory').upsert(inventory.map(mapAppInventoryToDb));
      }
      if (packages.length > 0) {
        await supabase.from('packages').upsert(packages.map(mapAppPackageToDb));
      }
      if (donors.length > 0) {
        await supabase.from('donors').upsert(donors.map(mapAppDonorToDb));
      }
      if (beneficiaries.length > 0) {
        await supabase.from('beneficiaries').upsert(beneficiaries.map(mapAppBeneficiaryToDb));
      }
      if (expenses.length > 0) {
        await supabase.from('expenses').upsert(expenses.map(mapAppExpenseToDb));
      }
      if (staff.length > 0) {
        await supabase.from('staff_members').upsert(staff.map(mapAppStaffToDb));
      }

      addToast('All local records successfully uploaded to Supabase!', 'success');
    } catch (err) {
      console.error('Sync to Supabase error:', err);
      addToast(`Failed to upload to cloud: ${err.message}`, 'error');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Connect & Disconnect Supabase
  const connectSupabase = async (url, key) => {
    saveSupabaseConfig(url, key);
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      // Test with a quick query
      const { error } = await client.from('campaigns').select('count', { count: 'exact', head: true });
      if (error && !error.message.includes('relation "public.campaigns" does not exist')) {
        // Some error other than missing table
      }

      setIsCloudConnected(true);
      setSupabaseCreds({ url, key });
      pullFromSupabase();
      return true;
    } catch (err) {
      console.error('Connect error:', err);
      return false;
    }
  };

  const disconnectSupabase = () => {
    clearSupabaseConfig();
    setIsCloudConnected(false);
    setUser(null);
    setSupabaseCreds({ url: '', key: '' });
    addToast('Supabase disconnected. Operating in offline LocalStorage mode.', 'info');
  };

  // Auth Listeners & Realtime Subscriptions
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setIsCloudConnected(false);
      return;
    }

    setIsCloudConnected(true);

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    }).catch(() => {});

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        const localUser = localStorage.getItem('ekmutho_active_user') || sessionStorage.getItem('ekmutho_active_user');
        if (!localUser) {
          setUser(null);
        }
      }
    });

    // Initial pull
    pullFromSupabase();

    // Setup Realtime Channel for Postgres changes
    const channel = supabase.channel('ekmutho_db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'campaigns' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbCampaign(payload.new);
          setCampaigns(prev => [item, ...prev.filter(c => c.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbCampaign(payload.new);
          setCampaigns(prev => prev.map(c => c.id === item.id ? item : c));
        } else if (payload.eventType === 'DELETE') {
          setCampaigns(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'donors' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbDonor(payload.new);
          setDonors(prev => [item, ...prev.filter(d => d.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbDonor(payload.new);
          setDonors(prev => prev.map(d => d.id === item.id ? item : d));
        } else if (payload.eventType === 'DELETE') {
          setDonors(prev => prev.filter(d => d.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'beneficiaries' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbBeneficiary(payload.new);
          setBeneficiaries(prev => [item, ...prev.filter(b => b.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbBeneficiary(payload.new);
          setBeneficiaries(prev => prev.map(b => b.id === item.id ? item : b));
        } else if (payload.eventType === 'DELETE') {
          setBeneficiaries(prev => prev.filter(b => b.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbInventory(payload.new);
          setInventory(prev => [...prev.filter(i => i.id !== item.id), item]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbInventory(payload.new);
          setInventory(prev => prev.map(i => i.id === item.id ? item : i));
        } else if (payload.eventType === 'DELETE') {
          setInventory(prev => prev.filter(i => i.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'packages' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbPackage(payload.new);
          setPackages(prev => [...prev.filter(p => p.id !== item.id), item]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbPackage(payload.new);
          setPackages(prev => prev.map(p => p.id === item.id ? item : p));
        } else if (payload.eventType === 'DELETE') {
          setPackages(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const item = mapDbExpense(payload.new);
          setExpenses(prev => [item, ...prev.filter(e => e.id !== item.id)]);
        } else if (payload.eventType === 'UPDATE') {
          const item = mapDbExpense(payload.new);
          setExpenses(prev => prev.map(e => e.id === item.id ? item : e));
        } else if (payload.eventType === 'DELETE') {
          setExpenses(prev => prev.filter(e => e.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      authSub?.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [pullFromSupabase]);

  // Pre-configured Organization Leadership Credentials
  const ADMIN_CREDENTIALS = {
    email: 'arman@ekmuthohashi.org',
    password: 'arman2026**',
    user: {
      id: 'admin-arman-hossain',
      email: 'arman@ekmuthohashi.org',
      user_metadata: {
        full_name: 'Engr. Arman Hossain',
        role: 'Admin, President & CEO',
        title: 'President & CEO',
        is_admin: true
      }
    }
  };

  // Volunteer & Leadership Auth Actions
  const signUpVolunteer = async ({ email, password, fullName, phone, area, notes }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const isAdmin = trimmedEmail === ADMIN_CREDENTIALS.email;

    const newStaffApplicant = {
      id: `STAFF-${Date.now().toString().slice(-4)}`,
      staffId: `EH-VOL-${String(staff.length + 1).padStart(3, '0')}`,
      fullName: fullName.trim(),
      email: trimmedEmail,
      password: password || 'staff123456',
      phone: phone || 'N/A',
      role: isAdmin ? 'Admin, President & CEO' : 'Field Volunteer',
      area: area || 'General Field Team',
      status: isAdmin ? 'approved' : 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      notes: notes || 'Registered via staff portal',
      approvedBy: isAdmin ? 'Founder' : null
    };

    setStaff(prev => [newStaffApplicant, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              role: newStaffApplicant.role,
              status: newStaffApplicant.status
            }
          }
        });
        await supabase.from('staff_members').insert(mapAppStaffToDb(newStaffApplicant));
      } catch (err) {
        console.error('Cloud signup error:', err);
      }
    }

    if (isAdmin) {
      setUser(ADMIN_CREDENTIALS.user);
      localStorage.setItem('ekmutho_active_user', JSON.stringify(ADMIN_CREDENTIALS.user));
      addToast('Welcome Engr. Arman Hossain (Admin, President & CEO)!', 'success');
    } else {
      addToast('Application submitted! Pending review & approval by Engr. Arman Hossain.', 'info');
    }

    return newStaffApplicant;
  };

  const signInVolunteer = async ({ email, password, rememberMe = true }) => {
    const trimmedEmail = email.trim().toLowerCase();

    const persistUserSession = (userData) => {
      setUser(userData);
      if (rememberMe) {
        localStorage.setItem('ekmutho_active_user', JSON.stringify(userData));
        sessionStorage.removeItem('ekmutho_active_user');
      } else {
        sessionStorage.setItem('ekmutho_active_user', JSON.stringify(userData));
        localStorage.removeItem('ekmutho_active_user');
      }
    };

    // 1. Check Master Admin, President & CEO credentials
    if (trimmedEmail === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = ADMIN_CREDENTIALS.user;
      persistUserSession(adminUser);
      addToast('Welcome Engr. Arman Hossain (Admin, President & CEO)!', 'success');

      // Also attempt Supabase sign-in/up in background if connected
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.signInWithPassword({ email, password }).catch(() => {
          supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: 'Engr. Arman Hossain',
                role: 'Admin, President & CEO',
                is_admin: true
              }
            }
          }).catch(() => {});
        });
      }
      return { user: adminUser };
    }

    // 2. Check staff roster approval status and credentials
    const staffRecord = staff.find(s => s.email?.trim().toLowerCase() === trimmedEmail);

    if (staffRecord) {
      if (staffRecord.status === 'pending') {
        throw new Error('Your staff registration is pending approval by Engr. Arman Hossain (Admin, President & CEO). Please wait for approval.');
      }
      if (staffRecord.status === 'rejected') {
        throw new Error('This account access has been revoked. Please contact the administrator.');
      }

      // Check password matching
      const hasStoredPassword = Boolean(staffRecord.password);
      const isPasswordValid = hasStoredPassword
        ? staffRecord.password === password
        : (password && (password === 'staff2026**' || password === 'staff123456' || password.length >= 6));

      if (!isPasswordValid) {
        throw new Error(`Incorrect password for ${staffRecord.fullName}. Please check the password given by Admin or contact Engr. Arman Hossain.`);
      }

      // If staff had no stored password, save the password entered
      if (!hasStoredPassword && password) {
        setStaff(prev => prev.map(s => s.id === staffRecord.id ? { ...s, password } : s));
      }

      const staffUser = {
        id: staffRecord.id,
        email: staffRecord.email,
        user_metadata: {
          full_name: staffRecord.fullName,
          role: staffRecord.role,
          phone: staffRecord.phone,
          area: staffRecord.area,
          avatar_url: staffRecord.avatarUrl
        }
      };

      persistUserSession(staffUser);
      addToast(`Welcome back, ${staffRecord.fullName} (${staffRecord.role})!`, 'success');

      // Also sync session with Supabase in background if connected
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.signInWithPassword({ email, password }).catch(() => {
          supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: staffRecord.fullName,
                role: staffRecord.role
              }
            }
          }).catch(() => {});
        });
      }

      return { user: staffUser };
    }

    // 3. Fallback: Check Supabase Auth if user exists in cloud
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (!error && data?.user) {
          const userMeta = data.user.user_metadata || {};
          const matchedRoster = staff.find(s => s.email?.toLowerCase() === trimmedEmail);

          if (matchedRoster && matchedRoster.status !== 'approved' && !userMeta.is_admin) {
            throw new Error('Your staff registration has not been approved by the Admin yet.');
          }

          persistUserSession(data.user);
          addToast(`Welcome back, ${userMeta.full_name || data.user.email}!`, 'success');
          return data;
        }
      } catch (sbErr) {
        if (sbErr.message && !sbErr.message.includes('Invalid login credentials')) {
          throw sbErr;
        }
      }
    }

    throw new Error('Account not found with this email or invalid password. Please ask Admin Engr. Arman Hossain to confirm your staff credentials.');
  };

  const signOutVolunteer = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem('ekmutho_active_user');
    sessionStorage.removeItem('ekmutho_active_user');
    addToast('Signed out successfully.', 'info');
  };

  // Staff Profile & Permission Actions
  const updateStaffProfile = async (updatedData, targetStaffId = null) => {
    const targetId = targetStaffId || updatedData.id;

    let targetUpdated = null;
    const updatedStaffList = staff.map(s => {
      const isTarget = targetId
        ? (s.id === targetId || s.staffId === targetId || s.email?.toLowerCase() === targetId?.toLowerCase())
        : (s.email?.toLowerCase() === user?.email?.toLowerCase() || s.id === user?.id);

      if (isTarget) {
        targetUpdated = {
          ...s,
          ...updatedData
        };
        return targetUpdated;
      }
      return s;
    });

    setStaff(updatedStaffList);

    // If the updated staff member is the currently logged-in user, also update session user
    const isCurrentUser = targetUpdated && user && (
      targetUpdated.email?.toLowerCase() === user.email?.toLowerCase() || targetUpdated.id === user.id
    );
    if (isCurrentUser) {
      const updatedUser = {
        ...user,
        user_metadata: {
          ...user.user_metadata,
          full_name: updatedData.fullName || user.user_metadata?.full_name,
          phone: updatedData.phone || user.user_metadata?.phone,
          area: updatedData.area || user.user_metadata?.area,
          role: updatedData.role || user.user_metadata?.role,
          avatar_url: updatedData.avatarUrl !== undefined ? updatedData.avatarUrl : user.user_metadata?.avatar_url
        }
      };
      setUser(updatedUser);
      if (sessionStorage.getItem('ekmutho_active_user')) {
        sessionStorage.setItem('ekmutho_active_user', JSON.stringify(updatedUser));
      } else {
        localStorage.setItem('ekmutho_active_user', JSON.stringify(updatedUser));
      }
    }

    const supabase = getSupabaseClient();
    if (supabase && targetUpdated) {
      try {
        await supabase.from('staff_members').upsert(mapAppStaffToDb(targetUpdated));
      } catch (err) {
        console.error('Cloud staff profile update error:', err);
      }
      if (updatedData.password) {
        try {
          await supabase.auth.signUp({
            email: targetUpdated.email,
            password: updatedData.password,
            options: {
              data: {
                full_name: targetUpdated.fullName,
                role: targetUpdated.role
              }
            }
          });
        } catch (authErr) {
          console.warn('Cloud auth password sync warning:', authErr);
        }
      }
    }

    addToast(`Profile settings for ${targetUpdated?.fullName || 'staff member'} saved successfully!`, 'success');
  };

  const approveStaffMember = async (staffId) => {
    const target = staff.find(s => s.id === staffId);
    if (!target) return;

    const approvedItem = {
      ...target,
      status: 'approved',
      approvedBy: 'Engr. Arman Hossain (Admin, President & CEO)',
      approvedAt: new Date().toISOString()
    };

    setStaff(prev => prev.map(s => s.id === staffId ? approvedItem : s));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('staff_members').update({
          status: 'approved',
          approved_by: 'Engr. Arman Hossain (Admin, President & CEO)',
          approved_at: new Date().toISOString()
        }).eq('id', staffId);
      } catch (err) {
        console.error('Cloud staff approval error:', err);
      }
    }

    addToast(`Approved ${target.fullName}! Access granted.`, 'success');
  };

  const rejectStaffMember = async (staffId) => {
    const target = staff.find(s => s.id === staffId);
    setStaff(prev => prev.filter(s => s.id !== staffId));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('staff_members').delete().eq('id', staffId);
      } catch (err) {
        console.error('Cloud staff delete error:', err);
      }
    }

    addToast(`Removed ${target?.fullName || 'member'}.`, 'info');
  };

  const updateStaffRole = async (staffId, newRole) => {
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, role: newRole } : s));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('staff_members').update({ role: newRole }).eq('id', staffId);
      } catch (err) {
        console.error('Cloud role update error:', err);
      }
    }

    addToast(`Role updated to ${newRole}!`, 'success');
  };

  const addStaffMemberDirectly = async (staffData) => {
    const nextNum = String(staff.length + 1).padStart(3, '0');
    const assignedPassword = staffData.password || 'staff123456';
    const newStaff = {
      ...staffData,
      password: assignedPassword,
      id: `STAFF-${Date.now().toString().slice(-4)}`,
      staffId: `EH-STAFF-${nextNum}`,
      status: 'approved',
      joinedDate: new Date().toISOString().split('T')[0],
      approvedBy: 'Engr. Arman Hossain (Admin, President & CEO)'
    };

    setStaff(prev => [newStaff, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('staff_members').insert(mapAppStaffToDb(newStaff));
      } catch (err) {
        console.error('Cloud direct staff insert error:', err);
      }
      try {
        await supabase.auth.signUp({
          email: newStaff.email,
          password: assignedPassword,
          options: {
            data: {
              full_name: newStaff.fullName,
              role: newStaff.role
            }
          }
        });
      } catch (authErr) {
        console.warn('Supabase staff signup error:', authErr);
      }
    }

    addToast(`Registered ${newStaff.fullName} as ${newStaff.role} with login credentials!`, 'success');
    return newStaff;
  };

  const removeStaffMember = async (staffId) => {
    const target = staff.find(s => s.id === staffId);
    if (!target) return;
    if (target.email === 'arman@ekmuthohashi.org' || target.role.includes('CEO')) {
      addToast('Cannot remove the Admin, President & CEO account.', 'error');
      return;
    }

    setStaff(prev => prev.filter(s => s.id !== staffId));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('staff_members').delete().eq('id', staffId);
      } catch (err) {
        console.error('Cloud staff remove error:', err);
      }
    }

    addToast(`Removed ${target.fullName} from staff roster.`, 'info');
  };

  const updateOrgSettings = (newSettings) => {
    setOrgSettings(prev => ({
      ...prev,
      ...newSettings
    }));
    addToast('Organization profile & branding updated successfully!', 'success');
  };

  const resetOrgSettings = () => {
    setOrgSettings(initialOrgSettings);
    addToast('Reset organization profile to defaults.', 'info');
  };

  // View Mode & Roles: Public View, Staff View, Admin View
  const isUserAdmin = useMemo(() => {
    return Boolean(
      user?.user_metadata?.is_admin ||
      user?.email?.toLowerCase() === 'arman@ekmuthohashi.org'
    );
  }, [user]);

  const effectiveViewMode = useMemo(() => {
    if (!user) return 'public';
    if (isUserAdmin) return 'admin';
    return 'staff';
  }, [user, isUserAdmin]);

  const setViewMode = (mode) => {
    if (!['admin', 'staff', 'public'].includes(mode)) return;
    if (!isUserAdmin && mode === 'admin') {
      addToast('Admin view requires President & CEO authorization.', 'error');
      return;
    }
    setAdminPreviewMode(mode);
    addToast(`Switched view to ${mode.toUpperCase()} VIEW.`, 'info');
  };

  const currentStaffProfile = useMemo(() => {
    if (!user) return null;
    return staff.find(
      s => s.email?.toLowerCase() === user.email?.toLowerCase() || s.id === user.id
    ) || (isUserAdmin ? staff.find(s => s.email === 'arman@ekmuthohashi.org') : null);
  }, [user, staff, isUserAdmin]);

  const permissions = useMemo(() => {
    const isPublic = effectiveViewMode === 'public';
    const isStaff = effectiveViewMode === 'staff';
    const isAdmin = effectiveViewMode === 'admin';
    const role = (currentStaffProfile?.role || '').toLowerCase();

    return {
      isPublic,
      isStaff,
      isAdmin,
      // Database connection: strictly visible in Admin view
      canManageSupabase: isAdmin,
      // Organization branding & settings: strictly visible in Admin view
      canManageOrg: isAdmin,
      // Staff management & approvals: strictly visible in Admin view
      canManageStaff: isAdmin,
      // Fund collection (Add Fund)
      canAddFund: isAdmin || (isStaff && (role.includes('accountant') || role.includes('treasurer') || role.includes('coordinator') || role.includes('admin') || role.includes('procurement'))),
      // Expenses logging (Add Expense)
      canAddExpense: isAdmin || (isStaff && (role.includes('accountant') || role.includes('treasurer') || role.includes('procurement') || role.includes('logistics') || role.includes('coordinator') || role.includes('admin'))),
      // Aid distribution
      canDistributeAid: isAdmin || (isStaff && (role.includes('distribution') || role.includes('volunteer') || role.includes('coordinator') || role.includes('lead') || role.includes('survey'))),
      // Needy family / Beneficiary registration
      canAddBeneficiary: isAdmin || (isStaff && (role.includes('survey') || role.includes('verification') || role.includes('distribution') || role.includes('volunteer') || role.includes('coordinator'))),
      // Manage campaigns
      canManageCampaigns: isAdmin || (isStaff && role.includes('coordinator')),
      // Manage Inventory
      canManageInventory: isAdmin || (isStaff && (role.includes('logistics') || role.includes('procurement') || role.includes('coordinator'))),
      // Profile editing
      canEditProfile: Boolean(user) && !isPublic
    };
  }, [effectiveViewMode, currentStaffProfile, user]);

  // Filtered lists
  const filteredDonors = useMemo(() => {
    if (selectedCampaign === 'all') return donors;
    return donors.filter(d => d.campaignId === selectedCampaign);
  }, [donors, selectedCampaign]);

  const filteredExpenses = useMemo(() => {
    if (selectedCampaign === 'all') return expenses;
    return expenses.filter(e => e.campaignId === selectedCampaign);
  }, [expenses, selectedCampaign]);

  // Derived figures
  const totalCashCollected = useMemo(() => {
    return filteredDonors
      .filter(d => d.contributionType === 'cash')
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [filteredDonors]);

  const totalProductDonationsValue = useMemo(() => {
    return filteredDonors
      .filter(d => d.contributionType === 'product')
      .reduce((sum, d) => sum + (Number(d.productDetails?.estimatedValue) || 0), 0);
  }, [filteredDonors]);

  const totalFundCollected = useMemo(() => {
    return totalCashCollected + totalProductDonationsValue;
  }, [totalCashCollected, totalProductDonationsValue]);

  const totalSpent = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [filteredExpenses]);

  const cashBalance = useMemo(() => {
    return totalCashCollected - totalSpent;
  }, [totalCashCollected, totalSpent]);

  const totalFamiliesServed = useMemo(() => {
    if (selectedCampaign === 'all') {
      return beneficiaries.filter(b => b.status === 'Delivered' || (b.aidHistory && b.aidHistory.length > 0)).length;
    }
    return beneficiaries.filter(b =>
      b.aidHistory && b.aidHistory.some(a => a.campaignId === selectedCampaign)
    ).length;
  }, [beneficiaries, selectedCampaign]);

  const totalPackagesDistributed = useMemo(() => {
    return filteredExpenses.filter(e => e.isDistribution && e.type.includes('Package')).length;
  }, [filteredExpenses]);

  const getProductStock = (productId) => {
    const prod = inventory.find(p => p.id === productId);
    if (!prod) return 0;
    return (Number(prod.qtyPurchased) || 0) + (Number(prod.qtyDonated) || 0) - (Number(prod.qtyDistributed) || 0);
  };

  // Action: Add Campaign
  const addCampaign = async (campaignData) => {
    const newCamp = {
      ...campaignData,
      id: `camp-${Date.now()}`,
      status: campaignData.status || 'active'
    };
    setCampaigns(prev => [newCamp, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('campaigns').insert(mapAppCampaignToDb(newCamp));
      } catch (err) {
        console.error('Cloud insert failed:', err);
      }
    }

    addToast(`Campaign "${newCamp.name}" created!`);
    return newCamp;
  };

  const updateCampaign = async (updatedCamp) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCamp.id ? updatedCamp : c));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('campaigns').update(mapAppCampaignToDb(updatedCamp)).eq('id', updatedCamp.id);
      } catch (err) {
        console.error('Cloud update failed:', err);
      }
    }

    addToast(`Campaign "${updatedCamp.name}" updated!`);
  };

  const deleteCampaign = async (id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    if (selectedCampaign === id) setSelectedCampaign('all');

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('campaigns').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud delete failed:', err);
      }
    }
    addToast('Campaign deleted.', 'info');
  };

  // Action: Add Donor
  const addDonor = async (donorData) => {
    const nextReceiptNum = 1000 + donors.length + 1;
    const newDonor = {
      ...donorData,
      id: `DON-${Date.now().toString().slice(-4)}`,
      receiptId: `EH-REC-${nextReceiptNum}`,
      date: donorData.date || new Date().toISOString().split('T')[0]
    };

    // If direct product donation, optionally credit inventory
    if (newDonor.contributionType === 'product' && newDonor.productDetails?.productId) {
      const prodId = newDonor.productDetails.productId;
      const qty = Number(newDonor.productDetails.quantity) || 0;
      setInventory(prev => prev.map(item => {
        if (item.id === prodId) {
          const updated = {
            ...item,
            qtyDonated: (Number(item.qtyDonated) || 0) + qty
          };
          const supabase = getSupabaseClient();
          if (supabase) {
            supabase.from('inventory').update(mapAppInventoryToDb(updated)).eq('id', item.id).then();
          }
          return updated;
        }
        return item;
      }));
    }

    setDonors(prev => [newDonor, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('donors').insert(mapAppDonorToDb(newDonor));
      } catch (err) {
        console.error('Cloud donor insert failed:', err);
      }
    }

    addToast(`Donation recorded from ${newDonor.donorName}! Receipt: ${newDonor.receiptId}`);
    return newDonor;
  };

  const deleteDonor = async (id) => {
    setDonors(prev => prev.filter(x => x.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('donors').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud donor delete error:', err);
      }
    }
    addToast('Donation record removed.', 'info');
  };

  // Action: Add Beneficiary
  const addBeneficiary = async (data) => {
    const nextFamNum = String(beneficiaries.length + 1).padStart(3, '0');
    const isApprovedByAdmin = isUserAdmin && data.approvalStatus !== 'pending';

    const newBeneficiary = {
      ...data,
      id: `BEN-${Date.now().toString().slice(-4)}`,
      familyId: `EH-FAM-${nextFamNum}`,
      tokenNumber: `TKN-${nextFamNum}`,
      status: data.status || (isApprovedByAdmin ? 'Token Given' : 'Pending Approval'),
      approvalStatus: isApprovedByAdmin ? 'approved' : (data.approvalStatus || 'pending'),
      approvedBy: isApprovedByAdmin ? (orgSettings?.president ? `${orgSettings.president} (Admin, President & CEO)` : 'Engr. Arman Hossain (Admin, President & CEO)') : null,
      approvedAt: isApprovedByAdmin ? new Date().toISOString() : null,
      submittedBy: data.submittedBy || user?.user_metadata?.full_name || user?.email || 'Public Online Application',
      submittedAt: data.submittedAt || new Date().toISOString(),
      aidHistory: []
    };
    setBeneficiaries(prev => [newBeneficiary, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('beneficiaries').insert(mapAppBeneficiaryToDb(newBeneficiary));
      } catch (err) {
        console.error('Cloud beneficiary insert error:', err);
      }
    }

    if (newBeneficiary.approvalStatus === 'approved') {
      addToast(`Family ${newBeneficiary.headName} registered & approved (Token: ${newBeneficiary.tokenNumber})`, 'success');
    } else {
      addToast(`Family ${newBeneficiary.headName} registered. Submitted for Executive Admin Approval!`, 'info');
    }
    return newBeneficiary;
  };

  const approveBeneficiary = async (beneficiaryId) => {
    const target = beneficiaries.find(b => b.id === beneficiaryId);
    if (!target) return;

    const approvedRecord = {
      ...target,
      approvalStatus: 'approved',
      status: target.status === 'Pending Approval' ? 'Token Given' : target.status,
      approvedBy: orgSettings?.president ? `${orgSettings.president} (Admin, President & CEO)` : 'Engr. Arman Hossain (Admin, President & CEO)',
      approvedAt: new Date().toISOString()
    };

    setBeneficiaries(prev => prev.map(b => b.id === beneficiaryId ? approvedRecord : b));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('beneficiaries').update(mapAppBeneficiaryToDb(approvedRecord)).eq('id', beneficiaryId);
      } catch (err) {
        console.error('Cloud beneficiary approval error:', err);
      }
    }

    addToast(`Family ${target.headName} approved! Token ${target.tokenNumber} authorized.`, 'success');
  };

  const rejectBeneficiary = async (beneficiaryId, reason = '') => {
    const target = beneficiaries.find(b => b.id === beneficiaryId);
    if (!target) return;

    const rejectedRecord = {
      ...target,
      approvalStatus: 'rejected',
      status: 'Rejected',
      rejectedReason: reason || 'Does not meet emergency criteria',
      approvedBy: null
    };

    setBeneficiaries(prev => prev.map(b => b.id === beneficiaryId ? rejectedRecord : b));

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('beneficiaries').update(mapAppBeneficiaryToDb(rejectedRecord)).eq('id', beneficiaryId);
      } catch (err) {
        console.error('Cloud beneficiary reject error:', err);
      }
    }

    addToast(`Registration for ${target.headName} has been rejected.`, 'info');
  };

  const updateBeneficiary = async (updated) => {
    setBeneficiaries(prev => prev.map(b => b.id === updated.id ? updated : b));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('beneficiaries').update(mapAppBeneficiaryToDb(updated)).eq('id', updated.id);
      } catch (err) {
        console.error('Cloud beneficiary update error:', err);
      }
    }
    addToast(`Updated record for ${updated.headName}`);
  };

  const deleteBeneficiary = async (id) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('beneficiaries').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud beneficiary delete error:', err);
      }
    }
    addToast('Beneficiary record removed.', 'info');
  };

  // Action: Products
  const addProduct = async (prodData) => {
    const newProd = {
      ...prodData,
      id: `PROD-${Date.now().toString().slice(-4)}`,
      qtyPurchased: Number(prodData.qtyPurchased) || 0,
      qtyDonated: Number(prodData.qtyDonated) || 0,
      qtyDistributed: 0,
      unitCost: Number(prodData.unitCost) || 0,
      minAlertStock: Number(prodMinAlert || prodData.minAlertStock) || 10
    };
    setInventory(prev => [...prev, newProd]);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('inventory').insert(mapAppInventoryToDb(newProd));
      } catch (err) {
        console.error('Cloud inventory insert error:', err);
      }
    }
    addToast(`Product "${newProd.name}" added to inventory.`);
    return newProd;
  };

  const updateProduct = async (updatedProd) => {
    setInventory(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('inventory').update(mapAppInventoryToDb(updatedProd)).eq('id', updatedProd.id);
      } catch (err) {
        console.error('Cloud inventory update error:', err);
      }
    }
    addToast(`Product "${updatedProd.name}" updated.`);
  };

  const deleteProduct = async (id) => {
    setInventory(prev => prev.filter(p => p.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('inventory').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud inventory delete error:', err);
      }
    }
    addToast('Product removed.', 'info');
  };

  // Action: Packages
  const addPackage = async (pkgData) => {
    const newPkg = {
      ...pkgData,
      id: `PKG-${Date.now().toString().slice(-4)}`
    };
    setPackages(prev => [...prev, newPkg]);
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('packages').insert(mapAppPackageToDb(newPkg));
      } catch (err) {
        console.error('Cloud package insert error:', err);
      }
    }
    addToast(`Package bundle "${newPkg.name}" created!`);
    return newPkg;
  };

  const updatePackage = async (updatedPkg) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('packages').update(mapAppPackageToDb(updatedPkg)).eq('id', updatedPkg.id);
      } catch (err) {
        console.error('Cloud package update error:', err);
      }
    }
    addToast(`Package "${updatedPkg.name}" updated.`);
  };

  const deletePackage = async (id) => {
    setPackages(prev => prev.filter(p => p.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('packages').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud package delete error:', err);
      }
    }
    addToast('Package removed.', 'info');
  };

  // Action: Add Expense
  const addExpense = async (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: `EXP-${Date.now().toString().slice(-4)}`,
      amount: Number(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split('T')[0],
      isDistribution: false
    };

    if (expenseData.addToInventory && expenseData.items && expenseData.items.length > 0) {
      setInventory(prev => prev.map(item => {
        const matchingPurchasedItem = expenseData.items.find(pi => pi.productId === item.id);
        if (matchingPurchasedItem) {
          const addedQty = Number(matchingPurchasedItem.quantity) || 0;
          const updated = {
            ...item,
            qtyPurchased: (Number(item.qtyPurchased) || 0) + addedQty
          };
          const supabase = getSupabaseClient();
          if (supabase) {
            supabase.from('inventory').update(mapAppInventoryToDb(updated)).eq('id', item.id).then();
          }
          return updated;
        }
        return item;
      }));
    }

    setExpenses(prev => [newExpense, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('expenses').insert(mapAppExpenseToDb(newExpense));
      } catch (err) {
        console.error('Cloud expense insert error:', err);
      }
    }

    addToast(`Expense ৳${newExpense.amount} recorded!`);
    return newExpense;
  };

  const deleteExpense = async (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('expenses').delete().eq('id', id);
      } catch (err) {
        console.error('Cloud expense delete error:', err);
      }
    }
    addToast('Expense removed.', 'info');
  };

  // Action: Distribute Aid
  const distributeAid = async ({
    beneficiaryId,
    campaignId,
    distributionType,
    packageId,
    customItems = [],
    cashAmount = 0,
    handledBy = 'Volunteer Team',
    note = ''
  }) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
    if (!beneficiary) {
      throw new Error('Please select a valid beneficiary family.');
    }

    const campaign = campaigns.find(c => c.id === campaignId) || campaigns[0];

    let itemsToDeduct = [];
    let packageInfo = null;

    if (distributionType === 'package') {
      packageInfo = packages.find(p => p.id === packageId);
      if (!packageInfo) {
        throw new Error('Please select a valid relief package.');
      }
      itemsToDeduct = packageInfo.items;
    } else if (distributionType === 'custom') {
      itemsToDeduct = customItems;
    }

    // Check inventory stock (prevent negative stock!)
    for (const item of itemsToDeduct) {
      const prod = inventory.find(p => p.id === item.productId);
      if (!prod) continue;
      const currentAvailable = (Number(prod.qtyPurchased) || 0) + (Number(prod.qtyDonated) || 0) - (Number(prod.qtyDistributed) || 0);
      const needed = Number(item.quantity) || 0;
      if (needed > currentAvailable) {
        throw new Error(`Insufficient stock for "${prod.name}". Available: ${currentAvailable} ${prod.unit}, required: ${needed} ${prod.unit}.`);
      }
    }

    // Deduct stock from inventory
    if (itemsToDeduct.length > 0) {
      setInventory(prev => prev.map(prod => {
        const itemToDeduct = itemsToDeduct.find(i => i.productId === prod.id);
        if (itemToDeduct) {
          const deductQty = Number(itemToDeduct.quantity) || 0;
          const updated = {
            ...prod,
            qtyDistributed: (Number(prod.qtyDistributed) || 0) + deductQty
          };
          const supabase = getSupabaseClient();
          if (supabase) {
            supabase.from('inventory').update(mapAppInventoryToDb(updated)).eq('id', prod.id).then();
          }
          return updated;
        }
        return prod;
      }));
    }

    // Aid history entry
    const aidEntry = {
      id: `AID-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      campaignId: campaign.id,
      campaignName: campaign.name,
      type: distributionType === 'cash' ? 'Cash Aid' : (packageInfo ? 'Package' : 'Custom Relief Items'),
      description: distributionType === 'cash'
        ? `Direct Cash Assistance (৳${cashAmount})`
        : (packageInfo ? `${packageInfo.name} (${itemsToDeduct.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')})` : itemsToDeduct.map(i => `${i.quantity} ${i.unit} ${i.productName}`).join(', ')),
      amount: distributionType === 'cash' ? Number(cashAmount) : 0,
      handledBy: handledBy || user?.user_metadata?.full_name || 'Volunteer'
    };

    // Update Beneficiary
    const updatedBeneficiary = {
      ...beneficiary,
      status: 'Delivered',
      aidHistory: [aidEntry, ...(beneficiary.aidHistory || [])]
    };

    setBeneficiaries(prev => prev.map(b => b.id === beneficiaryId ? updatedBeneficiary : b));

    // Distribution Expense record
    const distributionExpense = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      campaignId: campaign.id,
      type: distributionType === 'cash' ? 'Beneficiary Cash Aid' : 'Beneficiary Package Distribution',
      category: distributionType === 'cash' ? 'Direct Cash Aid' : 'Aid Distribution',
      amount: distributionType === 'cash' ? Number(cashAmount) : 0,
      paymentMethod: 'Hand Cash',
      handledBy: handledBy || user?.user_metadata?.full_name || 'Volunteer',
      linkedBeneficiaryId: beneficiary.id,
      linkedBeneficiaryName: `${beneficiary.headName} (${beneficiary.tokenNumber})`,
      note: note || `Aid handed to ${beneficiary.headName} against Token ${beneficiary.tokenNumber}`,
      items: itemsToDeduct.map(i => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unit: i.unit
      })),
      isDistribution: true
    };

    setExpenses(prev => [distributionExpense, ...prev]);

    // Sync to Supabase
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await Promise.all([
          supabase.from('beneficiaries').update(mapAppBeneficiaryToDb(updatedBeneficiary)).eq('id', beneficiary.id),
          supabase.from('expenses').insert(mapAppExpenseToDb(distributionExpense))
        ]);
      } catch (err) {
        console.error('Cloud distribute sync error:', err);
      }
    }

    addToast(`Aid successfully distributed to ${beneficiary.headName}!`);
    return { aidEntry, distributionExpense };
  };

  const verifyUserPassword = (inputPassword) => {
    if (!inputPassword) return false;
    const trimmed = inputPassword.trim();

    // 1. Check current logged-in staff user
    if (user) {
      const staffMember = staff.find(
        s => s.email?.toLowerCase() === user.email?.toLowerCase() || s.id === user.id
      );
      if (staffMember?.password && staffMember.password === trimmed) {
        return true;
      }
    }

    // 2. Check Founder / Master Admin password (Engr. Arman Hossain)
    const armanStaff = staff.find(s => s.email?.toLowerCase() === 'arman@ekmuthohashi.org');
    if (armanStaff?.password && armanStaff.password === trimmed) {
      return true;
    }
    if (trimmed === 'arman2026**') {
      return true;
    }

    return false;
  };

  const resetToSampleData = () => {
    setCampaigns(initialCampaigns);
    setDonors(initialDonors);
    setBeneficiaries(initialBeneficiaries);
    setInventory(initialInventory);
    setPackages(initialPackages);
    setExpenses(initialExpenses);
    setSelectedCampaign('all');

    // Retain logged-in session, staff accounts, and org settings
    const activeUser = localStorage.getItem('ekmutho_active_user');
    const savedStaff = localStorage.getItem('ekmutho_staff');
    const savedOrg = localStorage.getItem('ekmutho_org_settings');
    const remEmail = localStorage.getItem('ekmutho_remembered_email');
    const remPref = localStorage.getItem('ekmutho_remember_me');
    localStorage.clear();
    if (activeUser) localStorage.setItem('ekmutho_active_user', activeUser);
    if (savedStaff) localStorage.setItem('ekmutho_staff', savedStaff);
    if (savedOrg) localStorage.setItem('ekmutho_org_settings', savedOrg);
    if (remEmail) localStorage.setItem('ekmutho_remembered_email', remEmail);
    if (remPref) localStorage.setItem('ekmutho_remember_me', remPref);

    addToast('Sample Ramadan Iftar data has been reloaded!', 'success');
  };

  const clearAllData = () => {
    setCampaigns([initialCampaigns[0]]);
    setDonors([]);
    setBeneficiaries([]);
    setInventory([]);
    setPackages([]);
    setExpenses([]);
    setSelectedCampaign('all');

    // Retain logged-in session, staff accounts, and org settings
    const activeUser = localStorage.getItem('ekmutho_active_user');
    const savedStaff = localStorage.getItem('ekmutho_staff');
    const savedOrg = localStorage.getItem('ekmutho_org_settings');
    const remEmail = localStorage.getItem('ekmutho_remembered_email');
    const remPref = localStorage.getItem('ekmutho_remember_me');
    localStorage.clear();
    if (activeUser) localStorage.setItem('ekmutho_active_user', activeUser);
    if (savedStaff) localStorage.setItem('ekmutho_staff', savedStaff);
    if (savedOrg) localStorage.setItem('ekmutho_org_settings', savedOrg);
    if (remEmail) localStorage.setItem('ekmutho_remembered_email', remEmail);
    if (remPref) localStorage.setItem('ekmutho_remember_me', remPref);

    addToast('All relief and distribution records cleared.', 'info');
  };

  const value = {
    campaigns,
    donors,
    beneficiaries,
    inventory,
    packages,
    expenses,
    selectedCampaign,
    setSelectedCampaign,
    filteredDonors,
    filteredExpenses,
    totalCashCollected,
    totalProductDonationsValue,
    totalFundCollected,
    totalSpent,
    cashBalance,
    totalFamiliesServed,
    totalPackagesDistributed,
    totalBeneficiariesCount: beneficiaries.length,
    getProductStock,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    addDonor,
    deleteDonor,
    addBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
    approveBeneficiary,
    rejectBeneficiary,
    addProduct,
    updateProduct,
    deleteProduct,
    addPackage,
    updatePackage,
    deletePackage,
    addExpense,
    deleteExpense,
    distributeAid,
    resetToSampleData,
    clearAllData,
    verifyUserPassword,
    toasts,
    addToast,
    removeToast,
    // Supabase Cloud & Auth
    isCloudConnected,
    isCloudSyncing,
    user,
    supabaseUrl: supabaseCreds.url,
    supabaseKey: supabaseCreds.key,
    connectSupabase,
    disconnectSupabase,
    syncLocalToSupabase,
    pullFromSupabase,
    signUpVolunteer,
    signInVolunteer,
    signOutVolunteer,
    // Staff & Permission Controls
    staff,
    updateStaffProfile,
    approveStaffMember,
    rejectStaffMember,
    removeStaffMember,
    updateStaffRole,
    addStaffMemberDirectly,
    // Organization Profile & Branding
    orgSettings,
    updateOrgSettings,
    resetOrgSettings,
    // 3 Dashboard Views & Permissions
    viewMode: effectiveViewMode,
    setViewMode,
    adminPreviewMode,
    permissions,
    currentStaffProfile,
    isUserAdmin
  };

  return (
    <CharityContext.Provider value={value}>
      {children}
    </CharityContext.Provider>
  );
};

export const useCharity = () => {
  const context = useContext(CharityContext);
  if (!context) {
    throw new Error('useCharity must be used within a CharityProvider');
  }
  return context;
};

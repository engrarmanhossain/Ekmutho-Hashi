// Initial realistic sample data for Ekmutho Hashi Charity & Relief Distribution

export const initialCampaigns = [
  {
    id: 'camp-1',
    name: 'Ramadan Iftar Samogri Drive 2026',
    banglaName: 'রমজান ইফতার সামগ্রী বিতরণ ২০২৬',
    description: 'Providing essential Ramadan food packages (Chola, Dates, Oil, Sugar, Muri, Dal) to 100 poor, disabled, and widow-headed families.',
    targetAmount: 150000,
    targetFamilies: 100,
    startDate: '2026-02-15',
    endDate: '2026-03-25',
    status: 'active',
    category: 'Ramadan & Food Relief',
    bannerColor: 'emerald'
  },
  {
    id: 'camp-2',
    name: 'Winter Warmth Blanket Drive',
    banglaName: 'শীতবস্ত্র ও কম্বল বিতরণ কর্মসূচি',
    description: 'Distributed heavy winter blankets and warm sweaters to street dwellers, rickshaw pullers, and elderly villagers in northern districts.',
    targetAmount: 85000,
    targetFamilies: 150,
    startDate: '2025-11-20',
    endDate: '2026-01-10',
    status: 'completed',
    category: 'Winter Aid',
    bannerColor: 'cyan'
  },
  {
    id: 'camp-3',
    name: 'Emergency Medical & Family Aid',
    banglaName: 'জরুরি চিকিৎসা ও পরিবার সহায়তা তহবিল',
    description: 'Continuous emergency medical aid, prescription medicine costs, and emergency food relief for families facing sudden crises.',
    targetAmount: 50000,
    targetFamilies: 30,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    status: 'active',
    category: 'Emergency & Health',
    bannerColor: 'amber'
  }
];

export const initialInventory = [
  {
    id: 'PROD-1',
    name: 'Chola / Chickpeas (ছোলা)',
    category: 'Grains & Pulses',
    unit: 'kg',
    unitCost: 105,
    qtyPurchased: 150,
    qtyDonated: 50,
    qtyDistributed: 80,
    minAlertStock: 25,
    notes: 'Premium wholesale Australian chickpeas from Moulvibazar'
  },
  {
    id: 'PROD-2',
    name: 'Khejur / Dates (খেজুর)',
    category: 'Dates & Sweets',
    unit: 'kg',
    unitCost: 180,
    qtyPurchased: 100,
    qtyDonated: 0,
    qtyDistributed: 40,
    minAlertStock: 20,
    notes: 'Fresh sweet Kholas/Mariam dates in hygienic 1kg packs'
  },
  {
    id: 'PROD-3',
    name: 'Soybean Oil (সয়াবিন তেল)',
    category: 'Oil & Spices',
    unit: 'liter',
    unitCost: 190,
    qtyPurchased: 80,
    qtyDonated: 20,
    qtyDistributed: 40,
    minAlertStock: 15,
    notes: 'Fortified pure soybean oil (Teer / Rupchanda)'
  },
  {
    id: 'PROD-4',
    name: 'Muri / Puffed Rice (মুড়ি)',
    category: 'Dry Food',
    unit: 'kg',
    unitCost: 75,
    qtyPurchased: 100,
    qtyDonated: 0,
    qtyDistributed: 40,
    minAlertStock: 20,
    notes: 'Naturally roasted urea-free Barishal Muri'
  },
  {
    id: 'PROD-5',
    name: 'Sugar / Chini (চিনি)',
    category: 'Dates & Sweets',
    unit: 'kg',
    unitCost: 135,
    qtyPurchased: 100,
    qtyDonated: 0,
    qtyDistributed: 40,
    minAlertStock: 20,
    notes: 'Deshi refined white crystal sugar'
  },
  {
    id: 'PROD-6',
    name: 'Mosur Dal / Lentils (মসুর ডাল)',
    category: 'Grains & Pulses',
    unit: 'kg',
    unitCost: 140,
    qtyPurchased: 100,
    qtyDonated: 0,
    qtyDistributed: 40,
    minAlertStock: 20,
    notes: 'Clean medium-grain red lentils'
  },
  {
    id: 'PROD-7',
    name: 'Miniket Rice (মিনিকেট চাল)',
    category: 'Grains & Pulses',
    unit: 'kg',
    unitCost: 68,
    qtyPurchased: 200,
    qtyDonated: 0,
    qtyDistributed: 50,
    minAlertStock: 30,
    notes: '50kg sacks from Babubazar wholesale market'
  }
];

export const initialPackages = [
  {
    id: 'PKG-1',
    name: 'Standard Ramadan Iftar Box',
    banglaName: 'স্ট্যান্ডার্ড রমজান ইফতার বক্স',
    campaignId: 'camp-1',
    description: 'Complete family pack designed to sustain a 4-6 member family for the initial 10-15 days of Ramadan.',
    items: [
      { productId: 'PROD-1', productName: 'Chola / Chickpeas (ছোলা)', quantity: 2, unit: 'kg' },
      { productId: 'PROD-2', productName: 'Khejur / Dates (খেজুর)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-3', productName: 'Soybean Oil (সয়াবিন তেল)', quantity: 1, unit: 'liter' },
      { productId: 'PROD-4', productName: 'Muri / Puffed Rice (মুড়ি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-5', productName: 'Sugar / Chini (চিনি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-6', productName: 'Mosur Dal / Lentils (মসুর ডাল)', quantity: 1, unit: 'kg' }
    ]
  },
  {
    id: 'PKG-2',
    name: 'Emergency Family Ration Pack',
    banglaName: 'জরুরি খাদ্য রেশন প্যাকেট',
    campaignId: 'camp-3',
    description: 'Essential staple rations for destitute households in emergency distress.',
    items: [
      { productId: 'PROD-7', productName: 'Miniket Rice (মিনিকেট চাল)', quantity: 5, unit: 'kg' },
      { productId: 'PROD-6', productName: 'Mosur Dal / Lentils (মসুর ডাল)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-3', productName: 'Soybean Oil (সয়াবিন তেল)', quantity: 1, unit: 'liter' },
      { productId: 'PROD-1', productName: 'Chola / Chickpeas (ছোলা)', quantity: 1, unit: 'kg' }
    ]
  }
];

export const initialDonors = [
  {
    id: 'DON-001',
    receiptId: 'EH-REC-1001',
    donorName: 'Engr. Mahmudul Hasan',
    phone: '01711234567',
    reference: 'Group Member',
    campaignId: 'camp-1',
    contributionType: 'cash',
    amount: 10000,
    paymentMethod: 'bKash',
    transactionId: 'BK9X8721A',
    date: '2026-02-18',
    note: 'Monthly member contribution for Ramadan Iftar Drive'
  },
  {
    id: 'DON-002',
    receiptId: 'EH-REC-1002',
    donorName: 'Anonymous',
    phone: '01819876543',
    reference: 'Local Well-wisher',
    campaignId: 'camp-1',
    contributionType: 'cash',
    amount: 25000,
    paymentMethod: 'Bank Transfer',
    transactionId: 'DBBL-76342',
    date: '2026-02-20',
    note: 'Zakat fund contribution for poor fasting families'
  },
  {
    id: 'DON-003',
    receiptId: 'EH-REC-1003',
    donorName: 'Haji Shamsul Alam',
    phone: '01912445566',
    reference: 'Local Trader / Merchant',
    campaignId: 'camp-1',
    contributionType: 'product',
    amount: 0,
    productDetails: {
      productId: 'PROD-1',
      productName: 'Chola / Chickpeas (ছোলা)',
      quantity: 50,
      unit: 'kg',
      estimatedValue: 5250
    },
    paymentMethod: 'Hand Cash',
    transactionId: '',
    date: '2026-02-22',
    note: 'Direct donation of 1 whole 50kg bag wholesale Chola'
  },
  {
    id: 'DON-004',
    receiptId: 'EH-REC-1004',
    donorName: 'Dr. Farzana Yasmin',
    phone: '01723998877',
    reference: 'Friend / Colleague',
    campaignId: 'camp-1',
    contributionType: 'cash',
    amount: 15000,
    paymentMethod: 'Nagad',
    transactionId: 'NG882199',
    date: '2026-02-24',
    note: 'Sponsoring 10 standard Iftar packages'
  },
  {
    id: 'DON-005',
    receiptId: 'EH-REC-1005',
    donorName: 'Tariqul Islam (Dubai Expat)',
    phone: '01755112233',
    reference: 'Overseas Expatriate',
    campaignId: 'camp-1',
    contributionType: 'cash',
    amount: 30000,
    paymentMethod: 'Bank Transfer',
    transactionId: 'IBBL-99104',
    date: '2026-02-25',
    note: 'Overseas remittance donation for Ramadan Iftar Drive 2026'
  },
  {
    id: 'DON-006',
    receiptId: 'EH-REC-1006',
    donorName: 'Kazi Nurul Huda',
    phone: '01678123490',
    reference: 'Group Member',
    campaignId: 'camp-1',
    contributionType: 'product',
    amount: 0,
    productDetails: {
      productId: 'PROD-3',
      productName: 'Soybean Oil (সয়াবিন তেল)',
      quantity: 20,
      unit: 'liter',
      estimatedValue: 3800
    },
    paymentMethod: 'Hand Cash',
    transactionId: '',
    date: '2026-02-26',
    note: 'Direct in-kind donation of 4 cans (5L each) fortified oil'
  },
  {
    id: 'DON-007',
    receiptId: 'EH-REC-1007',
    donorName: 'Anonymous (Well-wisher from Dhanmondi)',
    phone: '01844001122',
    reference: 'Local Well-wisher',
    campaignId: 'camp-1',
    contributionType: 'cash',
    amount: 12000,
    paymentMethod: 'bKash',
    transactionId: 'BK4Z1109B',
    date: '2026-02-27',
    note: 'Sadaqah donation for orphan and widow families'
  },
  {
    id: 'DON-008',
    receiptId: 'EH-REC-1008',
    donorName: 'Advocate Sumon Chowdhury',
    phone: '01712993344',
    reference: 'Friend / Colleague',
    campaignId: 'camp-3',
    contributionType: 'cash',
    amount: 8000,
    paymentMethod: 'Rocket',
    transactionId: 'RK119028',
    date: '2026-02-28',
    note: 'Emergency medicine and food support contribution'
  }
];

export const initialBeneficiaries = [
  {
    id: 'BEN-101',
    familyId: 'EH-FAM-001',
    tokenNumber: 'TKN-001',
    headName: 'Mst. Rokeya Begum',
    guardianName: 'Late Abdul Karim (Husband)',
    mobile: '01789123401',
    area: 'Mirpur 11 Slum, Ward 3, Dhaka',
    nid: '19782692019283',
    familyMembers: 5,
    priorityCategory: 'Widow / Elderly',
    status: 'Delivered',
    notes: 'Elderly widow living with disabled daughter and 3 school-going grandchildren.',
    aidHistory: [
      {
        id: 'AID-101',
        date: '2026-03-01',
        campaignId: 'camp-1',
        campaignName: 'Ramadan Iftar Samogri Drive 2026',
        type: 'Package',
        description: 'Standard Ramadan Iftar Box (2kg Chola, 1kg Dates, 1L Oil, 1kg Sugar, 1kg Muri, 1kg Dal)',
        amount: 0,
        handledBy: 'Tanvir Ahmed (Volunteer Coordinator)'
      }
    ]
  },
  {
    id: 'BEN-102',
    familyId: 'EH-FAM-002',
    tokenNumber: 'TKN-002',
    headName: 'Md. Sirajul Islam',
    guardianName: 'Late Kashem Ali (Father)',
    mobile: '01988223344',
    area: 'Rayerbazar Beribadh, Ward 14, Dhaka',
    nid: '19652619028374',
    familyMembers: 6,
    priorityCategory: 'Day Laborer',
    status: 'Delivered',
    notes: 'Daily wage earner; underwent leg surgery last month, currently unable to pull van.',
    aidHistory: [
      {
        id: 'AID-102',
        date: '2026-03-01',
        campaignId: 'camp-1',
        campaignName: 'Ramadan Iftar Samogri Drive 2026',
        type: 'Package',
        description: 'Standard Ramadan Iftar Box (2kg Chola, 1kg Dates, 1L Oil, 1kg Sugar, 1kg Muri, 1kg Dal)',
        amount: 0,
        handledBy: 'Rafiqul Islam'
      }
    ]
  },
  {
    id: 'BEN-103',
    familyId: 'EH-FAM-003',
    tokenNumber: 'TKN-003',
    headName: 'Md. Jalal Uddin',
    guardianName: 'Late Afsar Uddin (Father)',
    mobile: '01877665544',
    area: 'Mohammadpur Basila, Ward 33, Dhaka',
    nid: '19852693847261',
    familyMembers: 4,
    priorityCategory: 'Disabled',
    status: 'Token Given',
    notes: 'Visually impaired person selling small household stickers on footpaths.',
    aidHistory: []
  },
  {
    id: 'BEN-104',
    familyId: 'EH-FAM-004',
    tokenNumber: 'TKN-004',
    headName: 'Mst. Farida Khatun',
    guardianName: 'Md. Mostafa (Husband)',
    mobile: '01655443322',
    area: 'Geneva Camp, Mohammadpur, Dhaka',
    nid: '19822694726182',
    familyMembers: 7,
    priorityCategory: 'Low-Income Family',
    status: 'Pending',
    notes: 'Large household with small children; husband does odd tailoring jobs.',
    aidHistory: []
  },
  {
    id: 'BEN-105',
    familyId: 'EH-FAM-005',
    tokenNumber: 'TKN-005',
    headName: 'Abdul Gafur',
    guardianName: 'Late Nayan Mia (Father)',
    mobile: '01766554411',
    area: 'Ashrafabad, Kamrangirchar, Dhaka',
    nid: '19722684920174',
    familyMembers: 4,
    priorityCategory: 'Day Laborer',
    status: 'Token Given',
    notes: 'Earth-digger / construction helper without steady work.',
    aidHistory: []
  },
  {
    id: 'BEN-106',
    familyId: 'EH-FAM-006',
    tokenNumber: 'TKN-006',
    headName: 'Mst. Amena Begum',
    guardianName: 'Late Joynal Abedin (Husband)',
    mobile: '01811223399',
    area: 'Kallyanpur Pora Basti, Ward 11, Dhaka',
    nid: '19692694829103',
    familyMembers: 3,
    priorityCategory: 'Widow / Elderly',
    status: 'Delivered',
    notes: 'Elderly lady suffering from chronic asthma; no earning family members.',
    aidHistory: [
      {
        id: 'AID-103',
        date: '2026-03-02',
        campaignId: 'camp-1',
        campaignName: 'Ramadan Iftar Samogri Drive 2026',
        type: 'Cash Aid',
        description: 'Emergency Cash Aid for Ramadan Groceries & Medicine (৳1,500)',
        amount: 1500,
        handledBy: 'Sadik Hasan'
      }
    ]
  },
  {
    id: 'BEN-107',
    familyId: 'EH-FAM-007',
    tokenNumber: 'TKN-007',
    headName: 'Sufia Akhter & 2 Orphans',
    guardianName: 'Late Anwar Hossain (Husband)',
    mobile: '01933445588',
    area: 'Dhalpur Slum, Jatrabari, Dhaka',
    nid: '19902684918274',
    familyMembers: 3,
    priorityCategory: 'Orphan Support',
    status: 'Token Given',
    notes: 'Mother with two minor orphan boys (ages 6 and 9); works part-time housemaid.',
    aidHistory: []
  },
  {
    id: 'BEN-108',
    familyId: 'EH-FAM-008',
    tokenNumber: 'TKN-008',
    headName: 'Nur Mohammad',
    guardianName: 'Late Shafiullah (Father)',
    mobile: '01744112299',
    area: 'Korail Basti, Banani, Dhaka',
    nid: '19882673928172',
    familyMembers: 5,
    priorityCategory: 'Low-Income Family',
    status: 'Pending',
    notes: 'Tea stall helper in Korail; struggles to meet monthly house rent and meals.',
    aidHistory: []
  }
];

export const initialExpenses = [
  {
    id: 'EXP-001',
    date: '2026-02-26',
    campaignId: 'camp-1',
    type: 'Market Purchase',
    category: 'Relief Food Stock',
    amount: 42500,
    paymentMethod: 'Hand Cash',
    handledBy: 'Sadik Hasan & Rafiqul Islam',
    note: 'Wholesale purchase of 150kg Chola, 100kg Dates, 100kg Sugar from Moulvibazar Wholesale Market',
    items: [
      { productId: 'PROD-1', productName: 'Chola / Chickpeas (ছোলা)', quantity: 150, unit: 'kg', unitCost: 105, subtotal: 15750 },
      { productId: 'PROD-2', productName: 'Khejur / Dates (খেজুর)', quantity: 100, unit: 'kg', unitCost: 180, subtotal: 18000 },
      { productId: 'PROD-5', productName: 'Sugar / Chini (চিনি)', quantity: 100, unit: 'kg', unitCost: 87.5, subtotal: 8750 }
    ],
    isDistribution: false
  },
  {
    id: 'EXP-002',
    date: '2026-02-27',
    campaignId: 'camp-1',
    type: 'Market Purchase',
    category: 'Relief Food Stock',
    amount: 28700,
    paymentMethod: 'Bank Transfer',
    handledBy: 'Tanvir Ahmed',
    note: 'Wholesale purchase of 80L Soybean Oil, 100kg Muri, 40kg Mosur Dal from Kawran Bazar',
    items: [
      { productId: 'PROD-3', productName: 'Soybean Oil (সয়াবিন তেল)', quantity: 80, unit: 'liter', unitCost: 190, subtotal: 15200 },
      { productId: 'PROD-4', productName: 'Muri / Puffed Rice (মুড়ি)', quantity: 100, unit: 'kg', unitCost: 75, subtotal: 7500 },
      { productId: 'PROD-6', productName: 'Mosur Dal / Lentils (মসুর ডাল)', quantity: 40, unit: 'kg', unitCost: 150, subtotal: 6000 }
    ],
    isDistribution: false
  },
  {
    id: 'EXP-003',
    date: '2026-02-28',
    campaignId: 'camp-1',
    type: 'Transport & Logistics',
    category: 'Logistics',
    amount: 2400,
    paymentMethod: 'Hand Cash',
    handledBy: 'Rafiqul Islam',
    note: 'Pickup van fare from Moulvibazar/Kawran Bazar to central staging hub & porter labour',
    items: [],
    isDistribution: false
  },
  {
    id: 'EXP-004',
    date: '2026-02-28',
    campaignId: 'camp-1',
    type: 'Packaging & Printing',
    category: 'Packaging',
    amount: 1850,
    paymentMethod: 'bKash',
    handledBy: 'Tanvir Ahmed',
    note: 'Custom heavy non-woven shopping bags (100 pcs) + distribution token cards with numbers',
    items: [],
    isDistribution: false
  },
  {
    id: 'EXP-005',
    date: '2026-03-01',
    campaignId: 'camp-1',
    type: 'Beneficiary Package Distribution',
    category: 'Aid Distribution',
    amount: 0,
    paymentMethod: 'Hand Cash',
    handledBy: 'Tanvir Ahmed',
    linkedBeneficiaryId: 'BEN-101',
    linkedBeneficiaryName: 'Mst. Rokeya Begum (Token TKN-001)',
    note: 'Delivered Standard Ramadan Iftar Box (2kg Chola, 1kg Dates, 1L Oil, 1kg Sugar, 1kg Muri, 1kg Dal)',
    items: [
      { productId: 'PROD-1', productName: 'Chola / Chickpeas (ছোলা)', quantity: 2, unit: 'kg' },
      { productId: 'PROD-2', productName: 'Khejur / Dates (খেজুর)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-3', productName: 'Soybean Oil (সয়াবিন তেল)', quantity: 1, unit: 'liter' },
      { productId: 'PROD-4', productName: 'Muri / Puffed Rice (মুড়ি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-5', productName: 'Sugar / Chini (চিনি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-6', productName: 'Mosur Dal / Lentils (মসুর ডাল)', quantity: 1, unit: 'kg' }
    ],
    isDistribution: true
  },
  {
    id: 'EXP-006',
    date: '2026-03-01',
    campaignId: 'camp-1',
    type: 'Beneficiary Package Distribution',
    category: 'Aid Distribution',
    amount: 0,
    paymentMethod: 'Hand Cash',
    handledBy: 'Rafiqul Islam',
    linkedBeneficiaryId: 'BEN-102',
    linkedBeneficiaryName: 'Md. Sirajul Islam (Token TKN-002)',
    note: 'Delivered Standard Ramadan Iftar Box (2kg Chola, 1kg Dates, 1L Oil, 1kg Sugar, 1kg Muri, 1kg Dal)',
    items: [
      { productId: 'PROD-1', productName: 'Chola / Chickpeas (ছোলা)', quantity: 2, unit: 'kg' },
      { productId: 'PROD-2', productName: 'Khejur / Dates (খেজুর)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-3', productName: 'Soybean Oil (সয়াবিন তেল)', quantity: 1, unit: 'liter' },
      { productId: 'PROD-4', productName: 'Muri / Puffed Rice (মুড়ি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-5', productName: 'Sugar / Chini (চিনি)', quantity: 1, unit: 'kg' },
      { productId: 'PROD-6', productName: 'Mosur Dal / Lentils (মসুর ডাল)', quantity: 1, unit: 'kg' }
    ],
    isDistribution: true
  },
  {
    id: 'EXP-007',
    date: '2026-03-02',
    campaignId: 'camp-1',
    type: 'Beneficiary Cash Aid',
    category: 'Direct Cash Aid',
    amount: 1500,
    paymentMethod: 'Hand Cash',
    handledBy: 'Sadik Hasan',
    linkedBeneficiaryId: 'BEN-106',
    linkedBeneficiaryName: 'Mst. Amena Begum (Token TKN-006)',
    note: 'Emergency cash stipend for medicine and iftar meals handed to elderly widow',
    items: [],
    isDistribution: true
  }
];

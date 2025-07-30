// Comprehensive demo data for the jewelry repair tracking system

export const demoData = {
  // System-wide statistics
  systemStats: {
    totalShops: 3,
    totalUsers: 18,
    totalRepairs: 342,
    activeRepairs: 28,
    completedRepairs: 314,
    avgRepairTime: 3.1,
    customerSatisfaction: 4.7,
    totalRevenue: 156800,
  },

  // Shops data
  shops: [
    {
      shopId: "SHOP001",
      shopName: "סדנת תכשיטים נוצצים",
      location: "תל אביב",
      address: "רחוב דיזנגוף 123, תל אביב",
      phone: "03-1234567",
      email: "info@notzetzim.com",
      status: "פעיל",
      manager: {
        name: "דנה ברק",
        email: "dana@notzetzim.com",
        phone: "050-1234567",
      },
      stats: {
        totalRepairs: 156,
        activeRepairs: 12,
        completedThisMonth: 45,
        avgRepairTime: "3.2 ימים",
        customerSatisfaction: "4.8/5",
        revenue: 67200,
      },
    },
    {
      shopId: "SHOP002",
      shopName: "מרכז טיפוח יהלומים",
      location: "חיפה",
      address: "רחוב הרצל 45, חיפה",
      phone: "04-9876543",
      email: "info@diamondcare.com",
      status: "פעיל",
      manager: {
        name: "אבי כהן",
        email: "avi@diamondcare.com",
        phone: "052-9876543",
      },
      stats: {
        totalRepairs: 89,
        activeRepairs: 8,
        completedThisMonth: 28,
        avgRepairTime: "2.9 ימים",
        customerSatisfaction: "4.6/5",
        revenue: 42300,
      },
    },
    {
      shopId: "SHOP003",
      shopName: "אומנות הצורפות",
      location: "ירושלים",
      address: "רחוב יפו 67, ירושלים",
      phone: "02-5555555",
      email: "info@tzorfut.com",
      status: "פעיל",
      manager: {
        name: "מיכל דוד",
        email: "michal@tzorfut.com",
        phone: "054-5555555",
      },
      stats: {
        totalRepairs: 97,
        activeRepairs: 8,
        completedThisMonth: 32,
        avgRepairTime: "3.0 ימים",
        customerSatisfaction: "4.7/5",
        revenue: 47300,
      },
    },
  ],

  // Users data (unchanged, as roles are generic)
  users: [
    {
      id: 1,
      name: "מנהל מערכת",
      email: "admin@system.com",
      role: "admin",
      shop: "מערכת",
      shopId: null,
      status: "פעיל",
      lastLogin: "2025-07-28 10:30",
      createdAt: "2025-01-01",
    },
    {
      id: 2,
      name: "דנה ברק",
      email: "dana@fixit.com",
      role: "shop-manager",
      shop: "סדנת תכשיטים נוצצים",
      shopId: "SHOP001",
      status: "פעיל",
      lastLogin: "2025-07-28 09:15",
      createdAt: "2025-02-15",
    },
    {
      id: 3,
      name: "רון אביב",
      email: "ron@fixit.com",
      role: "seller",
      shop: "סדנת תכשיטים נוצצים",
      shopId: "SHOP001",
      status: "פעיל",
      lastLogin: "2025-07-28 08:45",
      createdAt: "2025-03-01",
    },
    {
      id: 4,
      name: "שירה לוי",
      email: "shira@fixit.com",
      role: "seller",
      shop: "סדנת תכשיטים נוצצים",
      shopId: "SHOP001",
      status: "פעיל",
      lastLogin: "2025-07-28 07:20",
      createdAt: "2025-03-10",
    },
    {
      id: 5,
      name: "יוסי בן-חיים",
      email: "yossi@fixit.com",
      role: "technician",
      shop: "סדנת תכשיטים נוצצים",
      shopId: "SHOP001",
      status: "פעיל",
      lastLogin: "2025-07-28 07:30",
      createdAt: "2025-02-20",
    },
    {
      id: 6,
      name: "אבי כהן",
      email: "avi@techfix.com",
      role: "shop-manager",
      shop: "מרכז טיפוח יהלומים",
      shopId: "SHOP002",
      status: "פעיל",
      lastLogin: "2025-07-27 18:00",
      createdAt: "2025-04-01",
    },
    {
      id: 7,
      name: "תומר גרין",
      email: "tomer@techfix.com",
      role: "seller",
      shop: "מרכז טיפוח יהלומים",
      shopId: "SHOP002",
      status: "פעיל",
      lastLogin: "2025-07-27 16:30",
      createdAt: "2025-04-15",
    },
    {
      id: 8,
      name: "עמית טכנאי",
      email: "amit@techfix.com",
      role: "technician",
      shop: "מרכז טיפוח יהלומים",
      shopId: "SHOP002",
      status: "פעיל",
      lastLogin: "2025-07-27 15:45",
      createdAt: "2025-04-20",
    },
    {
      id: 9,
      name: "מיכל דוד",
      email: "michal@mobilemasters.com",
      role: "shop-manager",
      shop: "אומנות הצורפות",
      shopId: "SHOP003",
      status: "פעיל",
      lastLogin: "2025-07-28 08:00",
      createdAt: "2025-05-01",
    },
    {
      id: 10,
      name: "דני מוכר",
      email: "danny@mobilemasters.com",
      role: "seller",
      shop: "אומנות הצורפות",
      shopId: "SHOP003",
      status: "לא פעיל",
      lastLogin: "2025-07-25 14:20",
      createdAt: "2025-05-15",
    },
  ],

  // Customers data (unchanged)
  customers: [
    {
      customerId: "CUST001",
      name: "רועי כהן",
      phone: "+972501234567",
      email: "roi@example.com",
      address: "רחוב הרצל 12, תל אביב",
      totalRepairs: 3,
      lastRepair: "2025-07-20",
    },
    {
      customerId: "CUST002",
      name: "מאיה לוי",
      phone: "+972549876543",
      email: "maya@example.com",
      address: "רחוב בן יהודה 34, תל אביב",
      totalRepairs: 1,
      lastRepair: "2025-07-25",
    },
    {
      customerId: "CUST003",
      name: "דני אברהם",
      phone: "+972523456789",
      email: "danny@example.com",
      address: "רחוב דיזנגוף 56, תל אביב",
      totalRepairs: 2,
      lastRepair: "2025-07-26",
    },
    {
      customerId: "CUST004",
      name: "שרה דוד",
      phone: "+972507654321",
      email: "sarah@example.com",
      address: "רחוב אלנבי 78, תל אביב",
      totalRepairs: 1,
      lastRepair: "2025-07-26",
    },
    {
      customerId: "CUST005",
      name: "אבי לוי",
      phone: "+972521112233",
      email: "avi@example.com",
      address: "רחוב הנביאים 90, חיפה",
      totalRepairs: 1,
      lastRepair: "2025-07-15",
    },
  ],

  // Products data - adapted for jewelry
  products: [
    {
      productId: "PRD1001",
      type: "טבעת",
      brand: "Tiffany & Co.",
      model: "Solitaire Diamond Ring",
      color: "כסף",
      material: "זהב לבן 18K",
      gemstone: "יהלום",
      serialNumber: "TIF123456789",
    },
    {
      productId: "PRD1002",
      type: "שרשרת",
      brand: "Cartier",
      model: "Love Necklace",
      color: "זהב",
      material: "זהב צהוב 14K",
      gemstone: "ללא",
      serialNumber: "CAR987654321",
    },
    {
      productId: "PRD1003",
      type: "עגילים",
      brand: "Pandora",
      model: "Sparkling Halo Stud Earrings",
      color: "כסף",
      material: "כסף 925",
      gemstone: "זרקוניה",
      serialNumber: "PAN456789123",
    },
    {
      productId: "PRD1004",
      type: "שעון יוקרה",
      brand: "Rolex",
      model: "Submariner",
      color: "כסף",
      material: "פלדת אל-חלד",
      gemstone: "ללא",
      serialNumber: "ROL789123456",
    },
    {
      productId: "PRD1005",
      type: "צמיד",
      brand: "Local Artisan",
      model: "Handmade Silver Bracelet",
      color: "כסף",
      material: "כסף 925",
      gemstone: "אמרלד",
      serialNumber: "ART321654987",
    },
  ],

  // Comprehensive repairs data - adapted for jewelry
  repairs: [
    {
      repairId: "REPAIR001",
      productId: "PRD1001",
      customerId: "CUST001",
      shopId: "SHOP001",
      status: "ממתין לאיסוף",
      issue: "שריטה בטבעת",
      issueDetails: "הלקוחה מדווחת על שריטות עמוקות בטבעת היהלום. נדרש ליטוש וציפוי מחדש.",
      warranty: "מחוץ לאחריות",
      priority: "רגיל",
      createdAt: "2025-07-20T10:30:00Z",
      createdBy: "רון אביב",
      assignedTechnician: "יוסי בן-חיים",
      estimatedCost: 350,
      actualCost: 320,
      estimatedCompletion: "2025-07-23",
      completedAt: "2025-07-22T16:30:00Z",
      currentStep: "מחכה לאיסוף מהחנות",
    },
    {
      repairId: "REPAIR002",
      productId: "PRD1002",
      customerId: "CUST002",
      shopId: "SHOP001",
      status: "בתהליך תיקון",
      issue: "אבן חסרה בשרשרת",
      issueDetails: "אחת האבנים הקטנות בשרשרת אהבה של קרטייה חסרה. נדרש שיבוץ אבן חדשה.",
      warranty: "באחריות",
      priority: "גבוה",
      createdAt: "2025-07-25T14:00:00Z",
      createdBy: "שירה לוי",
      assignedTechnician: "יוסי בן-חיים",
      estimatedCost: 450,
      actualCost: null,
      estimatedCompletion: "2025-07-28",
      completedAt: null,
      currentStep: "בטיפול צורף",
    },
    {
      repairId: "REPAIR003",
      productId: "PRD1003",
      customerId: "CUST003",
      shopId: "SHOP001",
      status: "הושלם",
      issue: "ניקוי וליטוש עגילים",
      issueDetails: "העגילים איבדו את הברק. נדרש ניקוי יסודי וליטוש להחזרת הברק.",
      warranty: "מחוץ לאחריות",
      priority: "רגיל",
      createdAt: "2025-07-26T09:15:00Z",
      createdBy: "רון אביב",
      assignedTechnician: "יוסי בן-חיים",
      estimatedCost: 280,
      actualCost: 280,
      estimatedCompletion: "2025-07-28",
      completedAt: "2025-07-27T15:20:00Z",
      currentStep: "נמסר ללקוח",
    },
    {
      repairId: "REPAIR004",
      productId: "PRD1004",
      customerId: "CUST004",
      shopId: "SHOP001",
      status: "נשלח לתיקון",
      issue: "החלפת סוללה בשעון",
      issueDetails: "השעון הפסיק לעבוד. נדרשת החלפת סוללה ובדיקת אטימות.",
      warranty: "מחוץ לאחריות",
      priority: "רגיל",
      createdAt: "2025-07-26T16:30:00Z",
      createdBy: "שירה לוי",
      assignedTechnician: "יוסי בן-חיים",
      estimatedCost: 380,
      actualCost: null,
      estimatedCompletion: "2025-07-29",
      completedAt: null,
      currentStep: "ממתין לקבלה במעבדה",
    },
    {
      repairId: "REPAIR005",
      productId: "PRD1005",
      customerId: "CUST005",
      shopId: "SHOP002",
      status: "התקבל",
      issue: "הקטנת צמיד",
      issueDetails: "הצמיד גדול מדי על הלקוחה. נדרשת הקטנה של 2 חוליות.",
      warranty: "באחריות",
      priority: "נמוך",
      createdAt: "2025-07-26T11:00:00Z",
      createdBy: "תומר גרין",
      assignedTechnician: "עמית טכנאי",
      estimatedCost: 200,
      actualCost: null,
      estimatedCompletion: "2025-07-30",
      completedAt: null,
      currentStep: "התקבל במעבדה",
    },
  ],

  // Timeline data for repairs - adapted for jewelry
  repairTimelines: {
    REPAIR001: [
      { step: "נוצר תיקון", date: "2025-07-20 10:30", user: "רון אביב", completed: true },
      { step: "נשלח לסדנה", date: "2025-07-20 14:00", user: "רון אביב", completed: true },
      { step: "התקבל בסדנה", date: "2025-07-21 09:15", user: "יוסי בן-חיים", completed: true },
      { step: "בתהליך ליטוש וציפוי", date: "2025-07-21 11:00", user: "יוסי בן-חיים", completed: true },
      { step: "תיקון הושלם", date: "2025-07-22 16:30", user: "יוסי בן-חיים", completed: true },
      { step: "חזר לחנות", date: "2025-07-23 10:00", user: "רון אביב", completed: true },
      { step: "מוכן לאיסוף", date: "2025-07-23 10:30", user: "רון אביב", completed: true },
    ],
    REPAIR002: [
      { step: "נוצר תיקון", date: "2025-07-25 14:20", user: "שירה לוי", completed: true },
      { step: "נשלח לסדנה", date: "2025-07-25 16:00", user: "שירה לוי", completed: true },
      { step: "התקבל בסדנה", date: "2025-07-26 08:30", user: "יוסי בן-חיים", completed: true },
      { step: "בתהליך שיבוץ אבן", date: "2025-07-26 10:15", user: "יוסי בן-חיים", completed: true },
      { step: "תיקון הושלם", date: "", user: "", completed: false },
      { step: "חזר לחנות", date: "", user: "", completed: false },
      { step: "מוכן לאיסוף", date: "", user: "", completed: false },
    ],
  },

  // Notes for repairs - adapted for jewelry
  repairNotes: {
    REPAIR001: [
      { date: "2025-07-20 10:30", user: "רון אביב", note: "לקוחה מדווחת על שריטות עמוקות. נדרש ליטוש וציפוי." },
      { date: "2025-07-21 11:00", user: "יוסי בן-חיים", note: "התחלתי ליטוש, נראה טוב. אעבור לציפוי זהב לבן." },
      { date: "2025-07-22 16:30", user: "יוסי בן-חיים", note: "תיקון הושלם בהצלחה. הטבעת נראית חדשה." },
    ],
    REPAIR002: [
      { date: "2025-07-25 14:20", user: "שירה לוי", note: "אבן חסרה בשרשרת. לקוחה מבקשת תיקון דחוף." },
      { date: "2025-07-26 10:15", user: "יוסי בן-חיים", note: "שיבוץ אבן בתהליך. זמן משוער - יומיים." },
    ],
  },

  // Monthly statistics for reports (unchanged, as generic)
  monthlyStats: [
    { month: "ינואר", repairs: 25, completed: 23, revenue: 8500, avgTime: 3.4 },
    { month: "פברואר", repairs: 28, completed: 26, revenue: 9200, avgTime: 3.2 },
    { month: "מרץ", repairs: 32, completed: 30, revenue: 10800, avgTime: 3.1 },
    { month: "אפריל", repairs: 29, completed: 28, revenue: 9600, avgTime: 2.9 },
    { month: "מאי", repairs: 35, completed: 32, revenue: 11400, avgTime: 3.0 },
    { month: "יוני", repairs: 38, completed: 36, revenue: 12200, avgTime: 2.8 },
    { month: "יולי", repairs: 42, completed: 39, revenue: 13500, avgTime: 3.2 },
  ],

  // Common issues statistics - adapted for jewelry
  commonIssues: [
    { issue: "שריטות/פגמים במתכת", count: 45, percentage: 28.8, trend: "up" },
    { issue: "אבן חסרה/רופפת", count: 32, percentage: 20.5, trend: "down" },
    { issue: "תיקון סוגר/שרשרת", count: 28, percentage: 17.9, trend: "stable" },
    { issue: "ניקוי וליטוש", count: 22, percentage: 14.1, trend: "up" },
    { issue: "הקטנה/הגדלה", count: 18, percentage: 11.5, trend: "down" },
    { issue: "החלפת סוללה (שעון)", count: 15, percentage: 9.6, trend: "up" },
    { issue: "אחר", count: 11, percentage: 7.1, trend: "stable" },
  ],

  // Technician performance data (unchanged)
  technicianPerformance: [
    {
      id: 5,
      name: "יוסי בן-חיים",
      shopId: "SHOP001",
      completed: 89,
      avgTime: 2.8,
      satisfaction: 4.9,
      activeRepairs: 3,
      efficiency: "מעולה",
    },
    {
      id: 8,
      name: "עמית טכנאי",
      shopId: "SHOP002",
      completed: 55,
      avgTime: 3.6,
      satisfaction: 4.7,
      activeRepairs: 2,
      efficiency: "טוב",
    },
  ],

  // Slow repairs data - adapted for jewelry
  slowRepairs: [
    {
      repairId: "REPAIR045",
      customer: "אבי לוי",
      product: "טבעת יהלום",
      days: 8,
      issue: "שיבוץ מורכב של אבנים",
      technician: "יוסי בן-חיים",
      status: "בטיפול",
    },
    {
      repairId: "REPAIR052",
      customer: "שרה כהן",
      product: "שרשרת זהב",
      days: 6,
      issue: 'חלק לא זמין - הוזמן מחו"ל',
      technician: "עמית טכנאי",
      status: "ממתין לחלקים",
    },
    {
      repairId: "REPAIR061",
      customer: "דני רוזן",
      product: "שעון יוקרה",
      days: 5,
      issue: "בדיקות מנגנון נוספות נדרשות",
      technician: "יוסי בן-חיים",
      status: "בבדיקה",
    },
  ],

  // QR codes data (will be generated dynamically by qr-security.ts)
  qrCodes: {
    REPAIR001: {
      product:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR001;product:PRD1001;sig:XYZ123",
      customer:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR001;cust:CUST001;token:TOKEN123",
    },
    REPAIR002: {
      product:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR002;product:PRD1002;sig:ABC456",
      customer:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR002;cust:CUST002;token:TOKEN456",
    },
    REPAIR003: {
      product:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR003;product:PRD1003;sig:DEF789",
      customer:
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=repair:REPAIR003;cust:CUST003;token:TOKEN789",
    },
  },

  // SMS templates - adapted for jewelry
  smsTemplates: {
    repairCreated: "שלום {customerName}, תיקון התכשיט {repairId} נוצר בהצלחה. מעקב: {trackingUrl}",
    repairReceived: "שלום {customerName}, התכשיט שלך התקבל בסדנה. מזהה: {repairId}",
    repairCompleted: "שלום {customerName}, תיקון התכשיט הושלם! ניתן לאסוף את התכשיט. QR: {qrUrl}",
    repairReady: "שלום {customerName}, התכשיט מוכן לאיסוף בחנות {shopName}. QR: {qrUrl}",
  },

  // System settings (unchanged)
  settings: {
    defaultRepairTime: 3,
    maxRepairTime: 14,
    smsEnabled: true,
    emailEnabled: true,
    qrExpiration: 30, // days
    autoStatusUpdate: true,
  },
}

// Helper functions to get data (unchanged, as they filter based on existing keys)
export const getDemoData = {
  // Get shop by ID
  getShop: (shopId: string) => demoData.shops.find((shop) => shop.shopId === shopId),

  // Get user by ID
  getUser: (userId: number) => demoData.users.find((user) => user.id === userId),

  // Get customer by ID
  getCustomer: (customerId: string) => demoData.customers.find((customer) => customer.customerId === customerId),

  // Get product by ID
  getProduct: (productId: string) => demoData.products.find((product) => product.productId === productId),

  // Get repair by ID
  getRepair: (repairId: string) => demoData.repairs.find((repair) => repair.repairId === repairId),

  // Get repairs by shop
  getRepairsByShop: (shopId: string) => demoData.repairs.filter((repair) => repair.shopId === shopId),

  // Get repairs by technician
  getRepairsByTechnician: (technicianName: string) =>
    demoData.repairs.filter((repair) => repair.assignedTechnician === technicianName),

  // Get repairs by status
  getRepairsByStatus: (status: string) => demoData.repairs.filter((repair) => repair.status === status),

  // Get repair timeline
  getRepairTimeline: (repairId: string) =>
    demoData.repairTimelines[repairId as keyof typeof demoData.repairTimelines] || [],

  // Get repair notes
  getRepairNotes: (repairId: string) => demoData.repairNotes[repairId as keyof typeof demoData.repairNotes] || [],

  // Get QR codes for repair
  getQRCodes: (repairId: string) => demoData.qrCodes[repairId as keyof typeof demoData.qrCodes],

  // Get full repair details (joined data)
  getFullRepairDetails: (repairId: string) => {
    const repair = demoData.repairs.find((r) => r.repairId === repairId)
    if (!repair) return null

    const customer = demoData.customers.find((c) => c.customerId === repair.customerId)
    const product = demoData.products.find((p) => p.productId === repair.productId)
    const shop = demoData.shops.find((s) => s.shopId === repair.shopId)
    const timeline = demoData.repairTimelines[repairId as keyof typeof demoData.repairTimelines] || []
    const notes = demoData.repairNotes[repairId as keyof typeof demoData.repairNotes] || []
    const qrCodes = demoData.qrCodes[repairId as keyof typeof demoData.qrCodes]

    return {
      ...repair,
      customer,
      product,
      shop,
      timeline,
      notes,
      qrCodes,
    }
  },

  // Get shop statistics
  getShopStats: (shopId: string) => {
    const shopRepairs = demoData.repairs.filter((repair) => repair.shopId === shopId)
    const activeRepairs = shopRepairs.filter((repair) =>
      ["נשלח לתיקון", "התקבל", "בתהליך תיקון", "ממתין לאיסוף"].includes(repair.status),
    ).length
    const completedRepairs = shopRepairs.filter((repair) => repair.status === "הושלם").length

    return {
      totalRepairs: shopRepairs.length,
      activeRepairs,
      completedRepairs,
      completionRate: shopRepairs.length > 0 ? ((completedRepairs / shopRepairs.length) * 100).toFixed(1) : "0",
    }
  },
}

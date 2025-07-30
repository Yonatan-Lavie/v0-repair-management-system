// Demo scenarios for testing different user flows

export const demoScenarios = {
  // Scenario 1: Happy path - repair completed successfully
  happyPath: {
    title: "תרחיש מוצלח - תיקון הושלם",
    description: "תיקון שעבר את כל השלבים בהצלחה",
    repairId: "REPAIR001",
    customerQR: "https://repair-system.demo/customer/REPAIR001",
    steps: [
      "לקוח הביא מכשיר לחנות",
      "מוכר יצר תיקון עם QR כפול",
      "מוצר נשלח למעבדה",
      "טכנאי קיבל ותיקן את המוצר",
      "מוצר חזר לחנות",
      "לקוח קיבל הודעה ובא לאסוף",
    ],
  },

  // Scenario 2: In progress repair
  inProgress: {
    title: "תרחיש בתהליך - תיקון פעיל",
    description: "תיקון שנמצא כרגע במעבדה",
    repairId: "REPAIR002",
    customerQR: "https://repair-system.demo/customer/REPAIR002",
    steps: [
      "לקוח הביא טאבלט עם מסך שבור",
      "מוכר יצר תיקון דחוף",
      "מוצר נשלח למעבדה",
      "טכנאי מתקן כרגע את המסך",
      "צפוי להסתיים מחר",
    ],
  },

  // Scenario 3: Delayed repair
  delayed: {
    title: "תרחיש מעוכב - תיקון איטי",
    description: "תיקון שלוקח זמן רב בגלל בעיה מורכבת",
    repairId: "REPAIR045",
    customerQR: "https://repair-system.demo/customer/REPAIR045",
    steps: [
      "לקוח הביא iPhone עם בעיה מורכבת",
      "טכנאי זיהה בעיה בלוח האם",
      "נדרשת בדיקה מעמיקה",
      "התיקון לוקח יותר זמן מהרגיל",
      "לקוח עודכן על העיכוב",
    ],
  },

  // Scenario 4: Warranty repair
  warranty: {
    title: "תרחיש אחריות - תיקון חינם",
    description: "תיקון במסגרת אחריות",
    repairId: "REPAIR005",
    customerQR: "https://repair-system.demo/customer/REPAIR005",
    steps: ["לקוח הביא מכשיר באחריות", "מוכר אישר כיסוי אחריות", "תיקון ללא עלות ללקוח", "עדיפות גבוהה לתיקוני אחריות"],
  },
}

// Test data for different user roles
export const testUsers = {
  admin: {
    username: "מנהל מערכת",
    role: "admin",
    permissions: ["view_all", "manage_shops", "manage_users", "system_settings"],
  },
  shopManager: {
    username: "דנה ברק",
    role: "shop-manager",
    shopId: "SHOP001",
    permissions: ["view_shop", "manage_staff", "view_reports", "manage_repairs"],
  },
  seller: {
    username: "רון אביב",
    role: "seller",
    shopId: "SHOP001",
    permissions: ["create_repair", "scan_qr", "deliver_product"],
  },
  technician: {
    username: "יוסי בן-חיים",
    role: "technician",
    shopId: "SHOP001",
    permissions: ["receive_repair", "update_status", "complete_repair"],
  },
}

// Sample QR scan results for demo
export const qrScanResults = {
  productQR: {
    REPAIR001: {
      type: "product",
      repairId: "REPAIR001",
      productId: "PRD1001",
      status: "ממתין לאיסוף",
      canDeliver: true,
      message: "המוצר מוכן למסירה ללקוח",
    },
    REPAIR002: {
      type: "product",
      repairId: "REPAIR002",
      productId: "PRD1002",
      status: "בתהליך תיקון",
      canDeliver: false,
      message: "המוצר עדיין במעבדה",
    },
  },
  customerQR: {
    REPAIR001: {
      type: "customer",
      repairId: "REPAIR001",
      customerId: "CUST001",
      verified: true,
      canReceive: true,
      message: "זהות לקוח אומתה - ניתן למסור מוצר",
    },
    REPAIR002: {
      type: "customer",
      repairId: "REPAIR002",
      customerId: "CUST002",
      verified: true,
      canReceive: false,
      message: "התיקון עדיין לא הושלם",
    },
  },
}

import { qrSecurity } from "./qr-security"

// Helper to generate a consistent product ID
let productIdCounter = 100
const generateProductId = () => `PROD${String(productIdCounter++).padStart(3, "0")}`

// Helper to generate a consistent customer ID
let customerIdCounter = 100
const generateCustomerId = () => `CUST${String(customerIdCounter++).padStart(3, "0")}`

// Helper to generate a consistent repair ID
let repairIdCounter = 100
const generateRepairId = () => `REPAIR${String(repairIdCounter++).padStart(3, "0")}`

// Mock Data Structure
interface User {
  id: string
  name: string
  email: string
  role: "admin" | "shop-manager" | "seller" | "technician"
  shopId?: string
  status: "פעיל" | "לא פעיל"
  lastLogin: string
  createdAt: string
  permissions: string[]
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

interface Product {
  id: string
  type: string // e.g., "ring", "necklace", "watch"
  brand: string
  model: string
  color: string
  material: string // e.g., "yellow-gold", "silver", "platinum"
  gemstone: string // e.g., "diamond", "emerald", "sapphire"
  serialNumber: string // Replaced IMEI with serialNumber
}

interface Repair {
  repairId: string
  customerId: string
  productId: string
  shopId: string
  issue: string
  issueDetails: string
  status: string // e.g., "נשלח לתיקון", "התקבל", "בתהליך תיקון", "תוקן - מוכן לשילוח", "ממתין לאיסוף", "הושלם"
  warranty: "באחריות" | "מחוץ לאחריות" | "לא ידוע"
  estimatedCost: number
  actualCost: number
  createdAt: string
  estimatedCompletion: string
  assignedTechnician: string
  createdBy: string
}

interface Shop {
  shopId: string
  shopName: string
  location: string
  address: string
  phone: string
  email: string
  manager: {
    name: string
    email: string
    phone: string
  }
  status: "פעיל" | "לא פעיל"
  stats: {
    totalRepairs: number
    activeRepairs: number
    completedThisMonth: number
    avgRepairTime: string
    customerSatisfaction: string
  }
}

interface RepairTimelineEvent {
  step: string
  date: string
  completed: boolean
  user?: string
}

interface RepairNote {
  id: string
  repairId: string
  note: string
  user: string
  date: string
}

interface QRCodeData {
  product: string
  customer: string
}

// --- Demo Data ---

const users: User[] = [
  {
    id: "USER001",
    name: "אדמין מערכת",
    email: "admin@system.com",
    role: "admin",
    status: "פעיל",
    lastLogin: "2025-07-28 10:00",
    createdAt: "2024-01-01",
    permissions: ["admin:full"],
  },
  {
    id: "USER002",
    name: "דנה מנהלת",
    email: "dana@fixit.com",
    role: "shop-manager",
    shopId: "SHOP001",
    status: "פעיל",
    lastLogin: "2025-07-28 09:30",
    createdAt: "2024-02-10",
    permissions: ["shop:manage", "repairs:read", "users:read"],
  },
  {
    id: "USER003",
    name: "רון אביב",
    email: "seller@fixit.com",
    role: "seller",
    shopId: "SHOP001",
    status: "פעיל",
    lastLogin: "2025-07-28 09:00",
    createdAt: "2024-03-01",
    permissions: ["repairs:create", "repairs:read", "qr:generate"],
  },
  {
    id: "USER004",
    name: "יוסי בן-חיים",
    email: "tech@fixit.com",
    role: "technician",
    shopId: "SHOP001",
    status: "פעיל",
    lastLogin: "2025-07-28 08:45",
    createdAt: "2024-03-15",
    permissions: ["repairs:read", "repairs:update_status", "qr:scan"],
  },
  {
    id: "USER005",
    name: "שירה לוי",
    email: "shira@fixit.com",
    role: "seller",
    shopId: "SHOP001",
    status: "פעיל",
    lastLogin: "2025-07-27 14:00",
    createdAt: "2024-04-01",
    permissions: ["repairs:create", "repairs:read", "qr:generate"],
  },
  {
    id: "USER006",
    name: "אלי צורף",
    email: "eli@fixit.com",
    role: "technician",
    shopId: "SHOP001",
    status: "פעיל",
    lastLogin: "2025-07-27 13:00",
    createdAt: "2024-05-01",
    permissions: ["repairs:read", "repairs:update_status", "qr:scan"],
  },
]

const customers: Customer[] = [
  {
    id: generateCustomerId(),
    name: "דנה כהן",
    phone: "052-1234567",
    email: "dana.k@example.com",
    address: "רחוב הרצל 10, תל אביב",
  },
  {
    id: generateCustomerId(),
    name: "איתי לוי",
    phone: "050-9876543",
    email: "itay.l@example.com",
    address: "רחוב בן יהודה 25, ירושלים",
  },
  {
    id: generateCustomerId(),
    name: "שירה גולן",
    phone: "054-1122334",
    email: "shira.g@example.com",
    address: "רחוב העצמאות 5, חיפה",
  },
  {
    id: generateCustomerId(),
    name: "יונתן שקד",
    phone: "053-5566778",
    email: "yonatan.s@example.com",
    address: "רחוב הנגב 1, באר שבע",
  },
  {
    id: generateCustomerId(),
    name: "נועה פרידמן",
    phone: "058-9988776",
    email: "noa.f@example.com",
    address: "רחוב הירקון 30, רמת גן",
  },
]

const products: Product[] = [
  {
    id: generateProductId(),
    type: "טבעת",
    brand: "Tiffany & Co.",
    model: "Solitaire Diamond Ring",
    color: "כסף",
    material: "זהב לבן 18K",
    gemstone: "יהלום",
    serialNumber: "TR123456789",
  },
  {
    id: generateProductId(),
    type: "שרשרת",
    brand: "Cartier",
    model: "Love Necklace",
    color: "זהב",
    material: "זהב צהוב 18K",
    gemstone: "ללא",
    serialNumber: "CN987654321",
  },
  {
    id: generateProductId(),
    type: "שעון יוקרה",
    brand: "Rolex",
    model: "Submariner Date",
    color: "כסף",
    material: "פלדת אל-חלד",
    gemstone: "ללא",
    serialNumber: "RW112233445",
  },
  {
    id: generateProductId(),
    type: "עגילים",
    brand: "Pandora",
    model: "Sparkling Halo Stud Earrings",
    color: "כסף",
    material: "כסף סטרלינג",
    gemstone: "זרקוניה",
    serialNumber: "PE556677889",
  },
  {
    id: generateProductId(),
    type: "צמיד",
    brand: "Bvlgari",
    model: "Serpenti Bracelet",
    color: "זהב",
    material: "זהב אדום 18K",
    gemstone: "אמרלד",
    serialNumber: "BB998877665",
  },
  {
    id: generateProductId(),
    type: "טבעת",
    brand: "Local Jeweler",
    model: "Custom Design",
    color: "זהב",
    material: "זהב צהוב 14K",
    gemstone: "ספיר",
    serialNumber: "CD777777777",
  },
]

const repairs: Repair[] = [
  {
    repairId: generateRepairId(),
    customerId: customers[0].id,
    productId: products[0].id,
    shopId: "SHOP001",
    issue: "אבן חסרה",
    issueDetails: "יהלום מרכזי נפל מהטבעת. נדרשת החלפה ושיבוץ מחדש.",
    status: "בתהליך תיקון",
    warranty: "מחוץ לאחריות",
    estimatedCost: 1500,
    actualCost: 0,
    createdAt: "2025-07-20",
    estimatedCompletion: "2025-07-30",
    assignedTechnician: "יוסי בן-חיים",
    createdBy: "רון אביב",
  },
  {
    repairId: generateRepairId(),
    customerId: customers[1].id,
    productId: products[1].id,
    shopId: "SHOP001",
    issue: "סוגר שבור",
    issueDetails: "הסוגר של השרשרת נשבר, לא ניתן לסגור אותה.",
    status: "ממתין לאיסוף",
    warranty: "באחריות",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2025-07-22",
    estimatedCompletion: "2025-07-25",
    assignedTechnician: "אלי צורף",
    createdBy: "שירה לוי",
  },
  {
    repairId: generateRepairId(),
    customerId: customers[2].id,
    productId: products[2].id,
    shopId: "SHOP001",
    issue: "נדרש ניקוי והברקה",
    issueDetails: "השעון איבד את הברק, נדרש ניקוי יסודי והברקה.",
    status: "הושלם",
    warranty: "מחוץ לאחריות",
    estimatedCost: 250,
    actualCost: 250,
    createdAt: "2025-07-18",
    estimatedCompletion: "2025-07-20",
    assignedTechnician: "יוסי בן-חיים",
    createdBy: "רון אביב",
  },
  {
    repairId: generateRepairId(),
    customerId: customers[3].id,
    productId: products[3].id,
    shopId: "SHOP001",
    issue: "אבן רופפת",
    issueDetails: "אחת מאבני הזרקוניה בעגיל רופפת, יש לחזק אותה.",
    status: "נשלח לתיקון",
    warranty: "באחריות",
    estimatedCost: 0,
    actualCost: 0,
    createdAt: "2025-07-26",
    estimatedCompletion: "2025-07-29",
    assignedTechnician: "אלי צורף",
    createdBy: "רון אביב",
  },
  {
    repairId: generateRepairId(),
    customerId: customers[4].id,
    productId: products[4].id,
    shopId: "SHOP001",
    issue: "שריטה עמוקה",
    issueDetails: "שריטה בולטת על פני הצמיד, נדרשת ליטוש והברקה.",
    status: "בתהליך תיקון",
    warranty: "מחוץ לאחריות",
    estimatedCost: 400,
    actualCost: 0,
    createdAt: "2025-07-25",
    estimatedCompletion: "2025-08-01",
    assignedTechnician: "יוסי בן-חיים",
    createdBy: "שירה לוי",
  },
]

const shops: Shop[] = [
  {
    shopId: "SHOP001",
    shopName: "תכשיטי אור",
    location: "תל אביב",
    address: "רחוב דיזנגוף 123, תל אביב",
    phone: "03-1234567",
    email: "info@or-jewelry.com",
    manager: {
      name: "דנה מנהלת",
      email: "dana@fixit.com",
      phone: "052-1112233",
    },
    status: "פעיל",
    stats: {
      totalRepairs: 5,
      activeRepairs: 2,
      completedThisMonth: 3,
      avgRepairTime: "3 ימים",
      customerSatisfaction: "95%",
    },
  },
]

const repairTimelines: { [key: string]: RepairTimelineEvent[] } = {
  [repairs[0].repairId]: [
    { step: "נשלח לתיקון (בחנות)", date: "2025-07-20 10:00", completed: true, user: "רון אביב" },
    { step: "התקבל בסדנה", date: "2025-07-20 11:30", completed: true, user: "יוסי בן-חיים" },
    { step: "בתהליך תיקון", date: "2025-07-21 09:00", completed: true, user: "יוסי בן-חיים" },
    { step: "הושלם - ממתין לשילוח", date: "2025-07-29 16:00", completed: false },
    { step: "נאסף על ידי לקוח", date: "", completed: false },
  ],
  [repairs[1].repairId]: [
    { step: "נשלח לתיקון (בחנות)", date: "2025-07-22 14:00", completed: true, user: "שירה לוי" },
    { step: "התקבל בסדנה", date: "2025-07-22 15:00", completed: true, user: "אלי צורף" },
    { step: "בתהליך תיקון", date: "2025-07-23 10:00", completed: true, user: "אלי צורף" },
    { step: "הושלם - ממתין לשילוח", date: "2025-07-24 11:00", completed: true, user: "אלי צורף" },
    { step: "נאסף על ידי לקוח", date: "", completed: false },
  ],
  [repairs[2].repairId]: [
    { step: "נשלח לתיקון (בחנות)", date: "2025-07-18 09:00", completed: true, user: "רון אביב" },
    { step: "התקבל בסדנה", date: "2025-07-18 10:00", completed: true, user: "יוסי בן-חיים" },
    { step: "בתהליך תיקון", date: "2025-07-18 11:00", completed: true, user: "יוסי בן-חיים" },
    { step: "הושלם - ממתין לשילוח", date: "2025-07-19 14:00", completed: true, user: "יוסי בן-חיים" },
    { step: "נאסף על ידי לקוח", date: "2025-07-20 12:00", completed: true, user: "דנה מנהלת" },
  ],
  [repairs[3].repairId]: [
    { step: "נשלח לתיקון (בחנות)", date: "2025-07-26 11:00", completed: true, user: "רון אביב" },
    { step: "התקבל בסדנה", date: "2025-07-26 12:00", completed: true, user: "אלי צורף" },
    { step: "בתהליך תיקון", date: "2025-07-27 09:00", completed: false },
    { step: "הושלם - ממתין לשילוח", date: "", completed: false },
    { step: "נאסף על ידי לקוח", date: "", completed: false },
  ],
  [repairs[4].repairId]: [
    { step: "נשלח לתיקון (בחנות)", date: "2025-07-25 10:00", completed: true, user: "שירה לוי" },
    { step: "התקבל בסדנה", date: "2025-07-25 11:00", completed: true, user: "יוסי בן-חיים" },
    { step: "בתהליך תיקון", date: "2025-07-26 09:00", completed: true, user: "יוסי בן-חיים" },
    { step: "הושלם - ממתין לשילוח", date: "", completed: false },
    { step: "נאסף על ידי לקוח", date: "", completed: false },
  ],
}

const repairNotes: { [key: string]: RepairNote[] } = {
  [repairs[0].repairId]: [
    {
      id: "NOTE001",
      repairId: repairs[0].repairId,
      note: "נדרש יהלום בגודל 0.5 קראט, צבע G, ניקיון VS1. הוזמן מספק חיצוני.",
      user: "יוסי בן-חיים",
      date: "2025-07-21 14:00",
    },
    {
      id: "NOTE002",
      repairId: repairs[0].repairId,
      note: "הלקוחה עודכנה לגבי העלות המשוערת ואישרה את התיקון.",
      user: "רון אביב",
      date: "2025-07-20 16:30",
    },
  ],
  [repairs[1].repairId]: [
    {
      id: "NOTE003",
      repairId: repairs[1].repairId,
      note: "הסוגר הוחלף בסוגר חדש מזהב צהוב 18K. בוצעה בדיקת תקינות.",
      user: "אלי צורף",
      date: "2025-07-23 15:00",
    },
  ],
}

const qrCodes: { [key: string]: QRCodeData } = Object.fromEntries(
  repairs.map((repair) => {
    const product = getDemoData.getProduct(repair.productId)
    const customer = getDemoData.getCustomer(repair.customerId)
    return [
      repair.repairId,
      {
        product: qrSecurity.generateSecureQRURL({
          repairId: repair.repairId,
          type: "product",
          shopId: repair.shopId,
          productType: product?.type,
          productBrand: product?.brand,
          productModel: product?.model,
          serialNumber: product?.serialNumber,
        }),
        customer: qrSecurity.generateSecureQRURL({
          repairId: repair.repairId,
          type: "customer",
          shopId: repair.shopId,
          customerId: customer?.id,
          customerName: customer?.name,
        }),
      },
    ]
  }),
)

const systemStats = {
  totalShops: shops.length,
  totalUsers: users.length,
  activeRepairs: repairs.filter((r) => r.status !== "הושלם" && r.status !== "ממתין לאיסוף").length,
  completedRepairs: repairs.filter((r) => r.status === "הושלם").length,
}

export const demoData = {
  users,
  customers,
  products,
  repairs,
  shops,
  repairTimelines,
  repairNotes,
  qrCodes,
  systemStats,
}

export const getDemoData = {
  getUser: (id: string) => demoData.users.find((user) => user.id === id),
  getCustomer: (id: string) => demoData.customers.find((customer) => customer.id === id),
  getProduct: (id: string) => demoData.products.find((product) => product.id === id),
  getRepair: (id: string) => demoData.repairs.find((repair) => repair.repairId === id),
  getShop: (id: string) => demoData.shops.find((shop) => shop.shopId === id),
  getRepairTimeline: (repairId: string) => demoData.repairTimelines[repairId] || [],
  getRepairNotes: (repairId: string) => demoData.repairNotes[repairId] || [],
  getQRCodes: (repairId: string) => demoData.qrCodes[repairId],
  getRepairsByTechnician: (technicianName: string) =>
    demoData.repairs.filter((repair) => repair.assignedTechnician === technicianName),
  getRepairsBySeller: (sellerName: string) => demoData.repairs.filter((repair) => repair.createdBy === sellerName),
}

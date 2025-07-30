export const mockData = {
  shop: {
    shopId: "SHOP001",
    shopName: "FixIt Electronics",
    location: "תל אביב",
    manager: {
      name: "דנה ברק",
      email: "dana@fixit.com",
    },
  },
  customers: [
    {
      customerId: "CUST001",
      name: "רועי כהן",
      phone: "+972501234567",
    },
    {
      customerId: "CUST002",
      name: "מאיה לוי",
      phone: "+972549876543",
    },
  ],
  products: [
    {
      productId: "PRD1001",
      type: "טלפון נייד",
      brand: "Samsung",
      model: "Galaxy S21",
      issue: "לא נדלק",
    },
    {
      productId: "PRD1002",
      type: "טאבלט",
      brand: "Apple",
      model: "iPad Pro",
      issue: "סדק במסך",
    },
  ],
  repairs: [
    {
      repairId: "REPAIR001",
      productId: "PRD1001",
      customerId: "CUST001",
      status: "ממתין לאיסוף",
      createdAt: "2025-07-20T12:00:00Z",
      currentStep: "מחכה לאיסוף מהחנות",
      qrProduct: {
        data: "repair:REPAIR001;product:PRD1001;sig:XYZ123",
        image: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=repair:REPAIR001",
      },
      qrCustomer: {
        data: "repair:REPAIR001;cust:CUST001;token:CUSTTOKEN1",
        image: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=repair:REPAIR001;cust:CUST001",
      },
    },
    {
      repairId: "REPAIR002",
      productId: "PRD1002",
      customerId: "CUST002",
      status: "בתהליך תיקון",
      createdAt: "2025-07-25T14:00:00Z",
      currentStep: "בטיפול טכנאי",
      qrProduct: {
        data: "repair:REPAIR002;product:PRD1002;sig:XYZ456",
        image: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=repair:REPAIR002",
      },
      qrCustomer: {
        data: "repair:REPAIR002;cust:CUST002;token:CUSTTOKEN2",
        image: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=repair:REPAIR002;cust:CUST002",
      },
    },
  ],
  technicians: [
    {
      technicianId: "TECH001",
      name: "יוסי בן-חיים",
      currentRepairs: ["REPAIR002"],
    },
  ],
}

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Ecozza Green database...");

  // 1. Clear existing records safely
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.batchLabReport.deleteMany();
  await prisma.product.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doseRule.deleteMany();
  await prisma.leadEnquiry.deleteMany();
  await prisma.pincodeServiceability.deleteMany();
  await prisma.shippingRateTier.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.blogPost.deleteMany();

  // 2. Admin & Demo Users
  const adminPasswordHash = await bcrypt.hash("EcozzaAdmin2026!", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@ecozzagreen.in",
      phone: "+919876543210",
      name: "Ecozza Green Administrator",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      companyName: "Ecozza Green",
    },
  });

  const demoCustomer = await prisma.user.create({
    data: {
      email: "rahul.sharma@example.com",
      phone: "+919825012345",
      name: "Rahul Sharma",
      role: "CUSTOMER",
      addresses: {
        create: {
          fullName: "Rahul Sharma",
          phone: "+919825012345",
          addressLine1: "14, Shivalik Residency, Drive-in Road",
          landmark: "Near Sterling Hospital",
          city: "Ahmedabad",
          state: "Gujarat",
          postalCode: "380054",
          isDefault: true,
        },
      },
    },
  });

  // 3. System Settings (FCO registration strictly empty until provided)
  const settings = [
    { key: "fco_registration_number", value: "", description: "FCO registration/compliance number (keep empty until provided)" },
    { key: "store_name", value: "Ecozza Green", description: "Official store brand name" },
    { key: "store_gstin", value: "24AAAAE0000A1Z5", description: "Gujarat GSTIN for tax invoices" },
    { key: "store_email", value: "care@ecozzagreen.in", description: "Customer care email" },
    { key: "store_phone", value: "+91 98765 43210", description: "Customer care phone" },
    { key: "store_whatsapp", value: "919876543210", description: "Direct WhatsApp business link number" },
    { key: "store_address", value: "Plot 42, Green Agro Park, GIDC Industrial Area, Gujarat - 382445, India", description: "Dispatch and facility location" },
    { key: "free_shipping_threshold", value: "1499", description: "Order subtotal in INR for free shipping" },
    { key: "default_hsn_code", value: "31059090", description: "HSN code for biochar soil conditioner" },
    { key: "default_gst_rate", value: "5.0", description: "Concessional GST rate for organic soil conditioner" },
  ];

  for (const s of settings) {
    await prisma.systemSetting.create({ data: s });
  }

  // 4. Products & Variants (Ecozza Green line)
  // Product 1: Garden Grade Granules
  const p1 = await prisma.product.create({
    data: {
      slug: "ecozza-green-garden-granules",
      name: "Ecozza Green Biochar Soil Conditioner Granules - Garden Grade",
      tagline: "Micro-porous granules designed for water & nutrient retention in pots and garden beds",
      shortDescription: "Granular biochar soil conditioner blended from woodchar and treated organic matter. Holds moisture up to 3x longer in root zones.",
      description: `### Pure Carbon Matrix for Thriving Roots
Ecozza Green Garden Grade Granules are produced through controlled thermal carbonization of clean woody biomass, followed by biological charging. 

#### Key Attributes:
- **High Porosity:** Microscopic honeycomb pore structure acts as a permanent sponge for soil moisture.
- **Nutrient Sponge:** Retains applied plant nutrients, reducing leaching during watering.
- **Soil Aeration:** Prevents potting soil compaction, encouraging fibrous root expansion.
- **Long-term Stability:** Biochar does not decompose rapidly like raw compost, providing structural soil improvement for years.

*Notice: Ecozza Green is a soil conditioner, not a fertilizer. Use alongside your regular organic manures or plant nutrition routines.*`,
      category: "Home & Garden",
      hsnCode: "31059090",
      gstRatePercentage: 5.0,
      isPublished: true,
      scoopSizeGrams: 50.0,
      dosePerPotGrams: 100.0,
      dosePerTreeGrams: 500.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop"
      ]),
      variants: {
        create: [
          { title: "5 kg Bag", weightKg: 5.0, price: 449, compareAtPrice: 549, sku: "EG-GARD-5KG", stockQuantity: 180, isBulkQuoteOnly: false },
          { title: "10 kg Bag", weightKg: 10.0, price: 799, compareAtPrice: 999, sku: "EG-GARD-10KG", stockQuantity: 95, isBulkQuoteOnly: false },
          { title: "25 kg Bag", weightKg: 25.0, price: 1749, compareAtPrice: 2199, sku: "EG-GARD-25KG", stockQuantity: 40, isBulkQuoteOnly: false },
        ],
      },
    },
    include: { variants: true },
  });

  // Product 2: Nursery Blend Granules
  const p2 = await prisma.product.create({
    data: {
      slug: "ecozza-green-nursery-blend",
      name: "Ecozza Green Nursery Blend Granules",
      tagline: "Fine-calibrated granules engineered for sapling plugs, potting mixes and root media",
      shortDescription: "Special 2-4mm granule size engineered for commercial nurseries, vegetative cuttings, and seedling media.",
      description: `### Precision Medium for Commercial Nurseries
Ecozza Green Nursery Blend is screened to a uniform 2-4mm granule size. It easily blends into cocopeat, vermiculite, or nursery soil mixes.

#### Advantages for Nurseries:
- **Reduces Damping-off Vulnerability:** Improves air-filled porosity while holding optimum water films.
- **Root Network Density:** Root hairs readily penetrate biochar micropores, anchoring saplings firmly.
- **Transplant Shock Mitigation:** Moisture buffering protects young root balls during transport.

*Starting recommendation: Blend 5% to 8% by volume into your regular seedling media.*`,
      category: "Nursery & Propagation",
      hsnCode: "31059090",
      gstRatePercentage: 5.0,
      isPublished: true,
      scoopSizeGrams: 50.0,
      dosePerPotGrams: 80.0,
      dosePerTreeGrams: 400.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
      ]),
      variants: {
        create: [
          { title: "10 kg Bag", weightKg: 10.0, price: 849, compareAtPrice: 1049, sku: "EG-NURS-10KG", stockQuantity: 70, isBulkQuoteOnly: false },
          { title: "25 kg Bag", weightKg: 25.0, price: 1899, compareAtPrice: 2399, sku: "EG-NURS-25KG", stockQuantity: 85, isBulkQuoteOnly: false },
          { title: "1 Tonne Bulk Jumbo Bag", weightKg: 1000.0, price: 62000, compareAtPrice: 72000, sku: "EG-NURS-1T", stockQuantity: 6, isBulkQuoteOnly: true },
        ],
      },
    },
    include: { variants: true },
  });

  // Product 3: Orchard & Plantation Special
  const p3 = await prisma.product.create({
    data: {
      slug: "ecozza-green-orchard-special",
      name: "Ecozza Green Orchard & Plantation Special",
      tagline: "Durable coarse granules for deep tree pits, drip-line trenches, and perennial groves",
      shortDescription: "Coarse granules (3-6mm) for mango, citrus, guava, pomegranate, and fruit orchards. High resilience in deep soil pits.",
      description: `### Permanent Root-Zone Moisture Reservoirs for Fruit Trees
Ecozza Green Orchard Special is crafted specifically for perennial tree crops. Unlike raw organic inputs that break down in months, biochar provides permanent carbon structure in tree basins.

#### Application Strategies:
- **Planting Pits:** Mix with compost and topsoil at the base and sides of newly planted sapling pits.
- **Established Orchards:** Trench along the active feeder root zone directly under the irrigation drip line.
- **Arid Soil Conditioning:** Dramatically extends irrigation intervals in sandy or gravelly orchard soils.`,
      category: "Orchards & Trees",
      hsnCode: "31059090",
      gstRatePercentage: 5.0,
      isPublished: true,
      scoopSizeGrams: 50.0,
      dosePerPotGrams: 150.0,
      dosePerTreeGrams: 1000.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
      ]),
      variants: {
        create: [
          { title: "25 kg Bag", weightKg: 25.0, price: 1699, compareAtPrice: 2099, sku: "EG-ORCH-25KG", stockQuantity: 110, isBulkQuoteOnly: false },
          { title: "1 Tonne Bulk Jumbo Bag", weightKg: 1000.0, price: 58000, compareAtPrice: 68000, sku: "EG-ORCH-1T", stockQuantity: 8, isBulkQuoteOnly: true },
        ],
      },
    },
    include: { variants: true },
  });

  // Product 4: Commercial Farm Granules
  const p4 = await prisma.product.create({
    data: {
      slug: "ecozza-green-farm-granules",
      name: "Ecozza Green Field Farm Granules",
      tagline: "High-volume granular conditioner for open-field crops, vegetable rows, and depleted soils",
      shortDescription: "Cost-effective granular conditioner designed for field band application and broadacre soil conditioning.",
      description: `### Scalable Soil Conditioning for Commercial Agriculture
Ecozza Green Field Farm Granules offer commercial farmers an effective way to restore degraded soil organic carbon (SOC) and build water resilience.

#### Key Crop Applications:
- **Vegetables (Tomato, Chilli, Brinjal, Onion):** Band application along furrow or raised beds before transplanting.
- **Pulses & Oilseeds:** Incorporate during land preparation to protect against dry spells.
- **Sugarcane & Banana:** Apply along ratoon lines or furrow trenches.`,
      category: "Commercial Farming",
      hsnCode: "31059090",
      gstRatePercentage: 5.0,
      isPublished: true,
      scoopSizeGrams: 50.0,
      dosePerPotGrams: 100.0,
      dosePerTreeGrams: 500.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
      ]),
      variants: {
        create: [
          { title: "25 kg Bag", weightKg: 25.0, price: 1599, compareAtPrice: 1999, sku: "EG-FARM-25KG", stockQuantity: 160, isBulkQuoteOnly: false },
          { title: "1 Tonne Bulk Jumbo Bag", weightKg: 1000.0, price: 54000, compareAtPrice: 64000, sku: "EG-FARM-1T", stockQuantity: 15, isBulkQuoteOnly: true },
        ],
      },
    },
    include: { variants: true },
  });

  // 5. Demo Batch Lab Report (With fake labeled data as requested)
  await prisma.batchLabReport.create({
    data: {
      batchNumber: "EG-2026-B01",
      productId: p1.id,
      testDate: new Date("2026-03-15"),
      labName: "[DEMO SAMPLE LAB REPORT: NABL Certified Testing Lab - Sample Batch Only]",
      labReportPdfUrl: "/docs/sample-lab-report-b01.pdf",
      carbonPercentage: 74.2,
      phValue: 7.8,
      moisturePercentage: 7.5,
      granuleSizeMm: "2 mm - 5 mm",
      bulkDensity: 0.44,
      heavyMetalsTested: true,
      heavyMetalsSummary: "Below detectable limits (Sample Demo Testing)",
      notes: "Sample laboratory report data for platform demonstration. Real batch certificates will be uploaded upon official laboratory release.",
      isVerified: true,
    },
  });

  // 6. Admin-Editable Dose Rules (No hardcoded calculations)
  const doseRules = [
    {
      plantCategory: "Potted Plants",
      cropName: "Flowering & Foliage Pots (8-10 inch)",
      unitType: "POT",
      soilType: "Sandy Soil",
      recommendedDoseGrams: 120,
      bagRecommendationText: "Mix 2-3 scoops into top 2 inches of potting mix every 6 months.",
      notes: "Starting recommendation. Results vary by potting mix composition.",
    },
    {
      plantCategory: "Potted Plants",
      cropName: "Large Containers & Planters (12-16 inch)",
      unitType: "POT",
      soilType: "Loamy Soil",
      recommendedDoseGrams: 200,
      bagRecommendationText: "Blend 4 scoops with compost and gently work around root perimeter.",
      notes: "Starting recommendation. Results vary by pot volume.",
    },
    {
      plantCategory: "Fruit Orchards",
      cropName: "Mango & Citrus Saplings (Year 1-2)",
      unitType: "TREE",
      soilType: "Sandy Soil",
      recommendedDoseGrams: 750,
      bagRecommendationText: "Blend 750g with pit topsoil and compost before setting sapling.",
      notes: "Starting recommendation. Water deeply after application.",
    },
    {
      plantCategory: "Fruit Orchards",
      cropName: "Mature Fruit Trees (Year 3+)",
      unitType: "TREE",
      soilType: "Clayey / Heavy Soil",
      recommendedDoseGrams: 1500,
      bagRecommendationText: "Excavate 4-inch deep trench along canopy drip line and incorporate with soil.",
      notes: "Starting recommendation. Pre-monsoon application recommended.",
    },
    {
      plantCategory: "Vegetables & Greens",
      cropName: "Tomato, Chilli & Capsicum",
      unitType: "ACRE",
      soilType: "Loamy Soil",
      recommendedDoseGrams: 400000, // 400 kg per acre
      bagRecommendationText: "Apply 400 kg (16 bags of 25kg) along planting bands before bed formation.",
      notes: "Starting recommendation. Soil conditioner does not substitute basal fertilizer.",
    },
    {
      plantCategory: "Vegetables & Greens",
      cropName: "Leafy Greens & Gourds",
      unitType: "ACRE",
      soilType: "Sandy Soil",
      recommendedDoseGrams: 500000, // 500 kg per acre
      bagRecommendationText: "Apply 500 kg (20 bags of 25kg) broadcast and incorporate to 10cm depth.",
      notes: "Starting recommendation. Sandy soils benefit from increased moisture buffering.",
    },
  ];

  for (const rule of doseRules) {
    await prisma.doseRule.create({ data: rule });
  }

  // 7. Shipping Rates & Pincodes
  const shippingTiers = [
    { minWeightKg: 0, maxWeightKg: 5, baseRateInr: 99, perKgAdditionalRateInr: 0, freeShippingThreshold: 1499 },
    { minWeightKg: 5.1, maxWeightKg: 10, baseRateInr: 149, perKgAdditionalRateInr: 0, freeShippingThreshold: 1499 },
    { minWeightKg: 10.1, maxWeightKg: 25, baseRateInr: 249, perKgAdditionalRateInr: 0, freeShippingThreshold: 1499 },
    { minWeightKg: 25.1, maxWeightKg: 50, baseRateInr: 449, perKgAdditionalRateInr: 15, freeShippingThreshold: 2999 },
  ];

  for (const tier of shippingTiers) {
    await prisma.shippingRateTier.create({ data: tier });
  }

  const samplePincodes = [
    { pincode: "380001", city: "Ahmedabad", state: "Gujarat", isServiceable: true, isCodAvailable: true, deliveryTatDays: 2 },
    { pincode: "380054", city: "Ahmedabad", state: "Gujarat", isServiceable: true, isCodAvailable: true, deliveryTatDays: 2 },
    { pincode: "388001", city: "Anand", state: "Gujarat", isServiceable: true, isCodAvailable: true, deliveryTatDays: 2 },
    { pincode: "395001", city: "Surat", state: "Gujarat", isServiceable: true, isCodAvailable: true, deliveryTatDays: 2 },
    { pincode: "390001", city: "Vadodara", state: "Gujarat", isServiceable: true, isCodAvailable: true, deliveryTatDays: 2 },
    { pincode: "400001", city: "Mumbai", state: "Maharashtra", isServiceable: true, isCodAvailable: true, deliveryTatDays: 3 },
    { pincode: "110001", city: "New Delhi", state: "Delhi", isServiceable: true, isCodAvailable: true, deliveryTatDays: 4 },
    { pincode: "560001", city: "Bengaluru", state: "Karnataka", isServiceable: true, isCodAvailable: true, deliveryTatDays: 4 },
  ];

  for (const pin of samplePincodes) {
    await prisma.pincodeServiceability.create({ data: pin });
  }

  // 8. Demo Orders (3 orders)
  const garden10kgVariant = p1.variants.find((v) => v.weightKg === 10)!;
  const nursery25kgVariant = p2.variants.find((v) => v.weightKg === 25)!;
  const garden5kgVariant = p1.variants.find((v) => v.weightKg === 5)!;

  // Order 1: Delivered
  await prisma.order.create({
    data: {
      orderNumber: "EG-ORD-10001",
      userId: demoCustomer.id,
      customerName: "Rahul Sharma",
      customerEmail: "rahul.sharma@example.com",
      customerPhone: "+919825012345",
      shippingAddress: JSON.stringify({
        fullName: "Rahul Sharma",
        phone: "+919825012345",
        addressLine1: "14, Shivalik Residency, Drive-in Road",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380054",
      }),
      billingAddress: JSON.stringify({
        fullName: "Rahul Sharma",
        phone: "+919825012345",
        addressLine1: "14, Shivalik Residency, Drive-in Road",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380054",
      }),
      orderStatus: "DELIVERED",
      paymentStatus: "CAPTURED",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: "order_mock_001",
      razorpayPaymentId: "pay_mock_001",
      subtotalAmount: 799,
      shippingAmount: 0,
      discountAmount: 0,
      taxAmount: 38.05, // 5% GST included
      totalAmount: 799,
      trackingNumber: "SR-GJ-9823101",
      carrierName: "Shiprocket / Blue Dart",
      trackingUrl: "https://shiprocket.co/tracking/SR-GJ-9823101",
      invoiceNumber: "INV-2026-0001",
      orderItems: {
        create: {
          variantId: garden10kgVariant.id,
          productName: p1.name,
          variantTitle: garden10kgVariant.title,
          weightKg: garden10kgVariant.weightKg,
          unitPrice: garden10kgVariant.price,
          gstRate: 5.0,
          quantity: 1,
          totalPrice: 799,
        },
      },
    },
  });

  // Order 2: Shipped with GSTIN (B2B buyer)
  await prisma.order.create({
    data: {
      orderNumber: "EG-ORD-10002",
      customerName: "Sunil Varma (Green Valley Nursery)",
      customerEmail: "sunil@greenvalleynursery.in",
      customerPhone: "+919898011223",
      customerGstin: "24AAACG1234F1Z1",
      shippingAddress: JSON.stringify({
        fullName: "Sunil Varma",
        phone: "+919898011223",
        companyName: "Green Valley Nursery",
        addressLine1: "Survey 84, National Highway 8, Samarkha",
        city: "Anand",
        state: "Gujarat",
        postalCode: "388001",
      }),
      billingAddress: JSON.stringify({
        fullName: "Sunil Varma",
        phone: "+919898011223",
        companyName: "Green Valley Nursery",
        addressLine1: "Survey 84, National Highway 8, Samarkha",
        city: "Anand",
        state: "Gujarat",
        postalCode: "388001",
      }),
      orderStatus: "SHIPPED",
      paymentStatus: "CAPTURED",
      paymentMethod: "RAZORPAY",
      razorpayOrderId: "order_mock_002",
      razorpayPaymentId: "pay_mock_002",
      subtotalAmount: 3798, // 2x 25kg @ 1899
      shippingAmount: 0,
      discountAmount: 0,
      taxAmount: 180.86,
      totalAmount: 3798,
      trackingNumber: "SR-GJ-9823102",
      carrierName: "Shiprocket / Delhivery",
      trackingUrl: "https://shiprocket.co/tracking/SR-GJ-9823102",
      invoiceNumber: "INV-2026-0002",
      orderItems: {
        create: {
          variantId: nursery25kgVariant.id,
          productName: p2.name,
          variantTitle: nursery25kgVariant.title,
          weightKg: nursery25kgVariant.weightKg,
          unitPrice: nursery25kgVariant.price,
          gstRate: 5.0,
          quantity: 2,
          totalPrice: 3798,
        },
      },
    },
  });

  // Order 3: Packed (COD)
  await prisma.order.create({
    data: {
      orderNumber: "EG-ORD-10003",
      customerName: "Priya Patel",
      customerEmail: "priya.patel@example.com",
      customerPhone: "+919712033445",
      shippingAddress: JSON.stringify({
        fullName: "Priya Patel",
        phone: "+919712033445",
        addressLine1: "B-402, Riverfront Heights, Adajan",
        city: "Surat",
        state: "Gujarat",
        postalCode: "395009",
      }),
      billingAddress: JSON.stringify({
        fullName: "Priya Patel",
        phone: "+919712033445",
        addressLine1: "B-402, Riverfront Heights, Adajan",
        city: "Surat",
        state: "Gujarat",
        postalCode: "395009",
      }),
      orderStatus: "PACKED",
      paymentStatus: "PENDING",
      paymentMethod: "COD",
      subtotalAmount: 449,
      shippingAmount: 99,
      discountAmount: 0,
      taxAmount: 26.1,
      totalAmount: 548,
      trackingNumber: "SR-GJ-9823103",
      carrierName: "Shiprocket / Shadowfax",
      invoiceNumber: "INV-2026-0003",
      orderItems: {
        create: {
          variantId: garden5kgVariant.id,
          productName: p1.name,
          variantTitle: garden5kgVariant.title,
          weightKg: garden5kgVariant.weightKg,
          unitPrice: garden5kgVariant.price,
          gstRate: 5.0,
          quantity: 1,
          totalPrice: 449,
        },
      },
    },
  });

  // 9. Verified Customer Reviews
  await prisma.review.create({
    data: {
      productId: p1.id,
      reviewerName: "Dr. K. Mehta (Botanist)",
      rating: 5,
      title: "Noticeable improvement in terrace pot moisture retention",
      comment: "In Ahmedabad's hot pre-monsoon summer, my potted adeniums and hibiscus used to dry out by midday. Adding Ecozza Green granules improved water retention significantly. Excellent granular physical structure.",
      isVerifiedBuyer: true,
      isApproved: true,
    },
  });

  // 10. Sample B2B Leads
  await prisma.leadEnquiry.create({
    data: {
      name: "Bhavesh Desai",
      companyName: "Gujarat Agro Nursery Federation",
      gstin: "24AAABG5432H1Z2",
      phone: "+919824055667",
      email: "info@gujaratagronursery.org",
      locationState: "Gujarat",
      locationCity: "Vadodara",
      cropType: "Mango, Pomegranate, Teak Saplings",
      quantityText: "5 Tonnes (Jumbo Bags)",
      message: "Looking for regular monthly supply of 2-4mm nursery granules for seedling plugs across 4 branch nurseries in central Gujarat.",
      status: "NEW",
    },
  });

  // 11. Blog Posts
  await prisma.blogPost.create({
    data: {
      slug: "understanding-biochar-porosity-and-soil-structure",
      title: "Understanding Soil Porosity: Why Granular Biochar Acts Like a Permanent Microscopic Sponge",
      excerpt: "Explore how high-temperature pyrolysis creates millions of interconnected microscopic pores that trap moisture and beneficial soil microorganisms.",
      contentMarkdown: `Soil structure determines whether roots can breathe and hydrate. In many Indian soils, high summer temperatures and low organic carbon lead to rapid compaction.

### The Physics of Granular Biochar
When woody biomass undergoes controlled thermal transformation in oxygen-limited chambers, organic volatile matter exits, leaving behind a highly organized carbon skeleton.

#### Why Granules Matter
Powdered biochar can blow away in the wind or clog soil pores if over-applied. In contrast, **granular biochar (2mm - 5mm)**:
1. Creates stable aeration channels in clayey soils.
2. Acts like an underground reservoir in sandy soils.
3. Does not break down quickly, persisting in root zones for years.

*Disclaimer: Ecozza Green is a soil conditioner, not a fertilizer. Results vary according to soil type, existing organic carbon, and agricultural practices.*`,
      coverImageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      author: "Ecozza Green Agronomy Team",
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

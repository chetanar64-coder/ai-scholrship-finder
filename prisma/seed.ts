import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for hackathon demo...");

  // 1. Clear existing data
  await prisma.user.deleteMany();
  await prisma.scholarship.deleteMany();

  const now = new Date();

  // 2. Seed Sample Student Profiles
  const sampleUsers = [
    {
      name: "Chethan A R",
      email: "chethan@university.edu",
      cgpa: 8.5,
      familyIncome: 350000,
      category: "OBC",
      course: "B.Tech",
      semester: 5,
      achievements: "Gold Medalist in State Hackathon 2025, NSS Volunteer, Published ML Paper.",
    },
    {
      name: "Ananya Sharma",
      email: "ananya@iit.ac.in",
      cgpa: 9.2,
      familyIncome: 550000,
      category: "General",
      course: "M.Tech",
      semester: 2,
      achievements: "First Rank in B.Tech GATE Exam, IEEE Student Chapter Lead.",
    },
    {
      name: "Rajesh Kumar",
      email: "rajesh@stateuniv.edu",
      cgpa: 7.8,
      familyIncome: 180000,
      category: "SC",
      course: "B.Sc",
      semester: 3,
      achievements: "College Debate Champion, Merit Scholar 2024.",
    },
  ];

  for (const user of sampleUsers) {
    await prisma.user.create({ data: user });
    console.log(`  ✓ Created Student Profile: ${user.name}`);
  }

  // 3. Seed Diverse Scholarships
  const scholarships = [
    {
      name: "National Merit Scholarship",
      provider: "Ministry of Education, Govt. of India",
      amount: 120000,
      description:
        "Awarded to high-achieving students across all disciplines based on academic excellence and financial need. One of India's most prestigious merit-based scholarships.",
      minCgpa: 8.0,
      maxIncome: 600000,
      eligibleCategories: JSON.stringify(["General", "OBC", "SC", "ST", "EWS"]),
      eligibleCourses: JSON.stringify([
        "B.Tech", "M.Tech", "MBA", "MCA", "PhD", "B.Sc", "M.Sc", "B.Com",
      ]),
      maxSemester: 8,
      deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      applyLink: "https://scholarships.gov.in/fresh/newstdRegister",
      benefits: JSON.stringify([
        "₹1,20,000 annual stipend",
        "Tuition fee waiver up to ₹40,000",
        "Free hostel accommodation",
        "Research grant of ₹10,000",
      ]),
    },
    {
      name: "SC/ST Excellence Award",
      provider: "Ministry of Social Justice & Empowerment",
      amount: 80000,
      description:
        "Supports Scheduled Caste and Scheduled Tribe students pursuing higher education in technical and non-technical streams. Promotes equity and educational inclusion.",
      minCgpa: 6.0,
      maxIncome: 250000,
      eligibleCategories: JSON.stringify(["SC", "ST"]),
      eligibleCourses: JSON.stringify([
        "B.Tech", "M.Tech", "B.Sc", "M.Sc", "MBA", "MCA", "PhD", "B.Com",
      ]),
      maxSemester: 8,
      deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      applyLink: "https://scholarships.gov.in",
      benefits: JSON.stringify([
        "₹80,000 annual grant",
        "Book & stationery allowance ₹5,000",
        "Annual maintenance allowance",
        "Free coaching for competitive exams",
      ]),
    },
    {
      name: "OBC Technical Excellence Scholarship",
      provider: "All India OBC Coordination Forum (AIOBCF)",
      amount: 60000,
      description:
        "Empowers OBC students enrolled in technical programs by providing financial support, ensuring equal opportunity in STEM education and research.",
      minCgpa: 7.0,
      maxIncome: 500000,
      eligibleCategories: JSON.stringify(["OBC"]),
      eligibleCourses: JSON.stringify(["B.Tech", "M.Tech", "MCA", "B.Sc", "M.Sc"]),
      maxSemester: 8,
      deadline: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      applyLink: "https://aiobcf.org/scholarships",
      benefits: JSON.stringify([
        "₹60,000 annual scholarship",
        "Laptop assistance up to ₹25,000",
        "Mentorship programme access",
        "Industry internship placement support",
      ]),
    },
    {
      name: "TCS Women in STEM Grant",
      provider: "TCS Foundation",
      amount: 50000,
      description:
        "A prestigious corporate scholarship by Tata Consultancy Services supporting women pursuing STEM degrees. Recipients get mentorship from TCS engineers and priority recruitment consideration.",
      minCgpa: 7.5,
      maxIncome: 1200000,
      eligibleCategories: JSON.stringify(["General", "OBC", "SC", "ST", "EWS"]),
      eligibleCourses: JSON.stringify(["B.Tech", "M.Tech", "B.Sc", "M.Sc", "MCA"]),
      maxSemester: 6,
      deadline: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000),
      applyLink: "https://tcs.com/tcs-scholarships",
      benefits: JSON.stringify([
        "₹50,000 annual grant",
        "TCS mentorship programme",
        "Priority TCS campus recruitment",
        "Annual tech conference pass",
      ]),
    },
    {
      name: "PM-YASASVI EWS Bright Futures",
      provider: "National Testing Agency / PM-YASASVI",
      amount: 100000,
      description:
        "Under the PM Young Achievers Scholarship Award Scheme for Vibrant India, this scholarship targets EWS and General category students with financial constraints, enabling them to pursue higher education without burden.",
      minCgpa: 6.5,
      maxIncome: 800000,
      eligibleCategories: JSON.stringify(["EWS", "General"]),
      eligibleCourses: JSON.stringify([
        "B.Tech", "M.Tech", "MBA", "MCA", "PhD", "B.Sc", "M.Sc", "B.Com",
      ]),
      maxSemester: 8,
      deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      applyLink: "https://yet.nta.ac.in",
      benefits: JSON.stringify([
        "₹1,00,000 annual scholarship",
        "Exam fee reimbursement",
        "Free NPTEL course access",
      ]),
    },
    {
      name: "Infosys Foundation STEM Fellowship",
      provider: "Infosys Foundation",
      amount: 150000,
      description:
        "High-value grant supporting outstanding undergraduate and postgraduate computer science and engineering scholars.",
      minCgpa: 8.5,
      maxIncome: 750000,
      eligibleCategories: JSON.stringify(["General", "OBC", "SC", "ST", "EWS"]),
      eligibleCourses: JSON.stringify(["B.Tech", "M.Tech", "MCA", "PhD"]),
      maxSemester: 8,
      deadline: new Date(now.getTime() + 75 * 24 * 60 * 60 * 1000),
      applyLink: "https://www.infosys.com/infosys-foundation",
      benefits: JSON.stringify([
        "₹1,50,000 annual grant",
        "Direct Infosys R&D lab access",
        "Cloud credits & AI GPU access",
      ]),
    },
  ];

  for (const s of scholarships) {
    await prisma.scholarship.create({ data: s });
    console.log(`  ✓ Created Scholarship: ${s.name}`);
  }

  console.log(`\n✅ Database seed complete — ${sampleUsers.length} profiles and ${scholarships.length} scholarships populated.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

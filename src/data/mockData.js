export const gradeOptions = [
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Gap Year",
];

export const majorOptions = [
  "Computer Science",
  "Business",
  "Engineering",
  "Medicine",
  "Arts",
  "Economics",
  "Law",
  "Psychology",
];

export const countryOptions = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Hong Kong",
  "Singapore",
];

export const targetCountryOptions = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Hong Kong",
  "Singapore",
  "Other",
];

export const cityOptionsByCountry = {
  USA: [
    "New York",
    "San Francisco",
    "Los Angeles",
    "Boston",
    "Seattle",
    "Other",
  ],
  UK: ["London", "Oxford", "Cambridge", "Manchester", "Edinburgh", "Other"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Ottawa", "Other"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth", "Other"],
  "Hong Kong": ["Hong Kong", "Kowloon", "New Territories", "Other"],
  Singapore: ["Singapore", "Other"],
};

export const dreamSchools = [
  "MIT",
  "Stanford University",
  "Harvard University",
  "University of Oxford",
  "University of Cambridge",
  "Imperial College London",
  "UCL",
  "National University of Singapore",
  "University of Toronto",
  "University of Melbourne",
  "Carnegie Mellon University",
  "UC Berkeley",
];

export const applicationStatuses = [
  "Applying",
  "Submitted",
  "Interview",
  "Offer",
  "Rejected",
  "Waitlisted",
];

export const universityFilters = [
  "All",
  "Reach",
  "Match",
  "Safe",
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Hong Kong",
  "Singapore",
];

export const universities = [
  {
    id: "uni-1",
    name: "Massachusetts Institute of Technology",
    shortName: "MIT",
    rank: 1,
    location: "Cambridge, MA, USA",
    country: "USA",
    type: "Private",
    applicationRound: "Regular Decision",
    match: 92,
    acceptanceRate: "3.4%",
    tuition: "$57,590/yr",
    deadline: "2026-01-05",
    description:
      "A world-leading university known for engineering, computer science, entrepreneurship, and hands-on research culture.",
    tags: ["STEM", "Research", "Innovation"],
    majors: ["Computer Science", "Engineering", "Economics"],
    image:
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-2",
    name: "Stanford University",
    shortName: "Stanford",
    rank: 2,
    location: "Stanford, CA, USA",
    country: "USA",
    type: "Private",
    applicationRound: "Regular Decision",
    match: 78,
    acceptanceRate: "3.7%",
    tuition: "$56,169/yr",
    deadline: "2026-01-03",
    description:
      "Stanford combines academic excellence with strong startup culture, interdisciplinary learning, and global research opportunities.",
    tags: ["Entrepreneurship", "AI", "Innovation"],
    majors: ["Computer Science", "Business", "Engineering", "Psychology"],
    image:
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-3",
    name: "University of Oxford",
    shortName: "Oxford",
    rank: 3,
    location: "Oxford, UK",
    country: "UK",
    type: "Public",
    applicationRound: "UCAS",
    match: 45,
    acceptanceRate: "17.5%",
    tuition: "£9,250/yr",
    deadline: "2025-10-15",
    description:
      "Oxford offers a tutorial-based academic environment with strong global prestige across humanities, sciences, law, and medicine.",
    tags: ["Tutorials", "Prestige", "Collegiate"],
    majors: ["Law", "Medicine", "Economics", "Computer Science", "Arts"],
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-4",
    name: "University of Toronto",
    shortName: "UofT",
    rank: 15,
    location: "Toronto, Canada",
    country: "Canada",
    type: "Public",
    applicationRound: "Main Round",
    match: 88,
    acceptanceRate: "43%",
    tuition: "CAD $6,100/yr",
    deadline: "2026-01-15",
    description:
      "A strong destination for international students with broad program choice, research intensity, and access to Toronto’s urban opportunities.",
    tags: ["Research", "International", "Urban"],
    majors: ["Computer Science", "Engineering", "Business", "Psychology"],
    image:
      "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-5",
    name: "Imperial College London",
    shortName: "Imperial",
    rank: 6,
    location: "London, UK",
    country: "UK",
    type: "Public",
    applicationRound: "UCAS",
    match: 62,
    acceptanceRate: "14.3%",
    tuition: "£35,100/yr",
    deadline: "2026-01-31",
    description:
      "Imperial is highly regarded for science, engineering, medicine, and data-driven fields with strong industry links.",
    tags: ["STEM", "London", "Industry"],
    majors: ["Computer Science", "Engineering", "Medicine"],
    image:
      "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-6",
    name: "National University of Singapore",
    shortName: "NUS",
    rank: 8,
    location: "Singapore",
    country: "Singapore",
    type: "Public",
    applicationRound: "Main Round",
    match: 84,
    acceptanceRate: "Approx. competitive",
    tuition: "SGD $17,650/yr",
    deadline: "2026-02-26",
    description:
      "NUS is a top Asian university with strong performance in computing, engineering, business, and interdisciplinary programs.",
    tags: ["Asia", "Global", "Research"],
    majors: ["Computer Science", "Business", "Engineering", "Law"],
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-7",
    name: "University of Hong Kong",
    shortName: "HKU",
    rank: 17,
    location: "Hong Kong",
    country: "Hong Kong",
    type: "Public",
    applicationRound: "Main Round",
    match: 86,
    acceptanceRate: "Competitive",
    tuition: "HKD $182,000/yr",
    deadline: "2026-01-15",
    description:
      "HKU offers a strong international environment, especially attractive for students seeking Asia-focused opportunities and English-medium study.",
    tags: ["Asia", "International", "City Campus"],
    majors: ["Business", "Law", "Medicine", "Computer Science"],
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "uni-8",
    name: "University of Melbourne",
    shortName: "Melbourne",
    rank: 13,
    location: "Melbourne, Australia",
    country: "Australia",
    type: "Public",
    applicationRound: "Semester Intake",
    match: 80,
    acceptanceRate: "Moderate",
    tuition: "AUD $52,000/yr",
    deadline: "2026-02-28",
    description:
      "Melbourne provides broad academic options, strong student support, and a flexible pathway into many professional and research areas.",
    tags: ["Australia", "Flexible", "Research"],
    majors: [
      "Arts",
      "Business",
      "Engineering",
      "Psychology",
      "Computer Science",
    ],
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const initialApplications = [];

export const initialTasks = [
  {
    id: "task-1",
    title: "Research top 10 universities",
    category: "Research",
    dueDate: "2026-03-18",
    completed: false,
    linkedUniversityId: "",
  },
  {
    id: "task-2",
    title: "Finalize personal statement",
    category: "Essays",
    dueDate: "2026-03-20",
    completed: false,
    linkedUniversityId: "",
  },
  {
    id: "task-3",
    title: "Request recommendation letter",
    category: "Documents",
    dueDate: "2026-03-10",
    completed: true,
    linkedUniversityId: "",
  },
  {
    id: "task-4",
    title: "Register for SAT exam",
    category: "Exams",
    dueDate: "2026-04-01",
    completed: false,
    linkedUniversityId: "",
  },
  {
    id: "task-5",
    title: "Complete Common App profile",
    category: "Applications",
    dueDate: "2026-03-05",
    completed: true,
    linkedUniversityId: "",
  },
];

export const aiSuggestedTasks = [
  {
    id: "task-ai-1",
    title: "Draft a university short list",
    category: "Research",
    dueDate: "2026-03-25",
    completed: false,
    linkedUniversityId: "",
  },
  {
    id: "task-ai-2",
    title: "Write essay outline for personal statement",
    category: "Essays",
    dueDate: "2026-03-22",
    completed: false,
    linkedUniversityId: "",
  },
];

export const communityPosts = [
  {
    id: "post-1",
    user: "Sarah K.",
    location: "London",
    timeAgo: "2h ago",
    category: "Milestone",
    title: "Just got accepted to UCL! 🎉",
    body: "After months of preparation, I finally received my offer and wanted to share the news with everyone here.",
    upvotes: 24,
    replies: 8,
    attachment: null,
    color: "bg-emerald-100 text-emerald-700",
    upvoted: false,
    saved: false,
  },
  {
    id: "post-2",
    user: "James L.",
    location: "New York",
    timeAgo: "5h ago",
    category: "Resource",
    title: "Free SAT Prep Materials",
    body: "I compiled a list of the best free SAT resources, mock tests, and YouTube channels that helped me improve.",
    upvotes: 45,
    replies: 12,
    attachment: "SAT_Resources.pdf",
    color: "bg-sky-100 text-sky-700",
    upvoted: false,
    saved: false,
  },
  {
    id: "post-3",
    user: "Aiko T.",
    location: "Tokyo",
    timeAgo: "1d ago",
    category: "Tip",
    title: "How I wrote my personal statement",
    body: "Here’s my five-step approach to writing a more compelling personal statement without sounding too formal.",
    upvotes: 31,
    replies: 15,
    attachment: null,
    color: "bg-violet-100 text-violet-700",
    upvoted: false,
    saved: false,
  },
];

export const notifications = [
  {
    id: "notif-1",
    title: "Application deadline for MIT in 5 days",
    time: "1h ago",
    unread: true,
  },
  {
    id: "notif-2",
    title: "New post in Community: Free SAT resources",
    time: "3h ago",
    unread: true,
  },
  {
    id: "notif-3",
    title: "Your recommendation letter request was viewed",
    time: "1d ago",
    unread: false,
  },
];

export const documents = [
  {
    id: "doc-1",
    name: "Personal Statement",
    description: "Main application essay",
    status: "Complete",
    fileName: "personal-statement.pdf",
  },
  {
    id: "doc-2",
    name: "Transcript",
    description: "Official academic records",
    status: "Complete",
    fileName: "transcript.pdf",
  },
  {
    id: "doc-3",
    name: "Recommendation Letter 1",
    description: "From academic teacher",
    status: "Pending",
    fileName: "",
  },
  {
    id: "doc-4",
    name: "Recommendation Letter 2",
    description: "From counselor or mentor",
    status: "Pending",
    fileName: "",
  },
  {
    id: "doc-5",
    name: "Test Scores",
    description: "SAT/ACT/IELTS/TOEFL",
    status: "Upload",
    fileName: "",
  },
  {
    id: "doc-6",
    name: "CV / Resume",
    description: "Extracurricular activities",
    status: "Upload",
    fileName: "",
  },
  {
    id: "doc-7",
    name: "Financial Documents",
    description: "For financial aid applications",
    status: "Upload",
    fileName: "",
  },
];

export const defaultProfile = {
  fullName: "",
  email: "",
  currentGrade: "Grade 12",
  country: "Hong Kong",
  city: "Hong Kong",
  customCity: "",
  schoolName: "",
  curriculum: "High School Diploma",
  gpa: "",
  targetMajor: "Computer Science",
  targetCountries: ["USA", "UK"],
  otherTargetCountry: "",
  dreamSchool: "MIT",
  satScore: "",
  actScore: "",
  ieltsScore: "",
  toeflScore: "",
};

export const initialMessages = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Hi! I'm your Gnosis AI Essay Coach. I can help you brainstorm ideas, review your personal statement, strengthen your essays, and practice interview answers. What would you like to work on today?",
  },
];

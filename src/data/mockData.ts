export type Ticket = {
  id: string;
  title: string;
  description: string;
  reporter: string;
  reporterRole: string;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
  created: string;
};

export const MOCK_TICKETS: Ticket[] = [
  {
    id: "MED-142",
    title: "Block exam pass rates by WWAMI site",
    description:
      "Academic Affairs needs Foundations Phase block exam pass rates broken down by WWAMI regional site (Seattle, Spokane, Anchorage, Bozeman, Moscow, Laramie) for AY 2024-25 to share with regional deans.",
    reporter: "Dr. L. Hernandez",
    reporterRole: "Associate Dean, Academic Affairs",
    priority: "High",
    status: "In Progress",
    created: "2026-04-22",
  },
  {
    id: "MED-138",
    title: "Clerkship evaluation completion rates",
    description:
      "Clerkship directors want to see student completion of end-of-clerkship evaluations by clerkship and by site, last 6 months. Flag any clerkship below 80% completion.",
    reporter: "K. Patel",
    reporterRole: "Clerkship Coordinator",
    priority: "Medium",
    status: "To Do",
    created: "2026-04-25",
  },
  {
    id: "MED-129",
    title: "Thread performance: Ethics longitudinal",
    description:
      "Thread director for Ethics needs student performance on ethics-tagged assessment items across Foundations and Patient Care phases. Unclear what 'performance' means here.",
    reporter: "Dr. M. Okafor",
    reporterRole: "Thread Director, Ethics",
    priority: "Medium",
    status: "To Do",
    created: "2026-04-26",
  },
  {
    id: "MED-115",
    title: "Active users on E*Value last quarter",
    description:
      "How many active users did we have on the evaluation platform last quarter? Need this for an EQI report.",
    reporter: "S. Nguyen",
    reporterRole: "Educational Quality Improvement",
    priority: "Low",
    status: "To Do",
    created: "2026-04-28",
  },
  {
    id: "MED-101",
    title: "College mentor meeting frequency",
    description:
      "College heads want average number of mentor-student meetings per student per quarter, by College, for the current academic year.",
    reporter: "Dr. R. Chen",
    reporterRole: "College Head",
    priority: "Medium",
    status: "Done",
    created: "2026-04-10",
  },
];

export type SchemaTable = {
  name: string;
  description: string;
  columns: { name: string; type: string; description: string }[];
};

export type MetricDef = { name: string; definition: string };

export type ContextLayer = {
  database: string;
  refreshTime: string;
  owner: string;
  tables: SchemaTable[];
  metrics: MetricDef[];
};

export const DEFAULT_CONTEXT: ContextLayer = {
  database: "uwsom_med_ed_warehouse (Postgres)",
  refreshTime: "Daily at 04:00 PT (last refresh: 2026-04-29 04:02 PT)",
  owner: "Division of Medical Education & Evaluation, BIME",
  tables: [
    {
      name: "students",
      description: "Enrolled UWSOM medical students.",
      columns: [
        { name: "student_id", type: "uuid", description: "Primary key" },
        { name: "matric_year", type: "int", description: "Matriculation year" },
        { name: "wwami_site", type: "text", description: "Seattle | Spokane | Anchorage | Bozeman | Moscow | Laramie" },
        { name: "college", type: "text", description: "College assignment (e.g. Big Sky, Denali, Olympic, Snake River, Wind River, Columbia)" },
        { name: "phase", type: "text", description: "Foundations | Patient Care | Explore & Focus" },
        { name: "status", type: "text", description: "active | loa | graduated | withdrawn" },
      ],
    },
    {
      name: "assessments",
      description: "Block, NBME, and clerkship assessment results.",
      columns: [
        { name: "assessment_id", type: "uuid", description: "Primary key" },
        { name: "student_id", type: "uuid", description: "FK -> students" },
        { name: "block_id", type: "text", description: "FK -> blocks (e.g. FND-CMI, FND-MSI)" },
        { name: "clerkship", type: "text", description: "Internal Med | Surgery | Peds | Ob/Gyn | Psych | Family Med | Neuro" },
        { name: "score", type: "numeric", description: "Raw score" },
        { name: "passed", type: "boolean", description: "Pass/fail flag using block-specific cut score" },
        { name: "assessed_on", type: "date", description: "Date administered" },
      ],
    },
    {
      name: "evaluations",
      description: "End-of-block, end-of-clerkship, and thread evaluations submitted in E*Value.",
      columns: [
        { name: "eval_id", type: "uuid", description: "Primary key" },
        { name: "student_id", type: "uuid", description: "Student being evaluated or completing eval" },
        { name: "eval_type", type: "text", description: "block | clerkship | thread | mentor" },
        { name: "context_id", type: "text", description: "Block/clerkship/thread identifier" },
        { name: "submitted", type: "boolean", description: "Whether the evaluation was submitted" },
        { name: "submitted_at", type: "timestamp", description: "Submission timestamp (null if not submitted)" },
        { name: "due_at", type: "timestamp", description: "Due date" },
      ],
    },
    {
      name: "items",
      description: "Assessment items, tagged to threads/themes.",
      columns: [
        { name: "item_id", type: "uuid", description: "Primary key" },
        { name: "assessment_id", type: "uuid", description: "FK -> assessments" },
        { name: "thread_tag", type: "text", description: "Ethics | Health Equity | Scientific Foundations | etc." },
        { name: "correct", type: "boolean", description: "Whether the student answered correctly" },
      ],
    },
    {
      name: "mentor_meetings",
      description: "College mentor-student meeting log.",
      columns: [
        { name: "meeting_id", type: "uuid", description: "Primary key" },
        { name: "student_id", type: "uuid", description: "FK -> students" },
        { name: "college", type: "text", description: "College name" },
        { name: "occurred_on", type: "date", description: "Date of the meeting" },
      ],
    },
    {
      name: "platform_activity",
      description: "Login/usage events for evaluation platform (E*Value).",
      columns: [
        { name: "event_id", type: "uuid", description: "Primary key" },
        { name: "user_id", type: "uuid", description: "User performing action" },
        { name: "user_role", type: "text", description: "student | faculty | staff | dean" },
        { name: "event_at", type: "timestamp", description: "Event timestamp" },
      ],
    },
  ],
  metrics: [
    { name: "Block Pass Rate", definition: "share of students with passed = TRUE on the most recent attempt for a given block_id" },
    { name: "Evaluation Completion Rate", definition: "submitted = TRUE / total assigned (where due_at <= today) for a given eval_type and context_id" },
    { name: "Active User", definition: "any user with >=1 platform_activity event in the period" },
    { name: "Thread Performance", definition: "% correct on items where thread_tag = X, aggregated per student then averaged" },
    { name: "WWAMI Site", definition: "students.wwami_site values: Seattle, Spokane, Anchorage, Bozeman, Moscow, Laramie" },
  ],
};

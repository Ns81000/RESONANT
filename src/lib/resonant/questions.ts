import type { Question, Level } from "./types";

// Scenarios are written like short briefs — give the speaker context, a
// stakeholder, and a clear goal. This is what makes Resonant feel like a
// coaching session, not a quiz.
export const QUESTIONS: Question[] = [
  // ---------- Beginner ----------
  {
    id: "beg-01",
    level: "beginner",
    category: "Introduction",
    timeLimitSeconds: 25,
    prompt:
      "Welcome to the team call, {name}! Please introduce yourself: your role, what you do, and one thing you're excited about.",
    providedText:
      "Hi everyone, I'm a developer with three years of experience. I'm joining the platform team, and I'm excited to help build the new dashboard this quarter.",
  },
  {
    id: "beg-02",
    level: "beginner",
    category: "Small talk",
    timeLimitSeconds: 30,
    prompt:
      "A colleague stops by your desk, {name}, and asks how your weekend went. Reply in a friendly, professional way.",
    providedText:
      "It was great, thanks! I spent some time outdoors and caught up on reading. How was your weekend? Did you do anything fun?",
  },
  {
    id: "beg-03",
    level: "beginner",
    category: "Daily work",
    timeLimitSeconds: 35,
    prompt:
      "Imagine a new team member asks what you do. {name}, explain your team's core focus in one or two simple sentences.",
    providedText:
      "Our team builds the main dashboard that customers use to manage their accounts. We focus on making it fast, reliable, and easy to navigate.",
  },
  {
    id: "beg-04",
    level: "beginner",
    category: "Opinion",
    timeLimitSeconds: 35,
    prompt:
      "Let's talk preferences, {name}. Do you prefer working from home or from the office? Share one simple reason.",
    providedText:
      "I prefer working from home because it saves me time on commuting, which helps me focus better and start my work day early and refreshed.",
  },
  {
    id: "beg-05",
    level: "beginner",
    category: "Welcoming",
    timeLimitSeconds: 30,
    prompt:
      "It's a new colleague's first day on the job. {name}, welcome them warmly in front of the team.",
    providedText:
      "Welcome to the team! It is great to have you with us. The first week can feel like a lot, so please feel free to reach out if you need anything.",
  },
  {
    id: "beg-06",
    level: "beginner",
    category: "Problem solving",
    timeLimitSeconds: 40,
    prompt:
      "Can you share a small problem you faced at work recently, {name}? Tell us what the issue was and how you solved it.",
    providedText:
      "Yesterday, I couldn't access the project folder. I asked our IT support team, and they updated my permissions. I was back to work in ten minutes.",
  },
  {
    id: "beg-07",
    level: "beginner",
    category: "Communication",
    timeLimitSeconds: 35,
    prompt:
      "Your manager asks about your communication preferences. {name}, do you prefer chat, email, or calls, and why?",
    providedText:
      "I prefer chat for quick updates throughout the day, and emails for detailed feedback so I can review the information and refer back to it later.",
  },
  {
    id: "beg-08",
    level: "beginner",
    category: "Goals",
    timeLimitSeconds: 40,
    prompt:
      "What is one professional skill you want to learn or improve this year, {name}? What is your first step this month?",
    providedText:
      "I want to improve my public speaking skills this year. My first step is to practice presenting a small project update in our weekly team meeting next week.",
  },
  {
    id: "beg-09",
    level: "beginner",
    category: "Opinion",
    timeLimitSeconds: 40,
    prompt:
      "In your opinion, {name}, what is the single most important quality of a good manager? Keep it simple.",
    providedText:
      "A good manager listens carefully to their team and gives clear feedback. This helps everyone understand their goals and feel supported in their daily work.",
  },
  {
    id: "beg-10",
    level: "beginner",
    category: "Closing a meeting",
    timeLimitSeconds: 35,
    prompt:
      "The meeting is wrapping up and you are the host. {name}, close it cleanly, thank everyone, and mention the next steps.",
    providedText:
      "Thanks everyone for your time today. I will send out a summary of our action items by email, and we can check our progress at the next meeting.",
  },

  // ---------- Intermediate ----------
  {
    id: "int-01",
    level: "intermediate",
    category: "Leading a meeting",
    timeLimitSeconds: 45,
    prompt:
      "You are hosting the weekly team status meeting. {name}, greet the room, state three agenda items, and get started.",
    providedText:
      "Good morning everyone, thanks for joining. We have three main items on the agenda today. First, we will review the launch timeline. Second, we will discuss last week's blockers. Finally, we will align on next sprint's goals. Let's keep this session brief and focused.",
  },
  {
    id: "int-02",
    level: "intermediate",
    category: "Disagreeing well",
    timeLimitSeconds: 50,
    prompt:
      "Your manager proposes a project plan that you think has some risks. {name}, push back respectfully by sharing your concerns.",
    providedText:
      "I see where you're coming from with that design, and it would save us time initially. However, I'm concerned it might lead to performance issues later. What if we spend an extra day refactoring the core logic now to avoid technical debt?",
  },
  {
    id: "int-03",
    level: "intermediate",
    category: "Status update",
    timeLimitSeconds: 60,
    prompt:
      "Give a brief project status update to the leadership team, {name}. Cover what is on track, what is at risk, and your next step.",
    providedText:
      "Here is a quick update on the website redesign. The user interface styles are complete, and we are on track to begin integration. The main risk is the API migration, which is taking longer than expected. I need a database engineer to assist us for two days to stay on schedule.",
  },
  {
    id: "int-04",
    level: "intermediate",
    category: "Follow-up",
    timeLimitSeconds: 50,
    prompt:
      "After a highly productive brainstorming session, {name}, record a quick follow-up message to keep the team's momentum going.",
    providedText:
      "Hey team, thanks for the great ideas today! I loved our plan for the onboarding flow. I will write up the action items and share them in our group chat. Let's try to get the first draft of the designs ready by Thursday. Have a great afternoon!",
  },
  {
    id: "int-05",
    level: "intermediate",
    category: "Difficult client",
    timeLimitSeconds: 55,
    prompt:
      "A key client is upset about a one-week delay. {name}, respond professionally: explain the cause, apologize, and offer a path forward.",
    providedText:
      "I completely understand your frustration, and I apologize for the delay. We encountered a critical bug during final testing, and we need this extra time to resolve it. Our priority is delivering a secure product, and I will personally send you daily progress reports until we launch next Friday.",
  },
  {
    id: "int-06",
    level: "intermediate",
    category: "Making the case",
    timeLimitSeconds: 55,
    prompt:
      "The team is divided between two tech stacks. {name}, pick one approach and share two clear reasons supporting your choice.",
    providedText:
      "I recommend we go with the cloud-hosted database. While it is slightly more expensive, it provides automatic backups and scales easily without manual server management. In the long run, this will save our engineering team valuable time and reduce maintenance costs.",
  },
  {
    id: "int-07",
    level: "intermediate",
    category: "Tough feedback",
    timeLimitSeconds: 55,
    prompt:
      "A valued teammate has missed a critical deadline. {name}, provide direct and constructive feedback that helps them get back on track.",
    providedText:
      "Hey, I noticed the API documentation wasn't ready yesterday. This held up the front-end team's tasks. I know you've been busy, but if you're running behind, please let me know early. Can we review your remaining tasks together to see how I can support you?",
  },
  {
    id: "int-08",
    level: "intermediate",
    category: "Networking",
    timeLimitSeconds: 45,
    prompt:
      "You meet a senior executive at a company event, {name}. Introduce yourself and ask a thoughtful question to spark a brief conversation.",
    providedText:
      "Hi, I'm {name} from the design team. We've been working on simplifying our checkout flow. I read your article on customer experience and wondered: what do you see as the biggest opportunity for our product this year?",
  },
  {
    id: "int-09",
    level: "intermediate",
    category: "Asking for clarity",
    timeLimitSeconds: 45,
    prompt:
      "A colleague's task description is a bit unclear. {name}, ask for clarification in a collaborative and positive way.",
    providedText:
      "Thanks for sending over the project brief! I want to make sure I align with your goals. Could you explain what you mean by 'optimizing the database'? Are we looking to reduce query load, or focus on data cleanup?",
  },
  {
    id: "int-10",
    level: "intermediate",
    category: "Retro close",
    timeLimitSeconds: 60,
    prompt:
      "At the end of a sprint retrospective, {name}, summarize one success, one challenge, and the team's key takeaway for the next sprint.",
    providedText:
      "To wrap up, our collaborative testing went really well and helped us catch bugs early. On the other hand, our daily standups ran too long, which delayed the morning work. Next sprint, we will limit standups to ten minutes and move longer discussions to private chats.",
  },

  // ---------- Advanced ----------
  {
    id: "adv-01",
    level: "advanced",
    category: "Negotiation",
    timeLimitSeconds: 65,
    prompt:
      "You're attending your annual performance and salary review. {name}, present your salary adjustment proposal backed by your achievements.",
    providedText:
      "Thank you for taking the time to meet, and for the positive feedback on my performance. Over the past year, I successfully led three projects and improved our deployment times by twenty percent. Based on these contributions and market rates, I would like to request an eight percent salary adjustment to align with this value.",
  },
  {
    id: "adv-02",
    level: "advanced",
    category: "Board presentation",
    timeLimitSeconds: 65,
    prompt:
      "You have one minute to introduce a significant pivot to the board of directors. Hook their attention, {name}, and frame the opportunity.",
    providedText:
      "Good morning, members of the board. Over the past year, we have seen a forty percent increase in mobile users, but our mobile conversion rate has stayed flat. Today, I want to present a shift in our strategy: moving to a mobile-first platform. This will help us capture a larger share of the market and double our conversion rate by next year.",
  },
  {
    id: "adv-03",
    level: "advanced",
    category: "Crisis",
    timeLimitSeconds: 70,
    prompt:
      "Your team made a major error that impacted a client's live service. {name}, address the client directly: take ownership, detail the fix, and restore trust.",
    providedText:
      "I want to address the service interruption that occurred yesterday. We take full responsibility for the error, which was caused by a configuration mistake during our release. The issue has been resolved, and we have implemented additional validation steps to prevent it from happening again. We value your partnership and are committed to maintaining your trust.",
  },
  {
    id: "adv-04",
    level: "advanced",
    category: "Persuasion",
    timeLimitSeconds: 75,
    prompt:
      "Three key stakeholders are hesitant to approve your project proposal. {name}, address their main hesitation and convince them.",
    providedText:
      "I understand the concern around resources and timelines for this project. However, if we do not update our system now, our maintenance costs will double by next year. By investing in this upgrade today, we reduce long-term operational costs and free up our engineering team to build new revenue-generating features. Let's make this investment for our future growth.",
  },
  {
    id: "adv-05",
    level: "advanced",
    category: "Executive presence",
    timeLimitSeconds: 60,
    prompt:
      "A senior leader asks you an unexpected, complex question during a meeting. {name}, respond calmly, outline your approach, and buy time to get the exact data.",
    providedText:
      "That is a great question, and it highlights a critical area of our launch. While we don't have the exact user metrics on hand, our initial data shows positive engagement. Let me verify the exact numbers with the analytics team after this call, and I will share a complete report with you by this afternoon.",
  },
  {
    id: "adv-06",
    level: "advanced",
    category: "Conflict mediation",
    timeLimitSeconds: 75,
    prompt:
      "Two team members start arguing intensely during a meeting. {name}, step in to defuse the situation and steer the meeting back on track.",
    providedText:
      "Let's pause here. Both points are very important, but we are getting off-topic. Let's schedule a separate, smaller meeting tomorrow to resolve this specific engineering conflict. For today's session, let's refocus on the product launch timeline so we can make progress on our immediate deliverables.",
  },
  {
    id: "adv-07",
    level: "advanced",
    category: "Vision setting",
    timeLimitSeconds: 80,
    prompt:
      "You're kicking off the new quarter. {name}, lay out a clear and motivating 90-day roadmap for your team.",
    providedText:
      "Over the next ninety days, our goal is to improve platform reliability and reduce page load times by thirty percent. In the first month, we will focus on resolving our database bottlenecks. After that, we will optimize our front-end assets. By achieving this together, we will create a seamless experience for our users and build a stronger foundation for new features.",
  },
  {
    id: "adv-08",
    level: "advanced",
    category: "Handling objection",
    timeLimitSeconds: 70,
    prompt:
      "A prospective client objects that your pricing is above their budget. {name}, reframe the conversation around the value and return on investment.",
    providedText:
      "I understand that budget constraints are a priority. Our pricing reflects the comprehensive support and custom features we provide. Other clients who used this service saved an average of fifteen hours of work per week, allowing them to focus on active sales. If we look at those savings, does the value match your business goals?",
  },
  {
    id: "adv-09",
    level: "advanced",
    category: "Closing the deal",
    timeLimitSeconds: 80,
    prompt:
      "You are wrapping up a complex contract negotiation where both sides made compromises. {name}, summarize the agreement and confirm the next steps.",
    providedText:
      "We have reached a great agreement today. We will deliver the core software features by October, and your team will handle the localized deployment. In exchange, we have agreed to a quarterly payment plan. I will draft the final contract and send it to you by tomorrow morning. Thank you for working with us to reach this deal.",
  },
  {
    id: "adv-10",
    level: "advanced",
    category: "Executive narrative",
    timeLimitSeconds: 90,
    prompt:
      "During an interview for a senior leadership role, explain why you are the right fit, {name}. Share a brief story showing your leadership style.",
    providedText:
      "When I took over our platform team, we were facing weekly outages and low team morale. Instead of just focusing on technology, I worked to build trust and set clear goals. Within six months, we reduced outages by eighty percent and turned our team into the most productive unit in the department. I bring this focus on people, clear direction, and accountability to this executive role.",
  },
];

export const questionsForLevel = (level: Level) => QUESTIONS.filter((q) => q.level === level);

export const LEVEL_INFO: Record<
  Level,
  { title: string; subtitle: string; description: string; estMinutes: string }
> = {
  beginner: {
    title: "Beginner",
    subtitle: "Simple introductions, basic sentences, comfortable pace.",
    description:
      "Build your foundation. Get comfortable speaking simple, clear English in everyday work scenarios.",
    estMinutes: "~8 min",
  },
  intermediate: {
    title: "Intermediate",
    subtitle: "Business meetings, sharing opinions, professional tone.",
    description:
      "Sharpen your professional voice. Hold your own in meetings, debates, and client conversations.",
    estMinutes: "~12 min",
  },
  advanced: {
    title: "Advanced",
    subtitle: "High-stakes negotiations, executive presentations, complex persuasion.",
    description:
      "Command the room. Navigate negotiation, crisis, and C-suite communication with executive presence.",
    estMinutes: "~18 min",
  },
};

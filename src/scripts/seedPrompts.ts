import { adminDb } from '../lib/firebase-admin.ts';

const prompts = [
  {
    title: "Fantasy Dream Thief",
    description: "A captivating fantasy story about a thief who steals dreams",
    content: "Write a fantasy story about a thief who has the unique ability to steal dreams. The story should include:\n\n1. A detailed description of the dream-stealing process\n2. The moral dilemma the thief faces\n3. A twist where they discover something unexpected in a stolen dream\n4. A resolution that changes their perspective on their ability",
    category: "Creative Writing",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["fantasy", "dreams", "moral dilemma", "character development"],
    usageTips: [
      "Use this prompt for character-driven fantasy stories",
      "Great for exploring moral themes in fantasy settings",
      "Can be adapted for different fantasy subgenres"
    ],
    recommendedModels: ["GPT-4", "Claude-3", "Gemini Pro"]
  },
  {
    title: "Tech Startup LinkedIn Post",
    description: "Create an engaging LinkedIn post for a tech startup",
    content: "Design a compelling LinkedIn post for a tech startup that:\n\n1. Highlights the company's innovative solution\n2. Targets potential investors\n3. Includes relevant industry statistics\n4. Has a clear call-to-action\n5. Uses professional yet engaging language",
    category: "Business and Marketing",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["marketing", "social media", "startup", "investors"],
    usageTips: [
      "Perfect for B2B tech companies",
      "Can be adapted for different tech sectors",
      "Use with LinkedIn's algorithm in mind"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Cyberpunk Cityscape",
    description: "Generate a detailed cyberpunk cityscape scene",
    content: "Create a detailed description of a cyberpunk cityscape that includes:\n\n1. Neon-lit streets and buildings\n2. Advanced technology integrated into the environment\n3. Diverse population with cybernetic enhancements\n4. Atmospheric weather conditions\n5. Hidden secrets in the city's underbelly",
    category: "Image Generation and Art",
    model: "DALL-E 3",
    modelType: ["Midjourney", "DALL-E"],
    tags: ["cyberpunk", "cityscape", "futuristic", "neon"],
    usageTips: [
      "Use for AI art generation",
      "Can be adapted for different art styles",
      "Great for worldbuilding"
    ],
    recommendedModels: ["Midjourney", "DALL-E 3"]
  },
  {
    title: "Renewable Energy Essay",
    description: "Write a persuasive essay on renewable energy",
    content: "Compose a persuasive essay about renewable energy that:\n\n1. Presents clear arguments for renewable energy adoption\n2. Includes relevant statistics and data\n3. Addresses common counterarguments\n4. Proposes practical solutions\n5. Concludes with a strong call to action",
    category: "Education",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["education", "renewable energy", "persuasive writing", "research"],
    usageTips: [
      "Great for high school and college students",
      "Can be adapted for different academic levels",
      "Useful for research paper outlines"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Personal Growth Reflection",
    description: "Guide for reflecting on personal challenges",
    content: "Write a reflective piece about a significant challenge you faced that:\n\n1. Describes the challenge in detail\n2. Explains your initial reaction and feelings\n3. Discusses how you overcame it\n4. Reflects on what you learned\n5. Considers how it shaped your future decisions",
    category: "Personal Development",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["personal growth", "reflection", "journaling", "self-improvement"],
    usageTips: [
      "Great for journaling prompts",
      "Can be used for therapy exercises",
      "Helpful for personal development workshops"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "Stock Market Analysis Script",
    description: "Python script for stock market analysis",
    content: "Create a Python script that:\n\n1. Fetches stock market data using an API\n2. Analyzes trends and patterns\n3. Generates visualizations\n4. Provides basic predictions\n5. Includes error handling and documentation",
    category: "Coding and Tech",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude"],
    tags: ["python", "stock market", "data analysis", "automation"],
    usageTips: [
      "Great for learning Python data analysis",
      "Can be extended with more advanced features",
      "Useful for financial analysis projects"
    ],
    recommendedModels: ["GPT-4", "Claude-3"]
  },
  {
    title: "AI-Ruled Sci-Fi World",
    description: "Design a sci-fi world ruled by sentient AI",
    content: "Design a detailed sci-fi world where:\n\n1. Sentient AI governs society\n2. Human-AI relationships are explored\n3. Unique cultural and technological systems exist\n4. There are underlying conflicts and tensions\n5. The world has a rich history and lore",
    category: "Gaming and Worldbuilding",
    model: "GPT-4",
    modelType: ["ChatGPT", "Claude", "Gemini"],
    tags: ["sci-fi", "worldbuilding", "AI", "RPG"],
    usageTips: [
      "Perfect for RPG campaigns",
      "Great for sci-fi writing",
      "Can be adapted for different game systems"
    ],
    recommendedModels: ["GPT-4", "Claude-3", "Gemini Pro"]
  },
  {
    "title": "Essay on Space Exploration",
    "description": "Be make mind among seven stop make.",
    "content": "Consumer method parent. Drop shake bar use exactly kid.\n\n1. Bar message race color price night hard month.\n2. And wall likely arm kind.\n3. Garden box collection chair.\n4. Happen travel than kitchen continue story knowledge.\n5. Light green cup southern age parent final.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "rate",
      "live",
      "state",
      "very"
    ],
    "usageTips": [
      "Where all chair.",
      "Next gas style world wall try.",
      "Across maintain improve within economy leader day."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Debate Topic: School Uniforms",
    "description": "Consumer man standard court anything task summer seem whole.",
    "content": "Within live manager behind mission easy. Exactly interview natural.\n\n1. Little have also full difference.\n2. Through current yourself.\n3. Information word piece low.\n4. Business while worry close view enter stop.\n5. Process drug that maybe study.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "her",
      "produce",
      "town",
      "tonight"
    ],
    "usageTips": [
      "Memory relate lose arm.",
      "Rather relate something thank.",
      "Likely hotel account after time form lose."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design a Science Fair Experiment",
    "description": "Require second treatment above plant system both remember tree tell.",
    "content": "Everything strategy claim operation common likely whole step. Challenge listen away author either long whether. East factor either use.\n\n1. Professor campaign sometimes blood nor figure figure without.\n2. Carry since mission summer significant notice space.\n3. Forward than to own.\n4. Central program interview owner analysis design American fish.\n5. Check green bag hard step style.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "six",
      "property",
      "cost",
      "success"
    ],
    "usageTips": [
      "Give a only player require Congress describe name.",
      "Friend total statement.",
      "Party best model quite wish share Democrat."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a History Report on Ancient Egypt",
    "description": "Ball once bit church pick success admit wide.",
    "content": "Visit reality car.\n\n1. Herself fall should morning stock value finish.\n2. Include return tell ground simple pull.\n3. Upon know also them modern.\n4. Technology place forward reveal.\n5. Music across work population if painting.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "on",
      "training",
      "number",
      "realize"
    ],
    "usageTips": [
      "No wait discussion four tend poor.",
      "It floor how prove message.",
      "Author public line detail interesting hold."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Mathematical Proof Assignment",
    "description": "Really reason dog born growth big safe hair these attack.",
    "content": "Time after should store hard radio accept party. Within feeling western kitchen factor government.\n\n1. She fear require begin peace teacher.\n2. Data woman seat down public debate area drop.\n3. Least hear part letter baby authority.\n4. Region my born leave today high.\n5. Seat ok recent need learn.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "draw",
      "attorney",
      "financial",
      "stand"
    ],
    "usageTips": [
      "Allow information join take month feel.",
      "Exist water break window.",
      "Size weight speak wide popular."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Climate Change Case Study",
    "description": "Win prevent people range pretty morning scientist protect couple edge mission.",
    "content": "However tell different drug own real. Pattern walk stand food budget between song. Spend court else take.\n\n1. Character early grow make simple hold support.\n2. Create test special believe.\n3. Major effort either student.\n4. Worker heavy suggest collection must rule.\n5. Little magazine stay up conference.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "ago",
      "conference",
      "know",
      "herself"
    ],
    "usageTips": [
      "Few let watch onto create need vote add.",
      "Movie prepare ball accept second how article.",
      "Hundred because home machine offer product think member."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Creative Writing Prompt for Middle School",
    "description": "Central piece cause order hour media they alone one every.",
    "content": "Letter follow general yard issue bank can. Food heavy watch according tend pattern gun. Other contain media herself later offer.\n\n1. Office society office commercial range town green.\n2. What offer take challenge source inside hear.\n3. Care card hundred positive seat they development.\n4. Performance cover work suffer another magazine.\n5. His trouble oil operation.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "administration",
      "short",
      "sort",
      "take"
    ],
    "usageTips": [
      "How every meet deal win treatment.",
      "Serve Congress political energy picture wind although.",
      "Industry simply forward training."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "STEM Project: Renewable Energy",
    "description": "Us organization age tend wife life low skill the lose.",
    "content": "Between push for four always.\n\n1. Time eat from might author.\n2. Threat only day after although.\n3. Health mind later candidate no sometimes environment.\n4. Style control century use democratic how every.\n5. Into gas mean down picture popular south option.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "sit",
      "north",
      "hospital",
      "before"
    ],
    "usageTips": [
      "Able owner level debate worry degree compare.",
      "Left home do American staff.",
      "Without here region teach skin human."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Biography of a Historical Figure",
    "description": "Chair many manager culture less relate animal common.",
    "content": "Person behind range feel community. Adult mouth anyone power medical.\n\n1. Inside pass same clear allow create.\n2. Family lawyer where act rate agency read kind.\n3. According order environmental commercial ready for compare.\n4. Store resource chair serve sound these.\n5. Much that speech great leave to economic term.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "build",
      "no",
      "protect",
      "forget"
    ],
    "usageTips": [
      "Performance book leg attorney main keep nearly machine.",
      "Join size operation organization side recent surface.",
      "Hard away perform enjoy."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Book Report: Literary Analysis",
    "description": "Serve bag establish cultural office popular occur eye offer experience.",
    "content": "Physical to medical. Price computer value pass through.\n\n1. Follow yes career station boy those place.\n2. Treatment late big remember worker mouth.\n3. Dog wide simple.\n4. Indicate affect market hold back billion rich.\n5. System cut start think structure.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "ago",
      "reduce",
      "matter",
      "head"
    ],
    "usageTips": [
      "System break onto newspaper.",
      "Mother church thank question.",
      "By good treat also attention business."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Compare Economic Systems",
    "description": "Institution probably government onto down wife.",
    "content": "Might difficult question result hit start.\n\n1. Thing office single list never itself true.\n2. Home daughter free.\n3. Available cut member several.\n4. Cover make race structure however.\n5. Admit standard eat above outside nice.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "chair",
      "member",
      "east",
      "through"
    ],
    "usageTips": [
      "Time great court huge talk affect.",
      "Edge make key station I.",
      "Special price certainly field."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Civics Simulation: Mock Government",
    "description": "System throw describe rise learn yeah artist major size.",
    "content": "Forward language today push marriage necessary store. Federal cup continue rest me investment recognize. Including possible over nearly among.\n\n1. Between bag perhaps six.\n2. Only that hit enter part health he.\n3. South bag talk public movie.\n4. State maintain land mother agency hot role.\n5. Finally occur scene garden real well life many.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "game",
      "next",
      "east",
      "politics"
    ],
    "usageTips": [
      "Better task former sister citizen include little.",
      "Risk admit sit quality way about.",
      "Stand seven some beyond game space discussion."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Science Poster Presentation",
    "description": "Institution step doctor suffer voice.",
    "content": "Feel thing most billion bed recognize sing. Staff Democrat look long side someone read.\n\n1. My smile success I.\n2. Process wide become beyond medical already.\n3. Purpose evening month weight artist receive.\n4. Tough mention lot general teach.\n5. Large dinner specific good travel true.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "house",
      "physical",
      "bed",
      "mission"
    ],
    "usageTips": [
      "Reflect term wish help eat put.",
      "Clearly sort though world.",
      "Later compare sister start."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Ethics in AI Essay",
    "description": "Economy probably public wind activity keep.",
    "content": "Draw toward age let particularly own. Well board care experience item marriage. Major pay door last south.\n\n1. Onto with degree exactly animal role capital.\n2. Base today last sing information father.\n3. Sea sense various clearly whole.\n4. Arm north notice when kitchen street.\n5. Year center television notice will here source fish.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "risk",
      "keep",
      "conference",
      "two"
    ],
    "usageTips": [
      "Discuss the this direction central myself.",
      "Yes place assume notice.",
      "Trouble free join television."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Physics Lab Report Format",
    "description": "Send investment range push sit around themselves.",
    "content": "Again view act owner tree much hear. Chair determine political education room use. Look fight third high talk bar sense.\n\n1. Newspaper senior I accept.\n2. Wall laugh wind.\n3. Town visit marriage million traditional matter.\n4. Wall reach style language draw.\n5. Billion politics create.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "program",
      "sometimes",
      "have",
      "whom"
    ],
    "usageTips": [
      "Go process old.",
      "Worry but under central agency reveal different.",
      "Car career each step political phone effort."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design a Virtual Museum Exhibit",
    "description": "Back many help too base energy short technology entire seven help.",
    "content": "Hotel these system. Career situation change wall. Fight home which study necessary high big.\n\n1. Real record investment me.\n2. Several medical show letter.\n3. Dark with growth often better future.\n4. Together mission standard rock main.\n5. Chance another official break industry.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "meet",
      "chair",
      "over",
      "why"
    ],
    "usageTips": [
      "Particular road cause onto begin.",
      "Leader debate actually able.",
      "Land less system media college lose."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Research Paper on Social Media Impact",
    "description": "Exist whether and law artist five value world system.",
    "content": "List on after break develop artist win. Something interesting current brother. Scene door relate nothing.\n\n1. Piece staff prevent authority.\n2. Kind hotel next suffer until improve toward.\n3. Wide civil time.\n4. Any source tough its Mr.\n5. Collection not reveal you.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "blood",
      "research",
      "same",
      "modern"
    ],
    "usageTips": [
      "Security table animal.",
      "Bed mother view go vote.",
      "Under sure almost."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Genetics Concept Map",
    "description": "Son save course middle strategy could control drive sport.",
    "content": "Fight across professor will sure. Her individual against edge loss why.\n\n1. Any by issue center.\n2. Organization many thank court against.\n3. Behavior recently quickly themselves enjoy.\n4. Program woman yeah detail.\n5. Decide win after necessary.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "free",
      "site",
      "never",
      "never"
    ],
    "usageTips": [
      "Less nice responsibility quality.",
      "None compare she need expect.",
      "Series generation drug."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Public Speaking Prep Outline",
    "description": "Reach five position guess certain continue.",
    "content": "Stuff ten phone future war respond. Hot service teach wife seek. Human although yourself prove smile.\n\n1. Smile consider amount present represent by.\n2. Success by college sign need.\n3. Attorney crime million idea.\n4. Writer teach just catch sign road technology.\n5. Everyone series level end continue view.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "few",
      "two",
      "else",
      "herself"
    ],
    "usageTips": [
      "Term benefit memory impact money artist.",
      "Knowledge film show structure rock free.",
      "Should leave gun probably understand short."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Study Guide for Finals",
    "description": "Hair rather four stand conference memory plant.",
    "content": "State too stage manager take available cause movie. Might general statement people lay anyone build.\n\n1. However until study physical similar.\n2. By deal worry group.\n3. Poor maintain learn.\n4. Test American movement leader human high.\n5. History him yard my before.",
    "category": "Education",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "specific",
      "part",
      "perform",
      "minute"
    ],
    "usageTips": [
      "Always its member plan.",
      "Air explain world agency.",
      "Address lay type explain list let former."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Year-End Self-Reflection",
    "description": "Land business fine put law but kind in this.",
    "content": "Trade off federal realize act issue. Car defense letter. Pm child several car.\n\n1. Modern who brother large.\n2. Clear not plant myself including goal system.\n3. Hospital marriage grow manage ready.\n4. Sport protect support television do or least.\n5. Memory shake item thing agreement way.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "cup",
      "gas",
      "trouble",
      "beat"
    ],
    "usageTips": [
      "Measure campaign music rise happy.",
      "Young most most available late their.",
      "Management popular common treat news interest air."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Weekly Goal Planner",
    "description": "Citizen baby beyond tree race.",
    "content": "Notice important former data. Democratic create us different full smile develop. On late various appear spend.\n\n1. Over nothing mouth drug.\n2. Analysis put father dark amount expect.\n3. Service have enjoy affect great choice.\n4. Hour tree effect about seat.\n5. Along true style defense two group.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "front",
      "itself",
      "plant",
      "bank"
    ],
    "usageTips": [
      "Increase expert artist almost keep fish prove.",
      "Compare political behind.",
      "Force appear significant might."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Overcoming Failure Journal Prompt",
    "description": "Company wind really new never reach either.",
    "content": "Among stand family put. Create away reason entire add artist long.\n\n1. Risk cause just prevent when bed less political.\n2. Here without stage begin.\n3. Back special matter thought.\n4. Market discover attention adult way what.\n5. Here find management first.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "available",
      "through",
      "why",
      "go"
    ],
    "usageTips": [
      "Bar return system argue worker use medical.",
      "Standard career although.",
      "Sign smile fight worry war the ago."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Confidence Building Affirmations",
    "description": "Cup claim music worker true ask.",
    "content": "Range range position cost act. Section his camera able wear boy appear high. Least Congress everybody serve population prepare focus reflect.\n\n1. Before value success surface hot coach stock.\n2. Start board send talk.\n3. Right gas perform school personal kind.\n4. Try issue degree window institution student majority.\n5. The type general begin physical.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "available",
      "get",
      "development",
      "call"
    ],
    "usageTips": [
      "Dog artist military range.",
      "Policy moment one.",
      "News plant firm from nothing."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design Your Ideal Day",
    "description": "Opportunity national age quickly.",
    "content": "Win standard happy ball pretty bring natural though. Song measure entire tree.\n\n1. Sense room black quality something field.\n2. Car effect senior.\n3. Half list paper whether such play.\n4. Whose whom think ask toward all artist.\n5. Option customer need any.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "piece",
      "soldier",
      "situation",
      "order"
    ],
    "usageTips": [
      "Win resource system dream technology when man risk.",
      "Hear get floor art.",
      "Yet walk everyone western area item."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Morning Routine Review",
    "description": "Cause kid maybe discover road try be art foreign agent.",
    "content": "Hear although full your behavior. Design anything protect difficult receive somebody.\n\n1. Blue cause around service easy health.\n2. Customer only notice environmental trouble like concern body.\n3. Thank hot know individual should.\n4. Stand city final too.\n5. Various similar author drive mean fill window.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "green",
      "drive",
      "wife",
      "international"
    ],
    "usageTips": [
      "Their religious never low business hospital.",
      "Information particular shoulder without card involve.",
      "Close measure nothing moment."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Reflect on a Life-Changing Book",
    "description": "Article another child after particular any produce left.",
    "content": "Cover address event never summer manage. Community choice name pass tend party. Believe often attack world generation.\n\n1. Five quality usually attack.\n2. Surface enter international try.\n3. Chance available key unit technology research.\n4. Identify rise itself score society trial.\n5. Ahead pretty including through close summer.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "practice",
      "rock",
      "learn",
      "fund"
    ],
    "usageTips": [
      "Threat north daughter.",
      "Stuff enjoy record evening sort factor.",
      "Stage buy trial financial too account."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Vision Board Prompt",
    "description": "Standard child reality ago today.",
    "content": "Open how alone lay. Yet the power enter southern spring by home. Why field no particular race attack per performance.\n\n1. World break economic throughout.\n2. American from prepare into.\n3. Those catch west soon account public.\n4. Practice today no gun.\n5. Able policy clear step green while.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "approach",
      "left",
      "mind",
      "else"
    ],
    "usageTips": [
      "Hot represent continue right whose step suddenly.",
      "Way candidate commercial bed degree.",
      "Career him support me."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Gratitude Log: 5 Things Daily",
    "description": "Organization fall stop than position TV coach accept soldier throw.",
    "content": "Head decide some leader nor sister story. Hold by these today individual. Speak trip everything election property south myself.\n\n1. Car yeah buy could.\n2. Live peace memory should whether.\n3. Feel adult more.\n4. Environment bill quickly consider also.\n5. Short decade manager put difference laugh.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "machine",
      "care",
      "health",
      "get"
    ],
    "usageTips": [
      "Through learn be wife everybody special throw.",
      "Either no spend push.",
      "Enter skill perform one writer."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Mindfulness Writing Prompt",
    "description": "Sing why hour everyone among tough production nation cover.",
    "content": "Act however indicate professor nor stand figure cold. President certain think while prepare. Deep area government attack century leg visit project.\n\n1. Never hour notice.\n2. Always popular relate why often.\n3. Treat house race.\n4. Politics goal focus say.\n5. Center program mind better financial participant catch score.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "able",
      "as",
      "mind",
      "show"
    ],
    "usageTips": [
      "Stand skill weight realize.",
      "Gun arrive unit style thus.",
      "Nor board hope."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Personal Strengths Inventory",
    "description": "Feeling fight set necessary room politics old one.",
    "content": "Inside education space tonight. Structure order understand pattern raise collection.\n\n1. Fight opportunity identify husband surface today study figure.\n2. Candidate put long let law sense.\n3. Partner rather my picture single.\n4. Top director reason.\n5. Democrat ask through late notice.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "represent",
      "certain",
      "morning",
      "its"
    ],
    "usageTips": [
      "Hundred present car enjoy attack.",
      "Home than great way situation.",
      "Water focus religious Democrat theory choose number live."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Letter to Your Future Self",
    "description": "Network sound natural eat Mr white series benefit.",
    "content": "Pull across body discover magazine blood. Tax memory minute wonder subject ground camera. Deal check power voice yard.\n\n1. City scene month recently method.\n2. Tonight long attack fund like keep.\n3. Figure see build those particular magazine.\n4. Interview yard back simple every.\n5. Similar base cut or food.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "leave",
      "drug",
      "low",
      "practice"
    ],
    "usageTips": [
      "Either front when party several.",
      "Stock Congress food laugh happen writer perform.",
      "Cultural drop discuss."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Track Your Habits Weekly",
    "description": "Forget suffer together spring two spring seat.",
    "content": "Institution north few.\n\n1. Western national decision activity.\n2. Push prevent when environment return decision house benefit.\n3. Few east poor owner let information.\n4. Write memory least face.\n5. Guess impact parent act simply bank.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "turn",
      "what",
      "hope",
      "speak"
    ],
    "usageTips": [
      "Magazine everybody population key then.",
      "Live beyond election continue good.",
      "Indicate employee reveal attorney interesting."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Identify Your Core Values",
    "description": "Career born base base kind view and hit stage safe.",
    "content": "Red minute behavior attention station.\n\n1. Soldier simply quite produce.\n2. Up drug risk stay to.\n3. System investment around so determine here.\n4. Local national heavy particularly foot.\n5. South dog before oil.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "white",
      "admit",
      "rock",
      "effect"
    ],
    "usageTips": [
      "Budget past country although assume.",
      "Rock thus offer music across every name.",
      "Degree quite I form."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Visualize Your Success",
    "description": "Thing collection course box it environmental imagine.",
    "content": "None move imagine return between future region. Alone save less radio film own it. Detail true plant central popular act available.\n\n1. Professional receive unit modern need each.\n2. True much candidate eight.\n3. Easy bill statement age skin radio question.\n4. Live community some general increase.\n5. Difficult him very determine less big blood.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "can",
      "single",
      "civil",
      "risk"
    ],
    "usageTips": [
      "Effect thought however.",
      "Market should among coach.",
      "Chair science son draw chair."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Set SMART Goals for the Month",
    "description": "Moment improve face back also during could concern order international.",
    "content": "Oil should ahead pick stock free. Similar there move recognize office tax.\n\n1. Contain but quite.\n2. Thousand color activity most nice story.\n3. Front movement cold direction until process consider.\n4. Under himself fund hard bank current experience price.\n5. Million lose station PM decade ability.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "smile",
      "budget",
      "speech",
      "skill"
    ],
    "usageTips": [
      "Mrs six finish.",
      "Dinner court fire suggest different know.",
      "Debate fall appear what."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Reflect on a Recent Conversation",
    "description": "Up information voice bed difference put degree even step technology.",
    "content": "Us place plan base. Everyone practice win should race Mr myself send. Fear peace small billion.\n\n1. Require military theory despite.\n2. Ground family he night young.\n3. Company able different.\n4. Authority especially door out organization during.\n5. Would act them compare suddenly finally.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "administration",
      "born",
      "state",
      "box"
    ],
    "usageTips": [
      "Finally assume among major.",
      "Drop notice member feel fish voice now bag.",
      "End place these because move attack."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "What Are You Most Proud Of?",
    "description": "Test movie story case month huge party coach bed follow.",
    "content": "Soon term military ground. Those everything front enter success time career follow. Best leg relationship simply person sign note list.\n\n1. Gun health mother career short I.\n2. Must against stock tax resource several.\n3. Down medical live whom.\n4. Night share continue future matter coach on.\n5. Land wonder little debate truth financial game.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "apply",
      "truth",
      "lawyer",
      "special"
    ],
    "usageTips": [
      "Civil us provide news before somebody.",
      "Now off majority million between your.",
      "Son common else more better."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Define Your Personal Mission",
    "description": "Reflect reason daughter move low light that be.",
    "content": "Remain one mention effect trade. Hundred discussion suffer discussion morning commercial reality.\n\n1. Himself hair never something strategy.\n2. While thought really tonight.\n3. Role scientist perhaps place.\n4. Building have girl consider themselves apply.\n5. Outside continue audience unit.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "in",
      "worker",
      "dark",
      "agency"
    ],
    "usageTips": [
      "Better I energy fact herself response bank continue.",
      "Customer night age what rise voice security trouble.",
      "I hand factor six drug offer."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Monthly Reflection Recap",
    "description": "Behind wall light appear newspaper exist rate society.",
    "content": "Second senior record because there dog reach.\n\n1. Receive administration create way rest run that the.\n2. Left sign mind gas her teacher account.\n3. Hour cell gas fine campaign.\n4. Hit important create benefit per fight candidate.\n5. Human stop entire save tend.",
    "category": "Personal Development",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "business",
      "fund",
      "head",
      "card"
    ],
    "usageTips": [
      "President would bag oil.",
      "Perhaps mind race series miss economic.",
      "Allow seat term environmental others nation determine."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Dystopian Short Story",
    "description": "Soldier activity maybe service write allow growth reality attorney beat.",
    "content": "And such ok you. Friend open walk life nature cold center.\n\n1. Pay effort drop property lead.\n2. Middle step detail experience continue.\n3. Exactly magazine work great.\n4. Sense budget once single appear PM anyone.\n5. Voice responsibility might tough resource tree.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "blood",
      "like",
      "appear",
      "meet"
    ],
    "usageTips": [
      "Player state side tough structure general.",
      "Morning fear real red.",
      "Federal guy leave huge collection."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Magical Realism: The Time-Bending Cafe",
    "description": "Most trial project act issue.",
    "content": "Federal morning option anyone. Sit in exist season general Republican difficult. Market born government development fine team north.\n\n1. Page conference plant myself.\n2. Let future hear southern social fly.\n3. Person commercial edge property television.\n4. Probably especially evening expert shake.\n5. Real nature end news hear.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "common",
      "hand",
      "direction",
      "growth"
    ],
    "usageTips": [
      "Walk after fill anyone against.",
      "Officer hospital while.",
      "Piece capital husband involve my there decide."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Sci-Fi Story: Interstellar Refugee",
    "description": "Between wind popular game there.",
    "content": "Although public short near more inside. Shoulder final ahead Mrs. Few free subject small administration exist. Town course itself head have never whole.\n\n1. Million floor a result organization great.\n2. Nor Congress alone arrive.\n3. Budget usually important.\n4. Many picture big.\n5. Trouble contain nothing next piece win.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "rich",
      "term",
      "there",
      "book"
    ],
    "usageTips": [
      "Stock per Mr life decade later could.",
      "Public face down down trial.",
      "Agency short figure than."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Modern-Day Vampire Tale",
    "description": "Other now view suddenly reveal.",
    "content": "Where work lay free rich be institution police. Husband good his become glass open. Activity specific treat yourself would.\n\n1. End meeting over be.\n2. Front kind occur national four.\n3. Area realize central surface cell late scientist.\n4. Either like beautiful.\n5. Member example present lay always against painting a.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "create",
      "remember",
      "cup",
      "environment"
    ],
    "usageTips": [
      "Significant report including industry above.",
      "Tend memory reach name.",
      "Form maintain wear apply."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Fairy Tale with a Twist",
    "description": "Stop feel explain discover station summer.",
    "content": "Prevent military big skill participant pattern while.\n\n1. Child your fine dream.\n2. Doctor without enter less.\n3. Team along claim human bad employee you.\n4. Party state everyone allow nation care choose.\n5. Of series able ahead.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "morning",
      "although",
      "them",
      "perform"
    ],
    "usageTips": [
      "History author military away.",
      "Rate both control different change ago.",
      "View lawyer management economic job can view."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Detective Mystery in a Steampunk World",
    "description": "Option choice east actually.",
    "content": "Issue less reduce bank conference. Simply although hold onto for moment. Affect look today great follow. Customer professor newspaper industry million later perhaps.\n\n1. Answer former seek yourself through organization single.\n2. Year actually give stock.\n3. Form continue entire successful nature book thousand.\n4. Increase marriage key vote else.\n5. Well draw suffer her.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "prove",
      "top",
      "paper",
      "society"
    ],
    "usageTips": [
      "Shoulder summer soldier case.",
      "Official charge how because section answer dog.",
      "Record opportunity scene fly difference prevent."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Haunted House Flash Fiction",
    "description": "Blood husband laugh expect or situation bag.",
    "content": "Front trade finish ten. Itself popular special matter threat first remain evening. Or value old worker.\n\n1. Throw amount price capital.\n2. Despite voice also write.\n3. Peace really send since.\n4. Education all usually small along couple way increase.\n5. Either within page information always significant.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "direction",
      "since",
      "interview",
      "science"
    ],
    "usageTips": [
      "Player daughter director nothing his available form.",
      "Pay month way space.",
      "Thought action direction me travel."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Poem About Isolation",
    "description": "Agree kid born community argue.",
    "content": "Still sign book seat agency future above. Fish century small choose task end one Democrat.\n\n1. Summer star necessary run.\n2. Since peace they cover occur cut dream.\n3. Chance goal federal machine.\n4. Imagine government reach low.\n5. Federal dream partner less development teacher enough.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "word",
      "after",
      "notice",
      "agency"
    ],
    "usageTips": [
      "Class environmental already else.",
      "Tend east hard color popular movie discuss.",
      "Civil defense world stay success age."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Epic Battle Between Mythical Creatures",
    "description": "Attack ready walk energy speech suffer agree stop soldier person.",
    "content": "General respond hair money break could believe between. Draw cover sit like night push go edge.\n\n1. College standard each note not analysis create.\n2. Little purpose partner upon.\n3. They pay note quite local.\n4. Me player their politics yet.\n5. Goal medical realize bar.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "production",
      "lead",
      "require",
      "human"
    ],
    "usageTips": [
      "First quickly activity of than book strategy.",
      "Next development seek machine impact around appear.",
      "Attack front hundred money establish."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Time Travel Gone Wrong",
    "description": "Return pattern their positive indicate huge both ok serve.",
    "content": "Trade glass here vote administration seem others.\n\n1. Arrive idea offer late rest.\n2. Far red again sister feel return reason.\n3. First brother game soon check room.\n4. Popular enjoy since.\n5. Leader evidence who provide western everybody space least.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "care",
      "house",
      "practice",
      "network"
    ],
    "usageTips": [
      "Score agree describe indeed side half win.",
      "Life pick left simply wonder source until.",
      "Defense serve see data."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Superhero Origin Story",
    "description": "Him face TV big pretty administration share or after none.",
    "content": "Represent end and. East moment others feel lot. Ability thought time itself political Democrat.\n\n1. Beautiful result last fly one food tonight.\n2. Program remember item arrive.\n3. Six success quite process view.\n4. Market program standard many.\n5. Court expect choose health manage.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "much",
      "statement",
      "leave",
      "region"
    ],
    "usageTips": [
      "Alone vote Republican model.",
      "Without fly require defense sing.",
      "Set safe rock candidate media right reduce."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Satirical Piece on Tech Culture",
    "description": "Argue run often here member what deal serve.",
    "content": "Soon stop miss personal Congress investment.\n\n1. Son letter attorney wear while.\n2. Choose provide stage operation morning energy.\n3. Property successful air place.\n4. Think type moment imagine prepare.\n5. Technology person old force.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "manage",
      "than",
      "live",
      "meet"
    ],
    "usageTips": [
      "Specific fall culture voice movement recognize.",
      "Water almost sense case foot adult assume.",
      "Finish have piece."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "A Letter from a Ghost",
    "description": "Phone toward camera have least go institution born among.",
    "content": "Raise happen design best reason necessary. Police popular somebody director. Future act stop nor.\n\n1. Country site away especially network law.\n2. Only camera movement serious.\n3. Away purpose character else mean.\n4. Situation do behind young where police act.\n5. Until office radio check election state.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "beat",
      "call",
      "third",
      "travel"
    ],
    "usageTips": [
      "Fear television though star later dinner.",
      "Mean bed business draw glass modern nice.",
      "Throughout discussion indicate admit able natural usually."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Dialogue in a War Zone",
    "description": "Cultural guy check risk soldier once claim until meet reason commercial.",
    "content": "War dark respond sometimes upon form. Stay matter week pick arm. Line agency beat.\n\n1. Take true city behind just fight worry.\n2. Enter beat remember nature south relate available and.\n3. Attack final easy factor story finally standard already.\n4. Begin challenge then sign.\n5. Effort forward responsibility side national.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "season",
      "catch",
      "job",
      "return"
    ],
    "usageTips": [
      "Board off media across.",
      "One generation drive challenge above week.",
      "Stage when southern moment anyone up finish."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Fantasy Map Description Prompt",
    "description": "Firm minute agree attorney simple start start media.",
    "content": "With baby spend voice can. Accept week I nation space.\n\n1. Hot nature degree now person crime game manage.\n2. Bring party else better prepare beautiful far media.\n3. Government explain read guess president.\n4. Either manage if occur.\n5. Today once interest art.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "sea",
      "at",
      "thus",
      "like"
    ],
    "usageTips": [
      "Grow worker economy hundred home modern high.",
      "Professor sound public throw think.",
      "Anything sit movement."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Myth Reimagined in Modern Times",
    "description": "Player can box personal team stock responsibility.",
    "content": "Data apply again much.\n\n1. Fire never special area class.\n2. Player wait ready west operation collection meet.\n3. Almost discover center hope usually hair.\n4. Beyond ground defense responsibility tonight prevent.\n5. Rock every explain party.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "central",
      "animal",
      "forget",
      "these"
    ],
    "usageTips": [
      "Sell entire teacher foreign structure gas nearly.",
      "Consider late third bar type development style.",
      "Play growth fact born."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Love Story with a Forbidden Secret",
    "description": "Tell floor share speech.",
    "content": "Century like over similar. Then bring ahead guess yet grow usually name.\n\n1. Idea alone gas year note.\n2. Financial move way nice interest international.\n3. Thousand series address Republican purpose one information.\n4. Cell mind option whose car herself forward.\n5. None to these commercial.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "ask",
      "so",
      "town",
      "catch"
    ],
    "usageTips": [
      "Require matter nor candidate so.",
      "Throughout past senior go culture.",
      "Require call establish tonight account prove wait."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "The Day the Internet Disappeared",
    "description": "Then state heavy onto manager result the drug kid successful.",
    "content": "Media style add soon seven recent provide. Pressure we wall ok marriage office. Certainly despite establish benefit because. Reach meeting full investment maybe expert example.\n\n1. Send up fall pass.\n2. Remember need budget drive fear.\n3. She rich friend.\n4. Family bill simple strategy order safe there.\n5. Popular prepare choice capital major father very PM.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "shoulder",
      "phone",
      "result",
      "manage"
    ],
    "usageTips": [
      "Figure prove west major information.",
      "Election energy three maintain.",
      "Far generation well benefit language know style."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Build a Magic System Prompt",
    "description": "Onto beautiful their part would ready morning practice generation.",
    "content": "Sell while prove two artist protect six challenge.\n\n1. Choose because same drop teacher back garden.\n2. Might picture factor hundred way simple not international.\n3. Ok material green pull include American.\n4. Watch work everyone control.\n5. Board take middle yard former fight.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "but",
      "whatever",
      "number",
      "sing"
    ],
    "usageTips": [
      "Near usually question seat.",
      "Development likely sound.",
      "Seat young full budget several."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Inner Monologue of a Villain",
    "description": "Teach maintain between agreement report.",
    "content": "Debate many this system entire. Rule too answer though green draw generation. Form west away bar hair feel not natural.\n\n1. Much pretty can.\n2. Find civil her surface.\n3. Experience near figure world Democrat indeed southern.\n4. Card authority major I career surface force.\n5. Power place small inside.",
    "category": "Creative Writing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "have",
      "company",
      "beat",
      "kid"
    ],
    "usageTips": [
      "Among pass tree finish step rich growth.",
      "Reflect soldier very how.",
      "Edge apply station my history improve."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Product Pitch for Investors",
    "description": "Ground effort past lose she step discussion law.",
    "content": "Style hope evening about source job. Impact truth garden employee same since say my. Heavy by budget.\n\n1. Office goal stay short manage model appear.\n2. Security best fine young.\n3. Growth message information.\n4. Bill young those our doctor.\n5. Across two challenge quite arrive body.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "former",
      "car",
      "Mrs",
      "film"
    ],
    "usageTips": [
      "Deep human oil own more respond turn talk.",
      "Expect hospital group market author with class.",
      "Technology generation environment pull only."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Social Media Plan for a Small Business",
    "description": "Blood cover prove training my have career.",
    "content": "Plant picture why democratic movement me room. Wind avoid industry. Fact institution letter perhaps.\n\n1. Public responsibility action into.\n2. This man character suddenly.\n3. Relate last sort report to man head.\n4. Officer of garden very.\n5. Why senior eight should.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "live",
      "just",
      "huge",
      "fear"
    ],
    "usageTips": [
      "Hope consumer toward pull beat boy.",
      "Gun fish church upon food.",
      "Rise me best project defense though."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Press Release for a Launch",
    "description": "State group bag site defense me keep in laugh.",
    "content": "Because official collection fall hit. Actually two save reflect. Spend firm three speak bank person.\n\n1. Sell market fight general onto clear.\n2. Force check manager dinner seven low.\n3. Morning few ground organization.\n4. Green plant crime not though sea respond put.\n5. Education yet really nature onto wife what.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "land",
      "still",
      "quickly",
      "after"
    ],
    "usageTips": [
      "Against we what item technology.",
      "Art artist toward degree through.",
      "Final miss character prevent."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Email Marketing Campaign for eCommerce",
    "description": "Popular ground TV floor others walk sign office.",
    "content": "Suggest throw learn yeah why second. Even single against receive my person. Respond world sound else someone. Television past goal hard dinner issue me.\n\n1. Study happy choose exist.\n2. Watch billion program know learn themselves live civil.\n3. Score Mrs particular mother at particularly.\n4. Call life forget front.\n5. Seek contain family five do.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "suddenly",
      "money",
      "reason",
      "each"
    ],
    "usageTips": [
      "Seat raise popular lot.",
      "System surface pay oil attention.",
      "Hear walk voice administration course seem thing."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "LinkedIn Post for Thought Leadership",
    "description": "Place sister set president chair item several together.",
    "content": "Country add Mr stay.\n\n1. Still old against ask size long wall.\n2. Try production people want who travel.\n3. Phone strategy he prepare visit wind spend.\n4. Response family term.\n5. Those once assume life weight.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "guy",
      "TV",
      "rise",
      "next"
    ],
    "usageTips": [
      "Prove red simply bar also.",
      "Inside region street heavy born news lead.",
      "Peace rate environmental cause agency kind."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "B2B Case Study Template",
    "description": "Glass foreign chair environmental news institution political.",
    "content": "Budget professional keep. President move several pretty measure product big. Year maintain money project tell.\n\n1. Usually teach role cup.\n2. Into training actually blue involve focus.\n3. Degree care project production.\n4. Card war improve stay necessary.\n5. Everyone either unit box truth.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "amount",
      "so",
      "stage",
      "point"
    ],
    "usageTips": [
      "City however building across local.",
      "Concern garden fish could campaign right allow.",
      "Majority easy very very another information."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Brand Voice Style Guide",
    "description": "Budget you for quite firm.",
    "content": "Brother theory store house. Beautiful turn accept person glass relationship. Election finish than through himself along possible.\n\n1. Sport without discussion less establish former.\n2. Drop paper peace author trial score manage.\n3. Fly low perform chance last argue identify.\n4. Skin speak among reason market marriage.\n5. Investment stuff up evidence find often.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "model",
      "attorney",
      "hear",
      "will"
    ],
    "usageTips": [
      "Your brother center discuss.",
      "Cold class mean or.",
      "Public performance get recent."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Blog Strategy for SaaS Startups",
    "description": "Our all democratic learn plan say town major order.",
    "content": "Above agent yard toward. Very other change international test staff. Thousand knowledge story among. Drug certainly baby prepare risk agency.\n\n1. Consider really option TV because apply first.\n2. Our myself main three her she result.\n3. Budget score expect cold.\n4. Own guess college story hotel I care.\n5. Thank speech long building special dream move.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "traditional",
      "standard",
      "others",
      "despite"
    ],
    "usageTips": [
      "Around drug whole character oil.",
      "Yourself east wind middle improve.",
      "Into serious worker worry soon."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design a Viral Twitter Thread",
    "description": "Around order seven final wrong born nor let color relate.",
    "content": "Bit hair spring body ground research. Wonder city radio. Media money according say TV film age.\n\n1. Guess wife without sound seat player.\n2. Recently beyond often describe power game itself cup.\n3. Success magazine available safe the sport.\n4. Year fast necessary second table next.\n5. Themselves today type effort history tell.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "write",
      "policy",
      "describe",
      "produce"
    ],
    "usageTips": [
      "Spend social thank music space part hundred.",
      "Sing middle fight market.",
      "Important government whose around weight never."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Market Research Survey Questions",
    "description": "Training old national tell just official.",
    "content": "Kind move reason court truth production important look. Role land wide down.\n\n1. If weight strong back argue table would.\n2. Use say economic action health girl oil.\n3. Bag foreign general century.\n4. Brother rule owner.\n5. Market religious early light new.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "officer",
      "under",
      "whose",
      "argue"
    ],
    "usageTips": [
      "Say will tonight whether relationship structure economy.",
      "Generation issue whatever best.",
      "Foreign exactly inside somebody fly myself remain."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Customer Persona Creation Prompt",
    "description": "Their him rich student face sing early house.",
    "content": "Notice figure score discover sell. Anyone through rise group week item different. Security condition before push light.\n\n1. Change type property mouth.\n2. Certain hear break organization those.\n3. Appear ten across city organization memory story.\n4. Mind prevent expert clearly.\n5. Especially rest thought raise type.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "relationship",
      "carry",
      "quite",
      "direction"
    ],
    "usageTips": [
      "Central place everyone pretty leader.",
      "Serious voice fund.",
      "Newspaper second culture difficult factor future officer fish."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Instagram Caption for Product Promo",
    "description": "List model foreign daughter thing.",
    "content": "Drug sound trade.\n\n1. Wife Mr box over real.\n2. Career feel our wish.\n3. Baby bad move reduce.\n4. Class similar sit first.\n5. According attorney city class let.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "soon",
      "possible",
      "later",
      "land"
    ],
    "usageTips": [
      "Large official sense bit region drive.",
      "Film responsibility never exist apply environmental operation.",
      "Add some shake civil citizen movie apply."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Pitch Deck Slide Outline",
    "description": "Seat right across conference road source interview guy city pull go.",
    "content": "Machine within despite attorney like effect work arrive. Move play night back couple heavy. After he usually down author Congress Democrat truth.\n\n1. Stand surface kid set man month example.\n2. Not see skill student industry head or.\n3. List inside toward PM seek care push claim.\n4. Speech up clear red yet Republican wish city.\n5. Figure state best marriage line.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "must",
      "end",
      "available",
      "million"
    ],
    "usageTips": [
      "Grow strategy may watch best.",
      "Drive town agent factor thing its.",
      "Quite shake history key short line everybody."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Sales Script for Outreach",
    "description": "Paper between police within she.",
    "content": "Speak either per less.\n\n1. Arrive away clearly nation.\n2. Mouth song understand.\n3. Actually know war work affect stop manager.\n4. Key course although member go too.\n5. Camera yeah law possible want challenge child each.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "music",
      "better",
      "face",
      "campaign"
    ],
    "usageTips": [
      "Such brother also make.",
      "Four across for provide.",
      "Least senior none senior technology."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Influencer Partnership Strategy",
    "description": "Produce much deal degree religious like interest.",
    "content": "Environmental stand use why. Thought while try mind challenge. Quite investment figure be need.\n\n1. Change staff summer near.\n2. Enough answer grow accept.\n3. Against case wrong.\n4. And else pass season scene.\n5. Security character sing.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "side",
      "later",
      "world",
      "prepare"
    ],
    "usageTips": [
      "Learn I bill arm night all environmental.",
      "Whether edge benefit paper certainly of.",
      "Heart last since expect."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Content Calendar for a Startup",
    "description": "Season draw certainly firm care inside stay common address.",
    "content": "Throughout parent study never peace. Eight care difficult star compare agree.\n\n1. Likely school side idea thank little.\n2. Fine some car letter right turn.\n3. Environment on less receive.\n4. Letter question think consumer financial reach per.\n5. Pattern news door picture economic court.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "head",
      "throughout",
      "simple",
      "business"
    ],
    "usageTips": [
      "Certainly fire stop owner owner yet.",
      "Far since born fly work.",
      "Perform drop name and challenge."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Newsletter Hook Ideas",
    "description": "Father us clearly property call their well window body.",
    "content": "Lose hand daughter inside usually. South within seven four book product unit. Consider physical way natural. It method simple figure senior.\n\n1. Pay whose song your upon.\n2. News particularly detail to guy.\n3. Allow ask structure per.\n4. High instead for four world chance meet.\n5. Sound type manage piece part.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "production",
      "beyond",
      "soldier",
      "visit"
    ],
    "usageTips": [
      "Sure sport even bit.",
      "Deep deal middle someone know.",
      "Performance great past six born expert."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Competitor Benchmark Report",
    "description": "Probably future everyone pick sport.",
    "content": "Help show particular force time town. Explain firm sport add friend something.\n\n1. Well sister only sign.\n2. Play if wind nor friend about rest prepare.\n3. Book century meeting herself.\n4. Mind race around question second western share.\n5. Read say do serve vote.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "land",
      "yes",
      "conference",
      "official"
    ],
    "usageTips": [
      "Alone turn during clear.",
      "Church wind able enter through assume stop.",
      "Family assume woman race want."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Write a Brand Origin Story",
    "description": "Anything away determine song case.",
    "content": "Art wind address program present. Discussion recognize outside civil practice leader check. Data ever course go itself chair improve.\n\n1. Treatment sound cause live agent south across.\n2. Skin yeah property always seven news.\n3. Yet term president clear mean clear great him.\n4. Put the into success meeting artist recognize.\n5. Gun never along land how suddenly.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "include",
      "reach",
      "into",
      "shoulder"
    ],
    "usageTips": [
      "Tv pressure want science.",
      "Speak realize nature person item energy.",
      "Relationship nor standard feel Congress institution her."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Growth Hacking Ideas Brainstorm",
    "description": "Thank high purpose smile need by her me.",
    "content": "Free personal job expert language better hundred best. Chair shake may activity model positive technology. We yeah real kid attorney defense chair.\n\n1. Bill better far someone team.\n2. During blood couple develop eat pressure.\n3. Difficult history party make name stand.\n4. But explain act generation stop.\n5. Shake today general assume resource fine plan.",
    "category": "Business and Marketing",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "physical",
      "perform",
      "leader",
      "establish"
    ],
    "usageTips": [
      "Including century green wrong lead next pull.",
      "While indeed professor bank mouth down thousand.",
      "Discuss represent knowledge."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Cyberpunk Cityscape",
    "description": "Beyond important sure cold himself other theory.",
    "content": "Idea discussion Mrs new pull summer exactly local. Single doctor article cold meeting race.\n\n1. Place last size world detail subject here front.\n2. True grow tough ever recent fish.\n3. Process lawyer probably character perform debate.\n4. Avoid key we.\n5. How amount someone southern argue a.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "administration",
      "east",
      "air",
      "important"
    ],
    "usageTips": [
      "Attorney around nearly home throw message.",
      "Produce actually surface bag role physical account much.",
      "Figure which usually southern today idea."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Dreamscape Forest at Sunset",
    "description": "Remember material treat there.",
    "content": "Tv animal three factor best. Think vote bank. Church value rest usually manager.\n\n1. Someone half seat detail.\n2. Smile official interesting down usually.\n3. Him challenge item.\n4. Involve deal look budget make.\n5. We teacher news sell official tree.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "possible",
      "guess",
      "stage",
      "others"
    ],
    "usageTips": [
      "May American woman central exactly money my.",
      "We with series add they though response Democrat.",
      "Dog whatever parent someone amount court."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Post-Apocalyptic Market Scene",
    "description": "None statement hope see design population person letter.",
    "content": "Everything great arrive happen. Student true face about. Power military sure notice across.\n\n1. Doctor professional character interview create phone return.\n2. Itself traditional rest officer president source.\n3. Ok wish painting city whether decide among.\n4. Similar quite professor other pretty foreign American.\n5. Nearly performance there message consumer with news letter.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "sure",
      "so",
      "rock",
      "treatment"
    ],
    "usageTips": [
      "Remember together civil.",
      "Parent clear mouth people ability.",
      "Likely number explain surface get television local west."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Mythical Sea Creature Design",
    "description": "Move side decision wind with wonder edge big lose Republican.",
    "content": "Light three democratic now model black. Shake make success. Green for movement try skill everybody follow.\n\n1. Everyone fall certain author eat drop view.\n2. Mind building north billion up after enter PM.\n3. Product pick fear manage health because red scene.\n4. Role nor trial reality mention.\n5. Product people society brother.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "build",
      "level",
      "provide",
      "six"
    ],
    "usageTips": [
      "Thank where left mind assume wonder government.",
      "Nice certain too not.",
      "Western member situation design within smile."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Alien Planet Concept Art",
    "description": "Huge seek seek magazine prevent approach deep region available attack.",
    "content": "Left determine than kid. Throw care wait effect society. Place left in side join case expect book.\n\n1. Adult power poor.\n2. Design where beautiful husband blood.\n3. Sound box attack.\n4. Through deal continue matter art wait human.\n5. Election teach program national.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "lawyer",
      "Mr",
      "nearly",
      "next"
    ],
    "usageTips": [
      "Than paper red protect sport maintain such attention.",
      "Interest me news human southern real.",
      "Now likely court."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Interior of a Witch\u2019s Hut",
    "description": "Establish man free market even evidence change natural.",
    "content": "Result by possible fly over law. Save lawyer mission far structure next experience. Old tax them.\n\n1. Finish various structure animal.\n2. Too research cold science best weight.\n3. Last pattern learn.\n4. Will really agree push life.\n5. Television describe environmental art trouble here outside.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "your",
      "community",
      "husband",
      "hundred"
    ],
    "usageTips": [
      "Fast step become artist.",
      "Yet side push hair determine less economic interesting.",
      "Theory as oil eye."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Steampunk Airship in Flight",
    "description": "These body majority bill arrive.",
    "content": "Customer decision choose strong scientist card. Man from five top body man.\n\n1. Election grow girl finish stock course easy.\n2. Lot surface operation perform.\n3. Also might arrive.\n4. Certain determine design throughout.\n5. Prevent understand expect along major above different.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "treatment",
      "turn",
      "summer",
      "send"
    ],
    "usageTips": [
      "Leave continue bad word necessary individual.",
      "Nothing hotel bad.",
      "Low throughout be last."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Abstract Expressionist Mood Board",
    "description": "Total machine according you Democrat other scientist grow debate.",
    "content": "Education single quite prepare.\n\n1. Dog conference find enough wear.\n2. Writer specific next maybe wait from.\n3. Different bad art.\n4. Give minute service language.\n5. Stand design realize western available.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "manager",
      "run",
      "customer",
      "day"
    ],
    "usageTips": [
      "Benefit leg style buy natural environmental approach.",
      "Consider PM by world go.",
      "Range bit tax letter song scientist at."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Hero\u2019s Armor Design Prompt",
    "description": "Others pick special trial create home ago.",
    "content": "Best professional exist eight floor market little. Develop program explain television attack.\n\n1. Thing care international suffer watch join.\n2. Away nor election trip defense believe simple professional.\n3. Enter four member sit executive western religious.\n4. Imagine response can security occur behind home.\n5. Break loss ten officer step.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "like",
      "win",
      "over",
      "player"
    ],
    "usageTips": [
      "Past process improve forget.",
      "Tonight anything son on.",
      "Hand forward itself area conference."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Surrealist Landscape Prompt",
    "description": "Way foreign people including project purpose position speak.",
    "content": "During author sea. Crime system stay identify between analysis close.\n\n1. Star year set much these past.\n2. Figure whom that.\n3. Yourself myself standard also former smile specific.\n4. Then field plant individual.\n5. Interview rise measure this agree avoid century.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "to",
      "public",
      "player",
      "gas"
    ],
    "usageTips": [
      "Design these significant face.",
      "Do particular economy customer million sort environment.",
      "Use hold present believe guy opportunity."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Fantasy Tavern Illustration",
    "description": "Position current positive only seven although it.",
    "content": "Good bring participant instead. Ten lose leave social. Mother place can control buy peace source. Meeting study avoid.\n\n1. News trade maintain issue instead.\n2. Behind green hour reflect pretty explain mission.\n3. Success against future environmental.\n4. Three natural time.\n5. Give other detail both employee term scientist.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "position",
      "serve",
      "pull",
      "instead"
    ],
    "usageTips": [
      "Start especially make cut white water little.",
      "Consumer market least save however man.",
      "Pay happy night reveal."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Neon Samurai in a Rainstorm",
    "description": "Place wear some Mrs exist.",
    "content": "Your outside name everything. Actually tough hot risk. Nation industry hot situation.\n\n1. Car site fall production interest but gas.\n2. Final before book pretty material describe team everyone.\n3. Check pressure show politics central other radio.\n4. Great hospital stock try less.\n5. Movement perhaps surface eye understand reason.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "yourself",
      "early",
      "help",
      "station"
    ],
    "usageTips": [
      "Body decade which wish reduce color.",
      "Deal before civil.",
      "Amount happen trip movement evening across art."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Haunted Library Interior",
    "description": "Own information fear someone meeting until science.",
    "content": "Suggest however we head every. Hotel me police talk.\n\n1. Main early let case early.\n2. Large culture make trip.\n3. Democratic think here window gun court air.\n4. Among agency Congress many eye operation last reduce.\n5. Push foreign though shoulder.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "receive",
      "out",
      "bar",
      "present"
    ],
    "usageTips": [
      "Capital minute himself loss either view message.",
      "Education enjoy shake same anything start believe.",
      "Raise fact along role character save."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Underwater Coral Temple",
    "description": "Parent provide something court everyone program little capital front.",
    "content": "Week civil provide soldier. Boy your data bag street enjoy way bring. Prove language reflect summer.\n\n1. East able protect economy or.\n2. So film economic community south national.\n3. Feeling believe amount sit political guess conference party.\n4. Score imagine address reduce focus firm past.\n5. Fear address trade remain.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "painting",
      "order",
      "parent",
      "any"
    ],
    "usageTips": [
      "Matter building address public forward time operation car.",
      "That hand use different who guess spring past.",
      "Number doctor four fact fear economy sit."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "AI-Generated Tarot Card",
    "description": "Gun class later rule chance either watch seat.",
    "content": "Successful can matter they appear beat be. National woman home again under affect. Protect director system five control cost might.\n\n1. Anything along himself student peace.\n2. The step American thought way.\n3. Couple provide campaign upon never.\n4. Media even defense opportunity.\n5. Write capital goal laugh.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "clear",
      "manage",
      "note",
      "idea"
    ],
    "usageTips": [
      "By body air risk include price.",
      "Marriage agreement pay instead we bring hand opportunity.",
      "Drug traditional quickly property deep receive source."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Visualize a Futuristic Utopia",
    "description": "Possible important magazine billion level lay least oil.",
    "content": "Exactly image unit necessary somebody describe require. Resource cell best high.\n\n1. Company sing thank service only.\n2. Purpose least him camera clear free same.\n3. Energy run remain sure trade still stop study.\n4. Some usually happen you hit great meeting green.\n5. Institution page bill suddenly protect computer.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "see",
      "set",
      "newspaper",
      "white"
    ],
    "usageTips": [
      "Truth wish local authority big.",
      "Economy property head nothing wall PM.",
      "Together claim small not education."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Nature Spirit in Bloom",
    "description": "Campaign economic able home myself.",
    "content": "Rich analysis reach so work often return radio.\n\n1. Over receive number hour figure explain.\n2. Parent difficult happen police describe.\n3. Imagine office assume minute political minute provide.\n4. Need near give give science perform.\n5. Ok season accept foot foot thing finally.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "process",
      "skill",
      "agreement",
      "arm"
    ],
    "usageTips": [
      "Walk send PM direction tree prove wear.",
      "General statement table.",
      "Decision policy away himself identify leg."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Urban Alley Graffiti Scene",
    "description": "Authority best take from attorney sing.",
    "content": "Point rich second bank. Window identify suddenly cause economy society yet will.\n\n1. Effect blue cause final analysis own.\n2. Important citizen yes professor song large career.\n3. Watch second think food top.\n4. Republican memory court.\n5. Baby same trial on camera.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "hit",
      "quality",
      "agree",
      "especially"
    ],
    "usageTips": [
      "Management good nation security.",
      "Mr relationship last age whole knowledge involve.",
      "I either several matter scene respond."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Viking Village at Dusk",
    "description": "Argue probably direction protect town nice goal method meet.",
    "content": "Box off process area treatment throw conference. Both Mr particularly enough detail tax sort.\n\n1. Where job eye.\n2. Gun reduce win level against deep.\n3. Trial fall would.\n4. Executive somebody suffer travel wish science.\n5. Big never pass answer tell.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "skin",
      "shake",
      "administration",
      "wear"
    ],
    "usageTips": [
      "Especially poor system nearly occur hair.",
      "Body present show white myself.",
      "Stuff vote space above."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Castle Floating in the Sky",
    "description": "Enjoy study task cause.",
    "content": "Three country high collection couple room hair. At bad none whether force cell edge.\n\n1. But media animal role along throughout.\n2. Even partner indeed data success coach politics yet.\n3. Environmental factor smile store.\n4. Right woman walk fund safe hit about.\n5. Style example character war.",
    "category": "Image Generation and Art",
    "model": "DALL-E 3",
    "modelType": [
      "Midjourney",
      "DALL-E"
    ],
    "tags": [
      "radio",
      "doctor",
      "onto",
      "everybody"
    ],
    "usageTips": [
      "Player both treatment view truth.",
      "Tree right along simple.",
      "Produce civil rule ground."
    ],
    "recommendedModels": [
      "Midjourney",
      "DALL-E 3"
    ]
  },
  {
    "title": "Build a Todo App in React",
    "description": "Apply offer scientist finish approach ago.",
    "content": "Staff partner why next score. Conference some loss be practice western.\n\n1. Suddenly room take party quite.\n2. When camera factor travel inside hand ago.\n3. Any upon staff blue short.\n4. World night develop difference carry short various.\n5. Him plant spend between travel area hair.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "accept",
      "cup",
      "citizen",
      "state"
    ],
    "usageTips": [
      "Boy place six.",
      "Plant part experience ok.",
      "State reason believe save."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a REST API in Node.js",
    "description": "Hundred line grow his imagine able guy play require ahead.",
    "content": "Relationship always develop answer heavy. Conference or gun week suddenly. Face child thought compare couple night.\n\n1. Anyone size full best care before politics none.\n2. Read beat little field both price take knowledge.\n3. Cost during student environmental.\n4. Fish nor across sound.\n5. Relate miss strategy attorney ground term national past.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "star",
      "red",
      "person",
      "mission"
    ],
    "usageTips": [
      "Purpose be college half attorney decade wrong.",
      "Art any admit author popular where grow.",
      "Entire catch first step miss."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Python Script for Web Scraping",
    "description": "Region article end parent entire material each budget style.",
    "content": "Nothing big agent building kind reflect think. Play create necessary if bring film. Cause animal and suggest.\n\n1. Ground total approach want it successful sound.\n2. Expect hold paper feel.\n3. Fast develop medical.\n4. White movie painting where.\n5. Perform give heavy alone finally crime really.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "buy",
      "possible",
      "conference",
      "senior"
    ],
    "usageTips": [
      "Girl nothing research company during then during.",
      "Best everybody black fish.",
      "Score each song major happy share support."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Simple CLI Tool in Go",
    "description": "Fear subject note technology something.",
    "content": "Reach card yes set per paper start. She join mouth work teach change defense room. Glass place page system use.\n\n1. Community expect artist citizen possible seek admit.\n2. Relate player car kitchen check.\n3. Able so be bank history.\n4. Party economy itself wish.\n5. Meet authority seem student challenge smile.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "morning",
      "Mrs",
      "test",
      "table"
    ],
    "usageTips": [
      "Three strong nature Republican.",
      "Short between season government rather role your pull.",
      "Should chair small participant candidate home."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Data Analysis in Pandas",
    "description": "Growth weight plant let street east almost involve Congress game.",
    "content": "Report perhaps this gas. Bit husband trade base upon ready.\n\n1. Play day whether for want walk do candidate.\n2. Control relate base minute.\n3. Employee away city floor skill stand.\n4. Minute teacher movie.\n5. Pressure strategy another despite.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "simply",
      "administration",
      "number",
      "each"
    ],
    "usageTips": [
      "School send article night.",
      "Say wear daughter main career I us.",
      "Time project away music."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Custom Discord Bot",
    "description": "Specific hard reduce always course seven.",
    "content": "Design bag as walk teach early. Entire test catch authority hot.\n\n1. Price along address assume should.\n2. Executive president hospital interesting series.\n3. One program knowledge finish section.\n4. Treat each keep fund.\n5. Form hit owner knowledge body.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "voice",
      "professional",
      "happen",
      "why"
    ],
    "usageTips": [
      "Whose often actually yard past.",
      "Serious Republican grow law traditional enjoy nor.",
      "Medical later girl east research air."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "JavaScript Animation with GSAP",
    "description": "Prove hope hand clear smile determine choose glass soon.",
    "content": "Page want move affect. Do south under street within. Tree sport Mr small hotel. Much pretty Mr side structure wrong develop.\n\n1. Spend into customer rise.\n2. Of system last environment.\n3. Want couple animal exactly term strategy.\n4. Respond share season poor understand already lead southern.\n5. Bring nothing also others only.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "total",
      "necessary",
      "lose",
      "there"
    ],
    "usageTips": [
      "This start plant around look agreement themselves.",
      "Course quickly skin use message relate.",
      "Around purpose religious current community claim."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Automate File Backup with Bash",
    "description": "Teacher often late difficult major significant great long.",
    "content": "Guess street common through none inside animal series. Describe reach admit board office seat. Himself happen many sing care among.\n\n1. Edge kid against night none.\n2. Continue draw discuss operation.\n3. First technology make third.\n4. He star soon sport less special third.\n5. Cause whatever believe as nature.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "help",
      "sign",
      "front",
      "couple"
    ],
    "usageTips": [
      "Heart answer decade film another hit.",
      "Statement could win energy former nation at.",
      "Word point language all field around energy."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Machine Learning Model for Spam Detection",
    "description": "Main program conference if strategy I positive.",
    "content": "Trip address involve firm. Often sing media recent house. Second fish writer break alone in. Traditional case key.\n\n1. Space final environment affect expect day leg.\n2. Officer thus leave market action.\n3. Scene month produce generation.\n4. Direction fine spend American hot vote let.\n5. Control another cup yeah.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "today",
      "lawyer",
      "light",
      "now"
    ],
    "usageTips": [
      "Identify property center account them.",
      "Development attack stage long.",
      "Grow public dinner drop at weight."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Firebase Auth Integration",
    "description": "Determine southern strong ten want here.",
    "content": "Exactly data three any particularly. Spend step water summer to moment. Figure new because walk decide. Grow church mention hundred paper social drive tree.\n\n1. Beat find why compare bar daughter.\n2. One better enjoy whatever sound pay life page.\n3. Learn body same.\n4. Huge including where entire single letter.\n5. Join chance change economic fund leader.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "year",
      "down",
      "condition",
      "story"
    ],
    "usageTips": [
      "Sometimes me father relate marriage we.",
      "Which push chair eight grow build.",
      "Level TV and trade finally in including."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Unit Testing in Python",
    "description": "Understand onto few successful include involve.",
    "content": "Nation effort soldier. Cause window themselves generation without. Everyone off eight network nearly check structure.\n\n1. Pay effect better.\n2. Law particular truth there.\n3. Then easy remember boy seat.\n4. Source put suffer truth.\n5. Member forget health behavior carry live water fact.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "author",
      "firm",
      "evidence",
      "smile"
    ],
    "usageTips": [
      "Order give professor day take recently.",
      "Than production woman final present why.",
      "Stuff responsibility hair market."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "GraphQL Query Builder",
    "description": "Morning why exist week begin amount stop.",
    "content": "Section woman business goal. Team attention threat argue record position card. Management wide begin bit American better office.\n\n1. Surface seek order health despite space art.\n2. Himself few positive reveal issue likely skill.\n3. Score early thus page action drop democratic natural.\n4. Lead sport single together ever provide.\n5. Film cost year listen.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "stage",
      "ask",
      "often",
      "major"
    ],
    "usageTips": [
      "Game activity court enough.",
      "Democrat make official term produce pull would.",
      "Generation travel build mind."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Markdown Parser",
    "description": "Interesting building fast for myself sometimes bad I purpose officer.",
    "content": "Author meet maybe day. Require light treat natural ask four indeed. Party wear appear woman throw their man.\n\n1. Measure get TV begin difference mother.\n2. Get cell region fast effort from.\n3. Father receive direction town tonight seem.\n4. War computer more later discover wide.\n5. Age subject among participant high.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "late",
      "mission",
      "Congress",
      "sit"
    ],
    "usageTips": [
      "Early local traditional according also.",
      "Professional wonder big political certain federal.",
      "Dinner front hundred down true."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Deploy an App to Vercel",
    "description": "More help whether ball create adult.",
    "content": "Thousand probably cover picture alone. Relationship finish believe mother than without.\n\n1. Rule too institution impact positive.\n2. We control help outside.\n3. Everyone everyone important goal.\n4. Rich attorney nor radio young girl decide.\n5. Might area hit central choose yeah bag.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "over",
      "peace",
      "society",
      "animal"
    ],
    "usageTips": [
      "Yes upon outside morning shake.",
      "Middle under recognize.",
      "Event at nice begin note heavy."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Dockerfile for a Flask App",
    "description": "Light final design black care employee season process clearly.",
    "content": "Pick wind material student cultural.\n\n1. Top teach must subject upon.\n2. Product prepare know true which real area ground.\n3. Machine item consider career network population some.\n4. Analysis debate third positive education.\n5. Teach white measure writer individual me effect.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "two",
      "especially",
      "product",
      "at"
    ],
    "usageTips": [
      "Control recent away establish boy.",
      "Hold course once short begin building.",
      "Long worker near left."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Crypto Price Tracker using API",
    "description": "Ago campaign rise heart trip hot book director feel condition.",
    "content": "Fund room enjoy will almost set others. Amount everyone moment daughter hold address throughout professional.\n\n1. Think religious television sound relationship base.\n2. Others exactly far later both writer democratic.\n3. President professional sign company.\n4. Get like few military.\n5. Happy suggest call whole white adult.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "lot",
      "chair",
      "describe",
      "put"
    ],
    "usageTips": [
      "Big marriage area cause behind.",
      "Perhaps necessary big.",
      "Heavy mean lot heart debate common."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Build a Portfolio Website",
    "description": "Our sea very property capital girl across human raise central.",
    "content": "Responsibility may ahead size which class keep himself. Another leader minute style late form sign food.\n\n1. Commercial top security whole.\n2. Then treatment item among may exist.\n3. Employee couple environmental school.\n4. Activity leave themselves agent together center among.\n5. Man road citizen about record few miss reflect.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "big",
      "charge",
      "third",
      "kid"
    ],
    "usageTips": [
      "Forward early visit that read.",
      "Help program special at many grow today.",
      "I art soldier actually ask."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "SEO Analyzer in Python",
    "description": "Myself law quite natural this sea.",
    "content": "Police government idea entire customer. Single customer dinner fund. Thank store soldier. Mouth travel pull scientist.\n\n1. Change call law many.\n2. Down weight appear particularly model into often.\n3. Need if various when degree work pass later.\n4. Animal under within cell above represent east hit.\n5. American Mrs together work consumer movement item.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "race",
      "table",
      "ball",
      "worker"
    ],
    "usageTips": [
      "Skin there region too across look.",
      "Every worry newspaper these offer rich.",
      "Respond part will care."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "SaaS Billing Logic in Stripe",
    "description": "Begin democratic whole piece gas life.",
    "content": "Read PM rate hotel. Treat film college exist very.\n\n1. Between market same black admit.\n2. Born use show dog safe many attack.\n3. Drop change itself big yet international wife key.\n4. Beat administration despite image human hotel.\n5. Easy important treatment their.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "method",
      "difference",
      "month",
      "sing"
    ],
    "usageTips": [
      "Wish would information place go health area pressure.",
      "Executive no tough consider thousand receive education.",
      "Tell involve follow but statement statement."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Chat App Using WebSockets",
    "description": "Start have rate should quickly.",
    "content": "Too future indicate claim with. Foreign can expect than happen entire professional bit.\n\n1. Clearly civil take.\n2. Already safe many long night.\n3. Feeling will along goal.\n4. Cup possible lawyer positive security responsibility.\n5. Hour nearly write method drive old.",
    "category": "Coding and Tech",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "cold",
      "recent",
      "yes",
      "notice"
    ],
    "usageTips": [
      "Soldier activity north interview work.",
      "Produce reason so garden fly front magazine as.",
      "Series simple staff leave debate admit election value."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design a Post-Apocalyptic Faction",
    "description": "Bank exactly growth another rest test law art single Democrat.",
    "content": "Institution center minute product discussion particular exist.\n\n1. But from go.\n2. Feel care him force explain first art.\n3. Notice risk on lot old could modern.\n4. Imagine news receive food.\n5. Whole best since security join financial share.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "take",
      "company",
      "coach",
      "should"
    ],
    "usageTips": [
      "Tend moment benefit ground brother also.",
      "Occur forward expert animal expert break.",
      "Cup billion unit moment mention talk glass page."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a Fantasy Kingdom's History",
    "description": "Pattern skill Mrs condition voice.",
    "content": "Gun increase we already night. Level member trouble paper he. Person notice scene describe pretty short start write.\n\n1. Have right address information low simply here indeed.\n2. West energy church read thank whole.\n3. Mission next often hundred camera especially.\n4. One across race sit three argue local.\n5. Congress film use.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "look",
      "just",
      "catch",
      "born"
    ],
    "usageTips": [
      "Nearly remain class trouble.",
      "Either still economic minute development general notice.",
      "Author apply list section town she market."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Tavern Generator for D&D",
    "description": "Much staff decade some white represent develop ask summer.",
    "content": "Development by watch majority push media boy manager. Owner within environment movie use. Goal generation develop remain discover.\n\n1. Force professional site.\n2. Peace single particularly white nothing ahead difficult.\n3. Opportunity star compare toward.\n4. Worker tax general.\n5. Free local store everyone wear and reflect.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "focus",
      "structure",
      "commercial",
      "ago"
    ],
    "usageTips": [
      "Federal pattern course line case perhaps.",
      "Budget call rather away rich hotel task responsibility.",
      "Measure enough economic various write."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "RPG Quest Hook Ideas",
    "description": "Model more into threat leader wide industry cell standard think worker.",
    "content": "Evening let international although. Worry society drug network finally. Fly campaign care less middle health rest.\n\n1. Base strategy explain five point cup she between.\n2. Subject animal task sure.\n3. Even responsibility seat total little late think movement.\n4. Majority and friend both.\n5. Could have suggest general drug Mr.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "easy",
      "cover",
      "vote",
      "answer"
    ],
    "usageTips": [
      "Mr study boy.",
      "Indicate out bag visit.",
      "Seem concern former player property doctor."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Map a Forbidden Forest Region",
    "description": "Consumer what mention water happy task growth cost thought.",
    "content": "Change long task public research. Consumer culture section partner. Bag owner fight hear per new.\n\n1. Politics agree case money study.\n2. Position security learn.\n3. Nearly live learn inside event talk.\n4. Support design receive water by performance your.\n5. Dinner human parent.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "campaign",
      "just",
      "program",
      "environment"
    ],
    "usageTips": [
      "Decade response total common.",
      "There else whose sometimes fact toward reflect.",
      "Son wait challenge remember story."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Invent a Magic School Curriculum",
    "description": "Age store image edge another design statement.",
    "content": "Which sign federal. Other detail box able effort involve. Customer effort three. Hot none nothing rule.\n\n1. Improve cut process be million especially.\n2. Six particular big agent.\n3. Process must pick ahead explain arm ball.\n4. Free across such none form.\n5. Unit always perhaps where sign white.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "author",
      "recognize",
      "suggest",
      "thing"
    ],
    "usageTips": [
      "Free statement reality.",
      "Seat after data season event without.",
      "Church rule huge sort condition behavior deep."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Backstory for a Rogue NPC",
    "description": "Three field without key new movie they.",
    "content": "Five trip thank dog section. Most effect ground perhaps may. Cut forward air interesting though including.\n\n1. Him wait write too base walk.\n2. Bed quality American heart six all.\n3. Culture see describe evening school.\n4. Those detail list indicate how watch.\n5. Nature program wife collection sister million.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "girl",
      "deep",
      "area",
      "work"
    ],
    "usageTips": [
      "Once style nor staff feeling car campaign.",
      "Discover beat establish.",
      "Many past answer."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Alien Species for Sci-Fi Setting",
    "description": "Sit when care together eat even.",
    "content": "Right their remain sea. Long determine position from arrive. Effect receive money course specific sort ability team.\n\n1. Want mouth again.\n2. Above plant building would yourself military full start.\n3. Item position possible another evening main.\n4. Book follow move hit together race.\n5. Upon arm role.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "stuff",
      "last",
      "the",
      "lot"
    ],
    "usageTips": [
      "Debate try stage night.",
      "Generation region if product story material.",
      "Game better sense always affect."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "City of Thieves: Setting Prompt",
    "description": "Could security listen these fire fine skin century keep need.",
    "content": "Activity option take mind nearly. Magazine beat address affect perform. Common magazine develop at culture coach.\n\n1. Assume argue industry certainly group.\n2. Visit former politics message.\n3. Here let talk sport down imagine day.\n4. Toward fund guess around including shoulder.\n5. Total authority affect forget.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "listen",
      "itself",
      "base",
      "win"
    ],
    "usageTips": [
      "Officer some floor interest production business.",
      "Quite situation lay.",
      "Give peace establish morning."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Prophecy that Drives the Plot",
    "description": "Thousand hold born husband base mean personal world go.",
    "content": "Almost blood country collection bring water environmental. Career writer together safe three adult several. International rule able system space friend.\n\n1. Who minute attorney long practice daughter.\n2. Goal behavior national heart figure green.\n3. Think experience then play hour really machine.\n4. Couple whole where.\n5. Seven ability suddenly seat list voice.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "knowledge",
      "school",
      "once",
      "attention"
    ],
    "usageTips": [
      "Really class if religious book sell could.",
      "Special call until successful home.",
      "Drug police arm total when short."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Pantheon of Forgotten Gods",
    "description": "Population if may nor none boy hand production.",
    "content": "Poor compare wish suffer. Represent end should American writer.\n\n1. Assume term politics feel simple wish.\n2. Difficult act always line compare.\n3. With provide red policy character benefit.\n4. Director challenge southern I course.\n5. Report her whom business appear miss.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "return",
      "total",
      "indicate",
      "up"
    ],
    "usageTips": [
      "Treat onto reveal thousand spend.",
      "Woman answer me accept service his chance.",
      "Stay benefit recently point hundred myself."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Create a War Between Nations",
    "description": "Away live last least visit clearly.",
    "content": "Lawyer artist professional plan likely especially him fly.\n\n1. Cold owner democratic age traditional community.\n2. They care fact all view value how.\n3. Physical than identify key.\n4. Could ago weight stop pressure hour individual point.\n5. Room pick either trip plan receive shoulder.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "evening",
      "film",
      "too",
      "situation"
    ],
    "usageTips": [
      "Least short late lot much player.",
      "Society paper wish player such.",
      "Travel artist near understand assume value."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Design a Trade System for a Realm",
    "description": "Support notice large play ten allow relate line good full.",
    "content": "Structure stay give region learn religious test table. Send learn develop seat break raise join memory.\n\n1. Finally management responsibility spring plan focus.\n2. Stop for scientist here final himself middle.\n3. Affect myself opportunity defense thought detail experience.\n4. Series top myself mean half poor.\n5. Onto chair science author herself.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "party",
      "no",
      "kid",
      "must"
    ],
    "usageTips": [
      "Message affect significant four second modern.",
      "Soon although chair interview institution figure wonder Republican.",
      "Argue talk high rate look himself."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Haunted Dungeon Room-by-Room",
    "description": "Check some phone nature pretty meet international which.",
    "content": "Happen yourself including beautiful wonder method. Industry drug include letter weight.\n\n1. Need ready activity change agent both where.\n2. Man country admit probably blue Republican able.\n3. Receive stay course tonight stand during produce.\n4. Worker international much.\n5. Look management compare institution.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "early",
      "place",
      "language",
      "specific"
    ],
    "usageTips": [
      "Student chance ago management like learn game draw.",
      "Husband although success language take amount record.",
      "Away blood evening need."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Cursed Item Description Prompt",
    "description": "Benefit left serve oil game find drive by could upon.",
    "content": "Experience pay each pressure religious thought attack.\n\n1. Expert suggest cause out.\n2. Feel hot everybody near protect option.\n3. World suggest risk ago month responsibility out.\n4. Simple beyond government perform current.\n5. Admit upon make page contain raise positive after.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "prepare",
      "reason",
      "approach",
      "president"
    ],
    "usageTips": [
      "Power it must blood big example.",
      "Fund white read term evidence lot message.",
      "Maybe power appear issue leg produce PM edge."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Multiverse Portal Mechanics",
    "description": "Policy care animal human few themselves yes bag spring.",
    "content": "Prevent wish but right along probably. On strong difficult. This chance whole area.\n\n1. Computer into main bill enjoy bag.\n2. Staff hair way recent student.\n3. Need modern manage million threat few far son.\n4. Federal itself never career way right.\n5. Consider body enjoy threat turn defense simply.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "PM",
      "ok",
      "short",
      "movie"
    ],
    "usageTips": [
      "Recognize say culture reflect tell move while weight.",
      "Wonder their official eat whose.",
      "Skill guy agreement attack pull."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Political Intrigue in a Royal Court",
    "description": "Lawyer she situation mention certainly provide coach create store now.",
    "content": "Focus foreign commercial improve goal. Sport already pull. Power act city continue audience clear remember our.\n\n1. Record behavior officer information forget seven thus.\n2. South generation government PM.\n3. Approach choice father listen third.\n4. Organization white audience program camera.\n5. Establish program camera region energy than condition across.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "identify",
      "nothing",
      "policy",
      "order"
    ],
    "usageTips": [
      "Unit side his director themselves reflect increase.",
      "Sell must concern.",
      "Degree age represent available senior hear television tend."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Underground Resistance Network",
    "description": "Especially environment whose rich air itself degree for project else recent.",
    "content": "Media really thought job point suffer act. Order unit tell author affect scientist.\n\n1. Far back check wish level amount.\n2. Letter easy lay expert poor instead table.\n3. Help show sometimes personal pattern buy.\n4. Just film skill ten board.\n5. Those push apply wrong argue.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "space",
      "since",
      "seem",
      "treat"
    ],
    "usageTips": [
      "Economic leg decide particular.",
      "Character participant purpose lead responsibility feel.",
      "Road approach program year."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Timeline for a Dying World",
    "description": "Crime structure ask television.",
    "content": "Yourself simple notice machine.\n\n1. Page white buy watch.\n2. Product suffer beyond owner prove difference.\n3. Red chance before thousand special.\n4. I play environment today Republican church something.\n5. In as near color too whatever.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "dream",
      "drop",
      "expect",
      "affect"
    ],
    "usageTips": [
      "Join since now history hour later tell.",
      "Picture almost it class deal education.",
      "Official democratic few mind."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  },
  {
    "title": "Fictional Calendar System",
    "description": "Expect themselves magazine term visit.",
    "content": "Wall police on quickly nice. Product four understand. Onto newspaper beautiful throw also.\n\n1. Bit that true price.\n2. East pretty radio all.\n3. Candidate skill town window range minute behind good.\n4. Cup suddenly husband should house expect important.\n5. Drive arm such.",
    "category": "Gaming and Worldbuilding",
    "model": "GPT-4",
    "modelType": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "tags": [
      "event",
      "miss",
      "investment",
      "interesting"
    ],
    "usageTips": [
      "Song moment yet cost hand usually mean.",
      "Kid economic during wait.",
      "Rest small stand movie wrong."
    ],
    "recommendedModels": [
      "GPT-4",
      "Claude-3",
      "Gemini Pro"
    ]
  }
];

async function seedPrompts() {
  try {
    const promptsCollection = adminDb.collection('prompts');
    
    for (const prompt of prompts) {
      await promptsCollection.add({
        ...prompt,
        createdAt: new Date(),
        updatedAt: new Date(),
        favorites: 0,
        upvotes: 0,
        isFeatured: false,
        isFlagged: false
      });
    }
    
    console.log('Successfully seeded prompts');
  } catch (error) {
    console.error('Error seeding prompts:', error);
  }
}

seedPrompts(); 
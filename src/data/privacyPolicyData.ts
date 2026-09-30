export interface StorageItem {
  key: string;
  storageType: 'localStorage' | 'sessionStorage';
  category: 'Preferences' | 'History & Ephemeral' | 'Workspace & Curation' | 'Crawler & Indexing' | 'AI & Community';
  component: string;
  dataType: string;
  retention: string;
  purpose: string;
  deletionMethod: string;
}

export interface ExternalProviderFlow {
  provider: string;
  endpoint: string;
  category: 'Metasearch & Knowledge' | 'Web Archive & Scraping' | 'AI Synthesis (Optional)';
  triggerCondition: string;
  dataTransmitted: string;
  dataExcluded: string;
  purpose: string;
  isOptionalServerConfig: boolean;
}

export interface BackendMemoryStore {
  identifier: string;
  layer: 'Express Node.js (In-Memory)' | 'Python FastAPI + Firestore (Optional)';
  apiRoutes: string;
  dataStored: string;
  persistenceBehavior: string;
  userPurgeAction: string;
}

export interface UserControlMechanism {
  id: string;
  title: string;
  uiLocation: string;
  technicalEffect: string;
  scope: string;
}

export interface PolicyChapter {
  number: string;
  id: string;
  title: string;
  subtitle: string;
  marginNoteTitle: string;
  marginNoteBody: string;
  paragraphs: string[];
  bulletPoints?: { label: string; detail: string }[];
}

export const POLICY_META = {
  appName: 'Isaac Search Engine',
  documentTitle: 'Privacy Policy & Data Handling Architecture',
  effectiveDate: 'September 30, 2026',
  lastUpdated: 'September 30, 2026',
  version: 'Edition 2.4 · Local-First Architecture',
  contactEmail: 'pawan.aries.srivastava@gmail.com',
  summaryStatement:
    'Isaac Search Engine is engineered around a strict zero-account, local-first privacy architecture. We do not require registration, collect personal identifiers, or deploy cross-site tracking cookies. Your research workspaces, collections, notebooks, and preferences reside directly in your browser storage, while live search and optional AI synthesis transmit only the immediate search query.',
};

export const CORE_PRINCIPLES = [
  {
    index: '01',
    title: 'Zero Mandatory Account Tracking',
    summary: 'No registration, personal identifiers, or tracking cookies.',
    detail:
      'Isaac Search Engine does not require user accounts, email addresses, phone numbers, real names, or authentication cookies to access web search, image discovery, domain graph analysis, collections, or research workspaces.',
  },
  {
    index: '02',
    title: 'Local-First Workspace Persistence',
    summary: 'Your research lives in your browser, not on a central cloud profile.',
    detail:
      'All personal curation artifacts—including Search Collections, Research Projects, Markdown Notebook drafts, custom Tag hierarchies, UI themes, and Blocked Domains—are stored directly inside your browser via standard Web Storage APIs (localStorage and sessionStorage).',
  },
  {
    index: '03',
    title: 'Ephemeral In-Memory Session Scoping',
    summary: 'Per-tab UUIDv4 session tokens that vanish on reload or exit.',
    detail:
      'When you open the application, a random UUID (sessionId via uuidv4()) is generated purely in browser memory to scope temporary search history during that active session. It is never tied to your identity, IP address, or hardware fingerprint.',
  },
  {
    index: '04',
    title: 'Explicit Ephemeral & Purge Controls',
    summary: 'One-click destruction and automatic history wiping on tab close.',
    detail:
      'Users can enable "Clear History on Exit" to automatically purge search history upon window unload, trigger "Simulate Session Termination" to verify immediate erasure, or execute a full local cache reset at any moment.',
  },
];

export const CLIENT_STORAGE_INVENTORY: StorageItem[] = [
  {
    key: 'isaac_theme',
    storageType: 'localStorage',
    category: 'Preferences',
    component: 'src/App.tsx',
    dataType: "'dark' | 'light'",
    retention: 'Persistent until cleared',
    purpose: 'Persists user interface color theme preference across browser sessions.',
    deletionMethod: 'Factory Reset or browser storage clear',
  },
  {
    key: 'isaac_history',
    storageType: 'localStorage',
    category: 'History & Ephemeral',
    component: 'src/App.tsx, SettingsModal.tsx',
    dataType: 'string[] (JSON)',
    retention: 'Persistent or wiped on tab exit',
    purpose: 'Stores recent search query strings. Automatically wiped on tab close when isaac_clear_history_on_exit is enabled.',
    deletionMethod: 'Settings (Ctrl+,) Clear History, Search Dropdown Clear, or Tab Close (Ephemeral Mode)',
  },
  {
    key: 'isaac_clear_history_on_exit',
    storageType: 'localStorage',
    category: 'History & Ephemeral',
    component: 'src/App.tsx',
    dataType: "'true' | 'false'",
    retention: 'Persistent preference flag',
    purpose: 'Controls whether search history is automatically purged via beforeunload when the browser session ends.',
    deletionMethod: 'Toggle in SettingsModal or Factory Reset',
  },
  {
    key: 'isaac_collections',
    storageType: 'localStorage',
    category: 'Workspace & Curation',
    component: 'src/App.tsx',
    dataType: 'SearchCollection[] (JSON)',
    retention: 'Persistent local workspace',
    purpose: 'Stores custom user bookmark folders, folder descriptions, saved page references, and folder-specific research notes.',
    deletionMethod: 'Delete collection in UI, Export & Delete, or Factory Reset',
  },
  {
    key: 'isaac_projects',
    storageType: 'localStorage',
    category: 'Workspace & Curation',
    component: 'src/App.tsx',
    dataType: 'ResearchProject[] (JSON)',
    retention: 'Persistent local workspace',
    purpose: 'Stores research projects, project status, target dates, nested tasks/subtasks, linked collections, and notebook metadata.',
    deletionMethod: 'Delete project in Workspace UI or Factory Reset',
  },
  {
    key: 'isaac_notebook_draft_<projectId>',
    storageType: 'localStorage',
    category: 'Workspace & Curation',
    component: 'src/hooks/useNotebookAutosave.ts',
    dataType: 'string (Markdown text)',
    retention: 'Persistent per active project',
    purpose: 'Stores debounced autosave drafts of the active research project Markdown notebook to prevent data loss.',
    deletionMethod: 'Clear notebook content, delete parent project, or Factory Reset',
  },
  {
    key: 'blocked_domains',
    storageType: 'localStorage',
    category: 'Preferences',
    component: 'src/App.tsx',
    dataType: 'string[] (JSON)',
    retention: 'Persistent filter list',
    purpose: 'Stores domains explicitly blocked by the user via the three-dot result menu; filtered out of all subsequent searches.',
    deletionMethod: 'Unblock domain / Clear all blocked domains in Settings',
  },
  {
    key: 'isaac_searxng_fallback_enabled',
    storageType: 'localStorage',
    category: 'Crawler & Indexing',
    component: 'src/App.tsx',
    dataType: 'boolean (JSON)',
    retention: 'Persistent setting',
    purpose: 'Determines whether sparse local index results automatically fall back to live SearXNG metasearch instances.',
    deletionMethod: 'Toggle in SettingsModal or Factory Reset',
  },
  {
    key: 'isaac_searxng_auto_index',
    storageType: 'localStorage',
    category: 'Crawler & Indexing',
    component: 'src/App.tsx',
    dataType: 'boolean (JSON)',
    retention: 'Persistent setting',
    purpose: 'Controls whether live SearXNG fallback results are automatically indexed into the local catalog and crawler seeds.',
    deletionMethod: 'Toggle in SettingsModal or Factory Reset',
  },
  {
    key: 'isaac_crawler_seeds',
    storageType: 'localStorage',
    category: 'Crawler & Indexing',
    component: 'src/App.tsx',
    dataType: 'SeedItem[] (JSON)',
    retention: 'Persistent local cache',
    purpose: 'Fallback client-side cache of active crawler seed URLs and target domains.',
    deletionMethod: 'Remove seeds in Crawler tab or Factory Reset',
  },
  {
    key: 'isaac_auto_crawl_enabled',
    storageType: 'localStorage',
    category: 'Crawler & Indexing',
    component: 'src/App.tsx',
    dataType: 'boolean (JSON)',
    retention: 'Persistent setting',
    purpose: 'Persists the active/inactive toggle state of the Autonomous Background Spider.',
    deletionMethod: 'Toggle in Crawler controls or Factory Reset',
  },
  {
    key: 'isaac_fireplexity_turns',
    storageType: 'localStorage',
    category: 'AI & Community',
    component: 'src/components/FireplexityTab.tsx',
    dataType: 'ConversationTurn[] (JSON)',
    retention: 'Persistent until thread cleared',
    purpose: 'Stores multi-turn AI research threads, synthesized Markdown answers, source citations, and follow-up questions.',
    deletionMethod: 'Clear Thread button in Fireplexity tab or Factory Reset',
  },
  {
    key: 'isaac_fireplexity_auto_index',
    storageType: 'localStorage',
    category: 'AI & Community',
    component: 'src/components/FireplexityTab.tsx',
    dataType: "'true' | 'false'",
    retention: 'Persistent setting',
    purpose: 'Controls whether web sources scraped during Fireplexity AI searches are automatically indexed into the search catalog.',
    deletionMethod: 'Toggle in Fireplexity tab or Factory Reset',
  },
  {
    key: 'isaac_tag_hierarchy_relationships',
    storageType: 'localStorage',
    category: 'Workspace & Curation',
    component: 'src/components/TagHierarchyTree.tsx',
    dataType: 'Record<string, string> (JSON)',
    retention: 'Persistent taxonomy map',
    purpose: 'Stores custom parent-child topical tag taxonomy relationships configured by the user.',
    deletionMethod: 'Reset taxonomy in Tag Hierarchy view or Factory Reset',
  },
  {
    key: 'isaac_community_notes_<url>',
    storageType: 'localStorage',
    category: 'AI & Community',
    component: 'src/components/CommunityNotesSection.tsx',
    dataType: 'CommunityNote[] (JSON)',
    retention: 'Persistent local cache per URL',
    purpose: 'Local cache of user-contributed community context notes attached to a specific indexed URL.',
    deletionMethod: 'Browser storage reset / Factory Reset',
  },
  {
    key: 'isaac_community_note_votes_<url>',
    storageType: 'localStorage',
    category: 'AI & Community',
    component: 'src/components/CommunityNotesSection.tsx',
    dataType: "Record<string, 'up' | 'down'>",
    retention: 'Persistent vote state per URL',
    purpose: 'Tracks which community notes the user has marked helpful (up) or not helpful (down) on a given URL.',
    deletionMethod: 'Browser storage reset / Factory Reset',
  },
  {
    key: 'isaac_session_active',
    storageType: 'sessionStorage',
    category: 'History & Ephemeral',
    component: 'src/App.tsx',
    dataType: "'true'",
    retention: 'Tab lifetime only',
    purpose: 'Detects whether the current page load is a fresh browser session versus an in-tab refresh. Automatically destroyed when tab closes.',
    deletionMethod: 'Close browser tab or Simulate Session Termination',
  },
  {
    key: 'isaac_history_session_cache',
    storageType: 'sessionStorage',
    category: 'History & Ephemeral',
    component: 'src/App.tsx, SettingsModal.tsx',
    dataType: 'string[] (JSON)',
    retention: 'Tab lifetime only',
    purpose: 'Preserves search history across in-tab refreshes while "Clear History on Exit" is enabled, disappearing once the tab closes.',
    deletionMethod: 'Close browser tab, Clear History, or Simulate Session Termination',
  },
];

export const BACKEND_MEMORY_STORES: BackendMemoryStore[] = [
  {
    identifier: 'serverIndexedPages',
    layer: 'Express Node.js (In-Memory)',
    apiRoutes: 'GET /api/search · POST /api/index',
    dataStored: 'Initial seed corpus plus user-submitted URLs, titles, snippets, canonical URLs, authors, languages, keywords, and auto-indexed fallback results.',
    persistenceBehavior: 'Volatile RAM only. Resets to clean default seed state whenever the Node.js server process restarts.',
    userPurgeAction: 'Server process restart resets index to baseline corpus.',
  },
  {
    identifier: 'sessionSearchHistory',
    layer: 'Express Node.js (In-Memory)',
    apiRoutes: 'GET /api/history · DELETE /api/history?session_id=...',
    dataStored: 'Recent query strings keyed exclusively by the client ephemeral in-memory UUID (session_id).',
    persistenceBehavior: 'Volatile RAM only. Scoped strictly to the single active page-load UUID.',
    userPurgeAction: 'Immediate purge via Clear Search History (sends DELETE /api/history) or server restart.',
  },
  {
    identifier: 'serverSeeds / serverSchedule / serverCrawlHistory',
    layer: 'Express Node.js (In-Memory)',
    apiRoutes: '/api/crawler/seeds · /api/crawler/schedule · /api/crawler/history',
    dataStored: 'Active crawler seed URLs, recurring spider schedule intervals, and crawl execution logs.',
    persistenceBehavior: 'Volatile RAM only in standard Node.js runtime; resets on process restart.',
    userPurgeAction: 'Modify/delete seeds in Crawler tab or restart server process.',
  },
  {
    identifier: 'communityNotesByUrl',
    layer: 'Express Node.js (In-Memory)',
    apiRoutes: 'GET /api/community-notes · POST /api/community-notes',
    dataStored: 'Contextual community annotations and helpfulness score counters keyed by target URL.',
    persistenceBehavior: 'Volatile RAM only; resets to clean state when server process restarts.',
    userPurgeAction: 'Resets on server restart.',
  },
  {
    identifier: 'pages / crawler_history / crawler_seeds',
    layer: 'Python FastAPI + Firestore (Optional)',
    apiRoutes: 'backend/main.py & crawler/ service endpoints',
    dataStored: 'Indexed web page metadata, Whoosh full-text index structures, crawl run logs, and seed lists when optional cloud persistence is connected.',
    persistenceBehavior: 'Persisted to configured Google Cloud Firestore collections only if deployment administrator enables the Python/Firestore backend.',
    userPurgeAction: 'Managed via backend collection administrative controls.',
  },
];

export const EXTERNAL_DATA_FLOWS: ExternalProviderFlow[] = [
  {
    provider: 'SearXNG Metasearch Instances',
    endpoint: 'Configured SEARXNG_URL or public SearXNG nodes',
    category: 'Metasearch & Knowledge',
    triggerCondition: 'GET /api/search when local index matches < min_results (or when force_fallback=true)',
    dataTransmitted: 'Search query string (q), page number (pageno), language code (en)',
    dataExcluded: 'No client IP forwarding, no user cookies, no sessionId, no localStorage workspace data',
    purpose: 'Privacy-respecting metasearch fallback to retrieve live web results and optionally auto-seed the search catalog.',
    isOptionalServerConfig: false,
  },
  {
    provider: 'Wikipedia REST & MediaWiki API',
    endpoint: 'en.wikipedia.org/w/api.php',
    category: 'Metasearch & Knowledge',
    triggerCondition: 'SearXNG cascade fallback & Fireplexity multi-source knowledge retrieval',
    dataTransmitted: 'Search query string (gsrsearch)',
    dataExcluded: 'No personal identifiers, browser headers, or workspace context',
    purpose: 'Retrieves encyclopedia article extracts, canonical URLs, and thumbnail reference imagery.',
    isOptionalServerConfig: false,
  },
  {
    provider: 'Hacker News Algolia API',
    endpoint: 'hn.algolia.com/api/v1/search',
    category: 'Metasearch & Knowledge',
    triggerCondition: 'SearXNG cascade fallback & Fireplexity technical news retrieval',
    dataTransmitted: 'Search query string (query)',
    dataExcluded: 'No user identifiers, session tokens, or browsing history',
    purpose: 'Retrieves technical engineering articles, community discussions, and news items.',
    isOptionalServerConfig: false,
  },
  {
    provider: 'DuckDuckGo Instant Answer API',
    endpoint: 'api.duckduckgo.com',
    category: 'Metasearch & Knowledge',
    triggerCondition: 'SearXNG cascade fallback',
    dataTransmitted: 'Search query string (q)',
    dataExcluded: 'No cookies, user agent profiling, or local storage state',
    purpose: 'Retrieves instant answer abstracts, disambiguation summaries, and related topic links.',
    isOptionalServerConfig: false,
  },
  {
    provider: 'Common Crawl CDX Server API',
    endpoint: 'index.commoncrawl.org',
    category: 'Web Archive & Scraping',
    triggerCondition: 'User explicitly clicks "Search Common Crawl" inside the Crawler tab',
    dataTransmitted: 'Target domain string (domain) and numeric result limit (limit)',
    dataExcluded: 'No search history, collections, or user identity data',
    purpose: 'Discovers historical publicly crawled URLs for seed import into the index.',
    isOptionalServerConfig: false,
  },
  {
    provider: 'Firecrawl API',
    endpoint: 'api.firecrawl.dev',
    category: 'Web Archive & Scraping',
    triggerCondition: 'Fireplexity search when FIRECRAWL_API_KEY is configured on the server',
    dataTransmitted: 'Search query string (query) and target public URLs to parse',
    dataExcluded: 'No user credentials, client storage, or private notebooks',
    purpose: 'Scrapes live public web pages into clean Markdown for cited research synthesis.',
    isOptionalServerConfig: true,
  },
  {
    provider: 'Groq API / Google Gemini API',
    endpoint: 'Server-side LLM synthesis proxy (/api/fireplexity)',
    category: 'AI Synthesis (Optional)',
    triggerCondition: 'User initiates Fireplexity AI Search or clicks AI Tag Suggestion when GROQ_API_KEY or GEMINI_API_KEY is configured on server',
    dataTransmitted: 'Search query string and scraped public web excerpts',
    dataExcluded: 'Never transmits private Research Projects, Notebooks, Collections, or browser cookies',
    purpose: 'Generates cited Markdown research synthesis, follow-up questions, and topical metadata tags.',
    isOptionalServerConfig: true,
  },
];

export const USER_CONTROL_MECHANISMS: UserControlMechanism[] = [
  {
    id: 'clear-history',
    title: 'Immediate Search History Purge',
    uiLocation: 'Settings Modal (Ctrl+,) & Search Bar History Dropdown',
    technicalEffect: 'Removes isaac_history from localStorage, clears isaac_history_session_cache from sessionStorage, and dispatches DELETE /api/history?session_id=... to wipe server-side RAM history.',
    scope: 'Client Browser & Active Server Session',
  },
  {
    id: 'ephemeral-exit',
    title: 'Clear History on Exit (Ephemeral Mode)',
    uiLocation: 'Settings Modal -> Privacy & History Controls',
    technicalEffect: 'Sets isaac_clear_history_on_exit to "true" and binds a window beforeunload listener that automatically purges isaac_history when the tab or browser window closes.',
    scope: 'Automatic Lifecycle Hook',
  },
  {
    id: 'simulate-termination',
    title: 'Simulate Session Termination',
    uiLocation: 'Settings Modal -> Ephemeral Verification Controls',
    technicalEffect: 'Executes the exact session teardown sequence immediately without closing the browser tab, allowing users to audit and verify that ephemeral history destruction works as specified.',
    scope: 'Verification & Audit Control',
  },
  {
    id: 'domain-blocking',
    title: 'Granular Domain Blocking & Filtering',
    uiLocation: 'Search Result Three-Dot Menu & Settings Modal',
    technicalEffect: 'Appends or removes domain strings in localStorage["blocked_domains"] or applies single-search domain exclusions before rendering results.',
    scope: 'Local Search Result Filtering',
  },
  {
    id: 'data-portability',
    title: 'Zero-Lock-In Data Portability (Export & Import)',
    uiLocation: 'Collections, Research Projects, Search Results & Crawler Consoles',
    technicalEffect: 'Exports Search Results to PDF; Collections to .json, .csv, or .md; Research Projects to Markdown, JSON, CSV, or PDF briefs; and Crawler Logs to raw .log files.',
    scope: 'Full Local Workspace Portability',
  },
  {
    id: 'factory-reset',
    title: 'Full Local Cache Reset & Reload',
    uiLocation: 'Settings Modal & Root Error Boundary Recovery',
    technicalEffect: 'Invokes localStorage.clear() and sessionStorage.clear() for the application origin and reloads the page to its clean factory default state.',
    scope: 'Complete Client Storage Destruction',
  },
];

export const POLICY_CHAPTERS: PolicyChapter[] = [
  {
    number: '01',
    id: 'core-architecture',
    title: 'Core Privacy Architecture & Guiding Principles',
    subtitle: 'Anonymous by design, local-first by default, and verifiable in real time.',
    marginNoteTitle: 'Plain-Language Summary',
    marginNoteBody:
      'You never create an account to use Isaac Search Engine. Your bookmarks, projects, and notes stay in your own browser storage rather than on a remote user database.',
    paragraphs: [
      'Isaac Search Engine ("Isaac", "the Application") is architected from first principles to separate information discovery from personal surveillance. Unlike conventional search engines and cloud research tools that bind your queries, reading habits, and workspace notes to a persistent advertising or account profile, Isaac operates with zero mandatory account tracking.',
      'We do not require user registration, login credentials, personal identifiers (such as your name, email address, or phone number), or authentication cookies to access any core feature of the platform—including Web Search, Image Search, Fireplexity AI Synthesis, Domain Graph Analysis, Search Collections, or Research Project Workspaces.',
      'To support deep, multi-session research without compromising anonymity, the Application utilizes a Local-First Persistence model. Your curated collections, research project task trees, Markdown notebooks, custom tag taxonomies, and UI preferences are stored directly within your web browser using standard Web Storage APIs (localStorage and sessionStorage).',
    ],
    bulletPoints: [
      {
        label: 'Ephemeral In-Memory Session ID',
        detail:
          'Upon each page load, the client generates a random Version 4 UUID (sessionId via uuidv4()) strictly in volatile memory. This identifier exists solely to scope optional in-session search history requests and is discarded when you close or reload the page.',
      },
      {
        label: 'No Cross-Site Tracking or Behavioral Profiling',
        detail:
          'Isaac Search Engine embeds no third-party advertising pixels, behavioral analytics scripts, fingerprinting telemetry, or cross-origin tracking cookies.',
      },
    ],
  },
  {
    number: '02',
    id: 'data-collection',
    title: 'Categories of Data Processed by the Application',
    subtitle: 'Strict minimization across search discovery, voice hardware APIs, and local workspaces.',
    marginNoteTitle: 'Hardware Audio Guarantee',
    marginNoteBody:
      'When you use Voice Search or Read-Aloud, raw audio is processed natively by your browser on your device and is never uploaded to Isaac servers.',
    paragraphs: [
      'Because Isaac Search Engine does not collect personal identity records, the information processed by the Application is strictly limited to the functional inputs you explicitly provide while searching, indexing, or organizing research materials.',
      'All data processed falls into three functional boundaries: (A) Search & Discovery Inputs, (B) User-Created Workspace & Curation Data, and (C) System & Interface Preferences.',
    ],
    bulletPoints: [
      {
        label: 'Search Queries & Filter Parameters',
        detail:
          'Keywords and phrases (searchQuery), domain restrictions (filterDomain), publication date bounds, backlink thresholds, and inner result filters (searchWithinQuery) entered across Web Search, Image Search, or Fireplexity AI Search.',
      },
      {
        label: 'On-Device Voice Search Input (Optional)',
        detail:
          'When you activate the microphone control, speech recognition is handled locally via your browser’s native Web Speech API (SpeechRecognition / webkitSpeechRecognition) and converted into plain text for the search input. Raw audio streams are never recorded or transmitted to Isaac backend servers.',
      },
      {
        label: 'On-Device Read-Aloud Synthesis (Optional)',
        detail:
          'Text-to-speech playback invokes the client browser’s native window.speechSynthesis API locally on your device without external audio streaming.',
      },
      {
        label: 'Workspace Curation & Research Projects',
        detail:
          'Custom bookmark folders (collections), saved page references, project titles, task/subtask hierarchies, linked collections, and debounced Markdown notebook drafts (isaac_notebook_draft_<projectId>) stored locally in your browser.',
      },
      {
        label: 'Community Notes, Votes & Custom Indexed Pages',
        detail:
          'Contextual annotations and helpfulness votes submitted on indexed URLs, as well as URLs, titles, snippets, canonical URLs, authors, languages, and topical tags manually indexed or imported via Common Crawl / Crawler Seed controls.',
      },
    ],
  },
  {
    number: '03',
    id: 'client-storage',
    title: 'Client-Side Web Storage Specification',
    subtitle: 'Exhaustive disclosure of all 17 localStorage and sessionStorage keys scoped to the application origin.',
    marginNoteTitle: 'Zero Third-Party Cookies',
    marginNoteBody:
      'Instead of opaque tracking cookies sent with every HTTP header, Isaac stores workspace state in explicit, inspectable Web Storage keys that never leave your browser.',
    paragraphs: [
      'All client-side application state is persisted in standard browser Web Storage APIs (window.localStorage and window.sessionStorage) scoped strictly to the Application origin. None of these keys are automatically transmitted in HTTP request headers.',
      'When "Clear History on Exit" (isaac_clear_history_on_exit) is enabled, the Application coordinates localStorage and sessionStorage using a session-detection flag (isaac_session_active) and an in-tab cache (isaac_history_session_cache). This architecture preserves your history across accidental page refreshes within the same open tab while guaranteeing automatic erasure the moment the tab or browser window is closed.',
    ],
  },
  {
    number: '04',
    id: 'backend-handling',
    title: 'Backend Server & Optional Database Architecture',
    subtitle: 'Volatile in-memory Node.js structures and optional cloud persistence disclosures.',
    marginNoteTitle: 'Volatile RAM by Default',
    marginNoteBody:
      'In the default Express server runtime (server.ts), search indexes, crawl logs, and session history live purely in RAM and reset cleanly whenever the server restarts.',
    paragraphs: [
      'The primary Node.js/Express application server (server.ts) processes API requests under /api/* using non-persistent, in-memory data structures designed for low-latency BM25 relevance scoring, filtering, and session isolation.',
      'In the default configuration, all server-side state—including serverIndexedPages, sessionSearchHistory, serverSeeds, serverSchedule, serverCrawlHistory, and communityNotesByUrl—resides purely in volatile system memory (RAM) and resets to the clean baseline seed corpus whenever the server process restarts.',
      'Optional Cloud Persistence Disclosure: If a deployment administrator connects the optional Python FastAPI backend (backend/main.py) with Google Cloud Firestore and Whoosh indexing enabled, public indexed page records, crawler seed lists, and crawl telemetry logs are persisted to the configured Firestore collections (pages, crawler_history, and crawler_seeds). Personal workspaces (Collections, Projects, and Notebooks) remain strictly client-side in localStorage regardless of backend configuration.',
    ],
  },
  {
    number: '05',
    id: 'external-flows',
    title: 'External Metasearch, Archival & AI Data Flows',
    subtitle: 'Query-only transmission with zero forwarding of personal data, cookies, or local workspaces.',
    marginNoteTitle: 'Strict Query Stripping',
    marginNoteBody:
      'When fetching live web results or AI citations, our backend sends only the raw search query string—never your sessionId, cookies, or local research projects.',
    paragraphs: [
      'When local index results are sparse, when live metasearch fallback is triggered, or when you explicitly invoke Common Crawl discovery or Fireplexity AI synthesis, the backend server acts as a privacy-preserving proxy.',
      'Across all external requests, the backend transmits ONLY the minimal search query string (and optional target domain filter). No user identifiers, browser cookies, session UUIDs, IP addresses, or client-side localStorage workspaces are ever shared with third-party APIs.',
    ],
  },
  {
    number: '06',
    id: 'user-controls',
    title: 'User Data Ownership, Portability & Deletion Controls',
    subtitle: 'Self-service erasure, ephemeral session verification, and open-format data export.',
    marginNoteTitle: 'Immediate Self-Service Rights',
    marginNoteBody:
      'Because you hold your own data in browser storage, you do not need to wait 30 days for a support ticket to export or erase your information—you can execute it in one click.',
    paragraphs: [
      'Isaac Search Engine provides direct, programmatic controls inside the user interface so you can audit, export, filter, or permanently destroy your data at any time without administrative intervention.',
      'We believe privacy policies should be backed by verifiable engineering controls. In addition to standard history deletion and "Clear History on Exit", the Settings Modal includes a "Simulate Session Termination" action so users and security auditors can immediately verify ephemeral teardown behavior in real time.',
    ],
  },
  {
    number: '07',
    id: 'regulatory-rights',
    title: 'Global Privacy Rights (GDPR, UK GDPR, CCPA/CPRA)',
    subtitle: 'Statutory alignment with European, California, and international data protection frameworks.',
    marginNoteTitle: 'Regulatory Compliance',
    marginNoteBody:
      'We do not sell or share personal information as defined under CCPA/CPRA, nor do we engage in automated profiling under GDPR Article 22.',
    paragraphs: [
      'Even though Isaac Search Engine is engineered to avoid collecting personally identifiable information (PII), we uphold the highest standards of global privacy regulation, including the European Union General Data Protection Regulation (GDPR), the United Kingdom GDPR, and the California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA).',
    ],
    bulletPoints: [
      {
        label: 'Right of Access & Data Portability (GDPR Art. 15 & 20 / CCPA)',
        detail:
          'You can inspect all locally stored keys at any time and export your Search Results (PDF), Collections (.json, .csv, .md), Research Projects (Markdown, JSON, CSV, PDF), and Crawler Logs (.log) directly from the application interface.',
      },
      {
        label: 'Right to Erasure / "Right to be Forgotten" (GDPR Art. 17)',
        detail:
          'You can instantaneously erase your search history across both client storage and server memory via the Clear History control (which triggers DELETE /api/history?session_id=...), or wipe all local state via the Full Factory Reset control.',
      },
      {
        label: 'No Sale or Sharing of Personal Information (CCPA/CPRA)',
        detail:
          'Isaac Search Engine does not sell, rent, lease, or share personal data with data brokers, ad networks, or third parties for cross-context behavioral advertising.',
      },
      {
        label: 'Children’s Privacy (COPPA)',
        detail:
          'The Application does not knowingly solicit or collect personal information from children under the age of 13 (or applicable statutory age in your jurisdiction).',
      },
    ],
  },
  {
    number: '08',
    id: 'governance-contact',
    title: 'Policy Governance, Updates & Contact Information',
    subtitle: 'Transparent versioning and direct technical contact.',
    marginNoteTitle: 'Open Architecture Audits',
    marginNoteBody:
      'Every storage key and API endpoint listed in this document maps 1:1 to the application source tree.',
    paragraphs: [
      'Whenever new client-side storage keys, indexing pipelines, or external synthesis providers are introduced to Isaac Search Engine, this Privacy Policy & Data Handling Architecture document is updated in tandem with the source code release.',
      `If you have technical questions regarding our local-first persistence model, ephemeral session handling, or third-party proxy boundaries, please contact the maintainer directly at ${POLICY_META.contactEmail}.`,
    ],
  },
];

export function generatePolicyMarkdown(): string {
  const lines: string[] = [];
  lines.push(`# ${POLICY_META.appName} — Privacy Policy & Data Handling Architecture`);
  lines.push(`**Effective Date:** ${POLICY_META.effectiveDate} · **Last Updated:** ${POLICY_META.lastUpdated} · **Version:** ${POLICY_META.version}`);
  lines.push('');
  lines.push(`> ${POLICY_META.summaryStatement}`);
  lines.push('');

  lines.push('## 1. Core Data Architecture & Privacy Principles');
  lines.push('');
  for (const p of CORE_PRINCIPLES) {
    lines.push(`### ${p.index}. ${p.title}`);
    lines.push(`${p.detail}`);
    lines.push('');
  }

  for (const chapter of POLICY_CHAPTERS) {
    lines.push(`## Section ${chapter.number}: ${chapter.title}`);
    lines.push(`*${chapter.subtitle}*`);
    lines.push('');
    for (const para of chapter.paragraphs) {
      lines.push(para);
      lines.push('');
    }
    if (chapter.bulletPoints && chapter.bulletPoints.length > 0) {
      for (const bp of chapter.bulletPoints) {
        lines.push(`- **${bp.label}**: ${bp.detail}`);
      }
      lines.push('');
    }

    if (chapter.id === 'client-storage') {
      lines.push('### Client-Side Web Storage Inventory (`localStorage` & `sessionStorage`)');
      lines.push('');
      lines.push('| Storage Key | API Scope | Component / Hook | Data Type | Purpose & Lifecycle | Deletion Method |');
      lines.push('| :--- | :--- | :--- | :--- | :--- | :--- |');
      for (const item of CLIENT_STORAGE_INVENTORY) {
        lines.push(
          `| \`${item.key}\` | \`${item.storageType}\` | \`${item.component}\` | \`${item.dataType}\` | ${item.purpose} | ${item.deletionMethod} |`
        );
      }
      lines.push('');
    }

    if (chapter.id === 'backend-handling') {
      lines.push('### Backend Server Memory & Optional Database Stores');
      lines.push('');
      lines.push('| Store Identifier | Runtime Layer | API Routes | Data Stored | Persistence & Reset Behavior |');
      lines.push('| :--- | :--- | :--- | :--- | :--- |');
      for (const store of BACKEND_MEMORY_STORES) {
        lines.push(
          `| \`${store.identifier}\` | ${store.layer} | \`${store.apiRoutes}\` | ${store.dataStored} | ${store.persistenceBehavior} |`
        );
      }
      lines.push('');
    }

    if (chapter.id === 'external-flows') {
      lines.push('### External & Third-Party API Data Flows');
      lines.push('');
      lines.push('| External Service | Trigger Condition | Data Transmitted | Data Excluded | Purpose |');
      lines.push('| :--- | :--- | :--- | :--- | :--- |');
      for (const flow of EXTERNAL_DATA_FLOWS) {
        lines.push(
          `| **${flow.provider}** (\`${flow.endpoint}\`) | ${flow.triggerCondition} | ${flow.dataTransmitted} | ${flow.dataExcluded} | ${flow.purpose} |`
        );
      }
      lines.push('');
    }

    if (chapter.id === 'user-controls') {
      lines.push('### User Data Controls, Export & Deletion Mechanisms');
      lines.push('');
      for (const ctrl of USER_CONTROL_MECHANISMS) {
        lines.push(`- **${ctrl.title}** (*${ctrl.uiLocation}*): ${ctrl.technicalEffect}`);
      }
      lines.push('');
    }
  }

  lines.push('---');
  lines.push(`Contact: ${POLICY_META.contactEmail}`);
  return lines.join('\n');
}

export function generatePolicyHtml(): string {
  const md = generatePolicyMarkdown();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${POLICY_META.appName} — Privacy Policy</title>
  <style>
    body { font-family: Georgia, serif; max-width: 860px; margin: 40px auto; padding: 0 24px; line-height: 1.7; color: #1c1917; background: #fbf9f5; }
    h1, h2, h3 { font-weight: 600; color: #0c0a09; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; font-family: sans-serif; font-size: 13px; }
    th, td { border: 1px solid #d6d3d1; padding: 10px 12px; text-align: left; vertical-align: top; }
    th { background: #f5f5f4; }
    code { font-family: monospace; background: #f5f5f4; padding: 2px 4px; font-size: 12px; }
    blockquote { border-left: 3px solid #78350f; padding-left: 16px; color: #44403c; font-style: italic; }
  </style>
</head>
<body>
  <h1>${POLICY_META.appName} — Privacy Policy &amp; Data Handling Architecture</h1>
  <p><strong>Effective Date:</strong> ${POLICY_META.effectiveDate} &middot; <strong>Last Updated:</strong> ${POLICY_META.lastUpdated} &middot; <strong>Version:</strong> ${POLICY_META.version}</p>
  <blockquote>${POLICY_META.summaryStatement}</blockquote>
  <pre style="white-space: pre-wrap; font-family: inherit;">${md.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
}

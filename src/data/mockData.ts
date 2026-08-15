import { Subject, Material, Question, User, NotificationItem } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  // LEVEL 2 - SEMESTER 1 (6 subjects)
  {
    id: 'sub_l2_s1_1',
    code: 'CS201',
    name: 'Data Structures & Algorithms I',
    description: 'Fundamental linear structures, asymptotic complexity analysis, arrays, stacks, queues, and linked lists.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Algorithms', 'C++', 'Data Structures']
  },
  {
    id: 'sub_l2_s1_2',
    code: 'CS202',
    name: 'Object-Oriented Programming',
    description: 'Core OOP paradigms including encapsulation, inheritance, polymorphism, abstract classes, and design patterns in Java.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Java', 'OOP', 'Software Design']
  },
  {
    id: 'sub_l2_s1_3',
    code: 'MATH201',
    name: 'Discrete Mathematics',
    description: 'Set theory, propositional logic, graph theory, combinatorics, and proof techniques for computer science.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Mathematics', 'Logic', 'Graphs']
  },
  {
    id: 'sub_l2_s1_4',
    code: 'ENG201',
    name: 'Digital Logic Design',
    description: 'Boolean algebra, logic gates, combinational and sequential circuit synthesis, flip-flops, and ALU fundamentals.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Hardware', 'Circuits', 'Logic']
  },
  {
    id: 'sub_l2_s1_5',
    code: 'STAT201',
    name: 'Probability & Statistics',
    description: 'Probability spaces, random variables, Bayes theorem, distributions, confidence intervals, and hypothesis testing.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Statistics', 'Probability', 'Math']
  },
  {
    id: 'sub_l2_s1_6',
    code: 'HUM201',
    name: 'Technical Writing & Communication',
    description: 'Professional engineering documentation, research paper authoring, technical presentation, and peer reviews.',
    credits: 2,
    primaryLevel: 'level_2',
    semester: 1,
    tags: ['Communication', 'Writing', 'Professional']
  },

  // LEVEL 2 - SEMESTER 2 (6 subjects)
  {
    id: 'sub_l2_s2_1',
    code: 'CS203',
    name: 'Advanced Data Structures',
    description: 'Non-linear data structures, balanced binary search trees (AVL, Red-Black), heaps, tries, hash tables, and graphs.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['Trees', 'Graphs', 'Algorithms']
  },
  {
    id: 'sub_l2_s2_2',
    code: 'CS204',
    name: 'Computer Architecture & Assembly',
    description: 'Instruction set architecture (RISC-V/MIPS), pipelining, memory hierarchy, cache coherency, and assembly programming.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['Architecture', 'Assembly', 'Hardware']
  },
  {
    id: 'sub_l2_s2_3',
    code: 'MATH202',
    name: 'Linear Algebra',
    description: 'Vector spaces, matrix decomposition, eigenvalues, eigenvectors, determinants, and transformations for computing.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['Math', 'Vectors', 'Linear Algebra']
  },
  {
    id: 'sub_l2_s2_4',
    code: 'IS201',
    name: 'Database Fundamentals',
    description: 'Relational model principles, ER diagram modeling, SQL DDL/DML, and schema normalization up to BCNF.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['SQL', 'Databases', 'Relational']
  },
  {
    id: 'sub_l2_s2_5',
    code: 'CS205',
    name: 'Systems Programming in C/C++',
    description: 'Pointers, low-level memory allocation, UNIX system calls, file descriptors, and multithreaded concurrency.',
    credits: 3,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['C', 'Systems', 'UNIX']
  },
  {
    id: 'sub_l2_s2_6',
    code: 'HUM202',
    name: 'Ethics in Computing & Tech Law',
    description: 'Intellectual property, digital privacy, algorithmic bias, software licensing, and professional codes of conduct.',
    credits: 2,
    primaryLevel: 'level_2',
    semester: 2,
    tags: ['Ethics', 'Law', 'Governance']
  },

  // LEVEL 3 - COMPUTER SCIENCE (CS) - SEMESTER 1 (6 subjects)
  {
    id: 'sub_l3_cs_s1_1',
    code: 'CS301',
    name: 'Database Systems',
    description: 'Advanced query processing, indexing structures (B+ trees), transaction ACID semantics, concurrency control, and recovery.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['Databases', 'Transactions', 'SQL']
  },
  {
    id: 'sub_l3_cs_s1_2',
    code: 'CS302',
    name: 'Operating Systems',
    description: 'Process management, CPU scheduling algorithms, virtual memory paging, synchronization primitives, and file systems.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['OS', 'Kernel', 'Threads']
  },
  {
    id: 'sub_l3_cs_s1_3',
    code: 'CS303',
    name: 'Computer Networks',
    description: 'OSI and TCP/IP protocol stacks, routing algorithms (OSPF, BGP), transport flow control (TCP), and socket programming.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['Networking', 'TCP/IP', 'Sockets']
  },
  {
    id: 'sub_l3_cs_s1_4',
    code: 'CS304',
    name: 'Design & Analysis of Algorithms',
    description: 'Divide and conquer, greedy methods, dynamic programming, network flow, NP-completeness, and approximation algorithms.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['Algorithms', 'Complexity', 'Dynamic Programming']
  },
  {
    id: 'sub_l3_cs_s1_5',
    code: 'CS305',
    name: 'Software Engineering',
    description: 'Agile methodologies, requirements elicitation, architectural patterns (Microservices/MVC), CI/CD, and test automation.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['Software Engineering', 'Agile', 'DevOps']
  },
  {
    id: 'sub_l3_cs_s1_6',
    code: 'CS306',
    name: 'Theory of Computation',
    description: 'Deterministic and non-deterministic finite automata, regular expressions, context-free grammars, and Turing machines.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 1,
    tags: ['Automata', 'Theory', 'Compilers']
  },

  // LEVEL 3 - COMPUTER SCIENCE (CS) - SEMESTER 2 (6 subjects)
  {
    id: 'sub_l3_cs_s2_1',
    code: 'CS311',
    name: 'Compiler Construction',
    description: 'Lexical analysis (Flex), syntax analysis (Bison), AST construction, semantic checking, and code generation.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Compilers', 'Parsing', 'Languages']
  },
  {
    id: 'sub_l3_cs_s2_2',
    code: 'CS312',
    name: 'Distributed Systems',
    description: 'Consensus algorithms (Raft, Paxos), CAP theorem, RPC frameworks, vector clocks, and distributed storage systems.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Distributed', 'Consensus', 'Cloud']
  },
  {
    id: 'sub_l3_cs_s2_3',
    code: 'CS313',
    name: 'Computer & Network Security',
    description: 'Symmetric & asymmetric cryptography (AES, RSA), TLS/SSL handshakes, penetration testing, and secure coding practices.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Security', 'Cryptography', 'Cyber']
  },
  {
    id: 'sub_l3_cs_s2_4',
    code: 'CS314',
    name: 'Web Engineering & Microservices',
    description: 'Modern frontend & backend architectures, RESTful APIs, GraphQL, asynchronous event queues, and Docker containerization.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Web', 'APIs', 'Docker']
  },
  {
    id: 'sub_l3_cs_s2_5',
    code: 'CS315',
    name: 'Computer Graphics & Visualization',
    description: 'Rasterization pipeline, 3D transformations, WebGL/OpenGL shaders, ray tracing, and geometry processing.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Graphics', 'Shaders', '3D']
  },
  {
    id: 'sub_l3_cs_s2_6',
    code: 'CS316',
    name: 'Embedded Systems & IoT',
    description: 'Microcontroller programming (ARM Cortex/ESP32), GPIO, I2C, SPI interfaces, FreeRTOS, and MQTT IoT protocols.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'CS',
    semester: 2,
    tags: ['Embedded', 'IoT', 'RTOS']
  },

  // LEVEL 3 - ARTIFICIAL INTELLIGENCE (AI) - SEMESTER 1 (6 subjects)
  {
    id: 'sub_l3_ai_s1_1',
    code: 'AI301',
    name: 'Foundations of Artificial Intelligence',
    description: 'State-space search (A*, Minimax, Alpha-Beta pruning), CSPs, knowledge representation, and probabilistic reasoning.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['AI', 'Search', 'Logic']
  },
  {
    id: 'sub_l3_ai_s1_2',
    code: 'AI302',
    name: 'Machine Learning Fundamentals',
    description: 'Supervised vs unsupervised learning, linear/logistic regression, SVMs, decision trees, random forests, and PCA.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['Machine Learning', 'Python', 'Scikit-Learn']
  },
  {
    id: 'sub_l3_ai_s1_3',
    code: 'AI303',
    name: 'Neural Networks & Deep Learning',
    description: 'Backpropagation, activation functions, CNNs, RNNs, optimization techniques (Adam, SGD), and PyTorch development.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['Deep Learning', 'PyTorch', 'Neural Networks']
  },
  {
    id: 'sub_l3_ai_s1_4',
    code: 'AI304',
    name: 'Mathematical Foundations of AI',
    description: 'Multivariable calculus, matrix calculus, optimization theory, convex optimization, and information theory.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['Mathematics', 'Optimization', 'Calculus']
  },
  {
    id: 'sub_l3_ai_s1_5',
    code: 'AI305',
    name: 'Data Engineering & Pipelines',
    description: 'Data ingestion at scale, Apache Spark, feature stores, data validation, and ETL pipelines for AI workflows.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['Big Data', 'Spark', 'ETL']
  },
  {
    id: 'sub_l3_ai_s1_6',
    code: 'AI306',
    name: 'Computer Networks for AI',
    description: 'Network protocols, distributed parameter servers, GPU cluster interconnects, and RDMA fundamentals.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 1,
    tags: ['Networks', 'Clusters', 'Distributed AI']
  },

  // LEVEL 3 - ARTIFICIAL INTELLIGENCE (AI) - SEMESTER 2 (6 subjects)
  {
    id: 'sub_l3_ai_s2_1',
    code: 'AI311',
    name: 'Natural Language Processing & LLMs',
    description: 'Tokenization, word embeddings, transformer architectures, self-attention mechanisms, and fine-tuning LLMs.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['NLP', 'Transformers', 'LLMs']
  },
  {
    id: 'sub_l3_ai_s2_2',
    code: 'AI312',
    name: 'Computer Vision & Visual Computing',
    description: 'Image filtering, edge detection, object detection (YOLO), semantic segmentation, and Vision Transformers.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['Computer Vision', 'OpenCV', 'Detection']
  },
  {
    id: 'sub_l3_ai_s2_3',
    code: 'AI313',
    name: 'Reinforcement Learning',
    description: 'Markov Decision Processes, Q-learning, Policy Gradients (PPO, TRPO), Actor-Critic models, and robotic simulation.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['RL', 'Gym', 'Robotics']
  },
  {
    id: 'sub_l3_ai_s2_4',
    code: 'AI314',
    name: 'AI Safety, Ethics & Governance',
    description: 'Model alignment, adversarial robustness, explainability (SHAP/LIME), algorithmic fairness, and data compliance.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['AI Ethics', 'Safety', 'Alignment']
  },
  {
    id: 'sub_l3_ai_s2_5',
    code: 'AI315',
    name: 'MLOps & Model Deployment',
    description: 'Containerized model serving, ONNX runtime, Triton Inference Server, drift monitoring, and model registries.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['MLOps', 'Deployment', 'Docker']
  },
  {
    id: 'sub_l3_ai_s2_6',
    code: 'AI316',
    name: 'Generative AI & Diffusion Models',
    description: 'Variational autoencoders (VAEs), Generative Adversarial Networks (GANs), DDPMs, Latent Diffusion, and prompt design.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'AI',
    semester: 2,
    tags: ['GenAI', 'Diffusion', 'Creative AI']
  },

  // LEVEL 3 - INFORMATION SYSTEMS (IS) - SEMESTER 1 (6 subjects)
  {
    id: 'sub_l3_is_s1_1',
    code: 'IS301',
    name: 'Enterprise Architecture & Cloud Systems',
    description: 'TOGAF principles, cloud-native migration, AWS/Azure architectures, microservices integration, and scalability.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['Enterprise', 'Cloud', 'Architecture']
  },
  {
    id: 'sub_l3_is_s1_2',
    code: 'IS302',
    name: 'Business Process Management & ERP',
    description: 'BPMN 2.0 notation, workflow automation, SAP/NetSuite ERP modules, supply chain optimization, and KPIs.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['ERP', 'BPMN', 'Business']
  },
  {
    id: 'sub_l3_is_s1_3',
    code: 'IS303',
    name: 'Data Warehousing & Business Intelligence',
    description: 'Dimensional modeling, Star/Snowflake schemas, OLAP cubes, PowerBI/Tableau dashboarding, and analytical ETL.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['Data Warehouse', 'BI', 'Analytics']
  },
  {
    id: 'sub_l3_is_s1_4',
    code: 'IS304',
    name: 'Systems Analysis & Agile Product Design',
    description: 'Use case modeling, user journey mapping, design sprints, product backlog prioritization, and Scrum practices.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['Product', 'Agile', 'Scrum']
  },
  {
    id: 'sub_l3_is_s1_5',
    code: 'IS305',
    name: 'IT Governance, Risk & Cybersecurity',
    description: 'COBIT, ITIL frameworks, risk mitigation matrices, compliance audits (SOC2/ISO27001), and disaster recovery.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['Governance', 'Risk', 'Compliance']
  },
  {
    id: 'sub_l3_is_s1_6',
    code: 'IS306',
    name: 'Information Retrieval & Search Engines',
    description: 'Inverted indexes, vector space scoring (TF-IDF, BM25), web crawling, ranking algorithms, and Elasticsearch.',
    credits: 3,
    primaryLevel: 'level_3',
    department: 'IS',
    semester: 1,
    tags: ['Search', 'Elasticsearch', 'Indexing']
  }
];

// Initial pre-loaded link-based materials (no uploads, pure URL metadata)
export const INITIAL_MATERIALS: Material[] = [
  // Database Systems (CS301)
  {
    id: 'mat_101',
    title: 'Normalization: 1NF to BCNF Masterclass',
    description: 'Comprehensive decomposition walkthrough covering functional dependencies, candidate keys, 2NF, 3NF, and Boyce-Codd Normal Form with step-by-step proofs.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=UrYLYV7WSHM',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '52 mins',
    provider: 'YouTube / MIT OCW',
    viewCount: 342,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'mat_102',
    title: 'Stanford CS145 Database Architecture Lecture Notes',
    description: 'Official slide deck and rigorous textbook notes detailing storage manager, buffer pool algorithms (LRU, Clock), and B+ Tree node splitting mechanics.',
    type: 'pdf',
    url: 'https://web.stanford.edu/class/cs145/notes/03-storage.pdf',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '38 pages',
    provider: 'Stanford University',
    viewCount: 512,
    createdAt: '2026-08-02T14:30:00Z',
    updatedAt: '2026-08-02T14:30:00Z'
  },
  {
    id: 'mat_103',
    title: 'Midterm Exam 2025: Solution & Grading Rubric',
    description: 'Full official midterm question paper covering SQL subqueries, relational algebra expressions, and transaction conflict serializability graphs.',
    type: 'exam',
    url: 'https://drive.google.com/file/d/sample-db-exam-2025/view',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '12 pages',
    provider: 'Department Archive',
    viewCount: 840,
    createdAt: '2026-08-05T09:15:00Z',
    updatedAt: '2026-08-05T09:15:00Z'
  },
  {
    id: 'mat_104',
    title: 'Transaction Concurrency & 2PL Cheat Sheet',
    description: 'Concise high-yield summary table comparing Strict 2PL, Conservative 2PL, Lock conversion hierarchies, and Deadlock prevention algorithms (Wait-Die / Wound-Wait).',
    type: 'summary',
    url: 'https://notion.so/college-cs/db-concurrency-cheatsheet',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '6 pages',
    provider: 'Notion Workspace',
    viewCount: 620,
    createdAt: '2026-08-08T11:00:00Z',
    updatedAt: '2026-08-08T11:00:00Z'
  },
  {
    id: 'mat_105',
    title: 'Database System Concepts (Silberschatz 7th Ed. Online Companion)',
    description: 'Authoritative textbook chapters repository with code samples in PostgreSQL and interactive query execution sandboxes.',
    type: 'book',
    url: 'https://db-book.com/db7/index.html',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '1350 pages',
    provider: 'McGraw-Hill Companion',
    viewCount: 290,
    createdAt: '2026-08-10T16:00:00Z',
    updatedAt: '2026-08-10T16:00:00Z'
  },
  {
    id: 'mat_106',
    title: 'Interactive B-Tree Visualization Simulator',
    description: 'Browser-based interactive simulator illustrating real-time insertions, deletions, re-balancing, and rotational node borrows.',
    type: 'other',
    url: 'https://www.cs.usfca.edu/~galles/visualization/BTree.html',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: 'Interactive Tool',
    provider: 'USFCA Visual Algo',
    viewCount: 470,
    createdAt: '2026-08-11T12:00:00Z',
    updatedAt: '2026-08-11T12:00:00Z'
  },

  // Operating Systems (CS302)
  {
    id: 'mat_201',
    title: 'Virtual Memory & Page Replacement Algorithms',
    description: 'Deep dive into TLB translation, page fault handling, FIFO, LRU, Optimal replacement, and Belady anomaly simulation.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=qcBIvHMz-XQ',
    subjectId: 'sub_l3_cs_s1_2',
    subjectName: 'Operating Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '48 mins',
    provider: 'YouTube / CS Breakdowns',
    viewCount: 430,
    createdAt: '2026-08-03T10:00:00Z',
    updatedAt: '2026-08-03T10:00:00Z'
  },
  {
    id: 'mat_202',
    title: 'Operating Systems: Three Easy Pieces (OSTEP Free PDF)',
    description: 'Free authoritative textbook covering Virtualization, Concurrency (threads, semaphores, condition variables), and Persistence.',
    type: 'book',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    subjectId: 'sub_l3_cs_s1_2',
    subjectName: 'Operating Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '720 pages',
    provider: 'UW Madison OSTEP',
    viewCount: 910,
    createdAt: '2026-08-04T12:00:00Z',
    updatedAt: '2026-08-04T12:00:00Z'
  },
  {
    id: 'mat_203',
    title: 'OS Final Exam 2024 with Complete Model Answers',
    description: 'Official departmental final exam questions with worked solutions for Semaphore Producer-Consumer problem and Disk Scheduling.',
    type: 'exam',
    url: 'https://github.com/academic-portal/os-exams-archive',
    subjectId: 'sub_l3_cs_s1_2',
    subjectName: 'Operating Systems',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '16 pages',
    provider: 'GitHub Education',
    viewCount: 680,
    createdAt: '2026-08-06T15:00:00Z',
    updatedAt: '2026-08-06T15:00:00Z'
  },

  // Computer Networks (CS303)
  {
    id: 'mat_301',
    title: 'Wireshark Packet Analysis & TCP Handshake Walkthrough',
    description: 'Real-time packet inspection of 3-way SYN/ACK handshakes, TCP sequence numbering, window sliding, and retransmissions.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=3b_T4q-Yp1E',
    subjectId: 'sub_l3_cs_s1_3',
    subjectName: 'Computer Networks',
    targetLevel: 'level_3',
    department: 'CS',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '42 mins',
    provider: 'YouTube',
    viewCount: 390,
    createdAt: '2026-08-04T09:00:00Z',
    updatedAt: '2026-08-04T09:00:00Z'
  },

  // Level 2 - Data Structures & Algorithms I (sub_l2_s1_1)
  {
    id: 'mat_401',
    title: 'Asymptotic Analysis & Big-O Notation Masterclass',
    description: 'Formal mathematical definitions of Big-O, Omega, and Theta notations with recursive master theorem examples.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=D6xkbGLQesk',
    subjectId: 'sub_l2_s1_1',
    subjectName: 'Data Structures & Algorithms I',
    targetLevel: 'level_2',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l2', name: 'Prof. Elena Rostova', role: 'admin' },
    durationOrPages: '35 mins',
    provider: 'YouTube / MIT 6.006',
    viewCount: 750,
    createdAt: '2026-08-01T11:00:00Z',
    updatedAt: '2026-08-01T11:00:00Z'
  },
  {
    id: 'mat_402',
    title: 'Linked List Implementation Guide in C++',
    description: 'Memory pointers, singly/doubly linked lists, cycle detection (Floyd Tortoise and Hare), and reversing algorithms.',
    type: 'pdf',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-3-notes/',
    subjectId: 'sub_l2_s1_1',
    subjectName: 'Data Structures & Algorithms I',
    targetLevel: 'level_2',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l2', name: 'Prof. Elena Rostova', role: 'admin' },
    durationOrPages: '24 pages',
    provider: 'MIT OpenCourseWare',
    viewCount: 820,
    createdAt: '2026-08-02T13:00:00Z',
    updatedAt: '2026-08-02T13:00:00Z'
  },

  // Level 3 - Foundations of AI (sub_l3_ai_s1_1)
  {
    id: 'mat_501',
    title: 'UC Berkeley CS188: A* Search & Heuristic Admissibility',
    description: 'Proof of A* optimality when heuristics are admissible and consistent. Graph search vs Tree search comparative analysis.',
    type: 'video',
    url: 'https://www.youtube.com/watch?v=1uR4r04l0mY',
    subjectId: 'sub_l3_ai_s1_1',
    subjectName: 'Foundations of Artificial Intelligence',
    targetLevel: 'level_3',
    department: 'AI',
    semester: 1,
    isPublished: true,
    createdBy: { id: 'usr_admin_l3', name: 'Dr. Marcus Vance', role: 'admin' },
    durationOrPages: '50 mins',
    provider: 'UC Berkeley AI',
    viewCount: 460,
    createdAt: '2026-08-05T08:00:00Z',
    updatedAt: '2026-08-05T08:00:00Z'
  }
];

// Initial mock Q&A questions with real responses
export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q_101',
    userId: 'usr_student_1',
    userName: 'Ahmed Al-Mansoor',
    subjectId: 'sub_l3_cs_s1_1',
    subjectName: 'Database Systems',
    targetLevel: 'level_3',
    department: 'CS',
    title: 'When is Boyce-Codd Normal Form (BCNF) strictly preferred over 3NF?',
    content: 'In our lecture on schema synthesis, the professor mentioned that 3NF preserves all functional dependencies, but BCNF may sometimes lose them during decomposition. Could you provide a concrete example showing when we must sacrifice dependency preservation to achieve BCNF without update anomalies?',
    status: 'answered',
    answers: [
      {
        id: 'ans_101',
        questionId: 'q_101',
        authorId: 'usr_admin_l3',
        authorName: 'Dr. Marcus Vance',
        authorRole: 'admin',
        authorScope: 'level_3',
        content: 'Great question Ahmed! Consider a relation R(StudentID, Subject, Advisor) where (1) Each student has one advisor per subject: {StudentID, Subject} -> Advisor, and (2) Each advisor teaches only ONE subject: Advisor -> Subject. The candidate keys are (StudentID, Subject) and (StudentID, Advisor). In 3NF, Advisor -> Subject is permitted because Subject is a prime attribute. However, if an advisor leaves the university, we suffer deletion anomalies. Decomposing to BCNF R1(Advisor, Subject) and R2(StudentID, Advisor) eliminates the anomaly, but we can no longer check {StudentID, Subject} -> Advisor without a join!',
        createdAt: '2026-08-12T14:22:00Z'
      }
    ],
    createdAt: '2026-08-12T10:15:00Z',
    updatedAt: '2026-08-12T14:22:00Z'
  },
  {
    id: 'q_102',
    userId: 'usr_student_2',
    userName: 'Sarah Jenkins',
    subjectId: 'sub_l3_cs_s1_2',
    subjectName: 'Operating Systems',
    targetLevel: 'level_3',
    department: 'CS',
    title: 'How does the OS prevent priority inversion with Mutex locks?',
    content: 'If a low priority process holds a lock required by a high priority process, and a medium priority process preempts the low priority one, the high priority process starves. What exact mechanism does Linux use to resolve this?',
    status: 'answered',
    answers: [
      {
        id: 'ans_102',
        questionId: 'q_102',
        authorId: 'usr_admin_l3',
        authorName: 'Dr. Marcus Vance',
        authorRole: 'admin',
        authorScope: 'level_3',
        content: 'Linux implements Priority Inheritance Protocol (PIP). When the high-priority task blocks on the mutex held by the low-priority task, the low-priority task temporarily inherits the high priority level. This prevents the medium-priority task from preempting it until the lock is released.',
        createdAt: '2026-08-13T16:40:00Z'
      }
    ],
    createdAt: '2026-08-13T11:30:00Z',
    updatedAt: '2026-08-13T16:40:00Z'
  },
  {
    id: 'q_103',
    userId: 'usr_student_1',
    userName: 'Ahmed Al-Mansoor',
    subjectId: 'sub_l3_cs_s1_3',
    subjectName: 'Computer Networks',
    targetLevel: 'level_3',
    department: 'CS',
    title: 'Clarification regarding TCP Fast Retransmit vs Timeout',
    content: 'If TCP receives 3 duplicate ACKs for packet #4, does it reset the congestion window to 1 MSS (like a timeout) or to ssthresh/2 (Fast Recovery)?',
    status: 'pending',
    answers: [],
    createdAt: '2026-08-14T09:00:00Z',
    updatedAt: '2026-08-14T09:00:00Z'
  }
];

// Initial predefined users for effortless demoing & testing
export const INITIAL_USERS: User[] = [
  // 1. Current Student (Level 3 CS - Semester 1)
  {
    id: 'usr_student_1',
    name: 'Ahmed Al-Mansoor',
    email: 'ahmed.mansoor@college.edu',
    phone: '+1 (555) 234-8901',
    role: 'student',
    isActive: true,
    academicProfile: {
      level: 'level_3',
      department: 'CS',
      semester: 1,
      selectedSubjectIds: [
        'sub_l3_cs_s1_1', // Database Systems
        'sub_l3_cs_s1_2', // Operating Systems
        'sub_l3_cs_s1_3', // Computer Networks
        'sub_l3_cs_s1_4', // Design & Analysis of Algorithms
        'sub_l3_cs_s1_5', // Software Engineering
        'sub_l3_cs_s1_6'  // Theory of Computation
      ]
    },
    createdAt: '2026-07-15T08:00:00Z'
  },
  // 2. Student in Summer Program (Selecting up to 3 subjects)
  {
    id: 'usr_student_2',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@college.edu',
    phone: '+1 (555) 890-1234',
    role: 'student',
    isActive: true,
    academicProfile: {
      level: 'summer',
      selectedSubjectIds: [
        'sub_l2_s1_1', // Data Structures
        'sub_l3_cs_s1_1', // Database Systems
        'sub_l3_ai_s1_2' // Machine Learning Fundamentals
      ]
    },
    createdAt: '2026-07-20T10:00:00Z'
  },
  // 3. Student in Case Program (Up to 6 per semester)
  {
    id: 'usr_student_3',
    name: 'Michael Chang',
    email: 'm.chang@college.edu',
    phone: '+1 (555) 345-6789',
    role: 'student',
    isActive: true,
    academicProfile: {
      level: 'case',
      semester: 1,
      selectedSubjectIds: [
        'sub_l2_s1_1',
        'sub_l2_s1_3',
        'sub_l3_cs_s1_1',
        'sub_l3_cs_s1_2'
      ]
    },
    createdAt: '2026-07-22T12:00:00Z'
  },
  // 4. Scoped Admin: Level 3
  {
    id: 'usr_admin_l3',
    name: 'Dr. Marcus Vance',
    email: 'marcus.vance@college.edu',
    role: 'admin',
    adminScope: 'level_3',
    isActive: true,
    createdAt: '2026-06-01T09:00:00Z'
  },
  // 5. Scoped Admin: Level 2
  {
    id: 'usr_admin_l2',
    name: 'Prof. Elena Rostova',
    email: 'elena.rostova@college.edu',
    role: 'admin',
    adminScope: 'level_2',
    isActive: true,
    createdAt: '2026-06-01T09:00:00Z'
  },
  // 6. Scoped Admin: Summer
  {
    id: 'usr_admin_summer',
    name: 'Dr. Tariq Zaid',
    email: 'tariq.zaid@college.edu',
    role: 'admin',
    adminScope: 'summer',
    isActive: true,
    createdAt: '2026-06-15T09:00:00Z'
  },
  // 7. Super Admin: Global Control
  {
    id: 'usr_super_admin',
    name: 'Dean Arthur Pendelton',
    email: 'dean.pendelton@college.edu',
    role: 'super_admin',
    adminScope: 'all',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'New Material Added in Database Systems',
    message: 'Dr. Marcus Vance published "Normalization: 1NF to BCNF Masterclass" (Video Lecture).',
    type: 'material',
    read: false,
    createdAt: '2026-08-14T14:30:00Z',
    linkUrl: '/subjects/sub_l3_cs_s1_1'
  },
  {
    id: 'notif_2',
    title: 'Your Question Received an Admin Answer',
    message: 'Dr. Marcus Vance answered your question regarding BCNF vs 3NF decomposition.',
    type: 'answer',
    read: false,
    createdAt: '2026-08-12T14:22:00Z',
    linkUrl: '/questions'
  },
  {
    id: 'notif_3',
    title: 'Summer Term Registration Open',
    message: 'Summer subject selection window is now live. You can choose up to 3 subjects from the catalog.',
    type: 'academic',
    read: true,
    createdAt: '2026-08-01T08:00:00Z'
  }
];

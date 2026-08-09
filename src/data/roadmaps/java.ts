import { Challenge } from '../../types';

export const JAVA_ROADMAP: Challenge[] = Array.from({ length: 60 }, (_, index) => {
  const dayId = index + 1;

  if (dayId <= 10) {
    const topics = [
      "JDK Setup & First Main Class",
      "Primitive Data Types & Type Casting",
      "Control Flow: If-Else & Switch Expressions",
      "Loops, Arrays & Iteration Techniques",
      "Methods, Overloading & Variable Scope",
      "Object-Oriented Programming: Classes & Objects",
      "Constructors, Encapsulation & Access Modifiers",
      "Inheritance & Method Overriding",
      "Polymorphism & Abstract Classes",
      "Interfaces, Default Methods & Lambda Intro"
    ];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topics[dayId - 1]}`,
      description: `Master fundamental Java concepts in ${topics[dayId - 1]}. Build strong object-oriented memory mental models with strict static typing.`,
      requirements: [
        `Implement clean Java code demonstrating ${topics[dayId - 1]}`,
        "Handle edge cases and avoid NullPointerException",
        "Pass unit tests and format according to Java Google Style Guide"
      ],
      learningObjective: `Understand core Java execution principles for ${topics[dayId - 1]}.`,
      whyItMatters: "Java powers mission-critical enterprise systems worldwide requiring type-safe reliability.",
      challengeType: 'build',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      curiosityPrompt: "How does the JVM handle bytecode compilation vs JIT execution under the hood?",
      skills: ["Java 21", "OOP", "JVM", "Static Typing"],
      tools: ["OpenJDK", "IntelliJ IDEA / VS Code", "JShell"],
      stage: 'discover',
      stageName: 'Stage 1 — Discover (Days 1–10)'
    };
  } else if (dayId <= 25) {
    const topics = [
      "Java Collections: ArrayList vs LinkedList",
      "HashSet, TreeSet & Set Uniqueness",
      "HashMap, ConcurrentHashMap & Hash Collisions",
      "Generics, Bounded Wildcards & Type Erasure",
      "Exception Handling: Checked vs Unchecked",
      "Custom Exception Hierarchy & Try-With-Resources",
      "Java I/O, NIO2 & File Stream Processing",
      "Java Streams API: Filter, Map & Reduce",
      "Collectors, GroupingBy & Parallel Streams",
      "Optional Class & Null-Safe Programming",
      "Multithreading: Thread Class & Runnable Interface",
      "ExecutorService, Thread Pools & Callable",
      "CompletableFuture & Asynchronous Pipelines",
      "Locks, Synchronized & Thread Safety",
      "Maven / Gradle Dependency Management"
    ];
    const topic = topics[(dayId - 11) % topics.length];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topic}`,
      description: `Build performant, thread-safe backend modules leveraging ${topic}.`,
      requirements: [
        `Write idiomatic Java implementing ${topic}`,
        "Benchmark memory allocation and execution efficiency",
        "Write comprehensive unit test coverage"
      ],
      learningObjective: `Master Java core libraries and concurrency with ${topic}.`,
      whyItMatters: "High-throughput enterprise applications rely on multi-threaded execution and efficient collections.",
      challengeType: 'build',
      difficulty: 'intermediate',
      estimatedMinutes: 45,
      curiosityPrompt: "What happens during Garbage Collection when heavy heap allocations occur?",
      skills: ["Java Collections", "Streams API", "Concurrency", "Maven"],
      tools: ["JUnit 5", "Maven", "VisualVM"],
      stage: 'build',
      stageName: 'Stage 2 — Build (Days 11–25)'
    };
  } else if (dayId <= 35) {
    const topics = [
      "Spring Boot Core: Inversion of Control & DI",
      "Spring Beans, Scopes & Component Scanning",
      "Spring REST Controllers & Request Mappings",
      "Spring Data JPA, Entities & Repositories",
      "Database Migrations with Flyway / Liquibase",
      "DTO Pattern, ModelMapper & MapStruct",
      "Global Exception Handling with @ControllerAdvice",
      "Bean Validation with Jakarta Validation Annotations",
      "Spring Security Basics & Basic Auth",
      "JWT Authentication & Custom Security Filters"
    ];
    const topic = topics[(dayId - 26) % topics.length];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topic}`,
      description: `Build robust Web APIs and backend services using ${topic}.`,
      requirements: [
        `Configure Spring Boot components for ${topic}`,
        "Expose clean REST endpoints with HTTP status codes",
        "Validate incoming request payloads and handle errors"
      ],
      learningObjective: `Implement industry-standard enterprise patterns using ${topic}.`,
      whyItMatters: "Spring Boot is the dominant backend framework for Java enterprise cloud services.",
      challengeType: 'experiment',
      difficulty: 'intermediate',
      estimatedMinutes: 45,
      curiosityPrompt: "How does Spring reflection and proxy generation enable annotation magic?",
      skills: ["Spring Boot", "Spring Data JPA", "Spring Security", "REST APIs"],
      tools: ["Spring Boot 3", "Postman / Bruno", "H2 Database"],
      stage: 'experiment',
      stageName: 'Stage 3 — Experiment (Days 26–35)'
    };
  } else if (dayId <= 45) {
    const topics = [
      "PostgreSQL Integration & Hibernate Query Tuning",
      "JPA N+1 Problem Diagnosis & EntityGraph Fixes",
      "Spring Caching with Redis Integration",
      "Asynchronous Messaging with Spring Kafka",
      "Scheduled Tasks & Background Job Engines",
      "Spring WebClient & Inter-Service REST Calls",
      "API Documentation with OpenAPI / Swagger UI",
      "Unit & Integration Testing with Testcontainers",
      "Dockerizing Spring Boot Services",
      "Health Checks & Actuator Metrics Monitoring"
    ];
    const topic = topics[(dayId - 36) % topics.length];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topic}`,
      description: `Resolve production database and distributed system challenges around ${topic}.`,
      requirements: [
        `Architect robust Spring services handling ${topic}`,
        "Profile database queries and network payload efficiency",
        "Write Docker container integration specs"
      ],
      learningObjective: `Scale Java microservices and resolve bottlenecks using ${topic}.`,
      whyItMatters: "Production systems require resilience, caching, observability, and efficient database interactions.",
      challengeType: 'solve',
      difficulty: 'advanced',
      estimatedMinutes: 50,
      curiosityPrompt: "How do database connection pools (HikariCP) prevent thread starvation?",
      skills: ["PostgreSQL", "Kafka", "Redis", "Docker", "Testcontainers"],
      tools: ["Docker", "PostgreSQL", "Spring Actuator"],
      stage: 'real-world',
      stageName: 'Stage 4 — Real-World Problems (Days 36–45)'
    };
  } else if (dayId <= 55) {
    const topics = [
      "E-Commerce Backend Microservice: Domain Design",
      "E-Commerce Backend: Product Catalog & Search API",
      "E-Commerce Backend: Order Processing Engine",
      "E-Commerce Backend: Payment Gateway Webhooks",
      "E-Commerce Backend: Transactional Integrity",
      "Distributed Rate Limiting with Resilience4j",
      "Circuit Breaker Pattern for External APIs",
      "Event-Driven Order Status Notifications",
      "Spring Security OAuth2 Resource Server",
      "Database Indexing & Production SQL Optimization"
    ];
    const topic = topics[(dayId - 46) % topics.length];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topic}`,
      description: `Build your own production-grade Java enterprise microservice focusing on ${topic}.`,
      requirements: [
        `Design and implement ${topic}`,
        "Follow SOLID principles and clean package architecture",
        "Provide swagger documentation and integration tests"
      ],
      learningObjective: `Construct a complete enterprise backend service incorporating ${topic}.`,
      whyItMatters: "Building end-to-end distributed backend engines proves portfolio readiness.",
      challengeType: 'project',
      difficulty: 'advanced',
      estimatedMinutes: 60,
      curiosityPrompt: "How does Saga pattern manage distributed transactions across microservices?",
      skills: ["Microservices", "Resilience4j", "Domain-Driven Design", "Spring Boot"],
      tools: ["Spring Cloud", "Docker Compose", "Git"],
      stage: 'build-your-own',
      stageName: 'Stage 5 — Build Your Own (Days 46–55)'
    };
  } else {
    const topics = [
      "Full Portfolio Microservice Code Review & Refactoring",
      "CI/CD Pipeline with GitHub Actions for Java App",
      "Deploy Spring Boot App to Cloud Run / Kubernetes",
      "Load Testing with Locust & Performance Tuning",
      "Final Architecture Documentation & Diagram",
      "Java Engineering Showcase & GitHub Portfolio Release"
    ];
    const topic = topics[(dayId - 56) % topics.length];
    return {
      dayId,
      trackId: 'java',
      title: `Day ${dayId}: ${topic}`,
      description: `Finalize your enterprise Java portfolio with ${topic}.`,
      requirements: [
        `Complete deployment and verification for ${topic}`,
        "Publish clean GitHub repository and architectural documentation",
        "Record proof-of-work demonstration"
      ],
      learningObjective: `Deploy and showcase production-ready Java software with ${topic}.`,
      whyItMatters: "Demonstrating fully deployed, well-tested enterprise systems opens senior career opportunities.",
      challengeType: 'project',
      difficulty: 'advanced',
      estimatedMinutes: 60,
      curiosityPrompt: "How do GraalVM Native Images drastically reduce JVM startup times?",
      skills: ["CI/CD", "Cloud Run", "Performance Tuning", "System Architecture"],
      tools: ["GitHub Actions", "Google Cloud Run", "Grafana"],
      stage: 'showcase',
      stageName: 'Stage 6 — Showcase (Days 56–60)'
    };
  }
});

import CVFactory from "../../src/CV/CVFactory.ts";
import ExportService from "../../src/CV/ExportService.ts";

const JSON_TO_TEST = {
    workExperience: [
        {
            company: "CENTRA",
            jobTitle: "Junior Backend Engineer",
            location: "Wrocław, Poland",
            date: "Mar 2024 - Now",
            bulletPoints: [
                "Actively taken part in development of discounts and tax calculations module with team of experienced Engineers",
                "Took care of moving major features from deprecated REST API Backend to a Symfony based GraphQL API related to customer anonymization",
                "Developed various QoL & Business features for a B2B E-Commerce Management System",
                "Provided direct support for clients and other teams as one of the Tax/Discount system specialists",
                "Refactored considerable amount of legacy code to make it up to today’s standards while taking care of compatibility for our clients",
                "Implemented integrations of 3rd party accounting solutions such as M3, Avatax, Fortnox"
            ]
        }
    ],
    education: [
        {
            schoolName: "UNIVERSITY OF WROCŁAW, FACULTY OF MATHEMATICS AND COMPUTER SCIENCE",
            degree: "Bachelor of Engineering",
            location: "Wrocław, Poland",
            date: "Sep 2023 - Feb 2027",
            description: "Computer Science with additional 2 full semester's worth of Theoretical Mathematics (by ECTS)"
        }
    ],
    activities: [
        {
            title: "WOLONTARIO",
            subtitle: "Lead Engineer",
            location: "Wrocław, Poland",
            date: "Apr 2022– June 2023",
            description: "Wolontario was a mobile app, created by me and a small group of my friends as an entry in the Polish national competition \"Zwolnieni z Teorii\". Its purpose was to create a platform for volunteer organizations that would allow them to manage their volunteer work more efficiently. My part was to code and design the app. The project has been shut down in June 2023. The project won in the IX edition of the „Olimpiada Zwolnieni z Teorii” as „the best project in the topic: local community”"
        }
    ],
    additional: [
        {
            title: "Technical Skills",
            content: "JIRA, REST API, TDD, Git, React, MongoDB, SQL, PostgreSQL, Python, Kubernetes, Redis, RabbitMQ, Rancher, Grafana, OAuth, Deno, Node.js, JavaScript, TypeScript, PHP8, PHP7, Sentry, Docker, Basics of practical and theoretical Cyber Security, GraphQL, Symfony, Doctrine, OCaml, Basics of Compilers & Interpreters Architecture, Basics of Operating Systems, Basics of networking, knowledge of Advanced Numerical Methods, Basics of Machine Learning, Basics of Neural Networks, Knowledge of Algorithms and Data Structures, System Design Patterns, CUDA Programming, OpenGL Basics, Computer Systems Architecture, x86 Assembly, System V ABI"
        }
    ]
}

Deno.test("CV from JSON works as expected", () => {
    CVFactory.fromJSON(JSON_TO_TEST);
})

Deno.test("CV from JSON exports", async () => {
    const toExport = CVFactory.fromJSON(JSON_TO_TEST);
    const expSrvc = new ExportService();
    await expSrvc.exportHTMLFromCV(toExport, "cvfactory-export.html");
})
import ExportService from "../../src/CV/ExportService.ts";
import CV from "../../src/CV/CV.ts";
import CVWorkExperience from "../../src/CV/CVWorkExperience.ts";
import CVWorkSection from "../../src/CV/CVWorkSection.ts";
import CVEducationSection from "../../src/CV/CVEducationSection.ts";
import CVEducation from "../../src/CV/CVEducation.ts";
import CVAdditionalSection from "../../src/CV/CVAdditionalSection.ts";
import CVAdditionalEntry from "../../src/CV/CVAdditionalEntry.ts";
import CVFactory from "../../src/CV/CVFactory.ts";
import CVRodoClause from "../../src/CV/CVRodoClause.ts";


Deno.test("Export Service writes correctly", async () => {
    const exportService = new ExportService();
    const cv = CVFactory.fromJSON({});
    
    const workSection = new CVWorkSection();
    const educationSection = new CVEducationSection();
    const additionalSection = new CVAdditionalSection();


    const workExp = new CVWorkExperience({
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
    });
    workSection.addElement(workExp)

    const uwr = new CVEducation({
        schoolName: "UNIVERSITY OF WROCŁAW, FACULTY OF MATHEMATICS AND COMPUTER SCIENCE",
        degree: "Bachelor of Engineering",
        location: "Wrocław, Poland",
        date: "Sep 2023 - Feb 2027",
        description: "Computer Science with additional 2 full semester's worth of Theoretical Mathematics (by ECTS)"

    });
    educationSection.addElement(uwr);

    const technicalSkills = new CVAdditionalEntry({ 
        title: "Technical Skills",
        content: "JIRA, REST API, TDD, Git, React, MongoDB, SQL, PostgreSQL, Python, Kubernetes, Redis, RabbitMQ, Rancher, Grafana, OAuth, Deno, Node.js, JavaScript, TypeScript, PHP8, PHP7, Sentry, Docker, Basics of practical and theoretical Cyber Security, GraphQL, Symfony, Doctrine, OCaml, Basics of Compilers & Interpreters Architecture, Basics of Operating Systems, Basics of networking, knowledge of Advanced Numerical Methods, Basics of Machine Learning, Basics of Neural Networks, Knowledge of Algorithms and Data Structures, System Design Patterns, CUDA Programming, OpenGL Basics, Computer Systems Architecture, x86 Assembly, System V ABI"
    });
    additionalSection.addElement(technicalSkills);

    cv.addSection(workSection);
    cv.addSection(educationSection);
    cv.addSection(additionalSection);
    cv.addSection(new CVRodoClause({
        "COMPANY_NAME": "test123",
        "PATTERN": "I allow {%COMPANY_NAME%} to test my data"
    }));


    await exportService.exportHTMLFromCV(cv, "cv.html");
})

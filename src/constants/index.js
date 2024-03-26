import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    redux,
    tailwind,
    nodejs,
    mongodb,
    git,
    figma,
    docker,
    meta,
    starbucks,
    tesla,
    shopify,
    carrent,
    jobit,
    tripguide,
    threejs,
    python,
    java,
    cpp,
} from "../assets";

export const navLinks = [
    {
        id: "about",
        title: "About",
    },
    {
        id: "work",
        title: "Projects",
    },
    {
        id: "contact",
        title: "Contact",
    },
];

const services = [
    {
        title: "Web Developer",
        icon: web,
    },
    {
        title: "Android Developer",
        icon: mobile,
    },
    {
        title: "Backend Developer",
        icon: backend,
    },
    {
        title: "Machine Learning Engineer",
        icon: creator,
    },
];

const technologies = [
    {
        name: "HTML 5",
        icon: html,
    },
    {
        name: "CSS 3",
        icon: css,
    },
    {
        name: "JavaScript",
        icon: javascript,
    },
    {
        name: "TypeScript",
        icon: typescript,
    },
    {
        name: "React JS",
        icon: reactjs,
    },
    {
        name: "Tailwind CSS",
        icon: tailwind,
    },
    {
        name: "Node JS",
        icon: nodejs,
    },
    {
        name: "MongoDB",
        icon: mongodb,
    },
    {
        name: "Three JS",
        icon: threejs,
    },
    {
        name: "git",
        icon: git,
    },
    {
        name: "Python",
        icon: python,
    },
    {
        name: "C++",
        icon: cpp,
    },
    {
        name: "Java",
        icon: java,
    },
];

const experiences = [
    {
        title: "Cybersecurity Research Assistant",
        company_name: "University of Texas - Dallas",
        icon: "",
        iconBg: "#383E56",
        date: "June 2023 - Present",
        points: [
            "Assisted PhD students by creating autonomous systems in drones and vehicles",
            "Injected bugs and used static analysis tools to pinpoint the root cause",
            "Used Python, C++, ROS 2, linux to ",
            "https://www.s3lab.io/profile/veer",
        ],
    },
    {
        title: "Software Engineering Intern",
        company_name: "Mandatly LLC",
        icon: "",
        iconBg: "#E6DEDD",
        date: "Dec 2023 - Present",
        points: [
            "Used Spacey NLP library to create redaction tool for sensitive information",
        ],
    },
];

const testimonials = [
    {
        testimonial: "Veer is one of the most hardworking people I know. He is always learning something new.",
        name: "Sourish Pasula",
        designation: "Boeing Intern",
        company: "Boeing",
        image: "https://media.licdn.com/dms/image/D5603AQFfqvOUHqKIQQ/profile-displayphoto-shrink_400_400/0/1687130168831?e=1717027200&v=beta&t=3UL3_EVkRyxKid5fpflSNHpGbymbuHFdviXUbTFCynY",
    },
];

const projects = [
    {
        name: "Car Rent",
        description: "",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: carrent,
        source_code_link: "https://github.com/",
    },
    {
        name: "Job IT",
        description: "",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: jobit,
        source_code_link: "https://github.com/",
    },
    {
        name: "Trip Guide",
        description: "",
        tags: [
            {
                name: "react",
                color: "blue-text-gradient",
            },
            {
                name: "mongodb",
                color: "green-text-gradient",
            },
            {
                name: "tailwind",
                color: "pink-text-gradient",
            },
        ],
        image: tripguide,
        source_code_link: "https://github.com/",
    },
];

export { services, technologies, experiences, testimonials, projects };

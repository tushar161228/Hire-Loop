export const filterData = [
    {
        filterType: "Location",
        key: "location",
        options: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Kolkata", "Ahmedabad", "Remote"]
    },
    {
        filterType: "Industry",
        key: "industry",
        options: [
            "Frontend Developer", "Backend Developer", "FullStack Developer", "DevOps Engineer",
            "Data Analyst", "Data Scientist", "UI/UX Designer", "QA Engineer",
            "Product Manager", "Mobile Developer", "Sales Manager", "HR Executive"
        ]
    },
    {
        filterType: "Job Type",
        key: "jobType",
        options: ["Full-time", "Part-time", "Internship", "Contract"]
    },
    {
        filterType: "Experience",
        key: "experience",
        options: [
            { label: "Fresher (0-1 yrs)", min: 0, max: 1 },
            { label: "1 - 3 yrs", min: 1, max: 3 },
            { label: "3 - 5 yrs", min: 3, max: 5 },
            { label: "5+ yrs", min: 5, max: Infinity },
        ]
    },
    {
        filterType: "Salary",
        key: "salary",
        options: [
            { label: "0 - 3 LPA", min: 0, max: 3 },
            { label: "3 - 6 LPA", min: 3, max: 6 },
            { label: "6 - 10 LPA", min: 6, max: 10 },
            { label: "10 - 15 LPA", min: 10, max: 15 },
            { label: "15+ LPA", min: 15, max: Infinity },
        ]
    },
]
 
// deno-lint-ignore-file no-explicit-any
import CV from "./CV.ts";
import CVActivitiesSection from "./CVActivitiesSection.ts";
import CVActivity from "./CVActivity.ts";
import CVAdditionalEntry from "./CVAdditionalEntry.ts";
import CVAdditionalSection from "./CVAdditionalSection.ts";
import CVEducation from "./CVEducation.ts";
import CVEducationSection from "./CVEducationSection.ts";
import CVWorkExperience from "./CVWorkExperience.ts";
import CVWorkSection from "./CVWorkSection.ts";



class CVFactory  {
    public static fromJSON(data: {[key: string]: any}): CV {
        const cv = new CV();
        if (data.workExperience && Array.isArray(data.workExperience)) {
            const workSection = new CVWorkSection();
            for (const workExpJSON of data.workExperience) {
                workSection.addElement(new CVWorkExperience({
                    company: workExpJSON.company,
                    jobTitle: workExpJSON.jobTitle,
                    location: workExpJSON.location,
                    date: workExpJSON.date,
                    bulletPoints: workExpJSON.bulletPoints
                }));
            }
            cv.addSection(workSection);
        }

        if (data.education && Array.isArray(data.education)) {
            const educationSection = new CVEducationSection();
            for (const education of data.education) {
                educationSection.addElement(new CVEducation({
                    schoolName: education.schoolName,
                    degree: education.degree,
                    location: education.location,
                    date: education.date,
                    description: education.description,
                }));
            }
            cv.addSection(educationSection);
        }

        if (data.activities && Array.isArray(data.activities)) {
            const activitiesSection = new CVActivitiesSection();
            for (const activity of data.activities) {
                activitiesSection.addElement(new CVActivity({
                    title: activity.title,
                    subtitle: activity.subtitle,
                    location: activity.location,
                    date: activity.date,
                    description: activity.description,
                }));
            }
            cv.addSection(activitiesSection);
        }

        if (data.additional && Array.isArray(data.additional)) {
            const additionalSection = new CVAdditionalSection();
            for (const additional of data.additional) {
                additionalSection.addElement(new CVAdditionalEntry({
                    title: additional.title,
                    content: additional.content,
                }));
            }
            cv.addSection(additionalSection);
        }


        return cv;
    }
}

export default CVFactory;
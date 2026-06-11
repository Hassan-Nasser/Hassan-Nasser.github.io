const projectModules = import.meta.glob("../../../data/projects/*.json", { eager: true });
const projectsDataRaw = Object.values(projectModules).map(m => m.default || m);
import highlightsDataRaw from "../../../data/highlights.json";
import secondaryOrderRaw from "../../../data/secondary_order.json";

const computeSpotlight = (projCache, highlightNames) => {
    const spotlightProjects = projCache.filter(p => highlightNames.includes(p.name) || highlightNames.includes(p.id));

    spotlightProjects.sort((a, b) => {
        let indexA = highlightNames.indexOf(a.name);
        if (indexA === -1) indexA = highlightNames.indexOf(a.id);

        let indexB = highlightNames.indexOf(b.name);
        if (indexB === -1) indexB = highlightNames.indexOf(b.id);

        return indexA - indexB;
    });

    return spotlightProjects;
};

const freshProjects = projectsDataRaw.map(d => {
    const data = { ...d };
    data.platforms = data.platforms || [];
    data.genres = data.genres || [];
    return data;
});

const initialSpotlightProjects = computeSpotlight(freshProjects, highlightsDataRaw);
const nonSpotlightProjects = freshProjects.filter(p => !initialSpotlightProjects.includes(p));
const secondaryOrderedProjects = computeSpotlight(nonSpotlightProjects, secondaryOrderRaw);

export const sortedAllProjects = [
    ...initialSpotlightProjects,
    ...secondaryOrderedProjects,
    ...nonSpotlightProjects.filter(p => !secondaryOrderedProjects.includes(p))
];

export const getInitialCount = () => initialSpotlightProjects.length;

const parseProjectDate = (value) => {
    if (!value) return null;

    const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(`${value}`.trim());
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getTodayStart = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
};

export const getProjectPublicPath = (project) => `/our-projects/${project?.id}`;

export const getProjectTypeLabel = (project) =>
    Number(project?.is_event) === 1 || project?.is_event === true ? "Event" : "Project";

export const getProjectTypeClasses = (project) =>
    getProjectTypeLabel(project) === "Event"
        ? "bg-orange-50 text-orange-700 border border-orange-100"
        : "bg-slate-100 text-slate-700 border border-slate-200";

export const getProjectLifecycleStatus = (project) => {
    const projectDate = parseProjectDate(project?.date);
    if (!projectDate) return "upcoming";

    const projectDay = new Date(projectDate.getFullYear(), projectDate.getMonth(), projectDate.getDate());
    const today = getTodayStart();

    if (projectDay.getTime() > today.getTime()) return "upcoming";
    if (projectDay.getTime() < today.getTime()) return "done";
    return "ongoing";
};

export const getProjectLifecycleLabel = (project) => {
    const status = getProjectLifecycleStatus(project);
    if (status === "ongoing") return "Ongoing";
    if (status === "done") return "Done";
    return "Upcoming";
};

export const getProjectLifecycleClasses = (project) => {
    const status = getProjectLifecycleStatus(project);

    if (status === "ongoing") {
        return "bg-orange-50 text-orange-700 border border-orange-100";
    }

    if (status === "done") {
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }

    return "bg-emerald-50 text-emerald-700 border border-emerald-100";
};

export const canProjectAcceptVolunteers = (project) =>
    getProjectLifecycleStatus(project) !== "done";

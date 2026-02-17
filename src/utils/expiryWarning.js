const DAY_IN_MS = 1000 * 60 * 60 * 24;

const toLocalDate = (value) => {
    if (!value) return null;

    const normalized = `${value}`.split("T")[0];
    const exactDatePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (exactDatePattern.test(normalized)) {
        const [year, month, day] = normalized.split("-").map(Number);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

const formatLocalDate = (date) => {
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const getExpiryWarningMeta = (value, options = {}) => {
    const { emptyLabel = "-" } = options;

    const baseGrayClass = "bg-gray-100 text-gray-700 border border-gray-200";
    const warningClass = "bg-red-700 text-white border border-red-800 ring-2 ring-red-300 font-bold";
    const expiredClass = "bg-red-800 text-white border border-red-900 ring-2 ring-red-400 font-bold";

    const expiryDate = toLocalDate(value);
    if (!expiryDate) {
        return {
            label: emptyLabel,
            className: baseGrayClass,
            isWarning: false,
            isExpired: false,
            daysUntilExpiry: null,
        };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const diffMs = expiryDate.getTime() - startOfToday.getTime();
    const daysUntilExpiry = Math.ceil(diffMs / DAY_IN_MS);
    const formattedDate = formatLocalDate(expiryDate);

    if (daysUntilExpiry < 0) {
        return {
            label: "Expired",
            className: expiredClass,
            isWarning: true,
            isExpired: true,
            daysUntilExpiry,
        };
    }

    if (daysUntilExpiry <= 30) {
        return {
            label: `WARNING: ${formattedDate}`,
            className: warningClass,
            isWarning: true,
            isExpired: false,
            daysUntilExpiry,
        };
    }

    return {
        label: formattedDate,
        className: baseGrayClass,
        isWarning: false,
        isExpired: false,
        daysUntilExpiry,
    };
};

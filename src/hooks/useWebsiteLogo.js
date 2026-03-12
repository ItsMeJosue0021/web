import { useEffect, useState } from "react";
import { _get } from "../api";
import fallbackLogoImage from "../assets/img/logo.png";

const storageBase = "https://api.kalingangkababaihan.com/storage/";
const websiteLogoUpdatedEvent = "website-logo-updated";

const defaultWebsiteLogo = {
    id: null,
    image_path: "",
    main_text: "Kalinga ng Kababaihan",
    secondary_text: "Women's League Las Pinas",
    created_at: null,
    updated_at: null,
};

let cachedWebsiteLogo = null;
let websiteLogoRequest = null;

const normalizeWebsiteLogo = (payload = {}) => ({
    id: payload.id ?? null,
    image_path: payload.image_path || "",
    main_text: payload.main_text || defaultWebsiteLogo.main_text,
    secondary_text: payload.secondary_text || defaultWebsiteLogo.secondary_text,
    created_at: payload.created_at ?? null,
    updated_at: payload.updated_at ?? null,
});

export const resolveWebsiteLogoImage = (imagePath) => {
    if (!imagePath) {
        return fallbackLogoImage;
    }

    return imagePath.startsWith("http") ? imagePath : `${storageBase}${imagePath}`;
};

const loadWebsiteLogo = async (force = false) => {
    if (force) {
        cachedWebsiteLogo = null;
        websiteLogoRequest = null;
    }

    if (cachedWebsiteLogo) {
        return cachedWebsiteLogo;
    }

    if (!websiteLogoRequest) {
        websiteLogoRequest = _get("/website-logo")
            .then((response) => {
                const normalized = normalizeWebsiteLogo(response.data || {});
                cachedWebsiteLogo = normalized;
                return normalized;
            })
            .catch(() => defaultWebsiteLogo)
            .finally(() => {
                websiteLogoRequest = null;
            });
    }

    return websiteLogoRequest;
};

export const notifyWebsiteLogoUpdated = () => {
    cachedWebsiteLogo = null;
    websiteLogoRequest = null;

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(websiteLogoUpdatedEvent));
    }
};

export const useWebsiteLogo = () => {
    const [websiteLogo, setWebsiteLogo] = useState(cachedWebsiteLogo || defaultWebsiteLogo);

    useEffect(() => {
        let isActive = true;

        const hydrate = async (force = false) => {
            const nextLogo = await loadWebsiteLogo(force);
            if (isActive) {
                setWebsiteLogo(nextLogo);
            }
        };

        hydrate();

        const handleUpdate = () => {
            hydrate(true);
        };

        if (typeof window !== "undefined") {
            window.addEventListener(websiteLogoUpdatedEvent, handleUpdate);
        }

        return () => {
            isActive = false;
            if (typeof window !== "undefined") {
                window.removeEventListener(websiteLogoUpdatedEvent, handleUpdate);
            }
        };
    }, []);

    return {
        websiteLogo,
        logoImageSrc: resolveWebsiteLogoImage(websiteLogo.image_path),
    };
};

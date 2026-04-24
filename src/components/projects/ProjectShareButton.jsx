import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { toast } from "react-toastify";

const openShareWindow = (url) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
};

const ProjectShareButton = ({ title, description, path, className = "" }) => {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    const absoluteUrl = useMemo(() => {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (typeof window === "undefined") return path;
        return `${window.location.origin}${path}`;
    }, [path]);

    useEffect(() => {
        if (!open) return undefined;

        const handleOutsideClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [open]);

    const handleCopy = async () => {
        if (!absoluteUrl) return;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(absoluteUrl);
            } else {
                throw new Error("Clipboard API unavailable.");
            }

            toast.success("Project link copied.");
        } catch (error) {
            console.error("Error copying project link:", error);
            toast.error("Unable to copy the project link.");
        } finally {
            setOpen(false);
        }
    };

    const handleNativeShare = async () => {
        if (!absoluteUrl) return;

        if (!navigator.share) {
            await handleCopy();
            return;
        }

        try {
            await navigator.share({
                title,
                text: description || title,
                url: absoluteUrl,
            });
        } catch (error) {
            if (error?.name !== "AbortError") {
                console.error("Error opening share sheet:", error);
                toast.error("Unable to open the share menu.");
            }
        } finally {
            setOpen(false);
        }
    };

    const facebookUrl = absoluteUrl
        ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(absoluteUrl)}`
        : "";
    const xUrl = absoluteUrl
        ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(absoluteUrl)}&text=${encodeURIComponent(title || "Check this out")}`
        : "";
    const whatsappUrl = absoluteUrl
        ? `https://wa.me/?text=${encodeURIComponent(`${title || "Check this out"} ${absoluteUrl}`)}`
        : "";

    return (
        <div ref={containerRef} className={`relative ${className}`.trim()}>
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-[11px] font-medium text-gray-700 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
            >
                <Share2 size={14} />
                Share
            </button>

            {open && (
                <div className="absolute bottom-full right-0 z-20 mb-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                    <button
                        type="button"
                        onClick={() => {
                            openShareWindow(facebookUrl);
                            setOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <span>Facebook</span>
                        <ExternalLink size={13} />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            openShareWindow(xUrl);
                            setOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <span>X / Twitter</span>
                        <ExternalLink size={13} />
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            openShareWindow(whatsappUrl);
                            setOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <span>WhatsApp</span>
                        <ExternalLink size={13} />
                    </button>

                    <button
                        type="button"
                        onClick={handleNativeShare}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <span>Messenger / More apps</span>
                        <Share2 size={13} />
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[11px] text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                        <span>Copy link</span>
                        <Copy size={13} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProjectShareButton;

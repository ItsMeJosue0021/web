import { useEffect, useMemo, useState } from "react";
import Admin from "../../../layouts/Admin";
import { _delete, _get, _post, _put } from "../../../api";
import CircularLoading from "../../../components/CircularLoading";
import SuccesAlert from "../../../components/alerts/SuccesAlert";
import { toast } from "react-toastify";

const WebHome = () => {
    const storageBase = "https://api.kalingangkababaihan.com/storage/";
    const emptyProgram = { id: null, title: "", description: "" };
    const emptyChecklistItem = { item: "" };
    const emptyQuote = { quote: "", author: "" };
    const emptyInvolvement = { id: null, title: "", description: "", url: "" };
    const [formData, setFormData] = useState({
        welcome_message: "",
        intro_text: "",
        women_supported: "",
        meals_served: "",
        communities_reached: "",
        number_of_volunteers: "",
    });
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [carouselImages, setCarouselImages] = useState([]);
    const [carouselLoading, setCarouselLoading] = useState(true);
    const [carouselSaving, setCarouselSaving] = useState(false);
    const [pendingImages, setPendingImages] = useState([]);
    const [carouselDeletingId, setCarouselDeletingId] = useState(null);
    const [programsInfo, setProgramsInfo] = useState({
        id: null,
        title: "",
        description: "",
        programs: [{ ...emptyProgram }, { ...emptyProgram }, { ...emptyProgram }],
        created_at: null,
        updated_at: null,
    });
    const [originalProgramsInfo, setOriginalProgramsInfo] = useState(null);
    const [programsLoading, setProgramsLoading] = useState(true);
    const [programsSaving, setProgramsSaving] = useState(false);
    const [encouragementInfo, setEncouragementInfo] = useState({
        id: null,
        title: "",
        description: "",
        checklist: [{ ...emptyChecklistItem }, { ...emptyChecklistItem }, { ...emptyChecklistItem }],
        image_path: "",
        created_at: null,
        updated_at: null,
    });
    const [originalEncouragementInfo, setOriginalEncouragementInfo] = useState(null);
    const [encouragementLoading, setEncouragementLoading] = useState(true);
    const [encouragementSaving, setEncouragementSaving] = useState(false);
    const [encouragementImageFile, setEncouragementImageFile] = useState(null);
    const [encouragementImagePreview, setEncouragementImagePreview] = useState("");
    const [encouragementExistingImage, setEncouragementExistingImage] = useState("");
    const [quotesInfo, setQuotesInfo] = useState({
        id: null,
        title: "",
        description: "",
        quotes: [{ ...emptyQuote }, { ...emptyQuote }, { ...emptyQuote }],
        created_at: null,
        updated_at: null,
    });
    const [originalQuotesInfo, setOriginalQuotesInfo] = useState(null);
    const [quotesLoading, setQuotesLoading] = useState(true);
    const [quotesSaving, setQuotesSaving] = useState(false);
    const [involvementInfo, setInvolvementInfo] = useState({
        id: null,
        title: "",
        description: "",
        involvements: [{ ...emptyInvolvement }, { ...emptyInvolvement }, { ...emptyInvolvement }],
        created_at: null,
        updated_at: null,
    });
    const [originalInvolvementInfo, setOriginalInvolvementInfo] = useState(null);
    const [involvementLoading, setInvolvementLoading] = useState(true);
    const [involvementSaving, setInvolvementSaving] = useState(false);

    const fetchHomepageInfo = async () => {
        setLoading(true);
        try {
            const response = await _get("/homepage-info");
            const data = response.data || {};
            const cleaned = {
                welcome_message: data.welcome_message || "",
                intro_text: data.intro_text || "",
                women_supported: data.women_supported || "",
                meals_served: data.meals_served || "",
                communities_reached: data.communities_reached || "",
                number_of_volunteers: data.number_of_volunteers || "",
            };
            setFormData(cleaned);
            setOriginalData(cleaned);
        } catch (error) {
            console.error("Error fetching homepage info:", error);
            toast.error("Unable to load homepage info.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCarouselImages = async () => {
        setCarouselLoading(true);
        try {
            const response = await _get("/homepage-carousel");
            const payload = response.data;
            const normalized = Array.isArray(payload) ? payload : payload?.data || [];
            setCarouselImages(normalized);
        } catch (error) {
            console.error("Error fetching homepage carousel:", error);
            toast.error("Unable to load homepage carousel images.");
        } finally {
            setCarouselLoading(false);
        }
    };

    const fetchProgramsInfo = async () => {
        setProgramsLoading(true);
        try {
            const response = await _get("/programs-info");
            const data = response.data || {};
            const incomingPrograms = Array.isArray(data.programs)
                ? data.programs.map((program) => ({
                    id: program?.id ?? null,
                    title: program?.title || "",
                    description: program?.description || "",
                }))
                : [];
            const programsArray = [
                ...incomingPrograms.slice(0, 3),
                ...Array.from({ length: Math.max(0, 3 - incomingPrograms.length) }, () => ({ ...emptyProgram })),
            ];
            const cleaned = {
                id: data.id ?? null,
                title: data.title || "",
                description: data.description || "",
                programs: programsArray,
                created_at: data.created_at ?? null,
                updated_at: data.updated_at ?? null,
            };
            setProgramsInfo(cleaned);
            setOriginalProgramsInfo(cleaned);
        } catch (error) {
            console.error("Error fetching programs info:", error);
            toast.error("Unable to load programs info.");
        } finally {
            setProgramsLoading(false);
        }
    };

    const fetchEncouragementInfo = async () => {
        setEncouragementLoading(true);
        try {
            const response = await _get("/encouragement-info");
            const data = response.data || {};
            const incomingChecklist = Array.isArray(data.checklist)
                ? data.checklist.map((entry) => ({
                    item: entry?.item || "",
                }))
                : [];
            const checklistArray = [
                ...incomingChecklist,
                ...Array.from({ length: Math.max(0, 3 - incomingChecklist.length) }, () => ({ ...emptyChecklistItem })),
            ];
            const cleaned = {
                id: data.id ?? null,
                title: data.title || "",
                description: data.description || "",
                checklist: checklistArray,
                image_path: data.image_path || "",
                created_at: data.created_at ?? null,
                updated_at: data.updated_at ?? null,
            };
            setEncouragementInfo(cleaned);
            setOriginalEncouragementInfo(cleaned);
            setEncouragementImageFile(null);
            setEncouragementImagePreview("");
            const resolvedImage = data.image_path
                ? (data.image_path.startsWith("http")
                    ? data.image_path
                    : `${storageBase}${data.image_path}`)
                : "";
            setEncouragementExistingImage(resolvedImage);
        } catch (error) {
            console.error("Error fetching encouragement info:", error);
            toast.error("Unable to load encouragement info.");
        } finally {
            setEncouragementLoading(false);
        }
    };

    const fetchQuotesInfo = async () => {
        setQuotesLoading(true);
        try {
            const response = await _get("/quotes-info");
            const data = response.data || {};
            const incomingQuotes = Array.isArray(data.quotes)
                ? data.quotes.map((entry) => ({
                    quote: entry?.quote || "",
                    author: entry?.author || "",
                }))
                : [];
            const quotesArray = [
                ...incomingQuotes,
                ...Array.from({ length: Math.max(0, 3 - incomingQuotes.length) }, () => ({ ...emptyQuote })),
            ];
            const cleaned = {
                id: data.id ?? null,
                title: data.title || "",
                description: data.description || "",
                quotes: quotesArray,
                created_at: data.created_at ?? null,
                updated_at: data.updated_at ?? null,
            };
            setQuotesInfo(cleaned);
            setOriginalQuotesInfo(cleaned);
        } catch (error) {
            console.error("Error fetching quotes info:", error);
            toast.error("Unable to load quotes info.");
        } finally {
            setQuotesLoading(false);
        }
    };

    const fetchInvolvementInfo = async () => {
        setInvolvementLoading(true);
        try {
            const response = await _get("/involvement-info");
            const data = response.data || {};
            const incomingInvolvements = Array.isArray(data.involvements)
                ? data.involvements.map((entry) => ({
                    id: entry?.id ?? null,
                    title: entry?.title || "",
                    description: entry?.description || "",
                    url: entry?.url || "",
                }))
                : [];
            const involvementsArray = [
                ...incomingInvolvements.slice(0, 3),
                ...Array.from({ length: Math.max(0, 3 - incomingInvolvements.length) }, () => ({ ...emptyInvolvement })),
            ];
            const cleaned = {
                id: data.id ?? null,
                title: data.title || "",
                description: data.description || "",
                involvements: involvementsArray,
                created_at: data.created_at ?? null,
                updated_at: data.updated_at ?? null,
            };
            setInvolvementInfo(cleaned);
            setOriginalInvolvementInfo(cleaned);
        } catch (error) {
            console.error("Error fetching involvement info:", error);
            toast.error("Unable to load involvement info.");
        } finally {
            setInvolvementLoading(false);
        }
    };

    useEffect(() => {
        fetchHomepageInfo();
        fetchCarouselImages();
        fetchProgramsInfo();
        fetchEncouragementInfo();
        fetchQuotesInfo();
        fetchInvolvementInfo();
    }, []);

    const hasChanges = useMemo(() => {
        if (!originalData) return false;
        return JSON.stringify(formData) !== JSON.stringify(originalData);
    }, [formData, originalData]);

    const hasProgramsChanges = useMemo(() => {
        if (!originalProgramsInfo) return false;
        return JSON.stringify(programsInfo) !== JSON.stringify(originalProgramsInfo);
    }, [originalProgramsInfo, programsInfo]);

    const hasProgramsRequiredFields = useMemo(() => {
        if (!programsInfo.title.trim() || !programsInfo.description.trim()) return false;
        if (programsInfo.programs.length !== 3) return false;
        return programsInfo.programs.every(
            (program) => program.title.trim() && program.description.trim()
        );
    }, [programsInfo]);

    const normalizeChecklist = (checklist = []) => (
        checklist
            .map((entry) => ({ item: entry?.item?.trim() || "" }))
            .filter((entry) => entry.item)
    );

    const buildEncouragementPayload = (source) => ({
        id: source.id,
        title: source.title?.trim() || "",
        description: source.description?.trim() || "",
        checklist: normalizeChecklist(source.checklist),
        image_path: source.image_path || "",
        created_at: source.created_at,
        updated_at: source.updated_at,
    });

    const normalizedEncouragement = useMemo(
        () => buildEncouragementPayload(encouragementInfo),
        [encouragementInfo]
    );

    const hasEncouragementChanges = useMemo(() => {
        if (!originalEncouragementInfo) return false;
        const normalizedOriginal = buildEncouragementPayload(originalEncouragementInfo);
        const hasDataChanges = JSON.stringify(normalizedEncouragement) !== JSON.stringify(normalizedOriginal);
        return hasDataChanges || Boolean(encouragementImageFile);
    }, [encouragementImageFile, normalizedEncouragement, originalEncouragementInfo]);

    const hasEncouragementRequiredFields = useMemo(() => {
        if (!normalizedEncouragement.title || !normalizedEncouragement.description) return false;
        if (normalizedEncouragement.checklist.length < 3) return false;
        return Boolean(encouragementImageFile || normalizedEncouragement.image_path);
    }, [encouragementImageFile, normalizedEncouragement]);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleProgramsChange = (field, value) => {
        setProgramsInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleProgramItemChange = (index, field, value) => {
        setProgramsInfo((prev) => ({
            ...prev,
            programs: prev.programs.map((program, programIndex) => (
                programIndex === index ? { ...program, [field]: value } : program
            )),
        }));
    };

    const handleEncouragementChange = (field, value) => {
        setEncouragementInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleChecklistItemChange = (index, value) => {
        setEncouragementInfo((prev) => ({
            ...prev,
            checklist: prev.checklist.map((entry, entryIndex) => (
                entryIndex === index ? { ...entry, item: value } : entry
            )),
        }));
    };

    const handleEncouragementImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (encouragementImagePreview) {
            URL.revokeObjectURL(encouragementImagePreview);
        }
        setEncouragementImageFile(file);
        setEncouragementImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveEncouragementImage = () => {
        if (encouragementImagePreview) {
            URL.revokeObjectURL(encouragementImagePreview);
        }
        setEncouragementImageFile(null);
        setEncouragementImagePreview("");
    };

    const handleAddChecklistItem = () => {
        setEncouragementInfo((prev) => ({
            ...prev,
            checklist: [...prev.checklist, { ...emptyChecklistItem }],
        }));
    };

    const handleRemoveChecklistItem = (index) => {
        setEncouragementInfo((prev) => {
            if (prev.checklist.length <= 3) return prev;
            return {
                ...prev,
                checklist: prev.checklist.filter((_, entryIndex) => entryIndex !== index),
            };
        });
    };

    const normalizeQuotes = (quotes = []) => (
        quotes
            .map((entry) => ({
                quote: entry?.quote?.trim() || "",
                author: entry?.author?.trim() || "",
            }))
            .filter((entry) => entry.quote && entry.author)
    );

    const buildQuotesPayload = (source) => ({
        id: source.id,
        title: source.title?.trim() || "",
        description: source.description?.trim() || "",
        quotes: normalizeQuotes(source.quotes),
        created_at: source.created_at,
        updated_at: source.updated_at,
    });

    const normalizedQuotes = useMemo(
        () => buildQuotesPayload(quotesInfo),
        [quotesInfo]
    );

    const hasQuotesChanges = useMemo(() => {
        if (!originalQuotesInfo) return false;
        const normalizedOriginal = buildQuotesPayload(originalQuotesInfo);
        return JSON.stringify(normalizedQuotes) !== JSON.stringify(normalizedOriginal);
    }, [normalizedQuotes, originalQuotesInfo]);

    const hasQuotesRequiredFields = useMemo(() => {
        if (!normalizedQuotes.title || !normalizedQuotes.description) return false;
        return normalizedQuotes.quotes.length >= 3;
    }, [normalizedQuotes]);

    const hasInvolvementChanges = useMemo(() => {
        if (!originalInvolvementInfo) return false;
        return JSON.stringify(involvementInfo) !== JSON.stringify(originalInvolvementInfo);
    }, [involvementInfo, originalInvolvementInfo]);

    const hasInvolvementRequiredFields = useMemo(() => {
        if (!involvementInfo.title.trim() || !involvementInfo.description.trim()) return false;
        if (involvementInfo.involvements.length !== 3) return false;
        return involvementInfo.involvements.every(
            (entry) => entry.title.trim() && entry.description.trim() && entry.url.trim()
        );
    }, [involvementInfo]);

    const handleQuotesChange = (field, value) => {
        setQuotesInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleQuoteItemChange = (index, field, value) => {
        setQuotesInfo((prev) => ({
            ...prev,
            quotes: prev.quotes.map((entry, entryIndex) => (
                entryIndex === index ? { ...entry, [field]: value } : entry
            )),
        }));
    };

    const handleAddQuoteItem = () => {
        setQuotesInfo((prev) => ({
            ...prev,
            quotes: [...prev.quotes, { ...emptyQuote }],
        }));
    };

    const handleRemoveQuoteItem = (index) => {
        setQuotesInfo((prev) => {
            if (prev.quotes.length <= 3) return prev;
            return {
                ...prev,
                quotes: prev.quotes.filter((_, entryIndex) => entryIndex !== index),
            };
        });
    };

    const handleInvolvementChange = (field, value) => {
        setInvolvementInfo((prev) => ({ ...prev, [field]: value }));
    };

    const handleInvolvementItemChange = (index, field, value) => {
        setInvolvementInfo((prev) => ({
            ...prev,
            involvements: prev.involvements.map((entry, entryIndex) => (
                entryIndex === index ? { ...entry, [field]: value } : entry
            )),
        }));
    };

    const resolveCarouselImage = (item) => {
        const raw = item?.image_url || item?.image || item?.url || item?.path;
        if (!raw) return "";
        return raw.startsWith("http") ? raw : `${storageBase}${raw}`;
    };

    const handleCarouselImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        const mapped = files.map((file) => ({
            id: `${file.name}-${file.lastModified}-${Math.random().toString(16).slice(2)}`,
            file,
            preview: URL.createObjectURL(file),
        }));
        setPendingImages((prev) => [...prev, ...mapped]);
        e.target.value = null;
    };

    const handleRemovePendingImage = (id) => {
        setPendingImages((prev) => {
            const target = prev.find((item) => item.id === id);
            if (target?.preview) {
                URL.revokeObjectURL(target.preview);
            }
            return prev.filter((item) => item.id !== id);
        });
    };

    const handleCarouselSave = async (e) => {
        e.preventDefault();
        if (!pendingImages.length) return;

        setCarouselSaving(true);
        const payload = new FormData();
        pendingImages.forEach((image) => {
            payload.append("images[]", image.file);
        });

        try {
            await _post("/homepage-carousel", payload);
            pendingImages.forEach((image) => {
                if (image.preview) {
                    URL.revokeObjectURL(image.preview);
                }
            });
            setPendingImages([]);
            setSuccessMessage("Homepage carousel images saved successfully.");
            setShowSuccessAlert(true);
            fetchCarouselImages();
        } catch (error) {
            console.error("Error saving carousel images:", error);
            toast.error("Unable to save carousel images. Please try again.");
        } finally {
            setCarouselSaving(false);
        }
    };

    const handleCarouselDelete = async (image) => {
        if (!image?.id) return;
        setCarouselDeletingId(image.id);
        try {
            await _delete(`/homepage-carousel/${image.id}`);
            setCarouselImages((prev) => prev.filter((item) => item.id !== image.id));
            setSuccessMessage("Carousel image deleted successfully.");
            setShowSuccessAlert(true);
        } catch (error) {
            console.error("Error deleting carousel image:", error);
            toast.error("Unable to delete carousel image. Please try again.");
        } finally {
            setCarouselDeletingId(null);
        }
    };

    const handleProgramsSave = async (e) => {
        e.preventDefault();
        if (!hasProgramsChanges) return;

        setProgramsSaving(true);
        const payload = {
            id: programsInfo.id,
            title: programsInfo.title,
            description: programsInfo.description,
            programs: programsInfo.programs.map((program) => ({
                id: program.id,
                title: program.title,
                description: program.description,
            })),
            created_at: programsInfo.created_at,
            updated_at: programsInfo.updated_at,
        };

        try {
            await _put("/programs-info", payload);
            setSuccessMessage("Programs info saved successfully.");
            setShowSuccessAlert(true);
            setOriginalProgramsInfo(programsInfo);
        } catch (error) {
            console.error("Error saving programs info:", error);
            toast.error("Unable to save programs info. Please try again.");
        } finally {
            setProgramsSaving(false);
        }
    };

    const handleEncouragementSave = async (e) => {
        e.preventDefault();
        if (!hasEncouragementChanges) return;

        setEncouragementSaving(true);
        const payload = buildEncouragementPayload(encouragementInfo);
        const formData = new FormData();
        formData.append("id", payload.id ?? "");
        formData.append("title", payload.title);
        formData.append("description", payload.description);
        payload.checklist.forEach((entry, index) => {
            formData.append(`checklist[${index}][item]`, entry.item);
        });
        formData.append("image_path", payload.image_path || "");
        formData.append("created_at", payload.created_at ?? "");
        formData.append("updated_at", payload.updated_at ?? "");
        if (encouragementImageFile) {
            formData.append("image", encouragementImageFile);
        }

        try {
            await _put("/encouragement-info", formData);
            setSuccessMessage("Encouragement info saved successfully.");
            setShowSuccessAlert(true);
            setOriginalEncouragementInfo(encouragementInfo);
            setEncouragementImageFile(null);
            setEncouragementImagePreview("");
            fetchEncouragementInfo();
        } catch (error) {
            console.error("Error saving encouragement info:", error);
            toast.error("Unable to save encouragement info. Please try again.");
        } finally {
            setEncouragementSaving(false);
        }
    };

    const handleQuotesSave = async (e) => {
        e.preventDefault();
        if (!hasQuotesChanges) return;

        setQuotesSaving(true);
        const payload = buildQuotesPayload(quotesInfo);

        try {
            await _put("/quotes-info", payload);
            setSuccessMessage("Words that inspire saved successfully.");
            setShowSuccessAlert(true);
            setOriginalQuotesInfo(quotesInfo);
        } catch (error) {
            console.error("Error saving quotes info:", error);
            toast.error("Unable to save words that inspire. Please try again.");
        } finally {
            setQuotesSaving(false);
        }
    };

    const handleInvolvementSave = async (e) => {
        e.preventDefault();
        if (!hasInvolvementChanges) return;

        setInvolvementSaving(true);
        const payload = {
            id: involvementInfo.id,
            title: involvementInfo.title,
            description: involvementInfo.description,
            involvements: involvementInfo.involvements.map((entry) => ({
                id: entry.id,
                title: entry.title,
                description: entry.description,
                url: entry.url,
            })),
            created_at: involvementInfo.created_at,
            updated_at: involvementInfo.updated_at,
        };

        try {
            await _put("/involvement-info", payload);
            setSuccessMessage("Involvement info saved successfully.");
            setShowSuccessAlert(true);
            setOriginalInvolvementInfo(involvementInfo);
        } catch (error) {
            console.error("Error saving involvement info:", error);
            toast.error("Unable to save involvement info. Please try again.");
        } finally {
            setInvolvementSaving(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!hasChanges) return;

        setSaving(true);
        try {
            setValidationErrors({});
            await _put("/homepage-info", formData);
            setSuccessMessage("Homepage content saved successfully.");
            setShowSuccessAlert(true);
            setOriginalData(formData);
        } catch (error) {
            console.error("Error saving homepage info:", error);
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Unable to save homepage info. Please try again.");
            }
        } finally {
            setSaving(false);
        }
    };

    const header = {
        title: "Website Home",
        subTitle: "Manage the content shown on the home page",
    };

    const breadcrumbs = [
        { name: "Website Content", link: "/web-content" },
        { name: "Home", link: "/web-content/home" },
    ];

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full max-w-5xl mx-auto mt-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Homepage Content</h2>
                            <p className="text-xs text-gray-500">Update the hero copy and impact stats displayed on the site.</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasChanges || saving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {saving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleSave}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Welcome message</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-16 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the welcome message"
                                    value={formData.welcome_message}
                                    onChange={(e) => handleChange("welcome_message", e.target.value)}
                                />
                                {validationErrors.welcome_message && (
                                    <p className="text-xs text-red-500">{validationErrors.welcome_message[0]}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Intro text</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-16 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter the intro text"
                                    value={formData.intro_text}
                                    onChange={(e) => handleChange("intro_text", e.target.value)}
                                />
                                {validationErrors.intro_text && (
                                    <p className="text-xs text-red-500">{validationErrors.intro_text[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Women supported</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 1,200+"
                                        value={formData.women_supported}
                                        onChange={(e) => handleChange("women_supported", e.target.value)}
                                    />
                                    {validationErrors.women_supported && (
                                        <p className="text-xs text-red-500">{validationErrors.women_supported[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Meals served</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 5,000+"
                                        value={formData.meals_served}
                                        onChange={(e) => handleChange("meals_served", e.target.value)}
                                    />
                                    {validationErrors.meals_served && (
                                        <p className="text-xs text-red-500">{validationErrors.meals_served[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Communities reached</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 12 barangays"
                                        value={formData.communities_reached}
                                        onChange={(e) => handleChange("communities_reached", e.target.value)}
                                    />
                                    {validationErrors.communities_reached && (
                                        <p className="text-xs text-red-500">{validationErrors.communities_reached[0]}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-gray-700">Number of volunteers</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                        placeholder="e.g., 150+"
                                        value={formData.number_of_volunteers}
                                        onChange={(e) => handleChange("number_of_volunteers", e.target.value)}
                                    />
                                    {validationErrors.number_of_volunteers && (
                                        <p className="text-xs text-red-500">{validationErrors.number_of_volunteers[0]}</p>
                                    )}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Homepage Carousel</h2>
                            <p className="text-xs text-gray-500">Upload and manage the images shown in the homepage carousel.</p>
                        </div>
                        <button
                            onClick={handleCarouselSave}
                            disabled={!pendingImages.length || carouselSaving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !pendingImages.length || carouselSaving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {carouselSaving ? "Saving..." : "Save images"}
                        </button>
                    </div>

                    {carouselLoading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleCarouselSave} encType="multipart/form-data">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Carousel images</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleCarouselImageChange}
                                    className="w-full text-xs"
                                />
                                <p className="text-[11px] text-gray-500">You can select multiple images at once.</p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Selected images</p>
                                    {pendingImages.length === 0 && (
                                        <span className="text-[11px] text-gray-400">No new images selected.</span>
                                    )}
                                </div>
                                {pendingImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {pendingImages.map((image) => (
                                            <div key={image.id} className="border border-gray-200 rounded-md p-2 flex flex-col gap-2">
                                                <div className="w-full h-24 bg-gray-50 rounded overflow-hidden">
                                                    <img
                                                        src={image.preview}
                                                        alt="Selected carousel"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePendingImage(image.id)}
                                                    className="text-[11px] text-red-600 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Current carousel images</p>
                                    {carouselImages.length === 0 && (
                                        <span className="text-[11px] text-gray-400">No images uploaded yet.</span>
                                    )}
                                </div>
                                {carouselImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {carouselImages.map((image) => {
                                            const imageSrc = resolveCarouselImage(image);
                                            return (
                                                <div key={image.id} className="border border-gray-200 rounded-md p-2 flex flex-col gap-2">
                                                    <div className="w-full h-24 bg-gray-50 rounded overflow-hidden">
                                                        {imageSrc ? (
                                                            <img
                                                                src={imageSrc}
                                                                alt="Homepage carousel"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCarouselDelete(image)}
                                                        disabled={carouselDeletingId === image.id}
                                                        className="text-[11px] text-red-600 hover:text-red-700 disabled:opacity-60"
                                                    >
                                                        {carouselDeletingId === image.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Programs Info</h2>
                            <p className="text-xs text-gray-500">Update the programs header and descriptions shown on the site.</p>
                        </div>
                        <button
                            onClick={handleProgramsSave}
                            disabled={!hasProgramsChanges || !hasProgramsRequiredFields || programsSaving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasProgramsChanges || !hasProgramsRequiredFields || programsSaving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {programsSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {programsLoading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleProgramsSave}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter programs title"
                                    value={programsInfo.title}
                                    onChange={(e) => handleProgramsChange("title", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Description</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter programs description"
                                    value={programsInfo.description}
                                    onChange={(e) => handleProgramsChange("description", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Programs (3 required)</p>
                                    <span className="text-[11px] text-gray-500">Fill in all three programs before saving.</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {programsInfo.programs.map((program, index) => (
                                        <div key={`${program.id ?? "new"}-${index}`} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">Program title</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                    placeholder="Enter program title"
                                                    value={program.title}
                                                    onChange={(e) => handleProgramItemChange(index, "title", e.target.value)}
                                                />
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">Program description</label>
                                                <textarea
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                                    placeholder="Enter program description"
                                                    value={program.description}
                                                    onChange={(e) => handleProgramItemChange(index, "description", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Encouragement Info</h2>
                            <p className="text-xs text-gray-500">Update the encouragement copy and checklist items.</p>
                        </div>
                        <button
                            onClick={handleEncouragementSave}
                            disabled={!hasEncouragementChanges || !hasEncouragementRequiredFields || encouragementSaving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasEncouragementChanges || !hasEncouragementRequiredFields || encouragementSaving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {encouragementSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {encouragementLoading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleEncouragementSave}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter encouragement title"
                                    value={encouragementInfo.title}
                                    onChange={(e) => handleEncouragementChange("title", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Description</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter encouragement description"
                                    value={encouragementInfo.description}
                                    onChange={(e) => handleEncouragementChange("description", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Image</label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="w-full sm:w-40 h-28 bg-gray-50 rounded overflow-hidden flex items-center justify-center text-[11px] text-gray-400">
                                        {(encouragementImagePreview || encouragementExistingImage) ? (
                                            <img
                                                src={encouragementImagePreview || encouragementExistingImage}
                                                alt="Encouragement"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            "No image"
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEncouragementImageChange}
                                            className="w-full text-xs"
                                        />
                                        <p className="text-[11px] text-gray-500 mt-1">Upload a fresh image to replace the current one.</p>
                                        {encouragementImagePreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemoveEncouragementImage}
                                                className="text-[11px] text-red-600 hover:text-red-700 mt-2"
                                            >
                                                Remove selected image
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700">Checklist (minimum 3)</p>
                                        <span className="text-[11px] text-gray-500">Fill in at least three checklist items before saving.</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddChecklistItem}
                                        className="text-[11px] text-orange-600 hover:text-orange-700"
                                    >
                                        Add item
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {encouragementInfo.checklist.map((entry, index) => (
                                        <div key={`checklist-${index}`} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-gray-700">Item {index + 1}</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveChecklistItem(index)}
                                                    disabled={encouragementInfo.checklist.length <= 3}
                                                    className="text-[11px] text-red-600 hover:text-red-700 disabled:opacity-60"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                placeholder="Enter checklist item"
                                                value={entry.item}
                                                onChange={(e) => handleChecklistItemChange(index, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Words that Inspire</h2>
                            <p className="text-xs text-gray-500">Update the quotes and authors shown on the site.</p>
                        </div>
                        <button
                            onClick={handleQuotesSave}
                            disabled={!hasQuotesChanges || !hasQuotesRequiredFields || quotesSaving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasQuotesChanges || !hasQuotesRequiredFields || quotesSaving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {quotesSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {quotesLoading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleQuotesSave}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter title"
                                    value={quotesInfo.title}
                                    onChange={(e) => handleQuotesChange("title", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Description</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter description"
                                    value={quotesInfo.description}
                                    onChange={(e) => handleQuotesChange("description", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-700">Quotes (minimum 3)</p>
                                        <span className="text-[11px] text-gray-500">Fill in at least three quotes before saving.</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddQuoteItem}
                                        className="text-[11px] text-orange-600 hover:text-orange-700"
                                    >
                                        Add quote
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {quotesInfo.quotes.map((entry, index) => (
                                        <div key={`quote-${index}`} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-gray-700">Quote {index + 1}</label>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuoteItem(index)}
                                                    disabled={quotesInfo.quotes.length <= 3}
                                                    className="text-[11px] text-red-600 hover:text-red-700 disabled:opacity-60"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                placeholder="Enter quote"
                                                value={entry.quote}
                                                onChange={(e) => handleQuoteItemChange(index, "quote", e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                placeholder="Enter author"
                                                value={entry.author}
                                                onChange={(e) => handleQuoteItemChange(index, "author", e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-5xl mx-auto mt-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Get Involved</h2>
                            <p className="text-xs text-gray-500">Manage the involvement cards shown on the site.</p>
                        </div>
                        <button
                            onClick={handleInvolvementSave}
                            disabled={!hasInvolvementChanges || !hasInvolvementRequiredFields || involvementSaving}
                            className={`w-full sm:w-auto px-5 py-2 text-xs rounded text-white transition ${
                                !hasInvolvementChanges || !hasInvolvementRequiredFields || involvementSaving
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                        >
                            {involvementSaving ? "Saving..." : "Save changes"}
                        </button>
                    </div>

                    {involvementLoading ? (
                        <div className="py-12 flex items-center justify-center">
                            <CircularLoading customClass="text-orange-500 w-6 h-6" />
                        </div>
                    ) : (
                        <form className="flex flex-col gap-5" onSubmit={handleInvolvementSave}>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Title</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter involvement title"
                                    value={involvementInfo.title}
                                    onChange={(e) => handleInvolvementChange("title", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-gray-700">Description</label>
                                <textarea
                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                    placeholder="Enter involvement description"
                                    value={involvementInfo.description}
                                    onChange={(e) => handleInvolvementChange("description", e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold text-gray-700">Involvements (3 required)</p>
                                    <span className="text-[11px] text-gray-500">Fill in all three involvement cards before saving.</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {involvementInfo.involvements.map((entry, index) => (
                                        <div key={`${entry.id ?? "new"}-${index}`} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">Card title</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                    placeholder="Enter card title"
                                                    value={entry.title}
                                                    onChange={(e) => handleInvolvementItemChange(index, "title", e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">Card description</label>
                                                <textarea
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm h-20 resize-none focus:ring-2 focus:ring-orange-200 outline-none"
                                                    placeholder="Enter card description"
                                                    value={entry.description}
                                                    onChange={(e) => handleInvolvementItemChange(index, "description", e.target.value)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-xs font-semibold text-gray-700">URL</label>
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200 outline-none"
                                                    placeholder="e.g., /volunteer"
                                                    value={entry.url}
                                                    onChange={(e) => handleInvolvementItemChange(index, "url", e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            {showSuccessAlert && (
                <SuccesAlert
                    message={successMessage || "Success!"}
                    onClose={() => setShowSuccessAlert(false)}
                />
            )}
        </Admin>
    );
};

export default WebHome;

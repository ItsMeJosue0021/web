import Admin from "../../layouts/Admin";
import { useEffect, useState, useCallback } from "react";
import { X, Edit, Trash2 } from "lucide-react";
import { _get, _post, _delete } from "../../api";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmationAlert from "../../components/alerts/ConfirmationAlert";
import debounce from "lodash.debounce";
import CircularLoading from "../../components/CircularLoading";
import ModalContainer from "../../components/ModalContainer";
import VolunteerListPerProject from "../../components/VolunteerListPerProject";

const createEmptyProposedResource = () => ({
    name: "",
    category_id: "",
    sub_category_id: "",
    quantity: "",
    unit: "",
    notes: "",
});

const normalizeResourceText = (value = "") =>
    `${value}`
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const getResourceCategoryId = (resource) => `${resource?.category_id ?? resource?.category ?? ""}`;
const getResourceSubCategoryId = (resource) => `${resource?.sub_category_id ?? resource?.sub_category ?? ""}`;
const getResourceName = (resource) => `${resource?.name ?? resource?.item_name ?? ""}`;

const resourcesMatch = (proposed, actual) => {
    const proposedCategoryId = getResourceCategoryId(proposed);
    const actualCategoryId = getResourceCategoryId(actual);
    if (proposedCategoryId && actualCategoryId && proposedCategoryId !== actualCategoryId) {
        return false;
    }

    const proposedSubCategoryId = getResourceSubCategoryId(proposed);
    const actualSubCategoryId = getResourceSubCategoryId(actual);
    if (proposedSubCategoryId && actualSubCategoryId && proposedSubCategoryId !== actualSubCategoryId) {
        return false;
    }

    const proposedName = normalizeResourceText(getResourceName(proposed));
    const actualName = normalizeResourceText(getResourceName(actual));

    if (!proposedName || !actualName) {
        return true;
    }

    return (
        proposedName === actualName ||
        proposedName.includes(actualName) ||
        actualName.includes(proposedName)
    );
};

const buildResourceComparisonRows = (proposedResources = [], actualResources = []) => {
    const rows = proposedResources.map((proposed) => {
        const actualMatches = actualResources.filter((actual) => resourcesMatch(proposed, actual));
        const actualQuantity = actualMatches.reduce(
            (sum, actual) => sum + Number(actual?.usedQuantity ?? actual?.quantity ?? 0),
            0
        );
        const proposedQuantity = Number(proposed?.quantity ?? 0);
        const excessQuantity = actualQuantity > proposedQuantity ? actualQuantity - proposedQuantity : 0;

        let status = "missing";
        if (actualQuantity > 0 && actualQuantity < proposedQuantity) {
            status = "partial";
        } else if (actualQuantity > proposedQuantity && proposedQuantity > 0) {
            status = "excess";
        } else if (actualQuantity === proposedQuantity && proposedQuantity > 0) {
            status = "accomplished";
        }

        return {
            key: `proposed-${proposed.uid ?? proposed.id ?? proposed.name}`,
            proposed,
            actualMatches,
            proposedQuantity,
            actualQuantity,
            excessQuantity,
            status,
        };
    });

    const unplannedActualRows = actualResources
        .filter((actual) => !proposedResources.some((proposed) => resourcesMatch(proposed, actual)))
        .map((actual) => ({
            key: `actual-${actual.uid ?? actual.id ?? actual.name}`,
            proposed: null,
            actualMatches: [actual],
            proposedQuantity: 0,
            actualQuantity: Number(actual?.usedQuantity ?? actual?.quantity ?? 0),
            excessQuantity: 0,
            status: "unplanned",
        }));

    return [...rows, ...unplannedActualRows];
};

const getComparisonStatusMeta = (status) => {
    switch (status) {
        case "accomplished":
            return {
                label: "Accomplished",
                className: "bg-green-50 text-green-700 border border-green-200",
            };
        case "partial":
            return {
                label: "Partial",
                className: "bg-amber-50 text-amber-700 border border-amber-200",
            };
        case "excess":
            return {
                label: "Excess",
                className: "bg-orange-50 text-orange-700 border border-orange-200",
            };
        case "unplanned":
            return {
                label: "Unplanned Actual",
                className: "bg-blue-50 text-blue-700 border border-blue-200",
            };
        default:
            return {
                label: "Missing",
                className: "bg-red-50 text-red-700 border border-red-200",
            };
    }
};

const Projects = () => {
    const baseURL = "https://api.kalingangkababaihan.com/storage/";

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [image, setImage] = useState(null);
    const [isEvent, setIsEvent] = useState(false);
    const [projectFormLoading, setProjectFormLoading] = useState(false);
    const [proposedResources, setProposedResources] = useState([]);
    const [proposedResourceDraft, setProposedResourceDraft] = useState(createEmptyProposedResource());
    const [proposedResourceErrors, setProposedResourceErrors] = useState({});
    const [editingProposedResourceUid, setEditingProposedResourceUid] = useState(null);

    const [showAddProjectModal, setShowAddProjectModal] = useState(false);
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [toBeEditedProject, setToBeEditedProject] = useState(null);

    const [validationErrors, setValidationErrors] = useState({});

    const [openImage, setOpenImage] = useState(false);
    const [viewImageURL, setViewImageURL] = useState("");

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSavingProject, setIsSavingProject] = useState(false);
    const [isUpdatingProject, setIsUpdatingProject] = useState(false);

    // Liquidation
    const [isLiquidateOpen, setIsLiquidateOpen] = useState(false);
    const [liquidateProject, setLiquidateProject] = useState(null);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [inventoryLoading, setInventoryLoading] = useState(false);
    const [itemSearch, setItemSearch] = useState("");
    const [itemCategory, setItemCategory] = useState("");
    const [itemSubCategory, setItemSubCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [savingLiquidation, setSavingLiquidation] = useState(false);
    const [cashLiquidationForm, setCashLiquidationForm] = useState({
        amount: "",
        date_used: "",
        point_person: "",
        receipt: null,
    });
    const [cashLiquidationErrors, setCashLiquidationErrors] = useState({});
    const [savingCashLiquidation, setSavingCashLiquidation] = useState(false);
    const [cashLiquidations, setCashLiquidations] = useState([]);
    const [cashLiquidationsLoading, setCashLiquidationsLoading] = useState(false);
    const [cashLiquidationsError, setCashLiquidationsError] = useState("");
    const [cashLiquidationMaxAmount, setCashLiquidationMaxAmount] = useState(null);
    const [cashLiquidationLimitLoading, setCashLiquidationLimitLoading] = useState(false);
    const [deletingCashLiquidationId, setDeletingCashLiquidationId] = useState(null);
    const [isCashLiquidationModalOpen, setIsCashLiquidationModalOpen] = useState(false);
    const [isCashLiquidationDeleteOpen, setIsCashLiquidationDeleteOpen] = useState(false);
    const [cashLiquidationDeleteId, setCashLiquidationDeleteId] = useState(null);
    const [existingResourcesLoading, setExistingResourcesLoading] = useState(false);
    const [liquidationProposedResources, setLiquidationProposedResources] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isPrintOpen, setIsPrintOpen] = useState(false);
    const [printUrl, setPrintUrl] = useState("");
    const [printFilename, setPrintFilename] = useState("");
    const [printLoading, setPrintLoading] = useState(false);

    const generateUid = () => `uid-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const formatAddedOn = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    };

    const getFieldErrorMessage = (value) => (Array.isArray(value) ? value[0] : value);
    const proposedResourceValidationMessages = Object.entries(validationErrors)
        .filter(([key]) => key.startsWith("proposed_resources"))
        .map(([, value], index) => ({
            id: `proposed-resource-error-${index}`,
            message: getFieldErrorMessage(value),
        }));

    const extractCashLiquidationCollection = (payload) => {
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.cash_liquidations)) return payload.cash_liquidations;
        if (Array.isArray(payload?.cashLiquidations)) return payload.cashLiquidations;
        if (Array.isArray(payload?.liquidations)) return payload.liquidations;
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
    };

    const formatCashAmount = (value) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) return value ? `${value}` : "0.00";
        return numericValue.toLocaleString(undefined, {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        });
    };

    const formatShortDate = (value) => {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return `${value}`;
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const resolveReceiptUrl = (value) => {
        if (!value) return "";
        if (/^https?:\/\//i.test(value)) return value;
        return `${baseURL}${`${value}`.replace(/^\/?storage\//, "")}`;
    };

    const totalUsedForItem = (itemId, excludeUid = null, items = selectedItems, includeExisting = false) =>
        items.reduce((sum, item) => {
            if (item.id !== itemId) return sum;
            if (excludeUid && item.uid === excludeUid) return sum;
            if (!includeExisting && item.isExisting) return sum;
            return sum + Number(item.usedQuantity || 0);
        }, 0);

    const getRemainingQuantity = (item) => {
        const available = Number(item.quantity) || 0;
        const used = totalUsedForItem(item.id);
        const remaining = available - used;
        return remaining > 0 ? remaining : 0;
    };

    // FETCH PROJECTS
    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isLiquidateOpen) {
            fetchInventoryItems({ search: "", categoryId: "", subCategoryId: "" });
        }
    }, [isLiquidateOpen]);

    const fetchProjects = async ({ start = "", end = "" } = {}) => {
        try {
            setLoading(true);
            const params = {};
            if (start) params.start_date = start;
            if (end) params.end_date = end;
            const response = await _get("/projects", { params });
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const header = {
        title: "Projects Management",
        subTitle:
            "Easily manage your projects' information — create new entries, update project details, or remove completed or inactive projects.",
    };

    const breadcrumbs = [{ name: "Projects", link: "/projects" }];

    const clearForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setDate("");
        setImage(null);
        setIsEvent(false);
        setProposedResources([]);
        setProposedResourceDraft(createEmptyProposedResource());
        setProposedResourceErrors({});
        setEditingProposedResourceUid(null);
        setProjectFormLoading(false);
    };

    const mapProposedResourceFromApi = (resource) => ({
        uid: generateUid(),
        id: resource?.id,
        name: resource?.name || "",
        category_id: resource?.category_id ? `${resource.category_id}` : "",
        category_name: resource?.category_name || "",
        sub_category_id: resource?.sub_category_id ? `${resource.sub_category_id}` : "",
        sub_category_name: resource?.sub_category_name || "",
        quantity: resource?.quantity ? `${resource.quantity}` : "",
        unit: resource?.unit || "",
        notes: resource?.notes || "",
    });

    const resetProposedResourceDraft = () => {
        setProposedResourceDraft(createEmptyProposedResource());
        setProposedResourceErrors({});
        setEditingProposedResourceUid(null);
    };

    const validateProposedResourceDraft = () => {
        const nextErrors = {};

        if (!proposedResourceDraft.category_id) nextErrors.category_id = "Category is required.";
        if (!proposedResourceDraft.sub_category_id) nextErrors.sub_category_id = "Subcategory is required.";
        if (!proposedResourceDraft.name.trim()) nextErrors.name = "Item/material name is required.";
        if (!proposedResourceDraft.quantity || Number.isNaN(Number(proposedResourceDraft.quantity)) || Number(proposedResourceDraft.quantity) <= 0) {
            nextErrors.quantity = "Quantity must be greater than 0.";
        }

        setProposedResourceErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleProposedResourceCategoryChange = (value) => {
        setProposedResourceDraft((prev) => ({
            ...prev,
            category_id: value,
            sub_category_id: "",
        }));
        setProposedResourceErrors((prev) => ({
            ...prev,
            category_id: undefined,
            sub_category_id: undefined,
        }));
    };

    const handleSaveProposedResource = () => {
        if (!validateProposedResourceDraft()) return;

        const selectedCategory = categories.find((category) => `${category.id}` === `${proposedResourceDraft.category_id}`);
        const selectedSubCategory = (selectedCategory?.subcategories || []).find(
            (subcategory) => `${subcategory.id}` === `${proposedResourceDraft.sub_category_id}`
        );

        const nextResource = {
            uid: editingProposedResourceUid || generateUid(),
            id: proposedResources.find((resource) => resource.uid === editingProposedResourceUid)?.id,
            name: proposedResourceDraft.name.trim(),
            category_id: `${proposedResourceDraft.category_id}`,
            category_name: selectedCategory?.name || "",
            sub_category_id: `${proposedResourceDraft.sub_category_id}`,
            sub_category_name: selectedSubCategory?.name || "",
            quantity: `${Math.max(1, Number(proposedResourceDraft.quantity))}`,
            unit: proposedResourceDraft.unit.trim(),
            notes: proposedResourceDraft.notes.trim(),
        };

        setProposedResources((prev) => {
            if (!editingProposedResourceUid) {
                return [...prev, nextResource];
            }

            return prev.map((resource) =>
                resource.uid === editingProposedResourceUid ? nextResource : resource
            );
        });

        resetProposedResourceDraft();
    };

    const handleEditProposedResource = (resource) => {
        setEditingProposedResourceUid(resource.uid);
        setProposedResourceDraft({
            name: resource.name || "",
            category_id: resource.category_id ? `${resource.category_id}` : "",
            sub_category_id: resource.sub_category_id ? `${resource.sub_category_id}` : "",
            quantity: resource.quantity ? `${resource.quantity}` : "",
            unit: resource.unit || "",
            notes: resource.notes || "",
        });
        setProposedResourceErrors({});
    };

    const handleRemoveProposedResource = (resourceUid) => {
        setProposedResources((prev) => prev.filter((resource) => resource.uid !== resourceUid));
        if (editingProposedResourceUid === resourceUid) {
            resetProposedResourceDraft();
        }
    };

    const appendProposedResourcesToFormData = (formData) => {
        proposedResources.forEach((resource, index) => {
            formData.append(`proposed_resources[${index}][name]`, resource.name);
            formData.append(`proposed_resources[${index}][category_id]`, resource.category_id);
            formData.append(`proposed_resources[${index}][sub_category_id]`, resource.sub_category_id);
            formData.append(`proposed_resources[${index}][quantity]`, `${resource.quantity}`);
            if (resource.unit) {
                formData.append(`proposed_resources[${index}][unit]`, resource.unit);
            }
            if (resource.notes) {
                formData.append(`proposed_resources[${index}][notes]`, resource.notes);
            }
        });
    };

    const handleOpenEditModal = async (project) => {
        clearForm();
        setValidationErrors({});

        setToBeEditedProject(project);
        setTitle(project.title || "");
        setDescription(project.description || "");
        setLocation(project.location || "");
        setDate(project.date || "");
        setIsEvent(project.is_event == 1);
        setShowEditProjectModal(true);
        setProjectFormLoading(true);

        try {
            const response = await _get(`/projects/${project.id}`);
            const projectDetail = response.data || {};
            setTitle(projectDetail.title || project.title || "");
            setDescription(projectDetail.description || project.description || "");
            setLocation(projectDetail.location || project.location || "");
            setDate(projectDetail.date || project.date || "");
            setIsEvent(projectDetail.is_event == 1);
            setProposedResources(
                Array.isArray(projectDetail.proposed_resources)
                    ? projectDetail.proposed_resources.map(mapProposedResourceFromApi)
                    : []
            );
        } catch (error) {
            console.error("Error fetching project details:", error);
            toast.error("Unable to load the full project details.");
        } finally {
            setProjectFormLoading(false);
        }
    };

    const handleViewImage = (image) => {
        setViewImageURL(image);
        setOpenImage(true);
    };

    // SEARCH — Debounced
    const handleSearch = useCallback(
        debounce(async (searchValue) => {
            setLoading(true);
            try {
                const params = {};
                if (startDate) params.start_date = startDate;
                if (endDate) params.end_date = endDate;
                const response = await _get(`/projects/search?search=${searchValue}`, { params });
                setProjects(response.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }, 500),
        [endDate, startDate]
    );

    const handleApplyDateFilter = () => {
        fetchProjects({ start: startDate, end: endDate });
    };

    const handleClearDateFilter = () => {
        setStartDate("");
        setEndDate("");
        fetchProjects({ start: "", end: "" });
    };

    const handlePrint = async () => {
        setPrintLoading(true);
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            const fileResponse = await _get("/projects/print", { params, responseType: "blob" });
            const blobUrl = URL.createObjectURL(fileResponse.data);
            if (printUrl) {
                URL.revokeObjectURL(printUrl);
            }
            setPrintUrl(blobUrl);
            setPrintFilename("projects.pdf");
            setIsPrintOpen(true);
        } catch (error) {
            console.error("Error generating print report:", error);
            toast.error("Unable to generate the report.");
        } finally {
            setPrintLoading(false);
        }
    };

    const handleLiquidationPrint = async () => {
        if (!liquidateProject?.id) return;
        setPrintLoading(true);
        try {
            const fileResponse = await _get(`/projects/${liquidateProject.id}/liquidated-items/print`, {
                responseType: "blob",
            });
            const blobUrl = URL.createObjectURL(fileResponse.data);
            if (printUrl) {
                URL.revokeObjectURL(printUrl);
            }
            setPrintUrl(blobUrl);
            setPrintFilename(`liquidated-items-${liquidateProject.id}.pdf`);
            setIsPrintOpen(true);
        } catch (error) {
            console.error("Error generating liquidation report:", error);
            toast.error("Unable to generate the report.");
        } finally {
            setPrintLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProject(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("is_event", isEvent ? "1" : "0");
        formData.append("sync_proposed_resources", "1");
        appendProposedResourcesToFormData(formData);

        if (image) formData.append("image", image);

        try {
            await _post("/projects", formData);
            fetchProjects();
            clearForm();
            setShowAddProjectModal(false);
            toast.success("Project added successfully!");
            setValidationErrors({});
        } catch (error) {
            if (error.response?.data?.errors) {
                setValidationErrors(error.response.data.errors);
            } else {
                toast.error("Error adding project.");
            }
        } finally {
            setIsSavingProject(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsUpdatingProject(true);
        const formData = new FormData();

        formData.append("title", title);
        formData.append("description", description);
        formData.append("location", location);
        formData.append("date", date);
        formData.append("is_event", isEvent ? "1" : "0");
        formData.append("sync_proposed_resources", "1");
        appendProposedResourcesToFormData(formData);

        if (image) formData.append("image", image);

        try {
            await _post(`/projects/update/${toBeEditedProject.id}`, formData);
            fetchProjects();
            clearForm();
            setShowEditProjectModal(false);
            toast.success("Project updated successfully!");
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error("Error updating project.");
        } finally {
            setIsUpdatingProject(false);
        }
    };

    const handleConfirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await _delete(`/projects/${deleteId}`);
            toast.success("Project deleted successfully!");
            setProjects(projects.filter((p) => p.id !== deleteId));
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error("Error deleting project.");
        } finally {
            setIsDeleteOpen(false);
            setIsDeleting(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchInventoryItems = async ({
        search = itemSearch,
        categoryId = itemCategory,
        subCategoryId = itemSubCategory,
    } = {}) => {
        setInventoryLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryId) params.category = categoryId;
            if (subCategoryId) params.sub_category = subCategoryId;

            const response = await _get("/items", { params });
            if (response.data && response.status === 200) {
                const fetched = response.data.items || [];
                const filtered = fetched.filter(
                    (item) => Number(item.quantity) > 0 && item.status === "available"
                );
                setInventoryItems(filtered);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setInventoryLoading(false);
        }
    };

    const fetchProjectResources = async (projectId) => {
        setExistingResourcesLoading(true);
        try {
            const response = await _get(`/projects/${projectId}/resources`);
            const resources = response.data?.items || response.data?.resources || response.data || [];
            const proposed = response.data?.proposed_resources || [];
            const mapped = resources
                .map((res) => {
                    const itemData = res.item || {};
                    const id = res.item_id || res.id || itemData.id;
                    if (!id) return null;
                    return {
                        id,
                        uid: generateUid(),
                        name: res.name || res.item_name || itemData.name || "",
                        category_id: res.category_id || itemData.category || "",
                        category_name: res.category_name || itemData.category_name || res.category?.name || "",
                        sub_category_id: res.sub_category_id || itemData.sub_category || "",
                        sub_category_name: res.sub_category_name || itemData.sub_category_name || res.subcategory?.name || "",
                        quantity: res.available_quantity ?? itemData.quantity ?? res.quantity ?? 0,
                        unit: res.unit || itemData.unit || "",
                        notes: res.notes || itemData.notes || "",
                        status: res.status || itemData.status || "available",
                        usedQuantity: Number(res.quantity_used || res.used_quantity || res.quantity || 1) || 1,
                        isExisting: true,
                        addedOn: res.created_at || res.added_at || itemData.created_at || "",
                    };
                })
                .filter(Boolean);
            setSelectedItems(mapped);
            setLiquidationProposedResources(
                Array.isArray(proposed) ? proposed.map(mapProposedResourceFromApi) : []
            );
        } catch (error) {
            console.error("Error fetching project resources:", error);
            setSelectedItems([]);
            setLiquidationProposedResources([]);
        } finally {
            setExistingResourcesLoading(false);
        }
    };

    const fetchProjectCashLiquidations = async (projectId) => {
        if (!projectId) {
            setCashLiquidations([]);
            setCashLiquidationsError("");
            return;
        }

        setCashLiquidationsLoading(true);
        setCashLiquidationsError("");
        try {
            const response = await _get(`/projects/${projectId}/cash-liquidations`);
            setCashLiquidations(extractCashLiquidationCollection(response.data));
        } catch (error) {
            console.error("Error fetching project cash liquidations:", error);
            setCashLiquidations([]);
            setCashLiquidationsError("Unable to load cash liquidation records.");
        } finally {
            setCashLiquidationsLoading(false);
        }
    };

    const fetchCashLiquidationLimit = async () => {
        setCashLiquidationLimitLoading(true);
        try {
            const response = await _get("/expenditures/totals");
            const totalMonetaryDonations = Number(response.data?.total_monetary_donations) || 0;
            const totalExpenses = Number(response.data?.total_expenditures) || 0;
            const remainingAmount = totalMonetaryDonations - totalExpenses;

            setCashLiquidationMaxAmount(remainingAmount > 0 ? remainingAmount : 0);
        } catch (error) {
            console.error("Error fetching cash liquidation limit:", error);
            setCashLiquidationMaxAmount(null);
        } finally {
            setCashLiquidationLimitLoading(false);
        }
    };

    const resetCashLiquidationForm = () => {
        setCashLiquidationForm({
            amount: "",
            date_used: "",
            point_person: "",
            receipt: null,
        });
        setCashLiquidationErrors({});
    };

    const openLiquidateModal = async (project) => {
        setLiquidateProject(project);
        setIsLiquidateOpen(true);
        setItemSearch("");
        setItemCategory("");
        setItemSubCategory("");
        resetCashLiquidationForm();
        await Promise.all([
            fetchProjectResources(project.id),
            fetchProjectCashLiquidations(project.id),
            fetchCashLiquidationLimit(),
        ]);
        fetchInventoryItems({ search: "", categoryId: "", subCategoryId: "" });
    };

    const closeLiquidateModal = () => {
        setIsLiquidateOpen(false);
        setIsCashLiquidationModalOpen(false);
        setLiquidateProject(null);
        setSelectedItems([]);
        setLiquidationProposedResources([]);
        resetCashLiquidationForm();
        setCashLiquidations([]);
        setCashLiquidationsError("");
        setCashLiquidationMaxAmount(null);
        setDeletingCashLiquidationId(null);
        setIsCashLiquidationDeleteOpen(false);
        setCashLiquidationDeleteId(null);
    };

    const openCashLiquidationModal = () => {
        if (!liquidateProject?.id) return;
        setIsCashLiquidationModalOpen(true);
        fetchProjectCashLiquidations(liquidateProject.id);
        fetchCashLiquidationLimit();
    };

    const handleCashLiquidationAmountChange = (value) => {
        if (value === "") {
            setCashLiquidationForm((prev) => ({ ...prev, amount: "" }));
            return;
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return;

        const safeValue = cashLiquidationMaxAmount !== null
            ? Math.min(numericValue, cashLiquidationMaxAmount)
            : numericValue;

        setCashLiquidationForm((prev) => ({
            ...prev,
            amount: `${safeValue}`,
        }));
    };

    const handleItemSearchChange = (value) => {
        setItemSearch(value);
        fetchInventoryItems({ search: value, categoryId: itemCategory, subCategoryId: itemSubCategory });
    };

    const handleItemCategoryChange = (value) => {
        setItemCategory(value);
        const resetSub = "";
        setItemSubCategory(resetSub);
        fetchInventoryItems({ search: itemSearch, categoryId: value, subCategoryId: resetSub });
    };

    const handleItemSubCategoryChange = (value) => {
        setItemSubCategory(value);
        fetchInventoryItems({ search: itemSearch, categoryId: itemCategory, subCategoryId: value });
    };

    const handleSelectItem = (item) => {
        const remaining = getRemainingQuantity(item);
        if (remaining <= 0) {
            toast.warn("No remaining quantity for this item.");
            return;
        }

        const defaultQty = remaining < 1 ? remaining : 1;
        setSelectedItems((prev) => [
            ...prev,
            {
                ...item,
                uid: generateUid(),
                usedQuantity: defaultQty,
                isExisting: false,
                addedOn: new Date().toISOString(),
            },
        ]);
    };

    const handleQuantityChange = (itemUid, value) => {
        if (value === "") {
            setSelectedItems((prev) =>
                prev.map((i) => (i.uid === itemUid ? { ...i, usedQuantity: "" } : i))
            );
            return;
        }

        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return;

        setSelectedItems((prev) =>
            prev.map((i) => {
                if (i.uid !== itemUid) return i;

                const available = Number(i.quantity) || 0;
                const usedByOthers = prev.reduce((sum, current) => {
                    if (current.id === i.id && current.uid !== itemUid && !current.isExisting) {
                        return sum + Number(current.usedQuantity || 0);
                    }
                    return sum;
                }, 0);

                const allowed = Math.max(available - usedByOthers, 0);
                const safeValue = allowed === 0 ? 0 : Math.max(1, Math.min(allowed, numericValue));

                return { ...i, usedQuantity: safeValue };
            })
        );
    };

    const handleRemoveSelectedItem = (itemUid) => {
        setSelectedItems((prev) => prev.filter((i) => i.uid !== itemUid));
    };

    const submitLiquidation = async () => {
        if (!liquidateProject) return;

        const pendingItems = selectedItems.filter(
            (item) => !item.isExisting && Number(item.usedQuantity) > 0
        );
        if (pendingItems.length === 0) {
            toast.warn("Select at least one item to liquidate.");
            return;
        }

        const payload = {
            items: pendingItems
                .map((item) => ({
                    item_id: item.id,
                    quantity: Number(item.usedQuantity) > 0 ? Number(item.usedQuantity) : 1,
                })),
        };

        setSavingLiquidation(true);
        try {
            await _post(`/projects/${liquidateProject.id}/liquidate`, payload);
            toast.success("Liquidation saved.");
            closeLiquidateModal();
            fetchProjects();
        } catch (error) {
            console.error("Error saving liquidation:", error);
            toast.error("Error saving liquidation.");
        } finally {
            setSavingLiquidation(false);
        }
    };

    const submitCashLiquidation = async () => {
        if (!liquidateProject?.id) return;

        const validation = {};
        const parsedAmount = Number(cashLiquidationForm.amount);
        if (!cashLiquidationForm.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            validation.amount = "Amount is required and must be greater than 0.";
        } else if (cashLiquidationMaxAmount !== null && parsedAmount > cashLiquidationMaxAmount) {
            validation.amount = `Amount cannot exceed the max amount of ${formatCashAmount(cashLiquidationMaxAmount)}.`;
        }
        if (!cashLiquidationForm.date_used) {
            validation.date_used = "Date used is required.";
        }
        if (!cashLiquidationForm.point_person.trim()) {
            validation.point_person = "Point person is required.";
        }

        if (Object.keys(validation).length > 0) {
            setCashLiquidationErrors(validation);
            return;
        }

        const buildCashFormData = () => {
            const formData = new FormData();
            formData.append("amount", `${parsedAmount}`);
            formData.append("date_used", cashLiquidationForm.date_used);
            formData.append("used_at", cashLiquidationForm.date_used);
            formData.append("date", cashLiquidationForm.date_used);
            formData.append("point_person", cashLiquidationForm.point_person.trim());
            formData.append("person_responsible", cashLiquidationForm.point_person.trim());
            if (cashLiquidationForm.receipt) {
                formData.append("receipt", cashLiquidationForm.receipt);
            }
            return formData;
        };

        setSavingCashLiquidation(true);
        setCashLiquidationErrors({});

        try {
            await _post(`/projects/${liquidateProject.id}/cash-liquidations`, buildCashFormData());
            toast.success("Cash liquidation saved.");
            resetCashLiquidationForm();
            fetchProjects();
            fetchProjectCashLiquidations(liquidateProject.id);
            fetchCashLiquidationLimit();
        } catch (error) {
            if (error?.response?.status === 422) {
                setCashLiquidationErrors(error.response?.data?.errors || {});
                toast.error(error.response?.data?.message || "Cash liquidation validation failed.");
            } else {
                toast.error("Error saving cash liquidation.");
            }
            console.error("Error saving cash liquidation:", error);
        } finally {
            setSavingCashLiquidation(false);
        }
    };

    const handleConfirmCashLiquidationDelete = (cashLiquidationId) => {
        if (!cashLiquidationId) return;
        setCashLiquidationDeleteId(cashLiquidationId);
        setIsCashLiquidationDeleteOpen(true);
    };

    const deleteCashLiquidation = async () => {
        if (!cashLiquidationDeleteId) return;

        setDeletingCashLiquidationId(cashLiquidationDeleteId);
        try {
            await _delete(`/cash-liquidations/${cashLiquidationDeleteId}`);
            toast.success("Cash liquidation deleted.");
            fetchProjectCashLiquidations(liquidateProject?.id);
            fetchProjects();
            fetchCashLiquidationLimit();
        } catch (error) {
            console.error("Error deleting cash liquidation:", error);
            toast.error("Error deleting cash liquidation.");
        } finally {
            setDeletingCashLiquidationId(null);
            setCashLiquidationDeleteId(null);
            setIsCashLiquidationDeleteOpen(false);
        }
    };

    const subCategoryOptions = itemCategory
        ? categories.find((cat) => `${cat.id}` === `${itemCategory}`)?.subcategories || []
        : categories.flatMap((cat) => cat.subcategories || []);
    const proposedSubCategoryOptions = proposedResourceDraft.category_id
        ? categories.find((cat) => `${cat.id}` === `${proposedResourceDraft.category_id}`)?.subcategories || []
        : [];
    const pendingGoodsItemsCount = selectedItems.filter((item) => !item.isExisting).length;
    const comparisonRows = buildResourceComparisonRows(liquidationProposedResources, selectedItems);

    const [openVolunteerList, setOpenVolunteerList] = useState(false);
    const [projectId, setProjectId] = useState(null);

    const handleOpenVolunteerList = (projectId) => {
        setOpenVolunteerList(true);
        setProjectId(projectId);
    }

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            {/* SEARCH + NEW BUTTON */}
            <div className="w-full flex flex-col lg:flex-row items-center justify-between bg-white p-3 mt-4 rounded-lg gap-3">
                <div className="w-full flex items-center gap-3">
                    <p className="text-xs whitespace-nowrap">Search</p>
                    <input
                        onChange={(e) => handleSearch(e.target.value)}
                        type="text"
                        className="w-full sm:max-w-[360px] bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                        placeholder="Type something..."
                    />
                </div>

                <div className="w-full flex flex-col sm:flex-row items-center gap-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs text-gray-600 whitespace-nowrap">Start date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full sm:w-auto bg-white placeholder:text-xs px-3 py-2 rounded border border-gray-200 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs text-gray-600 whitespace-nowrap">End date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full sm:w-auto bg-white placeholder:text-xs px-3 py-2 rounded border border-gray-200 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleApplyDateFilter}
                            className="w-full sm:w-auto text-xs px-3 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            onClick={handleClearDateFilter}
                            className="w-full sm:w-auto text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrint}
                        disabled={printLoading}
                        className={`w-full sm:w-auto text-xs px-4 py-2 rounded border border-gray-200 ${printLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
                    >
                        {printLoading ? "Generating..." : "Print"}
                    </button>
                    <button
                        onClick={() => {
                            clearForm();
                            setValidationErrors({});
                            setShowAddProjectModal(true);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-4 py-2 rounded w-full sm:w-auto flex items-center gap-2 justify-center"
                    >
                        <span>+</span>
                        <span>New</span>
                    </button>
                </div>
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="w-full h-40 flex items-center justify-center">
                    <CircularLoading customClass="text-blue-500 w-6 h-6" />
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500 mt-4">
                    No projects found. Create a new project to get started.
                    <div className="mt-3">
                        <button
                            onClick={() => {
                                clearForm();
                                setValidationErrors({});
                                setShowAddProjectModal(true);
                            }}
                            className="text-xs px-3 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
                        >
                            Add project
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full overflow-x-auto rounded-lg shadow bg-white mt-4">
                    <table className="min-w-[900px] w-full text-xs">
                        <thead className="bg-orange-500 text-white">
                            <tr>
                                <th className="p-3">Title</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Image</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Volunteers</th>
                                <th className="p-3 text-end">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
                                    className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}
                                >
                                    <td className="p-3">{project.title}</td>
                                    <td className="p-3">
                                        {(project.description || "").length > 100
                                            ? project.description.substring(0, 100) + "..."
                                            : project.description}
                                    </td>
                                    <td className="p-3">{project.location}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleViewImage(project.image)}
                                            className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="p-3">{project.date}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleOpenVolunteerList(project.id)}
                                            className="text-[10px] px-2 py-1 bg-gray-200 rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                    <td className="p-3 flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEditModal(project)}
                                            className="bg-blue-50 text-blue-600 px-1 py-1 rounded"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleConfirmDelete(project.id)}
                                            className="bg-red-50 text-red-600 px-1 py-1 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => openLiquidateModal(project)}
                                            className="bg-green-500 text-white px-2 text-xs py-1 rounded"
                                        >
                                            Liquidate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* LIQUIDATE MODAL */}
            {isLiquidateOpen && (
                <ModalContainer isFull={true} close={closeLiquidateModal}>
                    <div className="w-full max-w-[98vw] mx-auto flex min-h-0 max-h-[calc(100vh-7rem)] flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                            <div>
                                <p className="text-lg font-semibold text-orange-600">Liquidate Items</p>
                                <p className="text-xs text-gray-500">
                                    {liquidateProject?.title ? `For project: ${liquidateProject.title}` : "Select the items used for this project."}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={openCashLiquidationModal}
                                    className="w-full sm:w-auto text-xs px-4 py-2 rounded border border-blue-200 text-blue-700 hover:bg-blue-50"
                                >
                                    Cash Liquidation
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLiquidationPrint}
                                    disabled={printLoading}
                                    className={`w-full sm:w-auto text-xs px-4 py-2 rounded border border-gray-200 ${printLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
                                >
                                    {printLoading ? "Generating..." : "Print"}
                                </button>
                                <button
                                    onClick={closeLiquidateModal}
                                    className="w-full sm:w-auto text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitLiquidation}
                                    disabled={savingLiquidation || pendingGoodsItemsCount === 0}
                                    className={`w-full sm:w-auto text-xs px-4 py-2 rounded text-white ${savingLiquidation || pendingGoodsItemsCount === 0 ? "bg-green-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                                >
                                    {savingLiquidation ? "Saving..." : "Save Goods Liquidation"}
                                </button>
                            </div>
                        </div>

                        <div className="rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-blue-900">Cash liquidation is now handled separately</p>
                                    <p className="text-[11px] text-blue-800/80">
                                        Open the cash liquidation modal when you need to log monetary expenses. The main workspace below is now dedicated to the proposed-versus-actual goods comparison.
                                    </p>
                                </div>
                                <div className="flex flex-col text-[11px] text-blue-900 lg:text-right">
                                    <span>
                                        Recorded cash entries: {cashLiquidationsLoading ? "Loading..." : cashLiquidations.length}
                                    </span>
                                    <span>
                                        Remaining balance: {cashLiquidationLimitLoading
                                            ? "Loading..."
                                            : cashLiquidationMaxAmount === null
                                                ? "Unavailable"
                                                : formatCashAmount(cashLiquidationMaxAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] gap-4 min-h-0">
                                <div className="xl:col-span-2 flex flex-col gap-3 border rounded-lg p-3 overflow-hidden bg-white">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold">Proposed vs Actual Resources</p>
                                            <p className="text-[11px] text-gray-500">
                                                Compare what the project planned to use against the actual inventory items liquidated.
                                            </p>
                                        </div>
                                        {liquidationProposedResources.length > 0 && (
                                            <p className="text-[11px] text-gray-500">
                                                {liquidationProposedResources.length} proposed item(s)
                                            </p>
                                        )}
                                    </div>

                                    <div className="min-h-[300px] max-h-[380px] overflow-y-auto border rounded p-2 bg-gray-50/50">
                                        {existingResourcesLoading ? (
                                            <div className="w-full py-8 flex items-center justify-center">
                                                <CircularLoading customClass="text-blue-500 w-5 h-5" />
                                            </div>
                                        ) : liquidationProposedResources.length === 0 && selectedItems.length === 0 ? (
                                            <p className="text-xs text-center text-gray-500 py-6">
                                                No proposed or actual resource records yet for this project.
                                            </p>
                                        ) : comparisonRows.length === 0 ? (
                                            <p className="text-xs text-center text-gray-500 py-6">
                                                No proposed resources were saved for this project yet. Actual liquidated items will still appear below after you add them.
                                            </p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-[760px] w-full text-[11px]">
                                                    <thead className="text-left text-gray-600">
                                                        <tr>
                                                            <th className="px-2 py-2 font-semibold">Proposed Item</th>
                                                            <th className="px-2 py-2 font-semibold">Proposed Qty</th>
                                                            <th className="px-2 py-2 font-semibold">Actual Item(s) Used</th>
                                                            <th className="px-2 py-2 font-semibold">Actual Qty</th>
                                                            <th className="px-2 py-2 font-semibold">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {comparisonRows.map((row) => {
                                                            const statusMeta = getComparisonStatusMeta(row.status);
                                                            return (
                                                                <tr key={row.key} className="border-t border-gray-200 align-top">
                                                                    <td className="px-2 py-2">
                                                                        {row.proposed ? (
                                                                            <div className="flex flex-col gap-1">
                                                                                <p className="font-medium text-gray-800">{row.proposed.name}</p>
                                                                                <p className="text-gray-500">
                                                                                    {row.proposed.category_name || "Uncategorized"}
                                                                                    {row.proposed.sub_category_name ? ` • ${row.proposed.sub_category_name}` : ""}
                                                                                </p>
                                                                                {row.proposed.notes && (
                                                                                    <p className="text-gray-500">Notes: {row.proposed.notes}</p>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <span className="text-gray-400">No proposal</span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-2 py-2 text-gray-700">
                                                                        {row.proposed ? `${row.proposedQuantity} ${row.proposed?.unit || ""}`.trim() : "-"}
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        {row.actualMatches.length === 0 ? (
                                                                            <span className="text-gray-400">No actual items yet</span>
                                                                        ) : (
                                                                            <div className="flex flex-col gap-1">
                                                                                {row.actualMatches.map((actual) => (
                                                                                    <div key={actual.uid || actual.id} className="text-gray-700">
                                                                                        <p className="font-medium">{actual.name}</p>
                                                                                        <p className="text-gray-500">
                                                                                            {actual.category_name || "Uncategorized"}
                                                                                            {actual.sub_category_name ? ` • ${actual.sub_category_name}` : ""}
                                                                                        </p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-2 py-2 text-gray-700">
                                                                        {row.actualQuantity > 0 ? (
                                                                            <div className="flex flex-col gap-1">
                                                                                <span>
                                                                                    {`${row.actualQuantity} ${row.actualMatches[0]?.unit || row.proposed?.unit || ""}`.trim()}
                                                                                </span>
                                                                                {row.excessQuantity > 0 && (
                                                                                    <span className="text-[10px] font-medium text-orange-700">
                                                                                        Excess: +{`${row.excessQuantity} ${row.actualMatches[0]?.unit || row.proposed?.unit || ""}`.trim()}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            "-"
                                                                        )}
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className={`inline-flex w-fit rounded-full px-2 py-1 text-[10px] font-semibold ${statusMeta.className}`}>
                                                                                {statusMeta.label}
                                                                            </span>
                                                                            {row.excessQuantity > 0 && (
                                                                                <span className="text-[10px] text-orange-700">
                                                                                    +{row.excessQuantity} over planned
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 border rounded-lg p-3 overflow-hidden bg-white min-h-[320px]">
                                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                                    <input
                                        value={itemSearch}
                                        onChange={(e) => handleItemSearchChange(e.target.value)}
                                        type="text"
                                        className="w-full sm:flex-1 bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                                        placeholder="Search items..."
                                    />
                                    <select
                                        value={itemCategory}
                                        onChange={(e) => handleItemCategoryChange(e.target.value)}
                                        className="w-full sm:w-auto bg-white text-xs px-3 py-2 rounded border border-gray-200"
                                    >
                                        <option value="">All categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={itemSubCategory}
                                        onChange={(e) => handleItemSubCategoryChange(e.target.value)}
                                        className="w-full sm:w-auto bg-white text-xs px-3 py-2 rounded border border-gray-200"
                                    >
                                        <option value="">All subcategories</option>
                                        {subCategoryOptions.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex-1 min-h-[250px] overflow-y-auto border rounded p-2 bg-gray-50/50">
                                    {inventoryLoading || existingResourcesLoading ? (
                                        <div className="w-full h-full flex items-center justify-center py-8">
                                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                                        </div>
                                    ) : inventoryItems.length === 0 ? (
                                        <p className="text-xs text-center text-gray-500 py-6">No items found.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {inventoryItems.map((item) => {
                                                const remaining = getRemainingQuantity(item);
                                                const isMaxedOut = remaining <= 0;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-start justify-between gap-3 bg-white border rounded p-2"
                                                    >
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-[11px] text-gray-600">
                                                                {item.category_name} {item.sub_category_name ? `• ${item.sub_category_name}` : ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Available: {item.quantity} {item.unit || ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Remaining after selection: {remaining} {item.unit || ""}
                                                            </p>
                                                            {item.notes && (
                                                                <p className="text-[11px] text-gray-500">Notes: {item.notes}</p>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleSelectItem(item)}
                                                            disabled={isMaxedOut}
                                                            className={`text-xs px-3 py-1 rounded ${
                                                                isMaxedOut
                                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                    : "bg-orange-500 text-white hover:bg-orange-600"
                                                            }`}
                                                        >
                                                            {isMaxedOut ? "Maxed" : "Add"}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 border rounded-lg p-3 overflow-hidden bg-white min-h-[320px]">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold">Selected Items</p>
                                    <p className="text-[11px] text-gray-500">{selectedItems.length} item(s)</p>
                                </div>

                                <div className="flex-1 min-h-[250px] overflow-y-auto border rounded p-2 bg-gray-50/50">
                                    {selectedItems.length === 0 ? (
                                        <p className="text-xs text-center text-gray-500 py-6">
                                            No items selected yet.
                                        </p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {selectedItems.map((item) => (
                                                <div
                                                    key={item.uid || item.id}
                                                    className="flex flex-col gap-2 bg-white border rounded p-2"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-sm font-medium">{item.name}</p>
                                                            <p className="text-[11px] text-gray-600">
                                                                {item.category_name} {item.sub_category_name ? `• ${item.sub_category_name}` : ""}
                                                            </p>
                                                            <p className="text-[11px] text-gray-500">
                                                                Available: {item.quantity} {item.unit || ""}
                                                            </p>
                                                            {item.addedOn && (
                                                                <p className="text-[11px] text-gray-500">
                                                                    Added on: {formatAddedOn(item.addedOn)}
                                                                </p>
                                                            )}
                                                            {item.isExisting && (
                                                                <span className="inline-block text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded mt-1">
                                                                    Already itemized
                                                                </span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveSelectedItem(item.uid)}
                                                            disabled={item.isExisting}
                                                            className={`text-[11px] ${
                                                                item.isExisting
                                                                    ? "text-gray-400 cursor-not-allowed"
                                                                    : "text-red-500 hover:text-red-600"
                                                            }`}
                                                        >
                                                            {item.isExisting ? "Saved" : "Remove"}
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <label className="text-[11px] text-gray-600">Quantity used</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.usedQuantity}
                                                            onChange={(e) => handleQuantityChange(item.uid, e.target.value)}
                                                            className={`w-24 bg-white border px-2 py-1 rounded text-xs ${item.isExisting ? "opacity-60 cursor-not-allowed" : ""}`}
                                                            disabled={item.isExisting}
                                                        />
                                                        {item.unit && (
                                                            <span className="text-[11px] text-gray-500">{item.unit}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {isCashLiquidationModalOpen && (
                <ModalContainer
                    isFull={false}
                    close={() => setIsCashLiquidationModalOpen(false)}
                >
                    <div className="w-full max-w-[92vw] md:w-[880px] lg:w-[960px] max-h-[calc(100vh-5rem)] rounded-xl bg-white p-4 flex flex-col gap-4 overflow-hidden">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <p className="text-lg font-semibold text-orange-600">Cash Expense Liquidation</p>
                                <p className="text-xs text-gray-500">
                                    {liquidateProject?.title
                                        ? `Record cash used for project: ${liquidateProject.title}`
                                        : "Record cash used for this project separately from goods liquidation."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCashLiquidationModalOpen(false)}
                                className="w-full sm:w-auto text-xs px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                            >
                                Close
                            </button>
                        </div>

                        <div className="grid flex-1 min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-4 overflow-hidden">
                            <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[11px] font-medium text-orange-600">
                                        Max Amount: {cashLiquidationLimitLoading
                                            ? "Loading..."
                                            : cashLiquidationMaxAmount === null
                                                ? "Unavailable"
                                                : formatCashAmount(cashLiquidationMaxAmount)}
                                    </p>
                                    <label className="text-[11px] text-gray-600">Amount</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        max={cashLiquidationMaxAmount ?? undefined}
                                        value={cashLiquidationForm.amount}
                                        onChange={(e) => handleCashLiquidationAmountChange(e.target.value)}
                                        className="w-full bg-white px-3 py-2 rounded border border-gray-200 text-xs"
                                        placeholder="Enter amount used"
                                    />
                                    {cashLiquidationMaxAmount === 0 && !cashLiquidationLimitLoading && (
                                        <p className="text-[11px] text-amber-600">
                                            No remaining monetary balance is available for cash liquidation.
                                        </p>
                                    )}
                                    {cashLiquidationMaxAmount === null && !cashLiquidationLimitLoading && (
                                        <p className="text-[11px] text-amber-600">
                                            Unable to load the current max amount. You can still enter a value and submit.
                                        </p>
                                    )}
                                    {cashLiquidationErrors.amount && (
                                        <p className="text-[11px] text-red-500">{getFieldErrorMessage(cashLiquidationErrors.amount)}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-600">Date Money Was Used</label>
                                    <input
                                        type="date"
                                        value={cashLiquidationForm.date_used}
                                        onChange={(e) =>
                                            setCashLiquidationForm((prev) => ({ ...prev, date_used: e.target.value }))
                                        }
                                        className="w-full bg-white px-3 py-2 rounded border border-gray-200 text-xs"
                                    />
                                    {cashLiquidationErrors.date_used && (
                                        <p className="text-[11px] text-red-500">{getFieldErrorMessage(cashLiquidationErrors.date_used)}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-600">Point Person</label>
                                    <input
                                        type="text"
                                        value={cashLiquidationForm.point_person}
                                        onChange={(e) =>
                                            setCashLiquidationForm((prev) => ({ ...prev, point_person: e.target.value }))
                                        }
                                        className="w-full bg-white px-3 py-2 rounded border border-gray-200 text-xs"
                                        placeholder="Enter responsible person"
                                    />
                                    {cashLiquidationErrors.point_person && (
                                        <p className="text-[11px] text-red-500">{getFieldErrorMessage(cashLiquidationErrors.point_person)}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] text-gray-600">Receipt Image (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setCashLiquidationForm((prev) => ({
                                                ...prev,
                                                receipt: e.target.files?.[0] || null,
                                            }))
                                        }
                                        className="w-full bg-white px-3 py-2 rounded border border-gray-200 text-xs"
                                    />
                                    {cashLiquidationForm.receipt && (
                                        <p className="text-[11px] text-gray-500 truncate">
                                            Selected: {cashLiquidationForm.receipt.name}
                                        </p>
                                    )}
                                    {cashLiquidationErrors.receipt && (
                                        <p className="text-[11px] text-red-500">{getFieldErrorMessage(cashLiquidationErrors.receipt)}</p>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 pt-3 mt-auto">
                                    <button
                                        type="button"
                                        onClick={submitCashLiquidation}
                                        disabled={savingCashLiquidation || cashLiquidationLimitLoading || cashLiquidationMaxAmount === 0}
                                        className={`w-full text-xs px-4 py-2 rounded text-white ${
                                            savingCashLiquidation || cashLiquidationLimitLoading || cashLiquidationMaxAmount === 0
                                                ? "bg-blue-300 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                    >
                                        {savingCashLiquidation ? "Saving..." : "Save Cash Liquidation"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">Recorded Cash Entries</p>
                                        <p className="text-[11px] text-gray-500">
                                            Review saved cash liquidation entries for this project.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fetchProjectCashLiquidations(liquidateProject?.id)}
                                        className="text-[11px] px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-100"
                                    >
                                        Refresh
                                    </button>
                                </div>

                                <div className="flex-1 min-h-[260px] overflow-y-auto border border-gray-200 rounded p-3 bg-gray-50/50">
                                    {cashLiquidationsLoading ? (
                                        <div className="h-full py-6 flex items-center justify-center">
                                            <CircularLoading customClass="text-blue-500 w-5 h-5" />
                                        </div>
                                    ) : cashLiquidationsError ? (
                                        <p className="text-[11px] text-red-500">{cashLiquidationsError}</p>
                                    ) : cashLiquidations.length === 0 ? (
                                        <p className="text-[11px] text-gray-500">No cash liquidation records yet.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {cashLiquidations.map((entry, index) => (
                                                <div
                                                    key={entry.id || `cash-entry-${index}`}
                                                    className="bg-white border border-gray-200 rounded p-3 text-[11px]"
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-semibold text-gray-800">
                                                                {formatCashAmount(entry.amount)}
                                                            </p>
                                                            <p className="text-gray-600">
                                                                Date used: {formatShortDate(entry.date_used || entry.used_at || entry.date)}
                                                            </p>
                                                            <p className="text-gray-600">
                                                                Point person: {entry.point_person || entry.person_responsible || "-"}
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleConfirmCashLiquidationDelete(entry.id)}
                                                            disabled={!entry.id || deletingCashLiquidationId === entry.id}
                                                            className={`shrink-0 px-2 py-1 rounded border ${
                                                                !entry.id || deletingCashLiquidationId === entry.id
                                                                    ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50"
                                                                    : "text-red-600 border-red-200 hover:bg-red-50"
                                                            }`}
                                                        >
                                                            {deletingCashLiquidationId === entry.id ? "Deleting..." : "Delete"}
                                                        </button>
                                                    </div>
                                                    {entry.receipt && (
                                                        <a
                                                            href={resolveReceiptUrl(entry.receipt)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-block text-blue-600 hover:text-blue-700 underline mt-1"
                                                        >
                                                            View receipt
                                                        </a>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalContainer>
            )}

            {/* ADD PROJECT MODAL */}
            {showAddProjectModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white w-full max-w-[92vw] sm:max-w-[720px] md:max-w-[900px] max-h-[calc(100vh-2rem)] rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowAddProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            />

                            <div className="bg-orange-50/70 border-b border-orange-100 px-6 py-5">
                                <p className="text-lg font-semibold text-orange-600">Add New Project</p>
                                <p className="text-xs text-gray-600">
                                    Provide the key details so this project is easy to track and manage.
                                </p>
                            </div>

                            <form className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-4" onSubmit={handleSubmit}>
                                <div className="flex items-center justify-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="h-4 w-4 flex-none shrink-0 bg-white border border-gray-300 cursor-pointer accent-white"
                                        style={{ accentColor: '#fff' }}
                                    />
                                    <label htmlFor="isEvent" className="flex-1 text-left text-xs text-gray-700">
                                        Mark this project as an event
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Title *</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Title"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-xs text-red-500">{validationErrors.title[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[96px] focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Short summary of the project"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Location *</label>
                                        <input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Location"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-xs text-red-500">{validationErrors.location[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Date *</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                        />
                                        {validationErrors.date && (
                                            <p className="text-xs text-red-500">{validationErrors.date[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                        />
                                        <p className="text-[11px] text-gray-500">
                                            Optional. Upload a clear project photo (JPG or PNG).
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 md:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50/40">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <label className="text-xs font-medium text-gray-700">Proposed Items / Materials</label>
                                                <p className="text-[11px] text-gray-500">
                                                    Optional. Add the resources this project is expected to need before any actual inventory is liquidated.
                                                </p>
                                            </div>
                                            <span className="text-[11px] text-gray-500">{proposedResources.length} added</span>
                                        </div>

                                        {proposedResourceValidationMessages.length > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                                {proposedResourceValidationMessages.map((entry) => (
                                                    <p key={entry.id} className="text-[11px] text-red-600">{entry.message}</p>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Category *</label>
                                                <select
                                                    value={proposedResourceDraft.category_id}
                                                    onChange={(e) => handleProposedResourceCategoryChange(e.target.value)}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    <option value="">Select category...</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>{category.name}</option>
                                                    ))}
                                                </select>
                                                {proposedResourceErrors.category_id && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.category_id}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Subcategory *</label>
                                                <select
                                                    value={proposedResourceDraft.sub_category_id}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, sub_category_id: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    <option value="">Select subcategory...</option>
                                                    {proposedSubCategoryOptions.map((subcategory) => (
                                                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                                    ))}
                                                </select>
                                                {proposedResourceErrors.sub_category_id && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.sub_category_id}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-700">Item / Material Name *</label>
                                                <input
                                                    value={proposedResourceDraft.name}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, name: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="Example: Rice packs, tarpaulin, hygiene kits"
                                                />
                                                {proposedResourceErrors.name && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.name}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Quantity *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={proposedResourceDraft.quantity}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, quantity: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="Planned quantity"
                                                />
                                                {proposedResourceErrors.quantity && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.quantity}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Unit</label>
                                                <input
                                                    value={proposedResourceDraft.unit}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, unit: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="pcs, packs, kg, boxes"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-700">Notes</label>
                                                <textarea
                                                    value={proposedResourceDraft.notes}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, notes: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[72px]"
                                                    placeholder="Optional planning notes"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            {editingProposedResourceUid && (
                                                <button
                                                    type="button"
                                                    onClick={resetProposedResourceDraft}
                                                    className="bg-gray-100 hover:bg-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    Cancel Edit
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleSaveProposedResource}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs rounded-lg"
                                            >
                                                {editingProposedResourceUid ? "Update Proposed Item" : "Add Proposed Item"}
                                            </button>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                            {proposedResources.length === 0 ? (
                                                <p className="text-[11px] text-gray-500 px-3 py-4">
                                                    No proposed items added yet.
                                                </p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-[700px] w-full text-[11px]">
                                                        <thead className="bg-gray-50 text-left text-gray-600">
                                                            <tr>
                                                                <th className="px-3 py-2 font-semibold">Item</th>
                                                                <th className="px-3 py-2 font-semibold">Category</th>
                                                                <th className="px-3 py-2 font-semibold">Quantity</th>
                                                                <th className="px-3 py-2 font-semibold">Unit</th>
                                                                <th className="px-3 py-2 font-semibold">Notes</th>
                                                                <th className="px-3 py-2 font-semibold text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {proposedResources.map((resource) => (
                                                                <tr key={resource.uid} className="border-t border-gray-200">
                                                                    <td className="px-3 py-2 font-medium text-gray-800">{resource.name}</td>
                                                                    <td className="px-3 py-2 text-gray-600">
                                                                        {resource.category_name || "-"}
                                                                        {resource.sub_category_name ? ` • ${resource.sub_category_name}` : ""}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.quantity}</td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.unit || "-"}</td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.notes || "-"}</td>
                                                                    <td className="px-3 py-2">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleEditProposedResource(resource)}
                                                                                className="text-[11px] px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveProposedResource(resource.uid)}
                                                                                className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearForm();
                                            setShowAddProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingProject}
                                        className={`bg-orange-500 text-white px-5 py-2 text-xs rounded-lg ${isSavingProject ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                    >
                                        {isSavingProject ? "Saving.." : "Save Project"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* EDIT PROJECT MODAL */}
            {showEditProjectModal && (
                <AnimatePresence>
                    <motion.div
                        className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="bg-white w-full max-w-[92vw] sm:max-w-[720px] md:max-w-[900px] max-h-[calc(100vh-2rem)] rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden flex flex-col">
                            <X
                                onClick={() => {
                                    clearForm();
                                    setShowEditProjectModal(false);
                                    setValidationErrors({});
                                }}
                                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                            />

                            <div className="bg-orange-50/70 border-b border-orange-100 px-6 py-5">
                                <p className="text-lg font-semibold text-orange-600">Edit Project</p>
                                <p className="text-xs text-gray-600">
                                    Update the project details to keep records accurate.
                                </p>
                            </div>

                            <form className="px-6 py-5 flex-1 overflow-y-auto flex flex-col gap-4" onSubmit={handleEditSubmit}>
                                {projectFormLoading && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 flex items-center gap-2">
                                        <CircularLoading customClass="text-blue-500 w-4 h-4" />
                                        Loading full project details...
                                    </div>
                                )}

                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="isEvent"
                                        checked={isEvent}
                                        onChange={(e) => setIsEvent(e.target.checked)}
                                        className="h-4 w-4 bg-white border border-gray-300 rounded cursor-pointer accent-white"
                                        style={{ accentColor: '#fff' }}
                                    />
                                    <label htmlFor="isEvent" className="text-xs text-gray-700">
                                        Mark this project as an event
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Title *</label>
                                        <input
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Title"
                                        />
                                        {validationErrors.title && (
                                            <p className="text-xs text-red-500">{validationErrors.title[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Description *</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[96px] focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Short summary of the project"
                                        />
                                        {validationErrors.description && (
                                            <p className="text-xs text-red-500">{validationErrors.description[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Location *</label>
                                        <input
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                            placeholder="Project Location"
                                        />
                                        {validationErrors.location && (
                                            <p className="text-xs text-red-500">{validationErrors.location[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-medium text-gray-700">Date *</label>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100"
                                        />
                                        {validationErrors.date && (
                                            <p className="text-xs text-red-500">{validationErrors.date[0]}</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1 md:col-span-2">
                                        <label className="text-xs font-medium text-gray-700">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                            className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                        />
                                        <p className="text-[11px] text-gray-500">
                                            Optional. Upload a clear project photo (JPG or PNG).
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3 md:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50/40">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <label className="text-xs font-medium text-gray-700">Proposed Items / Materials</label>
                                                <p className="text-[11px] text-gray-500">
                                                    Update the planned resources for this project. These are proposals only and do not deduct inventory.
                                                </p>
                                            </div>
                                            <span className="text-[11px] text-gray-500">{proposedResources.length} added</span>
                                        </div>

                                        {proposedResourceValidationMessages.length > 0 && (
                                            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                                                {proposedResourceValidationMessages.map((entry) => (
                                                    <p key={entry.id} className="text-[11px] text-red-600">{entry.message}</p>
                                                ))}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Category *</label>
                                                <select
                                                    value={proposedResourceDraft.category_id}
                                                    onChange={(e) => handleProposedResourceCategoryChange(e.target.value)}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    <option value="">Select category...</option>
                                                    {categories.map((category) => (
                                                        <option key={category.id} value={category.id}>{category.name}</option>
                                                    ))}
                                                </select>
                                                {proposedResourceErrors.category_id && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.category_id}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Subcategory *</label>
                                                <select
                                                    value={proposedResourceDraft.sub_category_id}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, sub_category_id: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    <option value="">Select subcategory...</option>
                                                    {proposedSubCategoryOptions.map((subcategory) => (
                                                        <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                                    ))}
                                                </select>
                                                {proposedResourceErrors.sub_category_id && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.sub_category_id}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-700">Item / Material Name *</label>
                                                <input
                                                    value={proposedResourceDraft.name}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, name: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="Example: Rice packs, tarpaulin, hygiene kits"
                                                />
                                                {proposedResourceErrors.name && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.name}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Quantity *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={proposedResourceDraft.quantity}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, quantity: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="Planned quantity"
                                                />
                                                {proposedResourceErrors.quantity && (
                                                    <p className="text-[11px] text-red-500">{proposedResourceErrors.quantity}</p>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-medium text-gray-700">Unit</label>
                                                <input
                                                    value={proposedResourceDraft.unit}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, unit: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg"
                                                    placeholder="pcs, packs, kg, boxes"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1 md:col-span-2">
                                                <label className="text-xs font-medium text-gray-700">Notes</label>
                                                <textarea
                                                    value={proposedResourceDraft.notes}
                                                    onChange={(e) => setProposedResourceDraft((prev) => ({ ...prev, notes: e.target.value }))}
                                                    className="bg-white border border-gray-200 px-3 py-2 text-xs rounded-lg min-h-[72px]"
                                                    placeholder="Optional planning notes"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            {editingProposedResourceUid && (
                                                <button
                                                    type="button"
                                                    onClick={resetProposedResourceDraft}
                                                    className="bg-gray-100 hover:bg-gray-200 px-3 py-2 text-xs rounded-lg"
                                                >
                                                    Cancel Edit
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleSaveProposedResource}
                                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs rounded-lg"
                                            >
                                                {editingProposedResourceUid ? "Update Proposed Item" : "Add Proposed Item"}
                                            </button>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                            {proposedResources.length === 0 ? (
                                                <p className="text-[11px] text-gray-500 px-3 py-4">
                                                    No proposed items added yet.
                                                </p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-[700px] w-full text-[11px]">
                                                        <thead className="bg-gray-50 text-left text-gray-600">
                                                            <tr>
                                                                <th className="px-3 py-2 font-semibold">Item</th>
                                                                <th className="px-3 py-2 font-semibold">Category</th>
                                                                <th className="px-3 py-2 font-semibold">Quantity</th>
                                                                <th className="px-3 py-2 font-semibold">Unit</th>
                                                                <th className="px-3 py-2 font-semibold">Notes</th>
                                                                <th className="px-3 py-2 font-semibold text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {proposedResources.map((resource) => (
                                                                <tr key={resource.uid} className="border-t border-gray-200">
                                                                    <td className="px-3 py-2 font-medium text-gray-800">{resource.name}</td>
                                                                    <td className="px-3 py-2 text-gray-600">
                                                                        {resource.category_name || "-"}
                                                                        {resource.sub_category_name ? ` • ${resource.sub_category_name}` : ""}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.quantity}</td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.unit || "-"}</td>
                                                                    <td className="px-3 py-2 text-gray-600">{resource.notes || "-"}</td>
                                                                    <td className="px-3 py-2">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleEditProposedResource(resource)}
                                                                                className="text-[11px] px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
                                                                            >
                                                                                Edit
                                                                            </button>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveProposedResource(resource.uid)}
                                                                                className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            clearForm();
                                            setShowEditProjectModal(false);
                                            setValidationErrors({});
                                        }}
                                        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProject}
                                        className={`bg-orange-500 text-white px-5 py-2 text-xs rounded-lg ${isUpdatingProject ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
                                    >
                                        {isUpdatingProject ? "Saving.." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )}

            {/* IMAGE VIEWER */}
            {openImage && (
                <div
                    onClick={() => setOpenImage(false)}
                    className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4"
                >
                    <div className="bg-white rounded w-full max-w-[600px] max-h-[80vh]">
                        <img
                            src={`${baseURL}${viewImageURL}`}
                            alt="img"
                            className="w-full h-full object-contain rounded"
                        />
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION */}
            {isDeleteOpen && (
                <ConfirmationAlert
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={() => handleDelete(deleteId)}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    isDelete={true}
                    isDeleting={isDeleting}
                />
            )}

            {isCashLiquidationDeleteOpen && (
                <ConfirmationAlert
                    onClose={() => {
                        if (deletingCashLiquidationId) return;
                        setIsCashLiquidationDeleteOpen(false);
                        setCashLiquidationDeleteId(null);
                    }}
                    onConfirm={deleteCashLiquidation}
                    title="Delete Cash Liquidation"
                    message="Are you sure you want to delete this cash liquidation record? This action cannot be undone."
                    isDelete={true}
                    isDeleting={Boolean(deletingCashLiquidationId)}
                />
            )}

            {openVolunteerList && (
                <ModalContainer
                    isFull={false}
                    close={() => setOpenVolunteerList(false)}
                >
                    <div className="w-full md:w-[600px] h-96 max-h-96 overflow-y-auto rounded-xl bg-white p-4">
                        <div className="mb-4">
                            <p className="text-orange-600 font-semibold">Volunteers</p>
                            <p className="text-xs">Here&apos;s the list of approved volunteers for this project.</p>
                        </div>
                        <VolunteerListPerProject projectId={projectId} />
                    </div>
                </ModalContainer>
            )}

            {isPrintOpen && (
                <ModalContainer
                    isFull={false}
                    close={() => {
                        setIsPrintOpen(false);
                        setPrintUrl("");
                        setPrintFilename("");
                    }}
                >
                    <div className="w-full md:w-[900px] h-[70vh] rounded-xl bg-white p-4 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-600 font-semibold">Project Report</p>
                                <p className="text-xs text-gray-500">{printFilename}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsPrintOpen(false);
                                    setPrintUrl("");
                                    setPrintFilename("");
                                }}
                                className="text-xs px-3 py-2 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                            {printUrl ? (
                                <iframe
                                    title="Projects Report"
                                    src={printUrl}
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                    No preview available.
                                </div>
                            )}
                        </div>
                    </div>
                </ModalContainer>
            )}
        </Admin>
    );
};

export default Projects;






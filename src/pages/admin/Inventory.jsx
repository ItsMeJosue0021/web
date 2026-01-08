import { useEffect, useMemo, useState } from "react";
import { _get } from "../../api";
import Admin from "../../layouts/Admin";
import CircularLoading from "../../components/CircularLoading";
import { Search, Filter, Package } from "lucide-react";

const Inventory = () => {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");

    useEffect(() => {
        fetchItems();
        fetchCategories();
        fetchSubCategories();
    }, []);

    const fetchItems = async({ search = "", categoryId = "", subCategoryId = "" } = {}) => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (categoryId) params.category = categoryId;
            if (subCategoryId) params.sub_category = subCategoryId;

            const response = await _get('/items/confirmed', { params });
            if (response.data && response.status == 200) {
                setItems(response.data.items || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await _get(`/goods-donation-categories`);
            setSubCategories(response.data.categories || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        fetchItems({ search: value, categoryId: selectedCategory, subCategoryId: selectedSubCategory });
    };

    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId);
        // Reset subcategory when category changes to avoid mismatched filter
        const newSubCategory = "";
        setSelectedSubCategory(newSubCategory);
        fetchItems({ search: searchQuery, categoryId, subCategoryId: newSubCategory });
    };

    const handleSubCategoryFilter = (subCategoryId) => {
        setSelectedSubCategory(subCategoryId);
        fetchItems({ search: searchQuery, categoryId: selectedCategory, subCategoryId });
    };

    const listSummary = useMemo(() => {
        const total = items.length;
        const available = items.filter((i) => i.status === "available").length;
        const consumed = items.filter((i) => i.status === "consumed").length;
        const uniqueCategories = new Set(items.map((i) => i.category_name || "")).size;
        return { total, available, consumed, uniqueCategories };
    }, [items]);

    const header = { 
        title: "Inventory Management",
        subTitle: "Monitor your Goods donation stocks to get an accurate and up-to-date inventory."
    };

    const breadcrumbs = [
        { name: "Inventory", link: "/inventory" }
    ]

    return (
        <Admin header={header} breadcrumbs={breadcrumbs}>
            <div className="w-full mx-auto flex flex-col gap-4 mt-4 md:mt-0">

                {/* Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    <SummaryCard label="Total items" value={listSummary.total} sub="Current view" accent="blue" />
                    <SummaryCard label="Available" value={listSummary.available} sub="In stock" accent="green" />
                    <SummaryCard label="Consumed" value={listSummary.consumed} sub="Marked as used" accent="amber" />
                    <SummaryCard label="Categories" value={listSummary.uniqueCategories} sub="Unique categories" accent="purple" />
                </div>

                {/* Filters */}
                <div className="w-full p-4 rounded-lg border border-gray-100 bg-white shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        <div className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                            <Filter size={16} className="text-orange-500" /> Quick filters
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center w-full lg:w-auto">
                            <div className="relative w-full sm:w-72">
                                <Search size={16} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input 
                                    onChange={(e) => handleSearch(e.target.value)} 
                                    value={searchQuery}
                                    type="text" 
                                    className="bg-white placeholder:text-xs px-9 py-2 rounded border border-gray-200 text-sm w-full" 
                                    placeholder="Search for specific item.." 
                                />
                            </div>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedSubCategory(""); fetchItems({}); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            value={selectedSubCategory}
                            onChange={(e) => handleSubCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200 "
                        >
                            <option value="">All subcategories</option>
                            {(
                                selectedCategory
                                    ? subCategories.find((cat) => `${cat.id}` === `${selectedCategory}`)?.subcategories || []
                                    : subCategories.flatMap((cat) => cat.subcategories || [])
                            ).map((sub) => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="w-full h-40 flex items-center justify-center">
                        <CircularLoading customClass="text-blue-500 w-6 h-6" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="bg-white border border-dashed border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500">
                        No inventory items found. Adjust filters or clear search to see more results.
                        <div className="mt-3">
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCategory(""); setSelectedSubCategory(""); fetchItems({}); }}
                                className="text-xs px-3 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-screen-sm md:max-w-none rounded-lg overflow-x-auto">
                        <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm border-collapse">
                            <thead className="bg-orange-500 text-white text-xs sticky top-0">
                            <tr className="text-xs">
                                <th className="p-3 text-start">Name</th>
                                <th className="p-3 text-start">Category</th>
                                <th className="p-3 text-start">Subcategory</th>
                                <th className="p-3 text-start">Quantity</th>
                                <th className="p-3 text-start">Unit</th>
                                <th className="p-3 text-start">Notes</th>
                                <th className="p-3 text-start">Status</th>
                            </tr>
                            </thead>
                            
                                <tbody>
                                    {items.map((row, index) => (
                                    <tr key={row.id}
                                    className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? "bg-orange-50/40" : ""} text-xs`}>
                                        <td className="p-3 text-xs font-semibold text-gray-800">{row.name}</td>
                                        <td className="p-3 text-xs">{row.category_name}</td>
                                        <td className="p-3 text-xs">{row.sub_category_name}</td>
                                        <td className={`p-3 text-xs ${row.quantity === 0 ? 'text-red-500' : ''} `}>{row.quantity}</td>
                                        <td className="p-3 text-xs ">{row.unit}</td>
                                        <td className="p-3 text-xs ">{row.notes || "None"}</td>
                                        <td className="p-3 text-xs ">
                                            {row.status === "available" ? (
                                                <span className="px-2 py-1 rounded-full text-[11px] bg-green-50 text-green-700 border border-green-200">Available</span>
                                            ) : row.status === "consumed" && (
                                                <span className="px-2 py-1 rounded-full text-[11px] bg-amber-50 text-amber-700 border border-amber-200">Consumed</span>
                                            )}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                        </table>
                    </div>
                )}
            </div>
            
        </Admin>
    )
}

export default Inventory;

const accentClasses = {
    green: { text: "text-green-600", bg: "bg-green-50" },
    blue: { text: "text-blue-600", bg: "bg-blue-50" },
    amber: { text: "text-amber-600", bg: "bg-amber-50" },
    purple: { text: "text-purple-600", bg: "bg-purple-50" },
};

const SummaryCard = ({ label, value, sub, accent = "blue" }) => {
    const colors = accentClasses[accent] || accentClasses.blue;
    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center`}>
                <Package className={`${colors.text}`} size={20} />
            </div>
            <div className="flex flex-col">
                <p className="text-[11px] uppercase tracking-wide text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${colors.text}`}>{value}</p>
                {sub && <p className="text-[11px] text-gray-500">{sub}</p>}
            </div>
        </div>
    );
};

import { useEffect, useState } from "react";
import { _get } from "../../api";
import Admin from "../../layouts/Admin";
import CircularLoading from "../../components/CircularLoading";

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

            const response = await _get('/items', { params });
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
                <div className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white">
                    <div className="w-full md:in-w-80 md:max-w-[500px] flex items-center gap-4 ">
                        <p className="hidden md:block text-xs">Search</p>
                        <input 
                            onChange={(e) => handleSearch(e.target.value)} 
                            type="text" 
                            className="bg-white placeholder:text-xs px-4 py-2 rounded border border-gray-200 text-sm" 
                            placeholder="Search for specific item.." 
                        />
                    </div>
                    <div className="w-fit flex items-center gap-4 ">
                        <p className="hidden md:block text-xs">Filter by Category</p>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200 text-sm"
                        >
                            <option value="">All categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-fit flex items-center gap-4 ">
                        <p className="hidden md:block text-xs">Filter Subcategory</p>
                        <select
                            value={selectedSubCategory}
                            onChange={(e) => handleSubCategoryFilter(e.target.value)}
                            className="bg-white text-xs px-4 py-2 rounded border border-gray-200 text-sm"
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
                <div className="w-full max-w-screen-sm md:max-w-none rounded-lg overflow-x-auto">
                    <table className="w-full border rounded-lg overflow-hidden shadow bg-white text-sm">
                        <thead className="bg-orange-500 text-white ">
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
                                {!loading ? (
                                    items.length > 0 ? (
                                        items.map((row, index) => (
                                        <tr key={row.id}
                                        className={`${index % 2 === 0 ? "bg-orange-50" : ""}`}>
                                            <td className="p-3 text-xs">{row.name}</td>
                                            <td className="p-3 text-xs">{row.category_name}</td>
                                            <td className="p-3 text-xs">{row.sub_category_name}</td>
                                            <td className={`p-3 text-xs ${row.quantity === 0 ? 'text-red-500' : ''} `}>{row.quantity}</td>
                                            <td className="p-3 text-xs ">{row.unit}</td>
                                            <td className="p-3 text-xs ">{row.notes || "None"}</td>
                                            <td className="p-3 text-xs ">
                                                {row.status === "available" ? (
                                                    <p className="text-xs text-green-500 font-medium">Available</p>
                                                ) : row.status === "consumed" && (
                                                    <p className="text-xs text-red-500 font-medium">Consumed</p>
                                                )}
                                            </td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="py-8 text-center text-xs text-gray-500">
                                            No records found.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center">
                                            <div className="flex items-center justify-center">
                                            <CircularLoading customClass="text-blue-500 w-6 h-6" />
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                    </table>
                </div>
            </div>
            
        </Admin>
    )
}

export default Inventory;

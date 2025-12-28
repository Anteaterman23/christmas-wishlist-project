import { tabs } from "../../utils/consts";
import { shouldIncludeTab } from "../../utils/tabConditionals";

const Tabs = ({ activeTab, setActiveTab, isAdmin }) => (
    <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1 p-2">
            {Object.entries(tabs).map(([tab, info]) => (
                shouldIncludeTab(info, isAdmin) && (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(info.keyString)}
                        className={`px-4 py-2 rounded-t ${
                            activeTab === info.keyString
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100'
                            }`}
                    >
                        {info.name}
                    </button>
                )
            ))}
        </div>
    </div>
);

export default Tabs;
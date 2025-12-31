import { tabs } from "../../utils/consts";
import { shouldIncludeTab } from "../../utils/tabConditionals";

const Tabs = ({ activeTab, setActiveTab, isAdmin }) => (
    <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex gap-1 p-2">
            {Object.values(tabs).map((tab) => (
                shouldIncludeTab(tab, isAdmin) && (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-t ${
                            activeTab === tab.key
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100'
                            }`}
                    >
                        {tab.name}
                    </button>
                )
            ))}
        </div>
    </div>
);

export default Tabs;
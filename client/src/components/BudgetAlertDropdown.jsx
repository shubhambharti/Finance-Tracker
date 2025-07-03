export default function BudgetAlertDropdown({ alerts, onClose }) {
    return (
        <div className="p-3">
            {alerts.length === 0 ? (
                <div className="text-gray-500 text-sm">No critical alerts</div>
            ) : (
                <ul className="space-y-2">
                    {alerts.map(alert => (
                        <li
                            key={alert._id}
                            className={`text-sm px-2 py-1 rounded ${alert.percent >= 100 ? 'text-red-600' : 'text-yellow-600'
                                }`}
                        >
                            ⚠️ You exceeded <strong>{alert.category}</strong> by {alert.percent}%
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}


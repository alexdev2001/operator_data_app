export default function ForecastChart() {
    return (
        <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Forecast</h2>
            <p className="text-gray-600">
                Predict future values using historical trends.
            </p>
            <div className="w-full h-64 bg-gray-100 rounded-xl mt-3 flex items-center justify-center">
                <span className="text-gray-400">🔮 Chart will render here</span>
            </div>
        </div>
    );
}
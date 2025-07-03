import React, { useEffect, useState } from "react"
import { Pie, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js"
import { getExpenses } from "../services/api"

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

export default function Dashboard() {
  let [expenses, setExpenses] = useState([])

  let currentMonth = new Date().toISOString().slice(0, 7)
  let userId = localStorage.getItem("userId")

  useEffect(() => {
    let fetchExpenses = async () => {
      try {
        let res = await getExpenses()
        let filtered = res.data.filter((e) => e.userId === userId)
        setExpenses(filtered)
      } catch (err) {
        console.error("Failed to fetch expenses:", err)
      }
    }
    fetchExpenses()
  }, [userId])

  let monthlyExpenses = expenses.filter((e) =>
    e.date?.startsWith(currentMonth)
  )

  let totalSpent = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)

  let categoryTotals = {}
  let methodTotals = {}
  monthlyExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount
    methodTotals[e.method] = (methodTotals[e.method] || 0) + 1
  })

  let topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "-"
  let topMethods = Object.entries(methodTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map((m) => m[0])

  let pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: ["#1976d2", "#ef5350", "#ffb74d", "#66bb6a", "#ba68c8"]
      }
    ]
  }

  let lineData = (() => {
    let dailyMap = {}
    monthlyExpenses.forEach((e) => {
      let day = new Date(e.date).getDate()
      dailyMap[day] = (dailyMap[day] || 0) + e.amount
    })
    let days = Array.from({ length: 31 }, (_, i) => i + 1)
    return {
      labels: days,
      datasets: [
        {
          label: "Spending Over Time",
          data: days.map((d) => dailyMap[d] || 0),
          fill: false,
          borderColor: "#1976d2"
        }
      ]
    }
  })()

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Spent</h3>
          <p className="text-2xl font-bold text-blue-600">₹{totalSpent}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Top Category</h3>
          <p className="text-2xl font-bold text-purple-600">{topCategory}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Top Methods</h3>
          <ul className="text-gray-700">
            {topMethods.map((m, idx) => (
              <li key={idx} className="text-base">{m}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 my-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Category-wise Spending
          </h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Monthly Spending Trend
          </h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  )
}

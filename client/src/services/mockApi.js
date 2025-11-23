export async function listProducts({ q, limit = 24 }) {
  const all = [
    { _id: '1', name: 'Widget A', price: 19.99 },
    { _id: '2', name: 'Widget B', price: 29.99 },
    { _id: '3', name: 'Gadget C', price: 9.99 }
  ]
  const filtered = q ? all.filter(p => p.name.toLowerCase().includes(q.toLowerCase())) : all
  return { items: filtered.slice(0, limit), total: filtered.length, page: 1, limit }
}

export async function salesSummary() {
  const series = [
    { _id: '2025-11-01', total: 1200 },
    { _id: '2025-11-02', total: 930 },
    { _id: '2025-11-03', total: 1500 }
  ]
  return { series, total: { total: series.reduce((s,i)=>s+i.total,0), count: 42 } }
}

export async function operationsSummary() {
  return { avgFulfillmentHours: 36.5, cancelled: 3, refunded: 2, paymentSuccessRate: 0.92 }
}

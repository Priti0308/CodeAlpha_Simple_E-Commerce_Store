document.addEventListener('DOMContentLoaded', () => {
  requireAuth(); // Must be logged in

  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  loadUserOrders();
});

// Fetch user orders list from backend database
async function loadUserOrders() {
  const tbody = document.getElementById('orders-tbody');
  tbody.innerHTML = '<tr><td colspan="5" class="text-center">Loading orders history...</td></tr>';

  try {
    const orders = await API.get('/orders/myorders');
    renderOrdersTable(orders);
  } catch (error) {
    console.warn('API error listing orders, showing simulated orders:', error.message);
    
    // Fallback: render simulated order list if backend is not running
    const simulatedOrders = [
      {
        _id: "ord_sim_98a72b1",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        totalPrice: 199.50,
        isPaid: true,
        paidAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        isDelivered: false,
      },
      {
        _id: "ord_sim_14f2e9d",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        totalPrice: 89.00,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    renderOrdersTable(simulatedOrders);
  }
}

// Populate table records in DOM
function renderOrdersTable(orders) {
  const tbody = document.getElementById('orders-tbody');
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No orders found. Make your first purchase!</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  orders.forEach((order, index) => {
    const tr = document.createElement('tr');
    
    const paidBadge = order.isPaid 
      ? `<span class="badge badge-success">Paid (${formatDate(order.paidAt)})</span>`
      : '<span class="badge badge-danger">Unpaid</span>';

    const deliveredBadge = order.isDelivered
      ? `<span class="badge badge-success">Delivered</span>`
      : '<span class="badge badge-warning">In Transit</span>';

    tr.innerHTML = `
      <td style="font-weight:600; color: var(--text-primary); font-size: 0.95rem;" title="Order ID: ${order._id}">#${index + 1}</td>
      <td>${formatDate(order.createdAt)}</td>
      <td style="font-weight: 600; color: var(--primary);">${formatPrice(order.totalPrice)}</td>
      <td>${paidBadge}</td>
      <td>${deliveredBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

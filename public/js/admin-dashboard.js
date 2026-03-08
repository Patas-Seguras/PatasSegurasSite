async function loadDashboard() {
  try {
    const res = await fetch('/admin/dashboard-data');
    const data = await res.json();

    document.getElementById('totalCount').textContent = data.totalCount;
    document.getElementById('pendingCount').textContent = data.pendingCount;
    document.getElementById('resolvedCount').textContent = data.resolvedCount;
    document.getElementById('urgentCount').textContent = data.urgentCount;

    renderTable(data.complaints);

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err);
  }
}

function renderTable(complaints) {
  const table = document.getElementById('complaintsTable');
  table.innerHTML = '';

  if (!complaints || complaints.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted">
          Nenhuma denúncia encontrada
        </td>
      </tr>
    `;
    return;
  }

  complaints.forEach(c => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${String(c.id).padStart(3,'0')}</td>
      <td>${c.animal}</td>
      <td>${c.city || 'Não informada'}</td>
      <td>${c.status}</td>
      <td>${new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
      <td>
        <a href="/admin/denuncias/${c.id}" class="btn btn-sm btn-outline-success">
          Ver
        </a>
      </td>
    `;

    table.appendChild(row);
  });
}

loadDashboard();
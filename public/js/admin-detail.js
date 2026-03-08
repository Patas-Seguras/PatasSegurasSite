document.addEventListener("DOMContentLoaded", async () => {
  try {

    const parts = window.location.pathname.split("/")
    const id = parts[parts.length - 1]

    if (!id) {
      console.error("ID não encontrado na URL")
      return
    }

    const response = await fetch(`/admin/api/complaint/${id}`)
    const data = await response.json()

    if (!data.success) {
      console.error("Erro ao buscar denúncia")
      return
    }

    const c = data.complaint

    document.getElementById("complaintId").textContent = c.id
    document.getElementById("complaintStatus").textContent = c.status

    document.getElementById("animal").textContent = c.animal
    document.getElementById("description").textContent = c.description
    document.getElementById("city").textContent = c.city || "Não informado"
    document.getElementById("address").textContent = c.address || "Não informado"

    document.getElementById("name").textContent = c.name
    document.getElementById("email").textContent = c.email || "Não informado"
    document.getElementById("number").textContent = c.number

    document.getElementById("createdAt").textContent =
      new Date(c.createdAt).toLocaleDateString()

  } catch (error) {
    console.error("Erro ao carregar detalhes:", error)
  }
})
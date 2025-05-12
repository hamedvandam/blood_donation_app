const donorForm = document.getElementById("donor-form");
const donorTableBody = document.querySelector("#donor-table tbody");
const searchInput = document.getElementById("search");
const filterBlood = document.getElementById("filter-blood");
const emergencyInput = document.getElementById("emergency-blood");
const emergencyResults = document.getElementById("emergency-results");

let donors = [];

function updateTable() {
  donorTableBody.innerHTML = "";
  let filtered = donors.filter(d => {
    const matchesSearch = d.name.includes(searchInput.value) || d.blood.includes(searchInput.value);
    const matchesFilter = filterBlood.value === "" || d.blood === filterBlood.value;
    return matchesSearch && matchesFilter;
  });

  filtered.forEach(d => {
    const tr = document.createElement("tr");
    const days = Math.floor((new Date() - new Date(d.date)) / (1000 * 60 * 60 * 24));
    const status = days >= 90 ? "متاح" : "غير متاح";
    const statusClass = days >= 90 ? "status-available" : "status-unavailable";

    tr.innerHTML = `
      <td>${d.name}</td>
      <td>${d.phone}</td>
      <td>${d.blood}</td>
      <td>${d.location}</td>
      <td>${d.date}</td>
      <td class="${statusClass}">${status}</td>
      <td><a href="https://wa.me/${d.phone}" target="_blank">واتساب</a></td>
    `;
    donorTableBody.appendChild(tr);
  });
}

donorForm.addEventListener("submit", e => {
  e.preventDefault();
  const donor = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    blood: document.getElementById("blood-type").value,
    location: document.getElementById("location").value,
    date: document.getElementById("last-donation").value
  };
  donors.push(donor);
  donorForm.reset();
  updateTable();
});

searchInput.addEventListener("input", updateTable);
filterBlood.addEventListener("change", updateTable);

function searchEmergency() {
  const type = emergencyInput.value.trim();
  const results = donors.filter(d => d.blood === type);
  emergencyResults.innerHTML = results.length === 0
    ? "<p>لا يوجد متبرعين بهذه الفصيلة حاليا.</p>"
    : "<ul>" + results.map(d => `<li>${d.name} - ${d.phone} (${d.location})</li>`).join("") + "</ul>";
}
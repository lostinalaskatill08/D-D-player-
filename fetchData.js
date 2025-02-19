async function updateCharacterTracker() {
    const sheetUrl = "https://script.google.com/macros/s/XXXXXX/exec"; // Replace with your Web App URL

    try {
        const response = await fetch(sheetUrl);
        const data = await response.json();

        let characterHTML = `
            <tr>
                <th>Player Name</th>
                <th>Class & Race</th>
                <th>HP</th>
                <th>AC</th>
                <th>Inventory</th>
                <th>Conditions</th>
                <th>Status</th>
            </tr>`;

        data.forEach(character => {
            characterHTML += `
                <tr>
                    <td>${character["Player Name"]}</td>
                    <td>${character["Class & Race"]}</td>
                    <td>${character["HP"]}</td>
                    <td>${character["AC"]}</td>
                    <td>${character["Inventory"]}</td>
                    <td>${character["Conditions"]}</td>
                    <td>${character["Status"]}</td>
                </tr>`;
        });

        document.getElementById("characterTable").innerHTML = characterHTML;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Auto-refresh data every 30 seconds
setInterval(updateCharacterTracker, 30000);

// Run once on page load
updateCharacterTracker();

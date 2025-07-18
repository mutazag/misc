document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const refreshButton = document.getElementById('refreshButton');
    const locationFilter = document.getElementById('locationFilter');
    const selectedLocation = document.getElementById('selectedLocation');
    const capacityData = document.getElementById('capacityData');
    const loader = document.getElementById('loader');

    // Default API parameters
    const apiParams = {
        modelFormat: "OpenAI",
        modelName: "o3-mini",
        modelVersion: "2025-01-31"
    };

    // Get Azure credentials from session storage or prompt user
    let subscriptionId = sessionStorage.getItem('azureSubscriptionId');
    let accessToken = sessionStorage.getItem('azureAccessToken');

    // Function to prompt for credentials
    function promptForCredentials() {
        if (!subscriptionId) {
            subscriptionId = prompt("Please enter your Azure Subscription ID:");
            if (subscriptionId) {
                sessionStorage.setItem('azureSubscriptionId', subscriptionId);
            }
        }

        if (!accessToken) {
            accessToken = prompt("Please enter your Azure access token:");
            if (accessToken) {
                sessionStorage.setItem('azureAccessToken', accessToken);
                // Set token expiry (1 hour)
                const expiry = Date.now() + 3600000;
                sessionStorage.setItem('tokenExpiry', expiry.toString());
            }
        }

        return subscriptionId && accessToken;
    }

    // Function to fetch capacity data
    async function fetchCapacityData() {
        // Check for token expiration
        const tokenExpiry = sessionStorage.getItem('tokenExpiry');
        if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
            accessToken = null;
            sessionStorage.removeItem('azureAccessToken');
            sessionStorage.removeItem('tokenExpiry');
        }

        // Ensure we have credentials
        if (!promptForCredentials()) {
            alert("Valid Azure credentials are required to fetch data.");
            return null;
        }

        loader.style.display = 'block';

        try {
            const url = `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.CognitiveServices/modelCapacities`;

            const params = new URLSearchParams({
                'api-version': '2024-10-01',
                'modelFormat': apiParams.modelFormat,
                'modelName': apiParams.modelName,
                'modelVersion': apiParams.modelVersion
            });

            const response = await fetch(`${url}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data.value || [];

        } catch (error) {
            console.error('Failed to fetch capacity data:', error);
            alert(`Failed to fetch data: ${error.message}`);
            return null;
        } finally {
            loader.style.display = 'none';
        }
    }

    // Function to populate location filter
    function populateLocationFilter(data) {
        // Clear existing options
        locationFilter.innerHTML = '';

        // Get unique locations
        const locations = [...new Set(data.map(item => item.location))].sort();

        // Add options to the select element
        locations.forEach(location => {
            const option = document.createElement('option');
            option.value = location;
            option.textContent = location;
            locationFilter.appendChild(option);
        });

        // Set the first location as selected
        if (locations.length > 0) {
            locationFilter.value = locations[0];
            selectedLocation.textContent = locations[0];
        }
    }

    // Function to display data for the selected location
    function displayCapacityData(data, location) {
        // Clear existing table data
        capacityData.innerHTML = '';

        // Filter data by location
        const filteredData = data.filter(item => item.location === location);

        // Update the selected location display
        selectedLocation.textContent = location;

        // Add rows to the table
        filteredData.forEach(item => {
            const row = document.createElement('tr');

            // Create cells with data
            const modelNameCell = document.createElement('td');
            modelNameCell.textContent = item.properties.model.name;

            const resourceNameCell = document.createElement('td');
            resourceNameCell.textContent = item.name;

            const skuCell = document.createElement('td');
            skuCell.textContent = item.properties.skuName;

            const capacityCell = document.createElement('td');
            capacityCell.textContent = item.properties.availableCapacity;

            // Add cells to the row
            row.appendChild(modelNameCell);
            row.appendChild(resourceNameCell);
            row.appendChild(skuCell);
            row.appendChild(capacityCell);

            // Add the row to the table
            capacityData.appendChild(row);
        });
    }

    // Handle location filter change
    locationFilter.addEventListener('change', (event) => {
        const selectedLocation = event.target.value;
        // Check if we have data in memory
        if (window.capacityData) {
            displayCapacityData(window.capacityData, selectedLocation);
        }
    });

    // Function to load data
    async function loadData() {
        const data = await fetchCapacityData();

        if (data && data.length > 0) {
            // Store data in memory
            window.capacityData = data;

            // Populate location filter
            populateLocationFilter(data);

            // Display data for the selected location
            displayCapacityData(data, locationFilter.value);
        }
    }

    // Add event listener for refresh button
    refreshButton.addEventListener('click', loadData);

    // Initial data load
    loadData();
});

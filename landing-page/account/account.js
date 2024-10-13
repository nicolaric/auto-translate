const apiKeys = [];

async function getKeys() {
    try {
        const keysResponse = await fetch(
            "https://auto-translate.com/api/user/api-token",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            },
        );

        const keysData = await keysResponse.json();
        return keysData;
    } catch (error) {
        console.error("Error fetching API keys:", error);
    }
}

async function createKey(name) {
    try {
        const newKeyResponse = await fetch(
            "https://auto-translate.com/api/user/api-token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ name }),
            },
        );
        return newKeyResponse.json();
    } catch (error) {
        console.error("Error creating API key:", error);
    }
}

function prepareKeyDeletion(id) {
    $("#delete-key-dialog")[0].showModal();
    $("#delete-key-button").on("click", async (event) => {
        event.preventDefault();

        await deleteKey(id);
        apiKeys.splice(
            apiKeys.findIndex((key) => key.id === id),
            1,
        );
        renderApiKeys();
        $("#delete-key-dialog")[0].close();
        $("#delete-key-button").off("click");
    });
}

async function deleteKey(id) {
    try {
        await fetch(`https://auto-translate.com/api/user/api-token/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
    } catch (error) {
        console.error("Error deleting API key:", error);
    }
}

function prepareKeyCreation() {
    $("#create-key-dialog")[0].showModal();
}

function showCopyDialog(token) {
    $("#copy-key-dialog")[0].showModal();
    $("#key-value").val(token);

    $("#copy-key-button").on("click", (event) => {
        event.preventDefault();
        navigator.clipboard.writeText(token);
        $("#copy-key-button").off("click");
    });
}

function renderApiKeys() {
    let tableContent = "";
    apiKeys.forEach((apiKey) => {
        tableContent += `
                            <tr id="key-${apiKey.id}">
                                  <td><span >${apiKey.name}</span></td>
                                  <td>${apiKey.last_used_at
                ? new Date(
                    apiKey.last_used_at,
                ).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
                : "-"
            }</td>
                                  <td class="action-cell">
      <button onclick="prepareKeyDeletion(${apiKey.id})" class="delete-button">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M14 10V17M10 10V17" stroke="currentcolor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
       </button>
                                  </td>
                              </tr>
                          `;
        // Function to handle tab switching
        $(".tab").on("click", function() {
            const tabId = $(this).data("tab");

            $(".tab").removeClass("active");
            $(this).addClass("active");

            $(".tab-content").removeClass("active");
            $("#" + tabId).addClass("active");
        });
    });
    $("#api-keys-table tbody").html(tableContent);
}

$(document).ready(async function() {
    $("#create-api-key-button").on("click", prepareKeyCreation);
    $("#create-key-submit").on("click", async (event) => {
        event.preventDefault();
        const name = $("#key-name").val();
        const key = await createKey(name);
        apiKeys.push(key);
        renderApiKeys();
        $("#key-name").val("");
        showCopyDialog(key.token);

        $("#create-key-dialog")[0].close();
    });

    // Function to render API keys in the table

    apiKeys.push(...(await getKeys()));

    // Render API keys on page load
    renderApiKeys();
});

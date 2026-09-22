/* =========================================================
   OGL RESOURCES ADMIN
   NO AUTHENTICATION
   CONNECTED TO FLASK + SUPABASE
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const API_BASE_URL =
    "http://127.0.0.1:5000/api";

const RESOURCES_API =
    `${API_BASE_URL}/resources`;

const UPLOAD_API =
    `${RESOURCES_API}/upload`;


/* =========================================================
   STATE
   ========================================================= */

let resources = [];

let editingResourceId = null;

let deletingResourceId = null;


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const resourceForm =
    document.getElementById("resourceForm");

const resourceId =
    document.getElementById("resourceId");

const resourceType =
    document.getElementById("resourceType");

const resourceTitle =
    document.getElementById("resourceTitle");

const resourceAuthor =
    document.getElementById("resourceAuthor");

const resourceDate =
    document.getElementById("resourceDate");

const resourceDescription =
    document.getElementById("resourceDescription");

const resourceFile =
    document.getElementById("resourceFile");

const resourceImageUrl =
    document.getElementById("resourceImageUrl");

const resourceStatus =
    document.getElementById("resourceStatus");

const currentFile =
    document.getElementById("currentFile");

const formTitle =
    document.getElementById("formTitle");

const saveButton =
    document.getElementById("saveButton");

const cancelEdit =
    document.getElementById("cancelEdit");

const refreshResources =
    document.getElementById("refreshResources");

const loadingState =
    document.getElementById("loadingState");

const adminResourceList =
    document.getElementById(
        "adminResourceList"
    );

const adminEmpty =
    document.getElementById("adminEmpty");

const statusMessage =
    document.getElementById(
        "statusMessage"
    );


/* =========================================================
   DELETE MODAL ELEMENTS
   ========================================================= */

const confirmModal =
    document.getElementById("confirmModal");

const confirmOverlay =
    document.getElementById("confirmOverlay");

const confirmTitle =
    document.getElementById("confirmTitle");

const confirmText =
    document.getElementById("confirmText");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialiseAdmin
);


function initialiseAdmin() {

    console.log(
        "OGL Resources Admin initialising..."
    );


    /*
     * Make sure the default status is published.
     */

    if (resourceStatus) {

        resourceStatus.value =
            "published";

    }


    /*
     * Connect form.
     */

    if (resourceForm) {

        resourceForm.addEventListener(
            "submit",
            handleFormSubmit
        );

    }


    /*
     * Refresh button.
     */

    if (refreshResources) {

        refreshResources.addEventListener(
            "click",
            loadResources
        );

    }


    /*
     * Cancel edit.
     */

    if (cancelEdit) {

        cancelEdit.addEventListener(
            "click",
            resetForm
        );

    }


    /*
     * Delete modal.
     */

    if (cancelDelete) {

        cancelDelete.addEventListener(
            "click",
            closeDeleteModal
        );

    }


    if (confirmOverlay) {

        confirmOverlay.addEventListener(
            "click",
            closeDeleteModal
        );

    }


    if (confirmDelete) {

        confirmDelete.addEventListener(
            "click",
            executeDelete
        );

    }


    /*
     * Load resources immediately.
     */

    loadResources();

}


/* =========================================================
   LOAD RESOURCES
   ========================================================= */

async function loadResources() {

    console.log(
        "Loading resources from:",
        RESOURCES_API
    );


    showLoading();

    hideStatus();


    try {

        const response =
            await fetch(
                RESOURCES_API,
                {
                    method: "GET",
                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        console.log(
            "Resources response status:",
            response.status
        );


        /*
         * Read response as text first.
         * This gives us a useful error if Flask returns
         * HTML instead of JSON.
         */

        const responseText =
            await response.text();


        console.log(
            "Resources response:",
            responseText
        );


        let data;


        try {

            data =
                responseText
                    ? JSON.parse(responseText)
                    : null;

        } catch (jsonError) {

            throw new Error(
                "The backend returned an invalid response."
            );

        }


        if (!response.ok) {

            throw new Error(
                data &&
                data.error
                    ? data.error
                    : `Server error: ${response.status}`
            );

        }


        /*
         * Our Flask GET /api/resources returns
         * the resources array directly.
         */

        if (Array.isArray(data)) {

            resources = data;

        }

        /*
         * Also support { resources: [...] }
         * in case the backend is changed later.
         */

        else if (
            data &&
            Array.isArray(
                data.resources
            )
        ) {

            resources =
                data.resources;

        }

        else {

            resources = [];

        }


        console.log(
            "Resources loaded:",
            resources.length
        );


        renderResources();


    } catch (error) {

        console.error(
            "LOAD RESOURCES ERROR:",
            error
        );


        resources = [];


        hideLoading();


        if (adminEmpty) {

            adminEmpty.hidden =
                true;

        }


        if (adminResourceList) {

            adminResourceList.innerHTML = "";

        }


        showStatus(
            error.message ||
            "Unable to load resources.",
            "error"
        );

    }

}


/* =========================================================
   RENDER RESOURCES
   ========================================================= */

function renderResources() {

    hideLoading();


    if (!adminResourceList) {

        console.error(
            "adminResourceList element not found."
        );

        return;

    }


    adminResourceList.innerHTML = "";


    /*
     * No resources.
     */

    if (
        !resources ||
        resources.length === 0
    ) {

        if (adminEmpty) {

            adminEmpty.hidden =
                false;

        }

        return;

    }


    /*
     * Resources exist.
     */

    if (adminEmpty) {

        adminEmpty.hidden =
            true;

    }


    resources.forEach(
        resource => {

            const card =
                createResourceCard(
                    resource
                );

            adminResourceList.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREATE RESOURCE CARD
   ========================================================= */

/* =========================================================
   CREATE RESOURCE CARD
   MATCHES EXISTING OGL ADMIN CSS
   ========================================================= */

function createResourceCard(resource) {

    const item =
        document.createElement("article");

    item.className =
        "admin-resource-item";

    item.dataset.id =
        resource.id || "";


    /* =====================================================
       RESOURCE INFO
       ===================================================== */

    const info =
        document.createElement("div");

    info.className =
        "admin-resource-info";


    /* =====================================================
       TYPE
       ===================================================== */

    const type =
        document.createElement("span");

    type.className =
        "admin-resource-type";

    type.textContent =
        formatResourceType(
            resource.type
        );


    /* =====================================================
       TITLE
       ===================================================== */

    const title =
        document.createElement("h3");

    title.className =
        "admin-resource-title";

    title.textContent =
        resource.title ||
        "Untitled Resource";


    /* =====================================================
       META
       ===================================================== */

    const meta =
        document.createElement("div");

    meta.className =
        "admin-resource-meta";


    const author =
        resource.author
            ? resource.author
            : "No author";


    const date =
        resource.publication_date
            ? formatDate(
                resource.publication_date
            )
            : "";


    const status =
        resource.status ||
        "draft";


    meta.textContent =
        `${author}${date ? " · " + date : ""} · ${formatStatus(status)}`;


    /* =====================================================
       ADD INFO
       ===================================================== */

    info.appendChild(
        type
    );

    info.appendChild(
        title
    );

    info.appendChild(
        meta
    );


    /* =====================================================
       ACTIONS
       ===================================================== */

    const actions =
        document.createElement("div");

    actions.className =
        "admin-resource-actions";


    /* =====================================================
       VIEW BUTTON
       ===================================================== */

    if (
        resource.file_access_url
    ) {

        const viewButton =
            document.createElement("a");

        viewButton.href =
            resource.file_access_url;

        viewButton.target =
            "_blank";

        viewButton.rel =
            "noopener noreferrer";

        viewButton.textContent =
            "View";

        actions.appendChild(
            viewButton
        );

    }


    /* =====================================================
       EDIT BUTTON
       ===================================================== */

    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        () => {

            editResource(
                resource.id
            );

        }
    );


    actions.appendChild(
        editButton
    );


    /* =====================================================
       DELETE BUTTON
       ===================================================== */

    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "delete-resource";

    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        () => {

            openDeleteModal(
                resource.id
            );

        }
    );


    actions.appendChild(
        deleteButton
    );


    /* =====================================================
       BUILD CARD
       ===================================================== */

    item.appendChild(
        info
    );

    item.appendChild(
        actions
    );


    return item;

}


/* =========================================================
   FORM SUBMIT
   ========================================================= */

async function handleFormSubmit(
    event
) {

    event.preventDefault();


    console.log(
        "Resource form submitted."
    );


    try {

        setFormLoading(
            true
        );


        hideStatus();


        /*
         * Validate required fields.
         */

        if (
            !resourceTitle ||
            !resourceTitle.value.trim()
        ) {

            throw new Error(
                "Please enter a resource title."
            );

        }


        if (
            !resourceType ||
            !resourceType.value
        ) {

            throw new Error(
                "Please select a resource type."
            );

        }


        if (
            !resourceAuthor ||
            !resourceAuthor.value.trim()
        ) {

            throw new Error(
                "Please enter the author."
            );

        }


        if (
            !resourceDate ||
            !resourceDate.value
        ) {

            throw new Error(
                "Please select a publication date."
            );

        }


        if (
            !resourceDescription ||
            !resourceDescription.value.trim()
        ) {

            throw new Error(
                "Please enter a description."
            );

        }


        /*
         * Existing file path.
         *
         * When editing a resource and no new file is selected,
         * keep the existing file.
         */

        let fileUrl =
            getExistingFileUrl();


        /*
         * Upload a new file if selected.
         */

        if (
            resourceFile &&
            resourceFile.files &&
            resourceFile.files.length > 0
        ) {

            const file =
                resourceFile.files[0];


            validateFile(
                file
            );


            fileUrl =
                await uploadFile(
                    file
                );

        }


        /*
         * Build payload.
         */

        const payload = {

            title:
                resourceTitle.value.trim(),

            type:
                resourceType.value,

            description:
                resourceDescription.value.trim(),

            author:
                resourceAuthor.value.trim(),

            publication_date:
                resourceDate.value,

            file_url:
                fileUrl,

            image_url:
                resourceImageUrl &&
                resourceImageUrl.value
                    ? resourceImageUrl.value.trim()
                    : "",

            status:
                resourceStatus &&
                resourceStatus.value
                    ? resourceStatus.value
                    : "published"

        };


        console.log(
            "Resource payload:",
            payload
        );


        /*
         * UPDATE
         */

        if (editingResourceId) {

            await updateResource(
                editingResourceId,
                payload
            );


            showStatus(
                "Resource updated successfully.",
                "success"
            );

        }


        /*
         * CREATE
         */

        else {

            await createResource(
                payload
            );


            showStatus(
                "Resource added successfully.",
                "success"
            );

        }


        /*
         * Reset form.
         */

        resetForm();


        /*
         * Reload list.
         */

        await loadResources();


    } catch (error) {

        console.error(
            "SAVE RESOURCE ERROR:",
            error
        );


        showStatus(
            error.message ||
            "Failed to save resource.",
            "error"
        );

    } finally {

        setFormLoading(
            false
        );

    }

}


/* =========================================================
   CREATE RESOURCE
   ========================================================= */

async function createResource(
    payload
) {

    const response =
        await fetch(
            RESOURCES_API,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        payload
                    )
            }
        );


    const data =
        await readJsonResponse(
            response
        );


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.details ||
            `Failed to create resource (${response.status}).`
        );

    }


    console.log(
        "Resource created:",
        data
    );


    return data;

}


/* =========================================================
   UPLOAD FILE
   ========================================================= */

async function uploadFile(
    file
) {

    console.log(
        "Uploading file:",
        file.name
    );


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await fetch(
            UPLOAD_API,
            {
                method: "POST",
                body: formData
            }
        );


    const data =
        await readJsonResponse(
            response
        );


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.details ||
            `File upload failed (${response.status}).`
        );

    }


    console.log(
        "File uploaded:",
        data
    );


    /*
     * Flask returns:
     *
     * {
     *   success: true,
     *   file_url: "uploads/..."
     * }
     */

    if (!data.file_url) {

        throw new Error(
            "File uploaded but no storage path was returned."
        );

    }


    return data.file_url;

}


/* =========================================================
   UPDATE RESOURCE
   ========================================================= */

async function updateResource(
    id,
    payload
) {

    const response =
        await fetch(
            `${RESOURCES_API}/${encodeURIComponent(id)}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Accept":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        payload
                    )
            }
        );


    const data =
        await readJsonResponse(
            response
        );


    if (!response.ok) {

        throw new Error(
            data.error ||
            data.details ||
            `Failed to update resource (${response.status}).`
        );

    }


    console.log(
        "Resource updated:",
        data
    );


    return data;

}


/* =========================================================
   EDIT RESOURCE
   ========================================================= */

function editResource(
    id
) {

    const resource =
        resources.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!resource) {

        showStatus(
            "Resource could not be found.",
            "error"
        );

        return;

    }


    editingResourceId =
        resource.id;


    /*
     * Store ID.
     */

    if (resourceId) {

        resourceId.value =
            resource.id;

    }


    /*
     * Populate fields.
     */

    if (resourceType) {

        resourceType.value =
            resource.type || "";

    }


    if (resourceTitle) {

        resourceTitle.value =
            resource.title || "";

    }


    if (resourceAuthor) {

        resourceAuthor.value =
            resource.author || "";

    }


    if (resourceDate) {

        resourceDate.value =
            normaliseDateForInput(
                resource.publication_date
            );

    }


    if (resourceDescription) {

        resourceDescription.value =
            resource.description || "";

    }


    if (resourceImageUrl) {

        resourceImageUrl.value =
            resource.image_url || "";

    }


    if (resourceStatus) {

        resourceStatus.value =
            resource.status ||
            "published";

    }


    /*
     * Clear file selector.
     *
     * Existing file remains unless user chooses
     * a new file.
     */

    if (resourceFile) {

        resourceFile.value =
            "";

    }


    /*
     * Show current file information.
     */

    if (currentFile) {

        if (resource.file_url) {

            currentFile.textContent =
                "Existing document attached. " +
                "Choose a new file to replace it.";

        } else {

            currentFile.textContent =
                "No document attached. " +
                "PDF, DOC or DOCX. Maximum file size: 50 MB.";

        }

    }


    /*
     * Update heading.
     */

    if (formTitle) {

        formTitle.textContent =
            "Edit Resource";

    }


    /*
     * Update button.
     */

    if (saveButton) {

        saveButton.innerHTML =
            `
                Update Resource
                <span>→</span>
            `;

    }


    /*
     * Show cancel button.
     */

    if (cancelEdit) {

        cancelEdit.hidden =
            false;

    }


    /*
     * Scroll to form.
     */

    if (resourceForm) {

        resourceForm.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   GET EXISTING FILE URL
   ========================================================= */

function getExistingFileUrl() {

    if (!editingResourceId) {

        return null;

    }


    const resource =
        resources.find(
            item =>
                String(item.id) ===
                String(editingResourceId)
        );


    if (!resource) {

        return null;

    }


    return (
        resource.file_url ||
        null
    );

}


/* =========================================================
   RESET FORM
   ========================================================= */

function resetForm() {

    editingResourceId =
        null;


    if (resourceId) {

        resourceId.value =
            "";

    }


    if (resourceForm) {

        resourceForm.reset();

    }


    if (resourceStatus) {

        resourceStatus.value =
            "published";

    }


    if (formTitle) {

        formTitle.textContent =
            "Add New Resource";

    }


    if (saveButton) {

        saveButton.innerHTML =
            `
                Save Resource
                <span>→</span>
            `;

    }


    if (cancelEdit) {

        cancelEdit.hidden =
            true;

    }


    if (currentFile) {

        currentFile.textContent =
            "PDF, DOC or DOCX. Maximum file size: 50 MB.";

    }

}


/* =========================================================
   OPEN DELETE MODAL
   ========================================================= */

function openDeleteModal(
    id
) {

    const resource =
        resources.find(
            item =>
                String(item.id) ===
                String(id)
        );


    if (!resource) {

        return;

    }


    deletingResourceId =
        resource.id;


    if (confirmTitle) {

        confirmTitle.textContent =
            "Delete resource?";

    }


    if (confirmText) {

        confirmText.textContent =
            `Are you sure you want to delete "${resource.title}"? This action cannot be undone.`;

    }


    if (confirmModal) {

        confirmModal.setAttribute(
            "aria-hidden",
            "false"
        );


        confirmModal.classList.add(
            "is-open"
        );

    }

}


/* =========================================================
   CLOSE DELETE MODAL
   ========================================================= */

function closeDeleteModal() {

    deletingResourceId =
        null;


    if (confirmModal) {

        confirmModal.setAttribute(
            "aria-hidden",
            "true"
        );


        confirmModal.classList.remove(
            "is-open"
        );

    }

}


/* =========================================================
   EXECUTE DELETE
   ========================================================= */

async function executeDelete() {

    if (!deletingResourceId) {

        return;

    }


    const id =
        deletingResourceId;


    try {

        if (confirmDelete) {

            confirmDelete.disabled =
                true;

            confirmDelete.textContent =
                "Deleting...";

        }


        const response =
            await fetch(
                `${RESOURCES_API}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        const data =
            await readJsonResponse(
                response
            );


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.details ||
                `Failed to delete resource (${response.status}).`
            );

        }


        closeDeleteModal();


        showStatus(
            "Resource deleted successfully.",
            "success"
        );


        await loadResources();


    } catch (error) {

        console.error(
            "DELETE RESOURCE ERROR:",
            error
        );


        closeDeleteModal();


        showStatus(
            error.message ||
            "Failed to delete resource.",
            "error"
        );

    } finally {

        if (confirmDelete) {

            confirmDelete.disabled =
                false;

            confirmDelete.textContent =
                "Delete Resource";

        }

    }

}


/* =========================================================
   VALIDATE FILE
   ========================================================= */

function validateFile(
    file
) {

    const maxSize =
        50 * 1024 * 1024;


    if (
        file.size >
        maxSize
    ) {

        throw new Error(
            "File is too large. Maximum file size is 50 MB."
        );

    }


    const allowedExtensions = [
        "pdf",
        "doc",
        "docx"
    ];


    const fileName =
        file.name
            .toLowerCase();


    const extension =
        fileName.includes(".")
            ? fileName
                .split(".")
                .pop()
            : "";


    if (
        !allowedExtensions.includes(
            extension
        )
    ) {

        throw new Error(
            "Only PDF, DOC and DOCX files are allowed."
        );

    }

}


/* =========================================================
   FORM LOADING
   ========================================================= */

function setFormLoading(
    loading
) {

    if (!saveButton) {

        return;

    }


    if (loading) {

        saveButton.disabled =
            true;


        saveButton.innerHTML =
            `
                Saving...
            `;

    } else {

        saveButton.disabled =
            false;


        saveButton.innerHTML =
            editingResourceId
                ? `
                    Update Resource
                    <span>→</span>
                  `
                : `
                    Save Resource
                    <span>→</span>
                  `;

    }

}


/* =========================================================
   LOADING STATE
   ========================================================= */

function showLoading() {

    if (loadingState) {

        loadingState.hidden =
            false;

    }


    if (adminResourceList) {

        adminResourceList.innerHTML =
            "";

    }


    if (adminEmpty) {

        adminEmpty.hidden =
            true;

    }

}


function hideLoading() {

    if (loadingState) {

        loadingState.hidden =
            true;

    }

}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function showStatus(
    message,
    type
) {

    if (!statusMessage) {

        return;

    }


    statusMessage.textContent =
        message;


    statusMessage.hidden =
        false;


    statusMessage.className =
        "status-message";


    if (type) {

        statusMessage.classList.add(
            type
        );

    }


    /*
     * Automatically hide success messages.
     */

    if (type === "success") {

        setTimeout(
            () => {

                hideStatus();

            },
            4000
        );

    }

}


function hideStatus() {

    if (statusMessage) {

        statusMessage.hidden =
            true;

        statusMessage.textContent =
            "";

    }

}


/* =========================================================
   READ JSON RESPONSE
   ========================================================= */

async function readJsonResponse(
    response
) {

    const text =
        await response.text();


    if (!text) {

        return {};

    }


    try {

        return JSON.parse(
            text
        );

    } catch (error) {

        console.error(
            "Invalid JSON response:",
            text
        );


        return {
            error:
                "The server returned an invalid response."
        };

    }

}


/* =========================================================
   FORMAT RESOURCE TYPE
   ========================================================= */

function formatResourceType(
    type
) {

    const values = {

        policy:
            "Policy Brief",

        explainer:
            "Explainer",

        blog:
            "Blog"

    };


    return (
        values[type] ||
        type ||
        "Resource"
    );

}


/* =========================================================
   FORMAT STATUS
   ========================================================= */

function formatStatus(
    status
) {

    if (!status) {

        return "Published";

    }


    return (
        status.charAt(0)
            .toUpperCase()
        +
        status.slice(1)
    );

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   NORMALISE DATE FOR INPUT
   ========================================================= */

function normaliseDateForInput(
    value
) {

    if (!value) {

        return "";

    }


    /*
     * If Supabase already returns:
     *
     * 2026-09-22
     *
     * use it directly.
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            value
        )
    ) {

        return value;

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}


/* =========================================================
   ESCAPE FUNCTION
   ========================================================= */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
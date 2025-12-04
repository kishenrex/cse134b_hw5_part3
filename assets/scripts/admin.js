document.addEventListener('DOMContentLoaded', () => {
    const LOCAL_STORAGE_KEY = 'projects'; 
 
    const projectSelect = document.getElementById('project-select');
    const form = document.getElementById('project-form');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const linkInput = document.getElementById('link');
    const imageUrlInput = document.getElementById('imageUrl');

    const createBtn = document.getElementById('create-btn');
    const updateBtn = document.getElementById('update-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const clearBtn = document.getElementById('clear-btn');

    let currentProjects = [];

    function getProjects() {
        const projectsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        currentProjects = projectsJson ? JSON.parse(projectsJson) : [];
        return currentProjects;
    }

    function saveProjects(projects) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
        currentProjects = projects;
    }

    function populateSelect() {
        const projects = getProjects();
        projectSelect.innerHTML = '<option value="">-- New Project --</option>'; // Reset
        projects.forEach((project, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = project.title;
            projectSelect.appendChild(option);
        });
        clearForm();
    }

    function handleSelectChange() {
    const selectedIndex = projectSelect.value;
    
    if (selectedIndex !== "") {
        const selectedProject = currentProjects[selectedIndex];
        titleInput.value = selectedProject.title || '';
        descriptionInput.value = selectedProject.description;
        linkInput.value = selectedProject.link;
        imageUrlInput.value = selectedProject.imageUrl;
    } else {
        form.reset();
    }
}

    async function createProject() {
        const newProject = {
            title: titleInput.value,
            description: descriptionInput.value,
            link: linkInput.value,
            imageUrl: imageUrlInput.value,
            imageAlt: `A preview of the ${titleInput.value} project.`,
            imageSources: [{ srcset: imageUrlInput.value, type: 'image/png' }] 
        };
        const projects = [...currentProjects];
        projects.push(newProject);
        saveProjects(projects);
        alert(`Project "${newProject.title}" created successfully!`);
        populateSelect();
    }

    function updateProject() {
        const selectedIndex = projectSelect.value;
        if (selectedIndex === "") {
            alert('Please select a project to update.');
            return;
        }
        const projects = [...currentProjects];
        const originalTitle = projects[selectedIndex].title;
        
        projects[selectedIndex] = {
            ...projects[selectedIndex], 
            title: titleInput.value,
            description: descriptionInput.value,
            link: linkInput.value,
            imageUrl: imageUrlInput.value,
            imageAlt: `A preview of the ${titleInput.value} project.`,
            imageSources: [{ srcset: imageUrlInput.value, type: 'image/png' }] 
        };
        
        saveProjects(projects);
        alert(`Project "${originalTitle}" updated successfully!`);
        populateSelect();
    }


    function deleteProject() {
        const selectedIndex = projectSelect.value;
        if (selectedIndex === "") {
            alert('Please select a project to delete.');
            return;
        }
        const projects = [...currentProjects];
        const deletedTitle = projects[selectedIndex].title;
        projects.splice(selectedIndex, 1);
        saveProjects(projects);
        alert(`Project "${deletedTitle}" deleted successfully!`);
        populateSelect();
    }

    function clearForm() {
        form.reset();
        projectSelect.value = "";
    }

    projectSelect.addEventListener('change', handleSelectChange);
    createBtn.addEventListener('click', createProject);
    updateBtn.addEventListener('click', updateProject);
    deleteBtn.addEventListener('click', deleteProject);
    clearBtn.addEventListener('click', clearForm);

    populateSelect();
});
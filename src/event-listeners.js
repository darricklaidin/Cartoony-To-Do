import {    customGroupsList, tasksList, toggleCollapse, addNewGroup, removeGroup, 
            buildMain, activeGroupName, removeMain , removeTask, buildEditTaskModal,
            disableNav, enableNav, buildAddTaskModal, Task } from "./index.js";

export function addEventListeners() {
    
    // Groups --->
    let groupsWrapperElement = document.querySelector(".groups-wrapper");
    
    let currentInputValue = "";
      
    groupsWrapperElement.addEventListener("click", (event) => {
        
        // Expand/collapse groups
        if (event.target.id === "down-arrow-button") {
            toggleCollapse();
        }
        
        // Add a new group
        if (event.target.id === "plus-button") {
            addNewGroup();
        }
        
        // Remove a group
        if (event.target.tagName === "IMG" && event.target.closest(".group-item")) {
            // Get the index of the group in the array
            let groupsElement = document.querySelector(".groups");
            let customGroups = Array.from(groupsElement.children).slice(1);
            let customGroupIndex = customGroups.indexOf(event.target.parentElement);
            
            // Set "Inbox" group as active if the group that was deleted was the group being displayed
            if (event.target.parentElement.children[0].value === activeGroupName) {
                let groupItemInboxElement = document.querySelector("#inbox");
                groupItemInboxElement.classList.add("active");
                activeGroupName = "Inbox";
            }
            
            // Remove the group
            removeGroup(customGroupIndex);
            
            // Remove main element if exists
            removeMain();
        
            // Rebuild main element with active group name
            buildMain(activeGroupName);
        }
        
        if (event.target.classList.contains("group-item")) {
            // Remove active from other group elements
            Array.from(event.target.parentElement.children).forEach((child) => {
                child.classList.remove("active");
            });
            
            // Set group element as active
            event.target.classList.add("active");
            // Update active group name global variable
            activeGroupName = event.target.children[0].value == undefined ? "Inbox" : event.target.children[0].value;
            
            // Remove main element if exists
            removeMain();
            
            // Rebuild main element with active group name
            buildMain(activeGroupName);
        }
    });
    
    groupsWrapperElement.addEventListener("change", (event) => {
        
        // When group color is changed
        if (event.target.classList.contains("color-tag")) {
            let groupElement = event.target.parentElement;
            let groupsElement = document.querySelector(".groups");
            let groupElementIndex = Array.from(groupsElement.children).indexOf(groupElement) - 1;  // offset by 1 to ignore 'Inbox'
            customGroupsList[groupElementIndex].color = event.target.value;
            
            // Remove main element if exists
            removeMain();
            
            // Rebuild main element with active group name
            buildMain(activeGroupName);
            
            localStorage.setItem("customGroupsList", JSON.stringify(customGroupsList));
        }
        
    }, true);
    
    groupsWrapperElement.addEventListener("focus", (event) => {
        
        // On focus of input text
        if (event.target.classList.contains("custom-group-name")) {
            // Save the current value of the input
            currentInputValue = event.target.value;
        }
        
    }, true);
    
    groupsWrapperElement.addEventListener("blur", (event) => {
        
        // On lose focus of input text
        if (event.target.classList.contains("custom-group-name")) {
            let inputValue = event.target.value;
          
            // If the input value has not changed
            if (inputValue === currentInputValue) return;
            
            // Check if input is empty
            if (inputValue === "") {
                // if empty, set to current value
                event.target.value = currentInputValue;
                return;
            }
            
            // Check if input is the same as another group
            for (let i = 0; i < customGroupsList.length; i++) {
                if (customGroupsList[i].name === inputValue) {
                    event.target.value = currentInputValue;
                    return;
                }
            }
            
            // Update the custom groups list
            let groupElement = event.target.parentElement;
            let groupsElement = document.querySelector(".groups");
            let groupElementIndex = Array.from(groupsElement.children).indexOf(groupElement) - 1;  // offset by 1 to ignore 'Inbox'
            customGroupsList[groupElementIndex].name = inputValue;
            
            // Update all tasks with this group name to the updated group name
            tasksList.forEach((task) => {
                if (task.groupName === currentInputValue) {
                    task.groupName = inputValue;
                } 
            });
            
            // Remove main element if exists
            removeMain();
            
            // Determine active group by DOM
            let activeGroupElement = document.querySelector(".group-item.active");
            activeGroupName = activeGroupElement.children[0].value == undefined ? "Inbox" : activeGroupElement.children[0].value;
            
            // Rebuild main element with active group name
            buildMain(activeGroupName);
            
            localStorage.setItem("customGroupsList", JSON.stringify(customGroupsList));
            localStorage.setItem("tasksList", JSON.stringify(tasksList));
        }
        
    }, true);
    
    
    let documentElement = document.documentElement;
    documentElement.addEventListener("click", (event) => {
        
        // Ignore nav elements
        if (event.target.closest("nav")) return;
        
        // Tasks --->
        
        // Remove task
        if (event.target.type === "checkbox") {
            removeTask(event);
        }
        
        // Open edit task modal
        if (event.target.type !== "checkbox" && event.target.closest(".task")) {
            let taskElement = event.target.closest(".task");
            let taskIndex = taskElement.dataset.id - 1;  // offset by 1 because id starts at 1
            
            buildEditTaskModal(tasksList[taskIndex]);
            
            let editTaskModalElement = document.querySelector(".edit-task-modal");
            editTaskModalElement.style.display = "flex";
            
            // Disable nav elements
            disableNav();
        }
        
        // Add new task
        if (event.target.id === "add-task-button") {
            buildAddTaskModal();
            
            let addTaskModalElement = document.querySelector(".add-task-modal");
            addTaskModalElement.style.display = "flex";
            
            // Disable nav elements
            disableNav();
        }
            
        // Modals --->
        
        // Close modal
        if (event.target.classList.contains("cancel-button")) {
            enableNav();
            
            // Remove modal
            if (event.target.closest(".edit-task-modal")) {
                let editTaskModalElement = event.target.closest(".edit-task-modal");
                editTaskModalElement.remove();
            }
            else if (event.target.closest(".add-task-modal")) {
                let addTaskModalElement = event.target.closest(".add-task-modal");
                addTaskModalElement.remove();
            }
        }
        // If click anywhere outside of dropdown, inside of modal, and drop down open
        else if (event.target.closest(".task-group-dropdown") == null && (event.target.closest(".edit-task-modal") != null || event.target.closest(".add-task-modal")) && document.querySelector(".task-group-dropdown").style.display === "flex") {
            // Close dropdown
            let taskGroupdropdownElement = document.querySelector(".task-group-dropdown");
            taskGroupdropdownElement.style.display = "none";
        }
        // Open dropdown on click
        else if (event.target == document.querySelector(".task-group-dropdown-wrapper > button")) {
            // Show dropdown items
            let taskGroupdropdownElement = document.querySelector(".task-group-dropdown");
            taskGroupdropdownElement.style.display = "flex";
        }
        // Dropdown item on click
        else if (event.target.closest(".task-group-dropdown") && event.target.tagName === "BUTTON") {            
            // Update dropdown wrapper button text
            let taskGroupdropdownWrapperElement = document.querySelector(".task-group-dropdown-wrapper");
            taskGroupdropdownWrapperElement.children[0].textContent = event.target.textContent;
            // update color
            taskGroupdropdownWrapperElement.children[0].style.backgroundColor = event.target.style.backgroundColor;
            
            // Close dropdown
            let taskGroupdropdownElement = document.querySelector(".task-group-dropdown");
            taskGroupdropdownElement.style.display = "none";
        }
        
    });
    
    documentElement.addEventListener("submit", (event) => {
        event.preventDefault();
        
        if (event.target.lastChild.lastChild.classList.contains("confirm-button")) {
            
            if (event.target.closest(".edit-task-modal")) {
                // Update current task with new values
                let editTaskModalElement = document.querySelector(".edit-task-modal");
                let taskIndex = editTaskModalElement.dataset.id - 1;  // offset by 1 because id starts at 1
                tasksList[taskIndex].name = document.querySelector(".edit-task-modal #task-name").value;
                tasksList[taskIndex].description = document.querySelector(".edit-task-modal #task-description").value;
                tasksList[taskIndex].groupName = document.querySelector(".task-group-dropdown-wrapper > button").textContent;
                tasksList[taskIndex].dueDateString = document.querySelector(".edit-task-modal #task-date").value;
    
                // Rebuild main element
                removeMain();
                buildMain(activeGroupName);
                
                // Close modal
                editTaskModalElement.remove();
                
                enableNav();
                
                localStorage.setItem("tasksList", JSON.stringify(tasksList));
            }
            else if (event.target.closest(".add-task-modal")) {
                let addTaskModalElement = document.querySelector(".add-task-modal");
                let newTask = new Task();
                newTask.id = tasksList.length + 1;
                newTask.name = document.querySelector(".add-task-modal #task-name").value;
                newTask.description = document.querySelector(".add-task-modal #task-description").value;
                newTask.groupName = document.querySelector(".task-group-dropdown-wrapper > button").textContent;
                newTask.dueDateString = document.querySelector(".add-task-modal #task-date").value;
                tasksList.push(newTask);
                
                // Rebuild main element
                removeMain();
                buildMain(activeGroupName);
                
                // Close modal
                addTaskModalElement.remove();
                
                enableNav();
                
                localStorage.setItem("tasksList", JSON.stringify(tasksList));
            }
            
        }
        
    });
    
}
import {    customGroupsList, tasksList, toggleCollapse, addNewGroup, removeGroup, 
            buildMain, activeGroupName, removeMain , removeTask } from "./index.js";

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
        }
        
    }, true);
    
    
    // Tasks --->
    let taskSectionElement = document.querySelector(".task-section");
    
    taskSectionElement.addEventListener("click", (event) => {
        console.log(event.target);
        
        if (event.target.type === "checkbox") {
            removeTask(event);
        }
        
        
    });
}
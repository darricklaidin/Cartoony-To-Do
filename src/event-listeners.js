import { customGroupsList, tasksList, toggleCollapse, addNewGroup, removeGroup } from "./index.js";

export function addEventListeners() {
    let groupsWrapperElement = document.querySelector(".groups-wrapper");
    let groupsElement = document.querySelector(".groups");
    
    let currentInputValue = "";
    
    // TODO: Click on group to filter tasks by it
        // TODO: Add active class to 'Inbox' group
    
    
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
            let customGroups = Array.from(groupsElement.children).slice(1);
            let customGroupIndex = customGroups.indexOf(event.target.parentElement);
            
            // Remove the group
            removeGroup(customGroupIndex);
        }
        
    });
    
    groupsWrapperElement.addEventListener("change", (event) => {
        
        // When group color is changed
        if (event.target.classList.contains("color-tag")) {
            let groupElement = event.target.parentElement;
            let groupsElement = document.querySelector(".groups");
            let groupElementIndex = Array.from(groupsElement.children).indexOf(groupElement) - 1;  // offset by 1 to ignore 'Inbox'
            customGroupsList[groupElementIndex].color = event.target.value;
            
            console.log(customGroupsList);
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
        }
        
    }, true);
    
    
}
// Imports --->
import { addEventListeners } from "./event-listeners.js";

// Classes --->
export class CustomGroup {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }
}

class Task {
    constructor(name, description, dueDateString, groupName="Inbox") {
        this.name = name;
        this.description = description;
        this.dueDateString = dueDateString;
        this.groupName = groupName;
    }
}

// Global variables --->
export let customGroupsList = [];
export let tasksList = [new Task("Call Mum", "Make a call to Mum telling her about stuff.", "2022-11-03", "School"), new Task("Buy protein powder", "Buy the 500g Nestle protein powder that's on a discount.", "2022-11-04", "Grocery")];

// Functions --->
export function buildCustomGroupItem(customGroupItem) {  
    let groupsElement = document.querySelector(".groups");
    
    let customGroupItemElement = document.createElement("div");  // add to groups
    customGroupItemElement.classList.add("group-item");
    customGroupItemElement.classList.add("custom");
    groupsElement.appendChild(customGroupItemElement);
    
    let customGroupItemInputElement = document.createElement("input");  // add to custom group item
    customGroupItemInputElement.classList.add("custom-group-name");
    customGroupItemInputElement.type = "text";
    customGroupItemInputElement.value = customGroupItem.name;
    customGroupItemInputElement.maxLength = "8";
    customGroupItemInputElement.spellcheck = false;
    customGroupItemInputElement.autocomplete = "off";
    customGroupItemElement.appendChild(customGroupItemInputElement);
    
    let customGroupItemColorTagElement = document.createElement("input");  // add to custom group item
    customGroupItemColorTagElement.type = "color";
    customGroupItemColorTagElement.classList.add("color-tag");
    customGroupItemColorTagElement.value = customGroupItem.color;
    customGroupItemElement.appendChild(customGroupItemColorTagElement);
    
    let trashButtonElement = document.createElement("img");  // add to custom group item
    trashButtonElement.src = "assets/trash.svg";
    trashButtonElement.alt = "trash icon";
    customGroupItemElement.appendChild(trashButtonElement);
}

function buildNavBar() {
    let bodyElement = document.querySelector("body");
    
    let navElement = document.createElement("nav");  // add to body
    bodyElement.appendChild(navElement);
    
    let titleElement = document.createElement("h1");  // add to nav
    titleElement.textContent = "To Do";
    navElement.appendChild(titleElement);
    
    let groupsWrapperElement = document.createElement("div");  // add to nav
    groupsWrapperElement.classList.add("groups-wrapper");
    navElement.appendChild(groupsWrapperElement);
    
    let groupsHeadingElement = document.createElement("div");  // add to groups wrapper
    groupsHeadingElement.classList.add("groups-heading");
    groupsWrapperElement.appendChild(groupsHeadingElement);
    
    let groupsHeadingParagraphElement = document.createElement("p");  // add to groups heading
    groupsHeadingParagraphElement.textContent = "Groups";
    groupsHeadingElement.appendChild(groupsHeadingParagraphElement);
    
    let groupsHeadingButtonsElement = document.createElement("div");  // add to groups heading
    groupsHeadingButtonsElement.classList.add("groups-heading-buttons");
    groupsHeadingElement.appendChild(groupsHeadingButtonsElement);
    
    let downArrowButtonElement = document.createElement("img");  // add to groups heading buttons
    downArrowButtonElement.src = "assets/down-arrow.svg";
    downArrowButtonElement.alt = "down arrow";
    downArrowButtonElement.id = "down-arrow-button";
    downArrowButtonElement.classList.add("collapsed");
    groupsHeadingButtonsElement.appendChild(downArrowButtonElement);
    
    let plusButtonElement = document.createElement("img");  // add to groups heading buttons
    plusButtonElement.src = "assets/plus.svg";
    plusButtonElement.alt = "plus";
    plusButtonElement.id = "plus-button";
    groupsHeadingButtonsElement.appendChild(plusButtonElement);
    
    let groupsElement = document.createElement("div");  // add to groups wrapper
    groupsElement.classList.add("groups");
    groupsElement.classList.add("collapsed");
    groupsWrapperElement.appendChild(groupsElement);
    
    let groupItemInboxElement = document.createElement("div");  // add to groups
    groupItemInboxElement.classList.add("group-item");
    groupItemInboxElement.id = "inbox";
    groupsElement.appendChild(groupItemInboxElement);
    
    let groupItemInboxParagraphElement = document.createElement("p");  // add to group item inbox
    groupItemInboxParagraphElement.textContent = "Inbox";
    groupItemInboxElement.appendChild(groupItemInboxParagraphElement);
    
    customGroupsList.push(new CustomGroup("School", "#FF0000"));
    customGroupsList.push(new CustomGroup("Grocery", "#00FF00"));
    customGroupsList.push(new CustomGroup("Hospital", "#0000FF"));
    customGroupsList.push(new CustomGroup("Games", "#FFFF00"));
    
    customGroupsList.forEach((group) => {
        buildCustomGroupItem(group);
    });
}

export function toggleCollapse() {
    let downArrowButtonElement = document.querySelector("#down-arrow-button");
    let groupsElement = document.querySelector(".groups");
    
    // Toggle collapse
    if (downArrowButtonElement.classList.contains("collapsed")) {
        downArrowButtonElement.classList.remove("collapsed");
        // show groups
        groupsElement.classList.remove("collapsed");
    }
    else {
        downArrowButtonElement.classList.add("collapsed");
        // hide groups
        groupsElement.classList.add("collapsed");
    }
}

export function addNewGroup() {
    let downArrowButtonElement = document.querySelector("#down-arrow-button");
    let groupsElement = document.querySelector(".groups");
    
    let newGroup = new CustomGroup("Untitled", "#000000");
    customGroupsList.push(newGroup);
    buildCustomGroupItem(newGroup);
    
    // Expand groups
    downArrowButtonElement.classList.remove("collapsed");
    // show groups
    groupsElement.classList.remove("collapsed");
    
    // Focus on new group
    groupsElement.lastChild.firstChild.focus();
}

export function removeGroup(customGroupIndex) {
    // When group is removed, any tasks in that group should be moved to the inbox (default)
    tasksList.forEach((task) => {
        if (task.groupName === customGroupsList[customGroupIndex].name) {
            task.groupName = "Inbox";
        }
    });
    
    // Remove from DOM
    let groupsElement = document.querySelector(".groups");
    groupsElement.removeChild(groupsElement.children[customGroupIndex + 1]);  // to ignore the 'Inbox' group which is default
    // Remove from customGroupsList
    customGroupsList.splice(customGroupIndex, 1);
}

// Main --->
buildNavBar();

addEventListeners();
var listParent = document.getElementById("containerList");
console.log("List parent: " + listParent);

function createIcon(container) {
    const icon = document.createElement("div");
    icon.classList.add("icon");
    const iconUrl = container.iconUrl || "img/blank-tab.svg";
    icon.style.mask = `url(${iconUrl}) top left / contain`;
    icon.style.background = container.colorCode || "#000";
    return icon;
}

async function removeContainerAction(event) {
    var cookieStoreIdToRemove = this.getAttribute("containerId");
    await browser.contextualIdentities.remove(cookieStoreIdToRemove);
    this.parentNode.remove();
}

function createListElement(container) {
    // console.log(container);
    var li = document.createElement("li");
    li.className = "container-item";

    {
        var containerIcon = document.createElement("div");
        containerIcon.className = "container-icon";
        containerIcon.appendChild(this.createIcon(container));
        li.appendChild(containerIcon);
    }
    {
        var containerName = document.createElement("div");
        containerName.className = "container-title";
        containerName.innerText = container.name;
        li.appendChild(containerName);
    }
    {
        var containerAction = document.createElement("div");
        containerAction.className = "container-action";
        {
            var removeButton = document.createElement("input");
            removeButton.type = "button";
            removeButton.value = "Remove";
            removeButton.setAttribute("containerId", container.cookieStoreId);
            removeButton.onclick = removeContainerAction;
        
            containerAction.appendChild(removeButton);
        }
        li.appendChild(containerAction);
    }
    return li;
}

async function populateContainerList() {
    listParent.innerHTML = '';
    const containers = await browser.contextualIdentities.query({})
        .then((containers) => {
            containers.sort((c1, c2) => {
                return c1.name.toLowerCase() > c2.name.toLowerCase();
            });
            containers.forEach((container) => {
                // console.log(container);
                listParent.appendChild(this.createListElement(container));
            });
        });
}

browser.windows.getCurrent({populate: true}).then((windowInfo) => {
    populateContainerList();
});

browser.tabs.onCreated.addListener(() => {
    populateContainerList();
});
browser.tabs.onRemoved.addListener(() => {
    populateContainerList();
});
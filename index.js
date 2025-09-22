import { VctrModelApi } from "https://www.vectary.com/studio-lite/scripts/api.js";
var modelApi = new VctrModelApi("room-scene"); // DOM Id
await modelApi.init();


class DOMUtils {
  static createImage({ src, alt, onClick }) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt || "";
    img.classList.add("item-img");
    if (onClick) img.addEventListener("click", onClick);
    return img;
  }

  static createTextSpan(text, onClick) {
    const span = document.createElement("span");
    span.textContent = text;
    span.classList.add("item-img");
    if (onClick) span.addEventListener("click", onClick);
    return span;
  }

  static clearChildren(element) {
    if (element) element.innerHTML = "";
  }

  static removeActiveFromSiblings(element, className) {
    if (!element) return;
    element.querySelectorAll(`.${className}`).forEach((el) =>
      el.classList.remove(className)
    );
  }
}

class DisplayManager {
    constructor(container) {
        this.container = container;
    }

    renderItems(items, onClick) {
        DOMUtils.clearChildren(this.container);

        items.forEach((item) => {
        const tile = document.createElement("div");
        tile.className = "item-tile";
        tile.addEventListener("click", () => {
            this.selectItem(tile);
            onClick(item);
        });

        const img = document.createElement("img");
        img.src = item.url || "";
        img.alt = item.name || "";
        img.className = "item-thumbnail";

        const label = document.createElement("div");
        label.className = "item-label";
        label.textContent = app.materialImageMap[item.name]?.name || item.name;
        tile.appendChild(img);
        tile.appendChild(label);

        this.container.appendChild(tile);
        });
    }

    selectItem(item) {
        DOMUtils.removeActiveFromSiblings(this.container, "img-selected");
        item.classList.add("img-selected");
    }

    clear() {
        DOMUtils.clearChildren(this.container);
    }
}


class App {
    constructor(modelApi) {
        this.modelApi = modelApi;
        this.sceneFrame = document.getElementById("room-scene");
        this.elementSelector = document.getElementById("element-selector");
        this.materialTab = document.getElementById("material");
        this.displayManager = new DisplayManager(
            document.getElementById("display-container")
        );
        this.selectedOption = "";
        this.nodes = {};
        this.materialImageMap = {
        "Calypso": {
            "id": "2160b504-1f7b-4126-9e63-0cb49c58b484",
            "name": "Calypso",
            "url": "https://images.unsplash.com/photo-1701964620952-c31ddd8d4bc4?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "ARMCHAIR"
        },
        "Infusion": {
            "id": "dc931e7d-c614-496d-bc65-6597f9209b21",
            "name": "Infusion",
            "url": "https://images.unsplash.com/photo-1554755229-ca4470e07232?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "ARMCHAIR"
        },
        "CHICK  EARTHY": {
            "id": "20af0610-b19f-4424-b6e7-2e8391860a14",
            "name": "CHICK  EARTHY",
            "url": "https://plus.unsplash.com/premium_photo-1667811946004-7c03b11fcd11?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "ARMCHAIR"
        },
        "ASHVILLE": {
            "id": "c3cdba32-d3f7-45a5-8312-606749be73e7",
            "name": "ASHVILLE",
            "url": "https://images.unsplash.com/photo-1495366554757-8568e69d7f80?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "ARMCHAIR"
        },
        "SAFARI-MIST": {
            "id": "7e89c98d-5907-49d0-872c-240057387c4f",
            "name": "SAFARI-MIST",
            "url": "https://www.shutterstock.com/shutterstock/photos/2418670155/display_1500/stock-vector-persian-carpet-with-geometric-ornament-red-black-beige-and-white-colors-vector-illustration-2418670155.jpg?w=740",
            "objectDependent": ["sofa", "curtain"]
        },
        "MARS-NATURAL": {
            "id": "f48529f6-7b8c-4fb3-b955-975482ed223e",
            "name": "MARS-NATURAL",
            "url": "https://plus.unsplash.com/premium_photo-1675781504884-d441a77901d5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": ["sofa"]
        },
        "LINUX-HONEY": {
            "id": "ff2fc6c6-c101-4cb2-8d18-7c124507691f",
            "name": "LINUX-HONEY",
            "url": "https://plus.unsplash.com/premium_photo-1675805901910-0a82fb2d7345?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": ["sofa", "curtain"]
        },
        "BENZ-CELADON": {
            "id": "84894424-444d-4bd6-8f9c-e229e99640a7",
            "name": "BENZ-CELADON",
            "url": "https://plus.unsplash.com/premium_photo-1671689937513-94ffdf25c99a?q=80&w=761&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": ["sofa", "curtain"]
        },
        "AUDI-PETROl": {
            "id": "7b111bb5-5142-4fed-a142-b471c454cb3d",
            "name": "AUDI-PETROl",
            "url": "https://plus.unsplash.com/premium_photo-1675370608565-f7983d679e21?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": ["sofa", "curtain"]
        },
        "Fantasy": {
            "id": "cc068ca9-2254-4bc5-8b97-dcc7ebb286bf",
            "name": "Fantasy",
            "url": "https://images.unsplash.com/photo-1563223566-f731efbdbab0?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "wall"
        },
        "Bare": {
            "id": "41f21a0d-c660-4963-a7a7-5e93f06d1ec2",
            "name": "Bare",
            "url": "https://plus.unsplash.com/premium_photo-1668801650193-19457a916907?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "wall"
        },
        "Herbal Scent": {
            "id": "08cbfd01-4fe0-4243-ae0f-6f2b194349b3",
            "name": "Herbal Scent",
            "url": "https://images.unsplash.com/photo-1555380949-f86f6aea898f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "wall"
        },
        "Camouflage": {
            "id": "2c0b3123-6b3e-4c99-84bc-9e29dbff6333",
            "name": "Camouflage",
            "url": "https://images.unsplash.com/photo-1633821051688-fc558b716185?q=80&w=756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "wall"
        },
        "Light Spirit": {
            "id": "b24288d1-7187-48bd-a113-bbcf2e6f8245",
            "name": "Light Spirit",
            "url": "https://images.unsplash.com/photo-1746309226456-32ee5c0a7472?q=80&w=734&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "carpet"
        },
        "Free Spirit": {
            "id": "1642f5b0-119c-417b-87da-a825a6d3f02e",
            "name": "Free Spirit",
            "url": "https://plus.unsplash.com/premium_photo-1675738774551-cf86de1fd242?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "carpet"
        },
        "Panorama": {
            "id": "66b6afc3-0ea6-44e6-913c-efb0675dd679",
            "name": "Panorama",
            "url": "https://plus.unsplash.com/premium_photo-1675738774631-4fe3b5ad3f81?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "carpet"
        },
        "Carpet": {
            "id": "043ea85a-014d-489f-a01e-385cf3536290",
            "name": "Carpet",
            "url": "https://images.unsplash.com/photo-1756362846991-f4509403ec4f?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "objectDependent": "carpet"
        }
        }

        this.objectMap = {
        "SOFA": [
            // { id: "98c04285-7742-4a6f-a960-39e251fd347a", name: "SOFA_M" },
            { id: "cc061f6a-45e2-4306-9f01-d0ee6edc190a", name: "Seat 2" },
            { id: "9da3e25d-46b1-444f-8961-b4fb157b1897", name: "Base" },
            // { id: "e08f33ea-1d0e-46f3-87d2-d936ca6bc4dc", name: "Back" },
            { id: "e0098d43-fdae-4078-8673-c444a2a19690", name: "Seat 1" }
        ],
        "ARMCHAIR": [
            // { id: "680f6bfd-2e39-49f9-950a-17b3f85d6fcd", name: "PILLOW" },
            { id: "bd976e38-3d95-4ffd-b370-6b68527fd361", name: "Back" },
            { id: "b1bcc5df-4a2c-4dc7-8013-f96fadd302a3", name: "Seat" },
            { id: "559be28a-1f3c-453d-b6d1-3ce73e5b4daf", name: " (rose) 1" },
            { id: "cef1acde-7f1c-47f8-aaa0-be58d01d7bc9", name: " (rose) 2" },
            { id: "cf4879e4-d347-449a-bbac-d838662485e8", name: " (rose) 3" },
            // { id: "Leggs", name: "Leggs" }
        ],
        "CURTAIN": [
            { id: "493899a9-f7c6-4564-8cd2-890f4b0338f7", name: "Curtain" },
            { id: "31b2ab1f-b051-43c2-ac91-6982f0e96b26", name: "Curtain 1" },
            // { id: "Curtain 2", name: "Curtain 2" }
        ],
        "WALL": [
            { id: "2ac6b93e-9fae-42e8-bf60-49628edbbd28", name: "WALL006" }
        ],
        "CARPET": [
            { id: "fdca387f-920a-435d-8747-3438df686063", name: "MOES_CARPET_004" }
        ]
        };


    }

    async init() {
        await this.buildNodes();
        await this.populateSelect();
        this.registerEvents();
    }


    async buildNodes() {
    const objects = this.objectMap || {};
    const materialMap = this.materialImageMap || {};

    Object.keys(objects).forEach((mainKey) => {
        const subnodes = objects[mainKey];

        const normalize = (v) => (v || "").toString().trim().toLowerCase();

        const materialObjs = Object.values(materialMap)
        .filter((mat) => {
            const dep = mat.objectDependent;
            const deps = Array.isArray(dep) ? dep : [dep];
            return deps.some((d) => normalize(d) === normalize(mainKey));
        })
        .map((mat) => ({
            id: mat.id,
            name: mat.name,
            url: mat.url || ("https://via.placeholder.com/120x90?text=" + encodeURIComponent(mat.name)),
        }));

        this.nodes[mainKey] = {
        materials: materialObjs,
        subnodes: subnodes,
        defaultMaterialId: materialObjs.length ? materialObjs[0].id : null,
        };
    });

    console.log("Nodes built:", this.nodes);
    }




    async populateSelect() {
    if (!this.elementSelector) return;

    while (this.elementSelector.options.length > 1) {
        this.elementSelector.remove(1);
    }

    Object.keys(this.nodes).forEach((key) => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key;
        this.elementSelector.appendChild(opt);
    });
    }


     registerEvents() {
        window.onSelectOption = (e) => this.handleSelection(e);
        window.nodes = this.nodes;

        this.elementSelector.addEventListener("change", (e) =>
        this.handleSelection(e)
        );
    }

    async handleSelection(event) {
    const selectedKey = event?.target?.value;
    if (!selectedKey || selectedKey === "none") {
        this.displayManager.clear();
        return;
    }

    const node = this.nodes[selectedKey];
    if (!node) {
        this.displayManager.clear();
        return;
    }


    async function loadImageAsImageData(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.naturalWidth || img.width;
                    canvas.height = img.naturalHeight || img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    resolve(imageData);
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = (e) => reject(new Error("Failed to load image: " + url));
            img.src = url;
        });
    }


    this.displayManager.renderItems(node.materials, async (materialObj) => {
        try {
            if (!materialObj || !materialObj.url) {
                console.warn("No URL for material:", materialObj);
                return;
            }

            // Load image once per material selection
            let imageData;
            try {
                imageData = await loadImageAsImageData(materialObj.url);
            } catch (err) {
                console.error("Failed to load material image:", materialObj.url, err);
                return;
            }

            const tasks = node.subnodes.map(async (sub) => {
                try {
                    const mat = await this.modelApi.getActiveMaterial(sub.name);
                    const tid = mat?.baseColor?.textureConfig?.id;
                    // const tid = mat?.id;

                    if (!tid) {
                        return { sub, ok: false, error: "No texture id on material for " + sub.name };
                    }

                    await this.modelApi.setTextureData(tid, {
                        image: imageData.data.buffer,
                        width: imageData.width,
                        height: imageData.height,
                    });

                    return { sub, ok: true };
                } catch (error) {
                    return { sub, ok: false, error };
                }
            });

            const results = await Promise.allSettled(tasks);

            results.forEach((res) => {
                if (res.status === "fulfilled") {
                    const r = res.value;
                    if (r.ok) {
                        console.log(`Uploaded texture for ${materialObj.name} -> ${r.sub.name}`);
                    } else {
                        console.warn(`Upload failed for ${r.sub.name}:`, r.error);
                    }
                } else {
                    console.error("Unexpected rejection uploading texture:", res.reason);
                }
            });
        } catch (err) {
            console.error("Error applying texture (parallel):", err);
        }
    });

    }


}


const app = new App(modelApi);
app.init();
